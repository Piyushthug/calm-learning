# Architecture Decision Records (ADRs)

This directory contains all Architecture Decision Records (ADRs) for the E-Commerce Order Processing Platform.

## Overview

Architecture Decision Records document significant architectural decisions, the context that led to them, and their consequences. This helps the team understand the rationale behind our architecture and ensures consistency.

## ADRs

### [ADR-0001: Use Message Queue for Asynchronous Order Processing](./0001-use-message-queue-for-async-processing.md)

**Status**: Accepted | **Date**: 2024-12-15

**Decision**: Introduce RabbitMQ message broker for asynchronous communication between Order Service and Payment Service.

**Key Benefits**:
- Improved user experience with instant order confirmation
- Enhanced resilience (payment service failures don't block orders)
- Independent scaling of payment processing
- Automatic retry capability for failed payments

**Key Challenges**:
- Added infrastructure complexity
- Eventual consistency model
- Operational overhead for queue management

**CALM References**:
- Node: `rabbitmq-message-broker`
- Relationships: `order-service-to-rabbitmq`, `rabbitmq-to-payment-service`

---

### [ADR-0002: Use OAuth2 for API Authentication](./0002-use-oauth2-for-api-authentication.md)

**Status**: Accepted | **Date**: 2024-12-15

**Decision**: Implement OAuth2.0 (RFC 6749) with JWT tokens (RFC 7519) for all API authentication.

**Key Benefits**:
- Industry-standard authentication mechanism
- Support for multiple client types (web, mobile, service-to-service)
- Stateless token validation
- Flexible grant types and scopes

**Key Challenges**:
- Client-side token management complexity
- JWT token revocation requires additional infrastructure
- Authorization server operational overhead

**CALM References**:
- Node: `oauth2-auth-server`
- Relationship: `gateway-to-auth-server`
- Controls: SEC-003, SEC-004, SEC-005

---

## Decision Format

Each ADR follows this standard format:

1. **Title**: ADR number and decision description
2. **Status**: Proposed, Accepted, Deprecated, Superseded
3. **Date**: Decision date
4. **Context**: Problem statement and constraints
5. **Decision**: What was decided and why
6. **Consequences**: Positive and negative outcomes
7. **Alternatives**: Other options considered
8. **References**: Related documentation and standards

## Usage

- **New Decisions**: Create new ADR file following the numbering scheme (0003, 0004, etc.)
- **Superseding Decisions**: Mark old ADR status as "Superseded" with link to new decision
- **Implementation**: Update CALM architecture to reflect ADR changes
- **Review**: All ADRs should be reviewed by Architecture Review Board

## ADR Lifecycle

```
Proposed
    ↓
Under Review (by Architecture Review Board)
    ↓
Accepted (or Rejected)
    ↓
Implemented (reflected in CALM architecture)
    ↓
[May be: Deprecated or Superseded by newer ADR]
```

## Related Documentation

- **CALM Architecture**: [`architectures/ecommerce-platform.architecture.json`](../../architectures/ecommerce-platform.architecture.json)
- **CALM Schema**: Version 1.3 (https://calm.finos.org/release/1.3/meta/calm.json)
- **ADR Methodology**: [Lightweight ADR](https://adr.github.io/)

## Tools

### Viewing CALM References
```bash
# Validate architecture reflects all ADRs
calm validate -a architectures/ecommerce-platform.architecture.json

# View specific nodes/relationships
grep -A 10 "oauth2-auth-server" architectures/ecommerce-platform.architecture.json
grep -A 10 "rabbitmq-message-broker" architectures/ecommerce-platform.architecture.json
```

### ADR Tracking
ADRs are referenced in the CALM architecture's top-level `adrs` array:

```json
{
  "adrs": [
    "docs/adr/0001-use-message-queue-for-async-processing.md",
    "docs/adr/0002-use-oauth2-for-api-authentication.md"
  ]
}
```

## Review Checklist

Before accepting an ADR, verify:

- [ ] Clear problem statement (Context)
- [ ] Specific decision and rationale (Decision)
- [ ] Both positive and negative consequences listed
- [ ] Alternatives considered
- [ ] CALM architecture updated with changes
- [ ] Related controls/flows updated if applicable
- [ ] Architecture validates (zero errors/warnings)
- [ ] References and standards cited

## Questions?

Contact the Architecture Team or review existing ADRs for precedent.
