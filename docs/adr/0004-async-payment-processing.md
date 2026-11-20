# ADR 0004: Async Payment Processing via Event-Driven Architecture

**Date**: 2026-11-20  
**Status**: Accepted  
**Author**: Order Processing & Resilience Team  
**Relates to**: ADR-0001 (Message Queue), ADR-0003 (Database Replication)

## Context

Currently, the Order Service makes **synchronous gRPC calls** to the Payment Service during order creation. This creates a critical bottleneck and cascading failure risk:

**Current Synchronous Flow**:
```
Customer places order
    ↓
API Gateway (< 100ms)
    ↓
Order Service processes request
    ├─ Create order in database (100ms)
    └─ Synchronously call Payment Service (5-15 seconds) ← BOTTLENECK
        ├─ If timeout: Order left in limbo
        ├─ If fails: Customer sees error
        └─ Cascades upstream if Payment Service slow/down
    ↓
Return confirmation to customer (5-15 seconds total) ← TOO SLOW
```

**Current Problems**:
- ❌ **Order confirmation blocked** until payment completes (5-15 seconds)
- ❌ **Cascading failures**: Payment Service down = all orders fail
- ❌ **No automatic retry**: Failed payments require manual investigation
- ❌ **Poor customer experience**: "Loading..." for 5-15 seconds
- ❌ **No compensation pattern**: Can't refund if downstream fails
- ❌ **Connection pool exhaustion**: Slow Payment Service exhausts pools

**Failure Scenario**:
```
Time 0:00    Payment Service becomes slow (5 sec → 15 sec responses)
             
Time 0:00-15 Each order takes 15 seconds to process
             Customer sees slow loading
             
Time 0:30    Payment Service goes down
             All new gRPC calls timeout (15 seconds)
             Order Service throughput: 100 orders/sec → 6 orders/sec
             
Time 0:45    API Gateway connection pool exhausted
             New requests fail with 503
             All order submissions fail
             
Time 2:00    Manual scaling of Payment Service
             Payment Service restored
             Backlog of 10,000 failed orders
             Manual reprocessing required

Impact: 2-hour outage, $50K-200K+ loss
SLA Violation: 99.9% → 97% availability
```

## Decision

Redesign Order→Payment interaction to **fully asynchronous, event-driven architecture**:

1. **Synchronous**: Order Service creates order, returns confirmation immediately
2. **Asynchronous**: RabbitMQ queues payment event
3. **Decoupled**: Payment Service consumes when ready
4. **Resilient**: Automatic retry, DLQ for failures
5. **Compensating**: Can refund if payment processing fails

### Technical Specifications

| Aspect | Specification |
|--------|---------------|
| **Pattern** | Event-Driven Pub-Sub via RabbitMQ |
| **Publishing Service** | Order Service |
| **Consuming Service** | Payment Service |
| **Event Type** | order.created |
| **Queue Name** | order.payment.queue |
| **Queue Type** | Durable, persistent messages |
| **Acknowledgment** | Manual (explicit ack after processing) |
| **Retry Policy** | Exponential backoff (3 max retries) |
| **DLQ Strategy** | Move to Dead Letter Queue after 3 failures |
| **Consumer Groups** | Multiple instances (horizontal scaling) |
| **Performance** | Order confirmation: < 100ms |

### New Flow (Async)

```
Time 0:00    Customer places order
    ↓
Order Service
├─ Validate order (10ms)
├─ Create order in database (100ms)
│  └─ Status: "PENDING_PAYMENT"
├─ Publish "order.created" event to RabbitMQ (< 10ms)
└─ Return confirmation to customer (120ms total) ← FAST!

                (async in background)
                ↓
RabbitMQ
└─→ order.payment.queue (durable queue)

                (consumer processes when ready)
                ↓
Payment Service
├─ Consume order.created event
├─ Process payment with Stripe/PayPal (5 seconds)
├─ If success: Publish "payment.completed" event
├─ If failure: Publish "payment.failed" event
└─ Move to DLQ on max retries

                (async update)
                ↓
Order Service (via event listener)
├─ Update order status: "PAYMENT_COMPLETED" or "PAYMENT_FAILED"
└─ Trigger fulfillment or refund

Customer sees:
├─ Immediate confirmation (< 100ms)
├─ Polling for status update (3-5 seconds)
└─ Email notification when payment confirmed
```

### Benefits

