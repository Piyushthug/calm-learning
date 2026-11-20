# ADR 0002: Use OAuth2 for API Authentication

**Date**: 2024-12-15  
**Status**: Accepted  
**Author**: Security Team  

## Context

The API Gateway requires a secure, standardized authentication mechanism to support multiple client types while maintaining security and flexibility:

- **Web Application Clients**: Browser-based SPA/Progressive Web Apps
- **Mobile Application Clients**: iOS and Android native applications
- **Third-Party API Integrations**: Partners and external service integrations

Current authentication needs include:
- Support for multiple client types with different security models
- Token-based authentication to avoid server-side session storage
- Ability to revoke access and refresh tokens
- Standard, well-understood security mechanisms
- Stateless architecture aligned with microservices pattern

## Decision

We will implement **OAuth2.0 (RFC 6749)** with **JWT tokens (RFC 7519)** for all API authentication.

### Technical Specifications

| Aspect | Specification |
|--------|---------------|
| **Standard** | OAuth2.0 (RFC 6749) |
| **Token Format** | JWT (RFC 7519) |
| **Signing Algorithm** | RS256 (RSA with SHA-256) |
| **Token Endpoint** | `https://auth.ecommerce.internal/oauth2/token` |
| **Authorization Endpoint** | `https://auth.ecommerce.internal/oauth2/authorize` |
| **JWKS Endpoint** | `https://auth.ecommerce.internal/.well-known/jwks.json` |
| **Grant Types** | Authorization Code, Client Credentials, Refresh Token |
| **Access Token TTL** | 1 hour (3600 seconds) |
| **Refresh Token TTL** | 30 days (2592000 seconds) |
| **Implementation** | Spring Security with OAuth2 (Java 17) |
| **Deployment** | Kubernetes (3 replicas, high availability) |

### OAuth2 Flow Diagrams

#### Authorization Code Flow (Web Apps, Mobile Apps)
```
User/Client
    ↓
API Gateway (redirects to auth server)
    ↓
OAuth2 Authorization Server
    ↓ (user grants permission)
    ↓
Authorization Code issued
    ↓
Client exchanges code for tokens (backend)
    ↓
Access Token + Refresh Token returned
    ↓
Client uses Access Token to call API
    ↓
API Gateway validates JWT signature
    ↓
Request processed if token valid
```

#### Client Credentials Flow (Service-to-Service)
```
Service A
    ↓
Request token from OAuth2 Authorization Server
(with client_id and client_secret)
    ↓
Access Token returned
    ↓
Service A uses token to call API
    ↓
API Gateway validates JWT
    ↓
Request processed
```

### JWT Token Structure

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "key-id-2024-12-15"
}
{
  "sub": "user-id-or-service-id",
  "aud": ["api.ecommerce.internal"],
  "iss": "auth.ecommerce.internal",
  "exp": 1734277200,
  "iat": 1734273600,
  "scope": "orders:read orders:write inventory:read",
  "client_id": "web-app-v1",
  "grant_type": "authorization_code"
}
```

## Consequences

### Positive Consequences ✅

1. **Industry Standard**
   - OAuth2 is the de-facto standard for API authentication
   - Widely understood by developers and security teams
   - Extensive tooling and libraries available
   - Aligns with best practices from OWASP and NIST

2. **Flexibility**
   - Supports multiple client types (web, mobile, service-to-service)
   - Multiple grant types for different use cases
   - Easy to add third-party integrations
   - Compatible with federated identity providers (future)

3. **Stateless Architecture**
   - JWT tokens are self-contained with embedded claims
   - No server-side session storage required
   - Scales horizontally without session replication
   - Microservices can validate tokens independently

4. **Security**
   - RS256 signing prevents token tampering
   - Regular key rotation (90-day policy)
   - Support for token revocation
   - Scope-based access control
   - Encryption in transit (HTTPS/TLS 1.3)

5. **Operational Benefits**
   - Token expiry forces periodic re-authentication
   - Refresh tokens enable seamless UX without password entry
   - JWKS endpoint allows distributed validation
   - Audit trail of token usage

### Negative Consequences ⚠️

1. **Token Management Complexity**
   - Clients must implement token refresh logic
   - Storing tokens on client-side introduces security risks
   - Requires secure token storage mechanisms (secure cookies, secure storage)
   - Token expiration needs careful UX handling

2. **Revocation Challenges**
   - JWT tokens cannot be instantly revoked (token already issued)
   - Requires token blacklist/revocation cache for immediate revocation
   - Additional infrastructure for real-time revocation
   - Eventual consistency until cache TTL expires

3. **Implementation Complexity**
   - Setting up and securing OAuth2 authorization server
   - Key management and rotation procedures
   - Testing OAuth2 flows is more complex
   - Integration testing with multiple client types needed

4. **Operational Overhead**
   - OAuth2 authorization server requires monitoring and management
   - Key rotation procedures must be automated
   - Token validation at API Gateway adds latency
   - Troubleshooting token issues requires JWKS inspection

## Implementation Details

### CALM Architecture Updates

**New Node**: `oauth2-auth-server`
- Type: Service
- Runtime: Java 17 + Spring Security
- Deployment: Kubernetes with 3 replicas
- Interfaces: Token, Authorize, JWKS endpoints

**Updated API Gateway**:
- Added OAuth2 and JWT metadata
- New security controls: SEC-003, SEC-004, SEC-005
- JWKS validation caching enabled (3600s TTL)
- Circuit breaker for auth server calls

**New Relationship**:
- API Gateway → OAuth2 Auth Server: Token validation

### Configuration

```yaml
OAuth2 Configuration:
  Token Endpoint: https://auth.ecommerce.internal/oauth2/token
  Authorize Endpoint: https://auth.ecommerce.internal/oauth2/authorize
  JWKS Endpoint: https://auth.ecommerce.internal/.well-known/jwks.json
  
