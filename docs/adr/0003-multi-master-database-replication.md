# ADR 0003: Multi-Master Database Replication for High Availability

**Date**: 2026-11-20  
**Status**: Accepted  
**Author**: Database/Resilience Team  
**Relates to**: ADR-0001 (Async Processing), Resilience Analysis

## Context

The current e-commerce platform has single-master databases with read replicas in the same region. This architecture presents critical resilience gaps:

**Current Problems**:
- **Write Path SPOF**: Primary database is the only write target
- **Poor RPO**: Daily snapshots = 24-hour data loss window
- **Slow RTO**: Manual replica promotion = 30+ minute recovery
- **Regional Risk**: Datacenter failure = complete data loss
- **SLA Violation**: Cannot achieve 99.9% with 30-minute MTTR

**Current State**:
- Order Database: Primary + Read Replica (same region)
- Inventory Database: Primary + Read Replica (same region)
- Backup: Daily snapshots only
- RTO: 30-60 minutes (manual)
- RPO: 24 hours (daily snapshots)

**Failure Scenario**:
```
Time 0:00    Primary database crashes
             All writes fail immediately
             
Time 0:00-15 Manual detection & diagnosis
             Database team alerted
             
Time 0:15-30 Replica promotion
             Promote read replica to primary
             DNS updated
             
Time 0:30+   Service restored
             But: Any transactions since last snapshot = LOST
             Data loss window: 24 hours
             
Impact: 99.9% SLA violated
        $12K-50K+ loss depending on transaction volume
```

## Decision

Implement **bi-directional multi-master database replication** between two regions to achieve:
- **RTO**: < 10 seconds (automatic failover)
- **RPO**: 0 seconds (synchronous replication)
- **Availability**: 99.99% enterprise-grade

### Technical Specifications

| Aspect | Specification |
|--------|---------------|
| **Replication Strategy** | Bi-directional (Multi-Master) |
| **Primary Databases** | PostgreSQL 14.0+ (built-in logical replication) |
| **Region A** | Primary write (active) |
| **Region B** | Secondary write (active) |
| **Replication Mode** | Synchronous (zero data loss) |
| **Failover** | Automatic via health checks |
| **Failover Time** | < 10 seconds |
| **Data Loss** | 0 seconds (RPO = 0) |
| **Conflict Resolution** | Last-write-wins with timestamps |
| **Write Tolerance** | Both regions accept writes |

### Architecture

```
Region A (Primary)                Region B (Secondary)
┌─────────────────────────┐       ┌─────────────────────────┐
│ Order Database (Master) │───────│ Order Database (Master) │
│ ✓ Accepts reads         │◄─────│ ✓ Accepts reads         │
│ ✓ Accepts writes        │ Bi-  │ ✓ Accepts writes        │
│ ✓ 3 replicas           │ Direc │ ✓ 3 replicas           │
│   for read-scaling      │ tional│   for read-scaling      │
│                         │ Rep   │                         │
│ Order Service (3x)      │ lica- │ Order Service (3x)      │
│ Inventory (3x)          │ tion  │ Inventory (3x)          │
└─────────────────────────┘       └─────────────────────────┘
         ↑                                 ↑
    Synchronous                    Synchronous
   writes replicate                writes replicate
      to Region B                     to Region A
```

### Implementation Details

**PostgreSQL Logical Replication Setup**:

```sql
-- Region A (Publisher)
CREATE PUBLICATION pub_all_tables FOR ALL TABLES;

-- Region B (Subscriber)
CREATE SUBSCRIPTION sub_region_a 
  CONNECTION 'dbname=orders host=region-a.db.internal'
  PUBLICATION pub_all_tables;

-- Region B (also Publisher back to Region A)
CREATE PUBLICATION pub_all_tables FOR ALL TABLES;

-- Region A (also Subscriber)
CREATE SUBSCRIPTION sub_region_b
  CONNECTION 'dbname=orders host=region-b.db.internal'
  PUBLICATION pub_all_tables;
```

**Conflict Resolution Strategy**:
- Timestamp on every write
- Later timestamp wins
- Application handles rare conflicts gracefully
- Full audit trail of conflicts in separate table

**Failover Automation**:
- Health check every 5 seconds
- Failure detection: 2 consecutive failed checks (10 seconds)
- DNS update: < 1 second
- Application reconnection: < 5 seconds
- **Total MTTR: < 10 seconds**

## Consequences

### Positive Consequences ✅

1. **Zero Data Loss**
   - Synchronous replication = RPO 0
   - Every transaction confirmed in both regions
   - No "lost data" window

2. **Instant Failover**
   - Automatic detection and promotion
   - No manual intervention needed
   - < 10 second recovery time
   - SLA: 99.99% achievable

3. **Regional Independence**
   - Both regions can accept writes
   - Distribute load across regions
   - True active-active deployment
   - Better latency for geographically distributed users

4. **Disaster Recovery**
   - Survive complete datacenter failure
   - Business continuity assured
   - Customer confidence in platform stability

5. **Compliance**
   - Meets financial/e-commerce audit requirements
   - No data loss = no compliance violations
   - Better than 99.9% SLA requirement

### Negative Consequences ⚠️

1. **Infrastructure Cost**
   - 2x database infrastructure
   - Estimated: $2K-3K per month additional
   - Network replication between regions

