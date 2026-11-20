---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
relationship-id: order-service-to-db
id: "order-service-to-db"
title: "Order Service To Db"
---

# Order Service To Db

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>order-service-to-db</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Order Service persists order data to Order Database</td>
        </tr>
        <tr>
            <th>Protocol</th>
            <td>JDBC</td>
        </tr>
        </tbody>
    </table>
</div>

## Related Nodes
```mermaid
graph TD;
order-service["Order Service"] -- Connects --> order-database["Order Database"];
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
            <th>Connection Pool</th>
            <td>20</td>
        </tr>
        <tr>
            <th>Connection Timeout</th>
            <td>30s</td>
        </tr>
        <tr>
            <th>Ssl Enabled</th>
            <td>true</td>
        </tr>
        <tr>
            <th>Ssl Mode</th>
            <td>require</td>
        </tr>
        <tr>
            <th>Query Timeout</th>
            <td>5000ms</td>
        </tr>
        <tr>
            <th>Replication</th>
            <td>read-replica</td>
        </tr>
        <tr>
            <th>Backup</th>
            <td>daily snapshots</td>
        </tr>
        </tbody>
    </table>
</div>
