# ADR 0005: API Gateway Resilience via Multi-Region & GeoDNS

**Date**: 2026-11-20  
**Status**: Accepted  
**Author**: Platform & Resilience Team  
**Relates to**: ADR-0001, ADR-0003, ADR-0004

## Context

The API Gateway is currently the single ingress point for all API traffic. While it has 3 replicas, the architecture has critical single points of failure:

**Current SPOF Risks**:
- **DNS failure**: All traffic routed to wrong IP → 100% outage (5 min recovery)
- **Regional failure**: All replicas in one region → loss of all capacity
- **Network failure**: DNS or load balancer between regions → cascading failure
- **Scaling limit**: All 3 replicas in one region → limited concurrent connections

**Current Architecture**:
```
Single DNS Entry (api.ecommerce.internal)
    ↓
Single Load Balancer
    ↓
3 API Gateway Replicas (all in Region A)
```

**Failure Scenario**:
```
Time 0:00    Regional network incident affects Region A
             All 3 API Gateway replicas lose connectivity
             
Time 0:00-5  DNS cache continues serving Region A IPs
             Clients unable to reach API
             
Time 0:05+   DNS cache TTL expires
             New requests get correct response (no Region A IPs)
             But: 100% of traffic sent to non-existent service
             
Time 0:10    Manual failover initiated
             DNS updated to Region B
             
Time 0:10-15 Client DNS cache refresh
             Gradual traffic shift to Region B
             
Time 0:30+   Full recovery
             All traffic flowing to Region B
             
Impact: 30-minute outage, $50K+ loss
```

## Decision

Implement **multi-region API Gateway with geographic DNS routing**:

1. **Region A**: API Gateway (3 replicas) - Primary
2. **Region B**: API Gateway (3 replicas) - Secondary
3. **GeoDNS**: Route traffic by geography + health
4. **Automatic Failover**: < 1 second DNS failover
5. **Active-Active**: Both regions serving traffic

### Technical Specifications

| Aspect | Specification |
|--------|---------------|
| **Deployment Pattern** | Active-Active Multi-Region |
| **Regions** | Region A (Primary) + Region B (Secondary) |
| **API Gateway Instances** | 3 replicas per region = 6 total |
| **DNS Solution** | GeoDNS with health checks |
| **Health Check Interval** | Every 5 seconds |
| **Failover Detection** | < 10 seconds |
| **DNS Propagation** | < 1 second |
| **Traffic Distribution** | Geographic proximity + health |
| **Session Affinity** | Via JWT (stateless) |

### Architecture

```
                    GeoDNS (api.ecommerce.internal)
                   /                              \
         Health Check Region A              Health Check Region B
              ↓                                       ↓
        Region A (Primary)                   Region B (Secondary)
        ├─ API Gateway 1-3                   ├─ API Gateway 4-6
        ├─ Load Balancer                     ├─ Load Balancer
        └─ 3 replicas, 1500 conn/sec         └─ 3 replicas, 1500 conn/sec
                ↑                                        ↑
         Geo-routed users           Geo-routed users
         (Americas region)          (EMEA/APAC region)
```

### Implementation Details

**DNS Routing Logic**:
```
Query: api.ecommerce.internal

Decision Tree:
├─ User in Americas?
│  ├─ Region A healthy? → Route to Region A
│  └─ Region A down? → Route to Region B
│
└─ User in EMEA/APAC?
   ├─ Region B healthy? → Route to Region B
   └─ Region B down? → Route to Region A
```

**Health Check Endpoints**:
```
Region A: https://api-health-a.ecommerce.internal/health
├─ Checks: service readiness, database connectivity
├─ Interval: 5 seconds
└─ Failure threshold: 2 consecutive failures (10 seconds)

Region B: https://api-health-b.ecommerce.internal/health
├─ Checks: service readiness, database connectivity
├─ Interval: 5 seconds
└─ Failure threshold: 2 consecutive failures (10 seconds)
```

**Stateless Session Management**:
- JWT tokens (stateless, signed)
- No session affinity needed
- Any replica can serve any request
- Clients can seamlessly switch regions

## Consequences

### Positive Consequences ✅

1. **No Single Ingress SPOF**
   - Multiple entry points (6 replicas across 2 regions)
   - Regional failure = traffic shifts to other region
   - No single point of failure