2. **Operational Complexity**
   - Two-region failover management
   - Conflict resolution monitoring
   - More infrastructure to monitor/maintain

3. **Network Latency**
   - Synchronous replication adds latency
   - Typical: 10-50ms between regions
   - Write operations slightly slower
   - Acceptable for 99.99% uptime

4. **Eventual Consistency Window**
   - Brief window (< 100ms) where regions differ
   - Rare: happens only during failures
   - Application must handle gracefully

5. **Complexity for Developers**
   - Multi-master conflicts possible (rare)
   - Need to understand replication model
   - Testing becomes more complex

## Comparison with Alternatives

| Strategy | RTO | RPO | Cost | Complexity | Recommendation |
|----------|-----|-----|------|-----------|-----------------|
| **Multi-Master** | < 10s | 0s | $2.5K/mo | Medium | ✅ **RECOMMENDED** |
| Continuous Backup | 1-5 min | < 10s | $1.5K/mo | Low | Good alternative |
| Read Replica Promotion | 30 min | 24h | $0.5K/mo | Low | Current (inadequate) |
| Cloud-Native RDS | 1 min | 0s | $3K/mo | Low | Option if moving to AWS |

## Related ADRs

- ADR-0001: Message Queue for Async Processing (complements resilient data layer)
- ADR-0004: Async Payment Processing (relies on reliable databases)

## Implementation Phases

### Phase 1: Planning & Testing (1 week)
- [ ] Configure PostgreSQL logical replication
- [ ] Set up replication between Region A and B
- [ ] Test failover scenarios
- [ ] Stress test write throughput
- [ ] Validate zero data loss

### Phase 2: Deployment (1-2 weeks)
- [ ] Deploy Region B database infrastructure
- [ ] Enable bi-directional replication
- [ ] Configure health checks & DNS failover
- [ ] Deploy failover automation scripts
- [ ] Update connection strings in services

### Phase 3: Validation (1 week)
- [ ] Run chaos engineering tests
- [ ] Simulate region failures
- [ ] Verify automatic failover
- [ ] Load test both regions
- [ ] Document runbooks

### Phase 4: Monitoring (Ongoing)
- [ ] Replication lag monitoring
- [ ] Conflict detection/alerting
- [ ] Failover readiness checks
- [ ] Monthly failover drills

## Metrics & Success Criteria

| Metric | Current | Target | Validation |
|--------|---------|--------|-----------|
| **RTO** | 30 minutes | < 10 seconds | Failover test |
| **RPO** | 24 hours | 0 seconds | Replication test |
| **Availability** | 99.9% | 99.99% | Monthly uptime |
| **Write Latency** | 10ms | 15-20ms (with replication) | Load test |
| **Failover Detection** | Manual | < 10 seconds automatic | Health check test |

## Deployment Strategy

**Canary Approach**:
1. Enable replication (non-breaking change)
2. Run both regions in read-only mode (1 week testing)
3. Gradually shift writes to Region B
4. Full bi-directional writes (after validation)
5. Decommission single-region backup

**Rollback Plan**:
- If replication unstable: Disable, revert to single-master
- Keep weekly snapshots as safety net
- No data loss possible (can replay from other region)

## Operational Runbooks

### Failover Procedure
```
If Region A database fails:
1. Health check detects failure (10 seconds)
2. DNS switches to Region B
3. Applications reconnect (< 5 seconds)
4. Region B becomes primary write target
5. All new orders processed in Region B

If Region A recovers:
1. Replication resumes automatically
2. Region A syncs from Region B
3. Can promote Region A back (or keep Region B active)
4. No manual intervention needed
```

### Conflict Resolution
```
Rare scenario: Same order modified in both regions simultaneously
1. Conflict detected by replication engine
2. Timestamp comparison: Later write wins
3. Conflict logged to audit table
4. Application notified of conflict
5. Manual review if needed (< 0.001% of transactions)
```

## Cost Analysis

**Monthly Cost Breakdown**:
```
Current Setup:
├─ Primary database (Region A)      $1.5K/month
├─ Read replica (Region A)          $1K/month
└─ Backup storage (daily snapshots) $0.5K/month
Total: $3K/month

Multi-Master Setup:
├─ Primary database (Region A)      $1.5K/month
├─ Read replicas (Region A)         $1.5K/month
├─ Primary database (Region B)      $1.5K/month
├─ Read replicas (Region B)         $1.5K/month
└─ Network replication              $0.5K/month
Total: $6.5K/month

Additional Cost: $3.5K/month
ROI: Prevents $12K-50K+ losses from outages
Payback Period: 1 month (single avoided outage)
```

## Sign-Off

- **Approved by**: Database Team, Architecture Review Board
- **Implementation Lead**: Database Team
- **Timeline**: 3-4 weeks (Phase 1-3)
- **Go-Live Date**: Q1 2025 (Target: January 2025)
- **Review Date**: Q2 2025 (Post-implementation validation)

## References

- PostgreSQL Logical Replication: https://www.postgresql.org/docs/14/logical-replication.html
- Multi-Master Replication Patterns: https://wiki.postgresql.org/wiki/Replication,_Clustering,_and_Connection_Pooling
- Conflict-free Replicated Data Types (CRDTs)
- CAP Theorem: Availability vs Consistency trade-offs