JWT Configuration:
  Algorithm: RS256
  Signing Key: Private key (256-bit RSA)
  Validation Key: Public JWKS
  Key Rotation: 90 days
  
Token Expiry:
  Access Token: 1 hour
  Refresh Token: 30 days
  
Grant Types:
  - authorization_code (web apps, mobile apps)
  - client_credentials (service-to-service, trusted clients)
  - refresh_token (token refresh)
```

### Security Controls

| Control ID | Requirement |
|---|---|
| **SEC-003** | Implement RFC 6749 OAuth2 with authorization_code and client_credentials flows |
| **SEC-004** | Use RS256 for JWT signing, rotate keys every 90 days, validate expiry |
| **SEC-005** | Access tokens expire in 1 hour, refresh tokens in 30 days, implement revocation |

### Monitoring & Logging

- Token issuance rate and patterns
- Authentication failure rates
- Key rotation completion tracking
- JWKS endpoint availability and response times
- Token validation cache hit/miss ratios

## Alternatives Considered

1. **API Keys**: Too simplistic, no expiration, harder to revoke
2. **mTLS**: Complex client certificate management, not user-friendly
3. **SAML**: Heavier protocol, designed for enterprise federation
4. **Custom JWT**: Reinventing the wheel, security risks
5. **Session Tokens**: Requires server-side storage, doesn't scale

## Migration Path

### Phase 1: Foundation (Q4 2024)
- Deploy OAuth2 authorization server
- Implement JWT validation in API Gateway
- Create test credentials for integration testing

### Phase 2: Adoption (Q1 2025)
- Migrate web and mobile clients to OAuth2
- Support legacy API keys during transition
- Train development teams on OAuth2 flows

### Phase 3: Completion (Q2 2025)
- Deprecate legacy authentication methods
- Full OAuth2 enforcement
- Partner integrations move to OAuth2

## Related ADRs

- ADR-0001: Message Queue for Async Processing (independent but complements secure async communication)

## References

- RFC 6749: OAuth2 Authorization Framework: https://tools.ietf.org/html/rfc6749
- RFC 7519: JWT (JSON Web Tokens): https://tools.ietf.org/html/rfc7519
- RFC 8017: PKCS #1: RSA Cryptography: https://tools.ietf.org/html/rfc8017
- Spring Security OAuth2: https://spring.io/projects/spring-security-oauth2
- OWASP OAuth2 Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Cheat_Sheet

## Decisions Captured in CALM

This ADR is reflected in the CALM architecture:
- `oauth2-auth-server` node with JWKS, token, and authorize endpoints
- Security controls SEC-003, SEC-004, SEC-005 at API Gateway level
- Enhanced API Gateway metadata with OAuth2 and JWT specifications
- Relationship: API Gateway → OAuth2 Auth Server for token validation

## Sign-Off

- **Approved by**: Security Review Board, Architecture Team
- **Implementation Lead**: Security Team
- **Go-Live Date**: Q1 2025
- **Review Date**: Q2 2025
