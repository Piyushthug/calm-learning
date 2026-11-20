---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
relationship-id: inventory-service-to-db
id: "inventory-service-to-db"
title: "Inventory Service To Db"
---

# Inventory Service To Db

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>inventory-service-to-db</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Inventory Service manages product inventory in Inventory Database</td>
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
inventory-service["Inventory Service"] -- Connects --> inventory-database["Inventory Database"];
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
            <td>15</td>
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
            <td>3000ms</td>
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
