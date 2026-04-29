# Documentation Index

**Project**: GH Helper（小壁蜂 OsmiaAI）
**Version**: 0.3.8-beta
**Generated**: 2026-04-29

This repository is a sanitized public archive for technical documentation and release history. It is not the private production source tree.

---

## Recommended Reading

1. [README.md](./README.md): product overview, release boundary and documentation map
2. [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md): main technical architecture and diagrams
3. [DATA-FLOW.md](./DATA-FLOW.md): request, async proxy, context and rendering flows
4. [MODULES.md](./MODULES.md): concise module responsibility brief
5. [API-REFERENCE.md](./API-REFERENCE.md): sanitized API behavior
6. [Architecture-Whitepaper-CN-EN.md](./Architecture-Whitepaper-CN-EN.md): public architecture whitepaper

---

## File Purpose

| File | Purpose |
| --- | --- |
| README.md | Entry point and 0.3.8-beta summary |
| TECHNICAL-ARCHITECTURE.md | Primary architecture description |
| DATA-FLOW.md | Mermaid diagrams for project-specific data flow |
| MODULES.md | Module responsibility map without generic tutorials |
| API-REFERENCE.md | Chat proxy and persistence behavior, sanitized |
| Architecture-Whitepaper-CN-EN.md | Design motivation and evolution |
| DEPLOYMENT.md | Private deployment shape without source disclosure |
| EXTENSION-GUIDE.md | Extension boundaries and design notes |
| PROJECT-SUMMARY.md | Summary of this public documentation release |
| RELEASE-POLICY.md | Publishing and sensitive-content rules |
| SECURITY.md | Security statement |
| src/ | Abstract code skeleton, not production source |

---

## What Changed In This Documentation Pass

- Added `TECHNICAL-ARCHITECTURE.md`.
- Replaced long tutorial-style module notes with a concise architecture brief.
- Reworked data-flow diagrams around real 0.3.8-beta behavior.
- Updated API docs to emphasize async task mode and server-side secrets.
- Removed private-style deployable file tree descriptions.
- Clarified that architecture diagrams from unrelated product pages are not used here.

---

## Public Boundary Reminder

Do not add:

- API keys or GitHub tokens
- private source files
- knowledge-base JSON
- SQLite databases
- runtime task files
- user records or logs
- unredacted server paths or credentials
