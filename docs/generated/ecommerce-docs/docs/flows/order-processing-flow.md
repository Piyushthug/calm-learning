---
architecture: ../../../../../architectures/ecommerce-platform.architecture.json
flow-id: order-processing-flow
id: "order-processing-flow"
title: "Customer Order Processing"
---

# Customer Order Processing

## Details
<div class="table-container">
    <table>
        <tbody>
        <tr>
            <th>Unique Id</th>
            <td>order-processing-flow</td>
        </tr>
        <tr>
            <th>Name</th>
            <td>Customer Order Processing</td>
        </tr>
        <tr>
            <th>Description</th>
            <td>End-to-end flow from customer placing an order to payment confirmation</td>
        </tr>
        </tbody>
    </table>
</div>

## Sequence Diagram
```mermaid
sequenceDiagram
    Customer ->> API Gateway: Customer submits order via web interface
    API Gateway ->> Order Service: API Gateway routes order to Order Service
    Order Service ->> Payment Service: Order Service initiates payment processing
```



## Controls
### Audit

All order processing steps must be logged for audit compliance

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
            <td><b>AUDIT 001</b></td>
            <td>
                <table class="nested-table">
                        <tbody>
                        <tr>
                            <td><b>Requirement Url</b></td>
                            <td>
                                https://calm.finos.org/release/1.3/meta/control-requirement.json
                                    </td>
                        </tr>
                        <tr>
                            <td><b>Control Id</b></td>
                            <td>
                                AUDIT-001
                                    </td>
                        </tr>
                        <tr>
                            <td><b>Name</b></td>
                            <td>
                                Transaction logging
                                    </td>
                        </tr>
                        <tr>
                            <td><b>Description</b></td>
                            <td>
                                Log all order processing steps in detail and retain logs for 365 days
                                    </td>
                        </tr>
                        </tbody>
                    </table>
            </td>
        </tr>
        </tbody>
    </table>
</div>


## Metadata
<p class="empty-message">No metadata defined.</p>
