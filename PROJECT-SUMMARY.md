# Project Summary

**Project**: GH Helper（小壁蜂 OsmiaAI）
**Version**: 0.3.8-beta
**Summary date**: 2026-04-29
**Live demo**: https://topogenesis.top/intro/ghhelper

---

## Summary

This repository has been reorganized as a public, sanitized technical archive for GH Helper 0.3.8-beta. The current docs emphasize project-specific architecture value and remove long generic explanations that do not help readers understand the product.

The latest private project line remains outside the repository. Public docs now describe behavior and design boundaries rather than publishing raw implementation assets.

---

## Main Improvements

| Area | Improvement |
| --- | --- |
| Product positioning | Clarifies that OsmiaAI is lightweight orchestration around an LLM, not model training |
| README completeness | Restores the older public README's overview, core features, tech stack, quick start, metrics and license sections |
| License | Adds root MIT `LICENSE` file for the public sanitized repository |
| Architecture | Adds a dedicated technical architecture document with Mermaid diagrams |
| Modules | Replaces tutorial-style module explanations with responsibility and value tables |
| API | Documents async proxy behavior and secret handling without exposing implementation details |
| Data flow | Adds focused diagrams for routing, async task polling, context compression, swarm execution and rendering |
| Deployment | Removes private deployable tree examples and keeps only sanitized deployment shape |
| Release boundary | Repeats what must not be published: source, KB, database, runtime files and secrets |

---

## Technical Value Captured

- intent routing with fallback behavior
- six workflow types
- 11-role agent matrix
- context window and compression
- session memory and artifact workspace
- async PHP chat proxy
- server-side secret loading
- quality guard and loop detection
- code and wiring structured renderers
- SQLite/auth hardening summarized at architecture level

---

## What Was Intentionally Removed

- generic EventBus tutorials
- Redux-like state-store explanations
- inheritance and factory-pattern teaching examples
- full private directory trees
- private knowledge-base file names and contents
- deploy instructions that imply the public repo is directly runnable
- unrelated architecture diagrams from other product material

---

## Current Public Documentation Set

| File | Status |
| --- | --- |
| README.md | Updated |
| LICENSE | Added |
| TECHNICAL-ARCHITECTURE.md | Added |
| DATA-FLOW.md | Rewritten |
| MODULES.md | Rewritten |
| API-REFERENCE.md | Rewritten |
| Architecture-Whitepaper-CN-EN.md | Rewritten |
| DEPLOYMENT.md | Rewritten |
| INDEX.md | Rewritten |
| RELEASE-POLICY.md | Kept |
| SECURITY.md | Kept |
| EXTENSION-GUIDE.md | Existing extension note |

---

## Release Boundary

The public repository preserves technical history and explanation. It must not contain:

- `GH_helper_super0.3.8` raw production source
- backend proxy source
- provider API keys or personal access tokens
- knowledge-base JSON
- SQLite databases
- runtime task JSON
- user data, auth tokens, cookies or logs
