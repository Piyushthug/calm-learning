---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
node-id: inventory-service
id: "inventory-service"
title: "Inventory Service"
---

# Inventory Service

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>inventory-service</td>
        </tr>
        <tr>
            <th>Name</th>
            <td>Inventory Service</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Manages product inventory, stock levels, and inventory reservations for orders</td>
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
            <td>inventory-rest-api</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>inventory-cache-interface</td>
            <td></td>
            <td>6379</td>
        </tr>
        </tbody>
    </table>
</div>

## Related Nodes
```mermaid
graph TD;
inventory-service["Inventory Service"]:::highlight;
api-gateway["API Gateway"] -- Connects --> inventory-service["Inventory Service"];
inventory-service["Inventory Service"] -- Connects --> inventory-database["Inventory Database"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> inventory-service["Inventory Service"];
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
            <td>1.2.0</td>
        </tr>
        <tr>
            <th>Runtime</th>
            <td>Python 3.11</td>
        </tr>
        <tr>
            <th>Framework</th>
            <td>FastAPI</td>
        </tr>
        <tr>
            <th>Owner</th>
            <td>Inventory Team</td>
        </tr>
        <tr>
            <th>Database</th>
            <td>inventory-database</td>
        </tr>
        <tr>
            <th>Cache Layer</th>
            <td>Redis</td>
        </tr>
        <tr>
            <th>Replicas</th>
            <td>2</td>
        </tr>
        </tbody>
    </table>
</div>
