---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
node-id: order-service
id: "order-service"
title: "Order Service"
---

# Order Service

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>order-service</td>
        </tr>
        <tr>
            <th>Name</th>
            <td>Order Service</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Core service for managing orders, including creation, tracking, and status updates</td>
        </tr>
        <tr>
            <th>Node Type</th>
            <td>service</td>
        </tr>
        </tbody>
    </table>
</div>

## Interfaces
<div class="table-container">
    <table>
        <thead>
        <tr>
            <th>Unique Id</th>
            <th>Host</th>
            <th>Port</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>order-rest-api</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>order-event-stream</td>
            <td></td>
            <td>9092</td>
        </tr>
        </tbody>
    </table>
</div>

## Related Nodes
```mermaid
graph TD;
order-service["Order Service"]:::highlight;
api-gateway["API Gateway"] -- Connects --> order-service["Order Service"];
order-service["Order Service"] -- Connects --> payment-service["Payment Service"];
order-service["Order Service"] -- Connects --> order-database["Order Database"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> order-service["Order Service"];
order-service["Order Service"] -- Connects --> rabbitmq-message-broker["RabbitMQ Message Broker"];
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
            <th>Version</th>
            <td>1.5.0</td>
        </tr>
        <tr>
            <th>Runtime</th>
            <td>Java 17</td>
        </tr>
        <tr>
            <th>Framework</th>
            <td>Spring Boot</td>
        </tr>
        <tr>
            <th>Owner</th>
            <td>Order Team</td>
        </tr>
        <tr>
            <th>Database</th>
            <td>order-database</td>
        </tr>
        <tr>
            <th>Replicas</th>
            <td>2</td>
        </tr>
        <tr>
            <th>Cpu Limit</th>
            <td>1000m</td>
        </tr>
        <tr>
            <th>Memory Limit</th>
            <td>2Gi</td>
        </tr>
        </tbody>
    </table>
</div>
