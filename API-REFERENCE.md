# API Reference

**Project**: GH Helper（小壁蜂 OsmiaAI）
**Version**: 0.3.8-beta
**Scope**: public sanitized API behavior

This document describes public architectural behavior, not the full private backend implementation. It intentionally omits provider keys, private prompts, database dumps, runtime task payloads and source code.

---

## 1. Security Model

```text
Browser -> PHP proxy -> external LLM provider
```

The browser does not send provider credentials. The server reads the model provider key from a private environment variable or private local configuration. Public docs must not contain real keys, personal access tokens or secret file contents.

---

## 2. Chat Proxy

### Endpoint

```text
POST /api/chat.php
GET  /api/chat.php?task_id=<task_id>
```

### POST Request

The private frontend sends model configuration and chat messages to the server proxy.

```json
{
  "model": "deepseek-v4-pro",
  "messages": [
    { "role": "system", "content": "sanitized system instruction" },
    { "role": "user", "content": "How should I build this GH definition?" }
  ],
  "max_tokens": 64096,
  "reasoning_effort": "max",
  "thinking": { "type": "enabled" },
  "async": true
}
```

Parameter behavior:

| Field | Public behavior |
| --- | --- |
| `model` | Deployment-selected model name. Public docs should not hard-code secrets or private routing keys. |
| `messages` | Standard chat messages assembled by the private runtime. |
| `max_tokens` | Clamped server-side. 0.3.8-beta aligns frontend and backend around 64096. |
| `temperature` | Optional. Clamped server-side when accepted. |
| `top_p` | Optional. Removed or ignored when incompatible with thinking mode. |
| `reasoning_effort` | Optional reasoning-depth control. |
| `thinking` | Optional thinking-mode payload. |
| `async` | Defaults to async behavior in the private implementation. |

### Async Response

```http
HTTP/1.1 202 Accepted
Content-Type: application/json
```

```json
{
  "success": true,
  "task_id": "32_hex_character_task_id",
  "status": "pending"
}
```

The task ID is generated server-side and must match the expected format before polling.

### Polling

```text
GET /api/chat.php?task_id=<task_id>
```

Pending:

```json
{
  "success": true,
  "status": "pending"
}
```

Completed:

```json
{
  "success": true,
  "status": "completed",
  "data": {
    "choices": [
      {
        "message": {
          "role": "assistant",
          "content": "sanitized answer"
        }
      }
    ]
  }
}
```

Failed:

```json
{
  "success": false,
  "status": "failed",
  "error": "sanitized error message"
}
```

---

## 3. Runtime Task Handling

The private backend stores transient task state outside the public repository.

| Task state | Meaning |
| --- | --- |
| `pending` | Task accepted and waiting or running |
| `completed` | Provider response written to task result |
| `failed` | Provider call or validation failed |
| `expired` | Task file is too old or has been cleaned |

Public docs should describe the behavior, not publish task JSON examples copied from production.

---

## 4. Authentication And Persistence

The private app API includes account and conversation persistence. Publicly safe details:

- passwords are verified with modern password hashing APIs
- session tokens are random 64-hex values stored server-side
- token expiry is enforced
- SQLite is configured with WAL mode and foreign key checks in the private deployment
- conversation writes are handled transactionally

Publicly unsafe details:

- real database files
- user records
- auth tokens
- migration dumps
- server path structure
- raw endpoint source code

---

## 5. Error Handling Principles

| Error category | Public behavior |
| --- | --- |
| invalid JSON | return sanitized client error |
| missing required messages | return sanitized client error |
| invalid task ID | reject before reading task storage |
| provider failure | return sanitized server/proxy error |
| timeout | report failure or continue polling depending on private configuration |

The frontend should present a user-friendly error without exposing provider response bodies that may contain sensitive request metadata.

---

## 6. Release Checklist For API Docs

Before publishing API documentation:

- remove real domains except approved public demo/repo links
- remove provider keys, GitHub tokens and auth tokens
- remove private prompt text if it exposes product logic
- remove raw task payloads and database records
- describe schemas abstractly when the exact field values are private
