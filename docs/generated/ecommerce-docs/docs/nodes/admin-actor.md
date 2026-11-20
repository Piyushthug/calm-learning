---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
node-id: admin-actor
id: "admin-actor"
title: "Administrator"
---

# Administrator

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>admin-actor</td>
        </tr>
        <tr>
            <th>Name</th>
            <td>Administrator</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Internal administrators responsible for managing inventory, orders, and system configuration</td>
        </tr>
        <tr>
            <th>Node Type</th>
            <td>actor</td>
        </tr>
        </tbody>
    </table>
</div>

## Interfaces
<p class="empty-message">No interfaces defined.</p>

## Related Nodes
```mermaid
graph TD;
admin-actor["Administrator"]:::highlight;
admin-actor["Administrator"] -- Interacts --> api-gateway["API Gateway"];
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
            <th>Role</th>
            <td>admin</td>
        </tr>
        <tr>
            <th>Internal</th>
            <td>true</td>
        </tr>
        </tbody>
    </table>
</div>
