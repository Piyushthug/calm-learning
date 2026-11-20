---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
node-id: customer-actor
id: "customer-actor"
title: "Customer"
---

# Customer

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>customer-actor</td>
        </tr>
        <tr>
            <th>Name</th>
            <td>Customer</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>External actors representing end-users who browse products and place orders</td>
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
customer-actor["Customer"]:::highlight;
customer-actor["Customer"] -- Interacts --> api-gateway["API Gateway"];
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
            <td>end-user</td>
        </tr>
        <tr>
            <th>External</th>
            <td>true</td>
        </tr>
        </tbody>
    </table>
</div>
