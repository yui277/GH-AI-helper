# Module Architecture Brief

**Project**: GH Helper（小壁蜂 OsmiaAI）
**Version**: 0.3.8-beta
**Scope**: public, sanitized module documentation

This document replaces earlier tutorial-style module notes. It does not explain basic event buses, stores, classes, or factory patterns. The useful part for this project is how these pieces are composed for Grasshopper-specific AI assistance.

---

## Module Map

| Layer | Private implementation responsibility | Public note |
| --- | --- | --- |
| Browser UI | Conversation layout, sidebar state, settings, history loading, panel mounting | UI source is private; this repo documents only behavior |
| Runtime | Session state, context window, memory, artifacts, token budget, loop and quality checks | Core technical value |
| Workflow | Intent routing and workflow execution | Six workflow types are documented; internal prompts are private |
| Agents | Lead planning, specialist execution, critique and synthesis | Role names and responsibilities are public |
| Services | LLM gateway, knowledge retrieval, web/search fallback, summary utilities | API keys and KB files are private |
| Renderers | Markdown, code panel and wiring panel structured rendering | Sanitized behavior only |
| Backend proxy | Async chat task handling, environment-based secret loading, request validation | Source code and secrets are not public |
| Persistence | SQLite auth, tokens, conversation metadata, runtime task files | Schema details are only summarized |

---

## Runtime Layer

The runtime layer is the main difference between GH Helper and a normal chat wrapper.

| Component | What it does |
| --- | --- |
| ContextWindowManager | Keeps stable primers and recent turns, compresses the middle of long sessions when context pressure rises |
| MemoryStore | Maintains short-term memory, working memory and long-term summary during a session |
| ArtifactWorkspace | Stores structured outputs such as plans, research notes, code snippets and wiring schemes |
| LoopDetector | Detects repeated action signatures within a short time window |
| QualityGuard | Checks loops and flags risky GH component claims that lack verification |

The important design point is that long GH conversations often mix design intent, node topology, plugin choices and code fragments. The runtime keeps those parts available without sending uncontrolled full history every time.

---

## Workflow Layer

The router classifies each request before execution. In 0.3.8-beta the public workflow taxonomy is:

| Workflow | Typical use |
| --- | --- |
| `simple_answer` | Direct GH explanation or short answer |
| `react_tool_loop` | Needs knowledge retrieval, search or iterative tool-like reasoning |
| `multi_agent_swarm` | Complex parametric strategy requiring specialist perspectives |
| `research_synthesis` | Broader research-style answer with sources or comparisons |
| `code_generation` | C#/Python/GH script output with code panel rendering |
| `deep_methodology_review` | Methodological review, critique or design logic analysis |

Routing uses an LLM JSON decision when possible and falls back to deterministic heuristics if the JSON cannot be parsed. This avoids a single brittle classification path.

---

## Agent Layer

The agent system is not published as raw source. Publicly documented roles are:

| Role | Responsibility |
| --- | --- |
| lead | Plans the task and decomposes specialist work |
| methodology | Reviews generative design strategy and algorithmic logic |
| plugin | Evaluates GH plugin ecosystem choices and native fallback paths |
| script | Handles C#/Python scripting constraints and embedded code |
| node | Focuses on native Grasshopper component correctness |
| datatree | Checks tree structure, graft/flatten/simplify and list depth |
| fabrication | Reviews rationalization, tolerance and buildability |
| research | Handles broader reference gathering |
| kb_recall | Pulls targeted knowledge-base context |
| critic | Performs critique and risk checking |
| synthesizer | Merges specialist outputs into a final answer |

The 0.3.8-beta improvement is that the factory covers all roles with explicit specialties instead of collapsing most roles into a generic specialist.

---

## Service Layer

| Service | High-value behavior |
| --- | --- |
| LLMGateway | Sends requests through the server proxy, never exposing API keys in the browser |
| Retry handling | Retries failed completions with backoff rather than failing immediately |
| Keyword extraction | Rewrites user questions into retrieval-oriented keywords |
| Conversation summary | Produces compact summaries and strips internal analysis before display |
| KnowledgeBaseService | Loads only matched public-domain GH knowledge fragments from a server path |
| SearchService | Uses a local search backend when available and degrades gracefully |

The knowledge base contents are private assets. Public docs should describe categories and retrieval behavior, not copy JSON content.

---

## Backend Proxy Layer

The private PHP proxy has three public architectural points:

- Browser requests do not carry provider API keys.
- The server reads secrets from environment variables or private local configuration.
- Chat requests default to asynchronous task mode so the UI can poll completion status without keeping a fragile long request open.

The implementation also clamps request parameters, validates task IDs and periodically cleans expired task files.

---

## Structured Rendering Layer

GH Helper uses renderer modules because GH answers are rarely plain paragraphs.

| Renderer | Value |
| --- | --- |
| Code panel | Normalizes language names, restores escaped newlines, shows line numbers and supports copy/download |
| Wiring panel | Normalizes nodes and edges, renders SVG topology, supports zoom/pan/touch and exports SVG |
| Markdown response | Keeps the normal answer readable while allowing structured blocks to become interactive panels |

This is one of the places where the product becomes more useful than a general AI chat page: users can inspect a proposed GH wiring or script as a structured artifact.

---

## What Was Removed From Earlier Docs

The following content is intentionally no longer expanded here:

- how a publish/subscribe event bus works
- generic state-store examples
- basic class inheritance or factory pattern tutorials
- long code samples that are not the real production source
- raw private directory listings
- knowledge-base filenames and contents
- deployment snippets that imply this public repo is directly deployable

Those topics are common engineering knowledge or private implementation detail. The public docs now focus on the parts that explain GH Helper's actual product architecture.
