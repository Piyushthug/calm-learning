# ADR 0001: Use Message Queue for Asynchronous Order Processing

**Date**: 2024-12-15  
**Status**: Accepted  
**Author**: Architecture Team  

## Context

The e-commerce platform's order processing workflow currently uses synchronous communication between the Order Service and Payment Service. This creates several operational challenges:

- **User Experience**: Payment processing delays block order confirmation responses
- **Resilience**: Payment service unavailability blocks all order submissions
- **Scalability**: Cannot independently scale payment processing based on demand
- **Traffic Handling**: Sudden traffic spikes overwhelm the payment service
- **Failure Recovery**: Failed payments have no automatic retry mechanism

As the platform scales, these synchronous dependencies become a bottleneck affecting both reliability and user satisfaction.

## Decision

We will introduce **RabbitMQ message broker** between the Order Service and Payment Service to enable asynchronous, event-driven order processing.

### Technical Specifications

| Aspect | Specification |
|--------|---------------|
| **Broker** | RabbitMQ 3.12+ |
| **Protocol** | AMQP 0.9.1 |
| **Message Format** | JSON |
| **Durability** | Persistent messages with acknowledgments |
| **High Availability** | 3-node cluster (Kubernetes StatefulSet) |
| **Storage** | 10Gi persistent volume per node |
| **Queues** | `order.created`, `payment.processed` |
| **Retention** | 30-day message retention policy |
| **DLQ Support** | Dead Letter Queue enabled for failed messages |

### Order Processing Flow

```
1. Customer places order
   ↓
2. API Gateway routes to Order Service
   ↓
3. Order Service:
   - Creates order record (synchronous)
   - Publishes order.created event to RabbitMQ (asynchronous)
   - Returns confirmation to customer immediately
   ↓
4. Payment Service (async consumer):
   - Consumes order.created events
   - Processes payment in background
   - Publishes payment.processed event on success
   - Routes to DLQ on failure (auto-retry enabled)
```

## Consequences

### Positive Consequences ✅

1. **Improved User Experience**
   - Order confirmation is immediate (not blocked by payment processing)
   - Response times reduced from 15-30s to <500ms

2. **Enhanced Resilience**
   - Payment service failures don't block order submissions
   - Orders persist even if payment service is temporarily unavailable
   - Automatic retry with exponential backoff for failed payments

3. **Better Scalability**
   - Payment processing can be scaled independently
   - Load balancing across multiple payment processors
   - Handles traffic spikes gracefully with queue buffering

4. **Flexible Retry Logic**
   - Failed payments automatically retry (configurable policy)
   - Dead Letter Queue captures permanently failed payments
   - Operational visibility into failed transactions

5. **Future-Proof Architecture**
   - Easy to add new async processors (e.g., notifications, analytics)
   - Event-driven pattern supports event sourcing
   - Enables saga pattern for distributed transactions

### Negative Consequences ⚠️

1. **Added Complexity**
   - Introduces new infrastructure component (RabbitMQ cluster)
   - Requires operational expertise in message broker management
   - Increased DevOps overhead (monitoring, backups, scaling)

2. **Eventual Consistency**
   - Order status updates are no longer instantaneous
   - Customers may see "processing" status briefly
   - Requires UI changes to reflect async state transitions

3. **Operational Challenges**
   - Queue depth monitoring and alerting required
   - Dead Letter Queue handling needs operational procedures
   - Message replay/reprocessing capabilities needed
   - Additional cost for message broker infrastructure

4. **Debugging Complexity**
   - Harder to trace end-to-end request flows
   - Requires distributed tracing (OpenTelemetry) implementation
   - Failure investigation requires queue inspection tools

## Implementation Details

### CALM Architecture Updates

**New Node**: `rabbitmq-message-broker`
- Type: Service (infrastructure)
- Deployment: Kubernetes StatefulSet with 3 replicas
- Interfaces: AMQP (port 5672), Management API (port 15672)

**New Relationships**:
1. Order Service → RabbitMQ: Publish order events
2. RabbitMQ → Payment Service: Async message consumption

**Updated System Composition**: RabbitMQ added to system components

### Configuration

```yaml
RabbitMQ 3.12.0
- Persistent messages: enabled
- Acknowledgments: enabled
- Message durability: 30 days
- DLQ policy: enabled with auto-DLQ routing
- Consumer prefetch: 1 (fair dispatch)
```

### Monitoring

- Queue depth metrics (Prometheus)
- Consumer lag monitoring
- DLQ size and error rate alerts
- Message processing latency per consumer

## Alternatives Considered

1. **Kafka**: More complex, overkill for current scale, higher operational overhead
2. **AWS SQS**: Introduces cloud vendor lock-in
3. **Redis Streams**: Less suitable for guaranteed delivery model
4. **Keep Synchronous**: Risks scalability and resilience

## Related ADRs

- ADR-0002: OAuth2 for API Authentication (independent but complements async architecture)

## References

- RabbitMQ Documentation: https://www.rabbitmq.com/documentation.html
- AMQP Specification: https://www.amqp.org/
- CALM Architecture Pattern: Message-Driven Components

## Sign-Off

- **Approved by**: Architecture Review Board
- **Implementation Lead**: Platform Team
- **Go-Live Date**: Q1 2025
