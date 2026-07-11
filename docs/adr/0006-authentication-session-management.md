# ADR-0006: Centralize Authentication Session Management

## Status

Accepted

## Context

The Angular application uses JWT bearer authentication. Authenticated state must
survive browser refreshes, protected routes must reject guests, authentication
pages must reject signed-in users, and expired tokens must not leave feature pages
showing misleading empty states.

The backend currently issues access tokens only and does not provide refresh
tokens.

## Decision

- Store the access token through `TokenStorage` and non-sensitive user display
  metadata through `UserStorage` in browser local storage.
- Keep the current token, user, authentication state, label, and initials in
  `AuthState` signals.
- Attach the bearer token through one functional HTTP interceptor.
- When an authenticated request returns `401 Unauthorized`, clear the complete
  session, redirect once to `/login`, and rethrow the HTTP error.
- Do not clear the session for `403 Forbidden`.
- Protect application routes with `authGuard` and redirect authenticated users
  away from login and registration with `guestGuard`.
- Keep the public landing page available to everyone, but show dashboard actions
  instead of login and registration actions to authenticated users.

## Consequences

### Positive

- Authentication behavior is consistent across every feature.
- Feature components do not duplicate token or `401` handling.
- Session display metadata survives refreshes.
- Route behavior remains predictable for guests and signed-in users.

### Negative

- Local storage is readable by JavaScript and therefore depends on strong XSS
  prevention. Tokens must never contain secrets beyond their intended claims.
- Expired sessions require a new login because refresh tokens are unavailable.
- Existing sessions created before user metadata persistence may show a generic
  avatar until the next login.

## Future Considerations

If longer-lived sessions become necessary, introduce rotating refresh tokens with
server-side revocation rather than extending access-token lifetime or adding
silent retry logic around the current token.
