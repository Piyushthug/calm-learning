---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
relationship-id: rabbitmq-to-payment-service
id: "rabbitmq-to-payment-service"
title: "Rabbitmq To Payment Service"
---

# Rabbitmq To Payment Service

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>rabbitmq-to-payment-service</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Payment Service consumes order events from message queue for async payment processing</td>
        </tr>
        </tbody>
    </table>
</div>

## Related Nodes
```mermaid
graph TD;
rabbitmq-message-broker["RabbitMQ Message Broker"] -- Connects --> payment-service["Payment Service"];
classDef highlight fill:#f2bbae;
```

## Controls
_No controls defined._

## Metadata
<div class="table-container">
    <table>
        <thead>
        <tr>
            <th>Key</th>
            <th>Value</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th>Protocol</th>
            <td>AMQP</td>
        </tr>
        <tr>
            <th>Pattern</th>
            <td>publish-subscribe</td>
        </tr>
        <tr>
            <th>Consumer Group</th>
            <td>payment-processors</td>
        </tr>
        <tr>
            <th>Communication Pattern</th>
            <td>asynchronous</td>
        </tr>
        <tr>
            <th>Dead Letter Queue</th>
            <td>enabled</td>
        </tr>
        <tr>
            <th>Timeout</th>
            <td>30000ms</td>
        </tr>
        <tr>
            <th>Max Retries</th>
            <td>3</td>
        </tr>
        </tbody>
    </table>
</div>