```
Synchronous (Current)        Async (Proposed)
─────────────────────────────────────────────
5-15 seconds wait            < 100ms confirmation
Cascading failures           Decoupled failures
No retry                     Automatic retry + DLQ
Customer frustration         Better UX
Payment blocks order         Order → Payment async
Single failure = all down    Payment down = orders queue
```

## Consequences

### Positive Consequences ✅

1. **Instant Order Confirmation**
   - Confirmation: < 100ms (instead of 5-15 seconds)
   - Better customer experience
   - Reduced checkout abandonment

2. **Resilience & Decoupling**
   - Payment Service down ≠ Order Service down
   - Orders queue up in RabbitMQ
   - Payment processing when service recovers
   - No lost orders (messages persist 30 days)

3. **Automatic Retry & Error Handling**
   - Failed payments automatically retry
   - Dead Letter Queue for persistent failures
   - Operational visibility into failures
   - No manual reprocessing needed

4. **Scalability**
   - Payment Service can scale independently
   - Multiple consumer instances (horizontal scaling)
   - Better resource utilization
   - Smoother traffic spikes

5. **Compensation & Saga Patterns**
   - Can implement refunds if order fails downstream
   - Full audit trail of payment events
   - Idempotent processing (safe to retry)
   - Business logic flexibility

6. **Cost Savings**
   - Payment Service less CPU usage (can scale down)
   - Smoother resource utilization
   - Fewer connection pool exhaustion issues
   - Better infrastructure efficiency

### Negative Consequences ⚠️

1. **Eventual Consistency**
   - Brief delay between order creation and payment confirmation
   - Typical: 1-5 seconds (acceptable for e-commerce)
   - Customer sees "pending" status briefly
   - Requires UI changes to show payment status

2. **Complexity**
   - Event-driven architecture is more complex
   - Need to handle multiple event types
   - Developers must understand async patterns
   - Testing becomes more complex

3. **Debugging & Troubleshooting**
   - Harder to trace end-to-end requests
   - Requires distributed tracing (OpenTelemetry)
   - Requires message queue monitoring
   - Need expertise in async debugging

4. **State Management**
   - Order states more complex (PENDING_PAYMENT, PAYMENT_COMPLETED, etc.)
   - Must handle timeout scenarios
   - Need idempotent payment processing
   - Race conditions possible (need careful handling)

5. **Operational Overhead**
   - RabbitMQ cluster management (already deployed)
   - Message queue monitoring
   - DLQ investigation & replay procedures
   - More infrastructure to monitor

## Comparison with Alternatives

| Approach | Order Latency | Resilience | Complexity | Recommendation |
|----------|---------------|-----------|-----------|-----------------|
| **Async Event-Driven** | < 100ms | Excellent | Medium | ✅ **RECOMMENDED** |
| Synchronous + Retry | 5-15 sec | Good | Low | Current (inadequate) |
| Saga Pattern | < 100ms | Excellent | High | Future enhancement |
| Request-Response Choreography | 1-2 sec | Good | High | Alternative |

## Implementation Strategy

### Phase 1: Messaging Infrastructure (Already Completed!)
✅ RabbitMQ deployed with:
- 3-node cluster
- Persistent messages
- Dead Letter Queue enabled
- 30-day retention

### Phase 2: Order Service Updates (1-2 weeks)
```
Changes:
├─ Remove synchronous Payment Service call
├─ Add event publishing after order creation
│  └─ Publish "order.created" to order.payment.queue
├─ Add event listener for "payment.completed"/"payment.failed"
├─ Update order status based on payment events
└─ Add idempotency keys for safety

Order States:
├─ PENDING_PAYMENT (after creation, before payment)
├─ PAYMENT_PROCESSING (payment in queue)
├─ PAYMENT_COMPLETED (payment succeeded)
├─ PAYMENT_FAILED (payment failed)
└─ PAYMENT_RETRY_EXHAUSTED (DLQ)
```

### Phase 3: Payment Service Updates (1-2 weeks)
```
Changes:
├─ Add RabbitMQ message consumer
├─ Remove synchronous order service call
├─ Implement event-driven payment processing
├─ Add "payment.completed" / "payment.failed" events
├─ Implement idempotent payment processing
└─ Error handling & DLQ management

Consumer Logic:
1. Consume order.created event from queue
2. Validate order & payment details
3. Call Stripe/PayPal API
4. Publish payment.completed/failed event
5. Manual ack (only after success)
6. On failure: Automatic retry (exponential backoff)
7. After 3 retries: Move to DLQ
```

