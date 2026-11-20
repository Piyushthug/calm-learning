---
architecture: ../../../../architectures/ecommerce-platform.architecture.json
id: index
title: Welcome to CALM Documentation
sidebar_position: 1
slug: /
---

# Welcome to CALM Documentation

This documentation is generated from the **CALM Architecture-as-Code** model.

## High Level Architecture
```mermaid
---
config:
  theme: base
  themeVariables:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', sans-serif
    darkMode: false
    fontSize: 14px
    edgeLabelBackground: '#d5d7e1'
    lineColor: '#000000'
---
%%{init: {"layout": "elk", "flowchart": {"htmlLabels": false}}}%%
flowchart TB
classDef boundary fill:#e1e4f0,stroke:#204485,stroke-dasharray: 5 4,stroke-width:1px,color:#000000;
classDef node fill:#eef1ff,stroke:#007dff,stroke-width:1px,color:#000000;
classDef iface fill:#f0f0f0,stroke:#b6b6b6,stroke-width:1px,font-size:10px,color:#000000;
classDef highlight fill:#fdf7ec,stroke:#f0c060,stroke-width:1px,color:#000000;

        subgraph ecommerce-platform-system["E-Commerce Order Processing System"]
        direction TB
            api-gateway["API Gateway"]:::node
            inventory-database["Inventory Database"]:::node
            inventory-service["Inventory Service"]:::node
            oauth2-auth-server["OAuth2 Authorization Server"]:::node
            order-database["Order Database"]:::node
            order-service["Order Service"]:::node
            payment-service["Payment Service"]:::node
            rabbitmq-message-broker["RabbitMQ Message Broker"]:::node
        end
        class ecommerce-platform-system boundary

    admin-actor["Administrator"]:::node
    customer-actor["Customer"]:::node

    customer-actor -->|"Customers interact with the platform through the API Gateway"| api-gateway
    admin-actor -->|"Administrators access platform management features through the API Gateway"| api-gateway
    api-gateway -->|"API Gateway routes order requests to the Order Service"| order-service
    api-gateway -->|"API Gateway routes inventory requests to the Inventory Service"| inventory-service
    order-service -->|"Order Service initiates payment processing with Payment Service"| payment-service
    order-service -->|"Order Service persists order data to Order Database"| order-database
    inventory-service -->|"Inventory Service manages product inventory in Inventory Database"| inventory-database
    api-gateway -->|"API Gateway validates JWT tokens with OAuth2 Authorization Server"| oauth2-auth-server
    order-service -->|"Order Service publishes order events to message queue for async processing"| rabbitmq-message-broker
    rabbitmq-message-broker -->|"Payment Service consumes order events from message queue for async payment processing"| payment-service



```

## Nodes
- [Customer](nodes/customer-actor.md)
- [Administrator](nodes/admin-actor.md)
- [API Gateway](nodes/api-gateway.md)
- [Order Service](nodes/order-service.md)
- [Inventory Service](nodes/inventory-service.md)
- [Payment Service](nodes/payment-service.md)
- [OAuth2 Authorization Server](nodes/oauth2-auth-server.md)
- [RabbitMQ Message Broker](nodes/rabbitmq-message-broker.md)
- [Order Database](nodes/order-database.md)
- [Inventory Database](nodes/inventory-database.md)
- [E-Commerce Order Processing System](nodes/ecommerce-platform-system.md)

## Relationships
- [Customer Interacts With Gateway](relationships/customer-interacts-with-gateway.md)
- [Admin Interacts With Gateway](relationships/admin-interacts-with-gateway.md)
- [Gateway To Order Service](relationships/gateway-to-order-service.md)
- [Gateway To Inventory Service](relationships/gateway-to-inventory-service.md)
- [Order To Payment Service](relationships/order-to-payment-service.md)
- [Order Service To Db](relationships/order-service-to-db.md)
- [Inventory Service To Db](relationships/inventory-service-to-db.md)
- [Platform Composed Of Services](relationships/platform-composed-of-services.md)
- [Gateway To Auth Server](relationships/gateway-to-auth-server.md)
- [Order Service To Rabbitmq](relationships/order-service-to-rabbitmq.md)
- [Rabbitmq To Payment Service](relationships/rabbitmq-to-payment-service.md)

## Flows
- [Customer Order Processing](flows/order-processing-flow.md)
- [Inventory Stock Check](flows/inventory-check-flow.md)

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
            <th>Owner</th>
            <td>piyush.kumar4@ust.com</td>
        </tr>
        <tr>
            <th>Version</th>
            <td>1.0.0</td>
        </tr>
        <tr>
            <th>Created</th>
            <td>2026-11-20</td>
        </tr>
        <tr>
            <th>Environment</th>
            <td>production</td>
        </tr>
        <tr>
            <th>Business Domain</th>
            <td>E-Commerce</td>
        </tr>
        <tr>
            <th>Tags</th>
            <td>ecommerce, microservices, orders, inventory, payments</td>
        </tr>
        <tr>
            <th>Deployment Type</th>
            <td>kubernetes</td>
        </tr>
        <tr>
            <th>Architecture Pattern</th>
            <td>microservices</td>
        </tr>
        </tbody>
    </table>
</div>

## Architecture Decision Records

See the [Architecture Decision Records](../../adr/README.md) in the main documentation for:
- **ADR-0001**: Use Message Queue for Asynchronous Order Processing
- **ADR-0002**: Use OAuth2 for API Authentication

These ADRs document the key architectural decisions reflected in this CALM model.
