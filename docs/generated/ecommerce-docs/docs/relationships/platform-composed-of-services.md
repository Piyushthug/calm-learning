---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
relationship-id: platform-composed-of-services
id: "platform-composed-of-services"
title: "Platform Composed Of Services"
---

# Platform Composed Of Services

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>platform-composed-of-services</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>E-Commerce platform is composed of core microservices, infrastructure, and data stores</td>
        </tr>
        </tbody>
    </table>
</div>

## Related Nodes
```mermaid
graph TD;
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> api-gateway["API Gateway"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> oauth2-auth-server["OAuth2 Authorization Server"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> order-service["Order Service"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> inventory-service["Inventory Service"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> payment-service["Payment Service"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> rabbitmq-message-broker["RabbitMQ Message Broker"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> order-database["Order Database"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> inventory-database["Inventory Database"];
classDef highlight fill:#f2bbae;
```

## Controls
_No controls defined._

## Metadata
<p class="empty-message">No metadata defined.</p>
