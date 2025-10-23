### Nylas UI Integration Guide (OAuth + Inbox Tasks)

This document specifies the minimal endpoints and client calls needed to build a simple UI that lets a signed-in user connect Gmail via Nylas and view their extracted inbox tasks.

### Prerequisites

- **User auth**: User can sign up/sign in (session/cookie available to the browser).
- **Env/config**: Nylas app configured (client ID, API key), backend routes wired.

### Core User Flow

1) User clicks "Connect Gmail".
2) App calls `startOAuthFlow` to get a Nylas Hosted OAuth URL, then redirects the browser to it.
3) Nylas completes provider consent and redirects to your callback.
4) Backend exchanges the code, stores `grantId`, sets up webhook(s), and redirects user back to the app.
5) UI calls `listInboxTasks` to render extracted tasks.

### Endpoints

- **startOAuthFlow** (Action)
  - **Purpose**: Generate and return the Nylas Hosted OAuth URL.
  - **Args**:
    - `redirectUri`: string (your app callback URL)
  - **Response**: `{ url: string }`

- **GET /integrations/nylas/callback** (HTTP)
  - **Purpose**: OAuth callback landing; exchange `code` for `grantId` and link account to current user.
  - **Query**: `code`, `state` (optional)
  - **Behavior**: Validates state, exchanges code, persists `grantId` (+ account email), sets up webhook, and redirects to success page (e.g., `/inbox`).

- **listInboxTasks** (Query)
  - **Purpose**: Return extracted inbox tasks for the current user.
  - **Args**:
    - `limit?`: number (default 50)
    - `cursor?`: string (opaque pagination token)
    - Optional: further filters if supported (e.g., `status`)
  - **Response**:
    - `{
        items: Array<{
          _id: string;
          grantId: string;
          messageId: string;
          subject?: string;
          from?: { email: string; name?: string }[];
          to?: { email: string; name?: string }[];
          title: string;
          sentence?: string;
          actionType?: 'do' | 'schedule' | 'delegate' | 'defer';
          ownership?: 'user' | 'other' | 'unknown';
          detectedDeadlineISO?: string | null;
          confidence: number; // 0..1
          status: 'pending_confirmation' | 'confirmed' | 'ignored';
          receivedAt?: string; // ISO
        }>;
        nextCursor?: string;
      }`

### Example Calls

#### Connect Gmail button (Convex client)

```typescript
const { url } = await convex.mutation('integrations/nylas:startOAuthFlow', {
  redirectUri: `${window.location.origin}/integrations/nylas/callback`,
});
window.location.href = url;
```

#### OAuth callback (HTTP)

```http
GET /integrations/nylas/callback?code=...&state=...
```

Recommended behavior: server redirects to your app (e.g., `/inbox`).

#### List inbox tasks (Convex client)

```typescript
const res = await convex.query('integrations/nylas:listInboxTasks', {
  limit: 50,
  cursor: undefined,
});
const { items, nextCursor } = res;
```

#### List inbox tasks (HTTP variant)

```http
GET /inbox/tasks?limit=50&cursor=<opaque>
```

```json
{
  "items": [
    {
      "_id": "inbox_123",
      "grantId": "nylas_grant_abc",
      "messageId": "msg_456",
      "subject": "Project kickoff",
      "from": [{ "email": "pm@example.com", "name": "PM" }],
      "to": [{ "email": "me@example.com" }],
      "title": "Confirm kickoff meeting time",
      "detectedDeadlineISO": "2025-10-23T23:59:00.000Z",
      "confidence": 0.78,
      "status": "pending_confirmation",
      "receivedAt": "2025-10-21T14:02:00.000Z"
    }
  ],
  "nextCursor": "eyJwYWdlIjoyfQ=="
}
```

### UI Notes

- **Pagination**: default 50; pass `limit: 100` to fetch 100; use `nextCursor` for subsequent pages.
- **State handling**: include a `state` in `startOAuthFlow` if you want CSRF protection or to carry return URL.
- **Redirects**: backend callback should redirect to a signed-in app route (e.g., `/inbox`).