2. **Automatic Failover**
   - DNS health checks detect failures
   - Automatic reroute (< 10 seconds)
   - No manual intervention
   - Transparent to clients

3. **Better Geography**
   - Americas users → Region A (low latency)
   - EMEA/APAC users → Region B (low latency)
   - 20-30% latency improvement for distant regions

4. **Higher Capacity**
   - 6 replicas instead of 3
   - 2x total capacity
   - Can handle 2x traffic spikes
   - Better resource utilization

5. **Disaster Recovery**
   - Survive regional datacenter failure
   - Automatic failover to other region
   - Business continuity assured

### Negative Consequences ⚠️

1. **Infrastructure Cost**
   - 2x API Gateway infrastructure
   - 2x Load Balancer cost
   - GeoDNS service cost
   - Estimated: $3-5K/month additional
   - Network bandwidth between regions

2. **Operational Complexity**
   - More infrastructure to monitor
   - Failover procedures & runbooks
   - Cross-region debugging more complex
   - Coordination between regions

3. **DNS Challenges**
   - DNS cache TTL (60-300 seconds)
   - Brief window where clients get stale IPs
   - TTL trade-off: shorter = more queries, longer = slower failover
   - Recommendation: 60-second TTL

4. **Latency Trade-offs**
   - Distant regions slight increase
   - Regional replication adds latency
   - Acceptable for 99.99% uptime

## Implementation Strategy

### Phase 1: Planning & Setup (1-2 weeks)
- [ ] Provision Region B API Gateway infrastructure
- [ ] Set up load balancing in Region B
- [ ] Configure GeoDNS provider
- [ ] Set up health check endpoints
- [ ] Configure DNS failover rules

### Phase 2: Testing (1 week)
- [ ] Test cross-region traffic routing
- [ ] Simulate region failures
- [ ] Verify automatic failover (< 10 seconds)
- [ ] Load test both regions
- [ ] Validate geographic routing

### Phase 3: Gradual Rollout (1-2 weeks)
- [ ] Deploy to staging (both regions)
- [ ] Monitor cross-region traffic
- [ ] Gradual traffic shift to Region B (10% → 50% → 100%)
- [ ] Continuous monitoring for issues

### Phase 4: Operational Readiness (Ongoing)
- [ ] Document failover runbooks
- [ ] Train ops team on multi-region operations
- [ ] Set up cross-region monitoring
- [ ] Monthly failover drills

## Metrics & Success Criteria

| Metric | Current | Target | Validation |
|--------|---------|--------|-----------|
| **Ingress SPOF Risk** | High | Eliminated | Failure test |
| **Geographic Latency** | Same everywhere | Optimized | Latency metrics |
| **Failover Time** | Manual (30 min) | < 10 seconds | Failover test |
| **Capacity** | 1500 conn/sec | 3000 conn/sec | Load test |
| **Availability** | 99.9% | 99.99% | Uptime tracking |

## Related ADRs

- ADR-0001: Message Queue for Async Processing
- ADR-0003: Multi-Master Database Replication
- ADR-0004: Async Payment Processing

## Cost Analysis

**Monthly Cost**:
```
Current (Single Region):
├─ 3 API Gateway replicas    $1.5K/month
├─ 1 Load Balancer           $0.5K/month
└─ DNS service              $0.2K/month
Total: $2.2K/month

Multi-Region Setup:
├─ 6 API Gateway replicas    $3K/month
├─ 2 Load Balancers          $1K/month
├─ GeoDNS service            $0.5K/month
└─ Cross-region bandwidth    $0.5K/month
Total: $5K/month

Additional Cost: $2.8K/month
ROI: Prevents $50K-200K+ losses from regional outages
```

## Sign-Off

- **Approved by**: Platform Team, Architecture Review Board
- **Implementation Lead**: Platform Team
- **Timeline**: 3-4 weeks (Phases 1-3)
- **Go-Live Date**: Q1 2025 (Target: March 2025)
- **Review Date**: Q2 2025 (Post-deployment validation)

## References

- GeoDNS Routing: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html
- Multi-Region Architecture: https://aws.amazon.com/blogs/architecture/active-active-application-architecture/
- API Gateway HA: https://kubernetes.io/docs/concepts/services-networking/service/
- DNS Health Checks: https://www.cloudflare.com/learning/dns/dns-health-checks/
