---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
node-id: order-database
id: "order-database"
title: "Order Database"
---

# Order Database

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>order-database</td>
        </tr>
        <tr>
            <th>Name</th>
            <td>Order Database</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Primary database storing order data, customer order history, and order status information</td>
        </tr>
        <tr>
            <th>Node Type</th>
            <td>database</td>
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
            <td>order-db-connection</td>
            <td>order-db.internal</td>
            <td>5432</td>
        </tr>
        </tbody>
    </table>
</div>

## Related Nodes
```mermaid
graph TD;
order-database["Order Database"]:::highlight;
order-service["Order Service"] -- Connects --> order-database["Order Database"];
ecommerce-platform-system["E-Commerce Order Processing System"] -- Composed Of --> order-database["Order Database"];
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
            <th>Type</th>
            <td>PostgreSQL</td>
        </tr>
        <tr>
            <th>Version</th>
            <td>14.0</td>
        </tr>
        <tr>
            <th>Owner</th>
            <td>Database Team</td>
        </tr>
        <tr>
            <th>Backup Strategy</th>
            <td>daily-snapshots</td>
        </tr>
        <tr>
            <th>Replication</th>
            <td>read-replica</td>
        </tr>
        <tr>
            <th>Retention Period</th>
            <td>2-years</td>
        </tr>
        </tbody>
    </table>
</div>