### Phase 4: Deployment (2-4 weeks)
- [ ] Deploy changes to staging
- [ ] Load test async flow
- [ ] Test failure scenarios
- [ ] Run chaos engineering tests
- [ ] Gradual rollout (10% → 50% → 100%)
- [ ] Monitor event throughput & latency

### Phase 5: Validation (1 week)
- [ ] Monitor event queue metrics
- [ ] Validate payment success rates
- [ ] Check DLQ for failures
- [ ] Measure order confirmation latency
- [ ] Load test at peak traffic
- [ ] Document runbooks

## Metrics & Success Criteria

| Metric | Current | Target | Validation |
|--------|---------|--------|-----------|
| **Order Confirmation Latency** | 5-15 seconds | < 100ms | Load test |
| **Payment Processing Latency** | Synchronous | 1-5 seconds async | P50/P95/P99 |
| **Cascading Failure Risk** | High | Low | Chaos test |
| **Automatic Retry** | None | Exponential backoff | DLQ monitoring |
| **Failed Payment Rate** | Unknown | < 0.1% | Event metrics |
| **Payment Processing Throughput** | Limited by sync | 1000+ orders/sec | Load test |

## Operational Procedures

### Normal Operation
```
Customer places order
├─ Order confirmed in < 100ms
├─ Payment queued in RabbitMQ
└─ Processed within 5 seconds

Customer receives:
├─ Immediate "Order Confirmed" email
├─ Notification: "Processing Payment..."
└─ Notification: "Payment Completed!" (after 1-5 sec)
```

### Payment Failure Handling
```
If payment fails:
1. Payment Service publishes "payment.failed" event
2. Order Service listens for event
3. Order status updated to "PAYMENT_FAILED"
4. Send email to customer: "Payment Failed - Retry?"
5. Automatic retry: 3 times with exponential backoff

If all retries fail:
1. Move to Dead Letter Queue
2. Alert payment operations team
3. Manual investigation required
4. Customer support follows up
```

### DLQ Investigation Procedure
```
Daily Check:
1. Monitor DLQ queue depth
2. If count > 0: Investigate
3. Common causes:
   ├─ Invalid card
   ├─ Insufficient funds
   ├─ Fraud detection
   └─ Payment provider outage

Resolution:
1. Contact customer
2. Collect new payment details
3. Manually process payment
4. Update order status
5. Send confirmation email
```

## CALM Architecture Updates

### New Events
```json
{
  "event": "order.created",
  "schema": {
    "order_id": "string",
    "customer_id": "string",
    "amount": "decimal",
    "currency": "string",
    "payment_method": "string",
    "timestamp": "ISO8601"
  }
}

{
  "event": "payment.completed",
  "schema": {
    "order_id": "string",
    "transaction_id": "string",
    "amount_charged": "decimal",
    "timestamp": "ISO8601"
  }
}

{
  "event": "payment.failed",
  "schema": {
    "order_id": "string",
    "reason": "string",
    "retry_count": "integer",
    "timestamp": "ISO8601"
  }
}
```

### Updated Relationships
```
OLD (Remove):
order-to-payment-service (synchronous gRPC)

NEW (Add):
order-service-to-payment-queue (async)
├─ Publish "order.created" to RabbitMQ
└─ Metadata: event-type, async, automatic-retry

payment-queue-to-payment-service (async)
├─ Consume "order.created"
├─ Process payment
└─ Publish "payment.completed/failed"

payment-service-to-order-service (async)
├─ Listen for "payment.completed/failed"
└─ Update order status
```

## Related ADRs

- ADR-0001: Message Queue for Async Processing (foundation)
- ADR-0003: Multi-Master Database Replication (resilient data layer)

## Sign-Off

- **Approved by**: Order Processing Team, Payment Team, Architecture Review Board
- **Implementation Lead**: Order Processing Team
- **Timeline**: 2-4 weeks (Phases 2-4)
- **Go-Live Date**: Q1 2025 (Target: February 2025)
- **Review Date**: Q2 2025 (Post-implementation metrics review)

## References

- Event-Driven Architecture: https://www.rabbitmq.com/tutorials/tutorial-one-python.html
- Saga Pattern: https://microservices.io/patterns/data/saga.html
- Idempotent APIs: https://stripe.com/docs/api/idempotent_requests
- Eventual Consistency: https://www.allthingsdistributed.com/2008/12/eventually_consistent.html
