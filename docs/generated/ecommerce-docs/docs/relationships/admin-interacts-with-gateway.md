---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
relationship-id: admin-interacts-with-gateway
id: "admin-interacts-with-gateway"
title: "Admin Interacts With Gateway"
---

# Admin Interacts With Gateway

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>admin-interacts-with-gateway</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>Administrators access platform management features through the API Gateway</td>
        </tr>
        <tr>
            <th>Protocol</th>
            <td>HTTPS</td>
        </tr>
        </tbody>
    </table>
</div>

## Related Nodes
```mermaid
graph TD;
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
            <th>Port</th>
            <td>443</td>
        </tr>
        <tr>
            <th>Authentication</th>
            <td>OAuth2 + MFA</td>
        </tr>
        <tr>
            <th>Audit Logging</th>
            <td>enabled</td>
        </tr>
        <tr>
            <th>Access Control</th>
            <td>RBAC</td>
        </tr>
        <tr>
            <th>Sla</th>
            <td>99.95% availability</td>
        </tr>
        </tbody>
    </table>
</div>
