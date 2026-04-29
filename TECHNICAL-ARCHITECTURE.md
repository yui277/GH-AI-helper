# Technical Architecture

**Project**: GH Helper（小壁蜂 OsmiaAI）
**Version**: 0.3.8-beta
**Document status**: public sanitized architecture notes

This document is based on the 0.3.8-beta project line and the public product positioning of OsmiaAI. It intentionally excludes private source files, API keys, knowledge-base contents, runtime task files, databases and user data.

---

## 1. Product Logic

GH Helper is best understood as a GH-specialized orchestration layer around a general LLM. Its value is not in training a new model. Its value is in the product and runtime layer:

- understand whether a GH question is simple, research-heavy, code-heavy or topology-heavy
- retrieve targeted GH knowledge when useful
- keep useful context while compressing long conversations
- ask specialist agents to inspect methodology, plugins, scripts, nodes, Data Tree and fabrication risk
- render final output as text, code or wiring artifacts instead of only plain chat
- keep API keys and runtime state on the server side

```mermaid
flowchart LR
    Q[GH design question] --> O[OsmiaAI orchestration layer]
    O --> I[Intent routing]
    O --> K[Specialized KB retrieval]
    O --> C[Context and memory runtime]
    O --> A[Agent role matrix]
    O --> R[Structured renderers]
    I --> L[General LLM]
    K --> L
    C --> L
    A --> L
    L --> R
```

---

## 2. Public And Private Boundary

```mermaid
flowchart TB
    subgraph PublicRepo[Public GitHub repository]
        D[Sanitized docs]
        S[Abstract src skeleton]
        P[Release and security policy]
    end

    subgraph PrivateProject[Private GH_helper_super0.3.8 project]
        UI[Full frontend source]
        API[PHP proxy source]
        KB[Knowledge-base JSON]
        DB[SQLite data]
        T[Runtime task files]
        Sec[Secrets and API keys]
    end

    subgraph LiveService[Live deployment]
        Web[Browser app]
        Proxy[Server proxy]
        Model[External LLM provider]
    end

    D -.describes.-> UI
    D -.describes.-> API
    S -.abstract reference only.-> UI
    UI --> Web
    API --> Proxy
    KB --> Proxy
    DB --> Proxy
    T --> Proxy
    Sec --> Proxy
    Proxy --> Model

    Sec -.never publish.-> PublicRepo
    KB -.never copy.-> PublicRepo
    DB -.never copy.-> PublicRepo
```

The public repository is not a deployment package. It is a technical archive and release boundary.

---

## 3. Runtime Pipeline

```mermaid
flowchart TD
    Start([User submits GH question]) --> UI[Browser UI]
    UI --> State[Session state update]
    State --> Router[IntentRouter]
    Router --> Decision{Workflow decision}

    Decision -->|simple| Simple[SimpleWorkflow]
    Decision -->|needs retrieval| React[ReactWorkflow]
    Decision -->|complex| Swarm[SwarmWorkflow]
    Decision -->|research/code/review| Specialized[Specialized workflow]

    React --> Search[SearchService]
    React --> KB[KnowledgeBaseService]
    Search --> Notes[Research artifact]
    KB --> Notes

    Swarm --> Lead[LeadAgent plan]
    Lead --> Specialists[Specialist agents]
    Specialists --> Critic[Critic review]
    Critic --> Synthesis[Synthesizer]

    Simple --> Context[ContextWindowManager]
    Notes --> Context
    Synthesis --> Context
    Specialized --> Context

    Context --> Gateway[LLMGateway]
    Gateway --> Proxy[PHP async proxy]
    Proxy --> Model[External LLM]
    Model --> Guard[QualityGuard]
    Guard --> Parse[Structured response parser]
    Parse --> Render[Markdown / Code / Wiring panels]
    Render --> End([User sees final answer])
```

Key point: routing happens before the expensive model call. The system attempts to send a prepared context and workflow-specific instruction rather than forwarding raw chat history directly.

---

## 4. Async Chat Proxy

0.3.8-beta uses an asynchronous chat proxy by default.

```mermaid
sequenceDiagram
    participant Browser
    participant Chat as /api/chat.php
    participant Task as runtime task file
    participant Provider as External LLM

    Browser->>Chat: POST messages, model, parameters
    Chat->>Chat: validate and clamp parameters
    Chat->>Task: create task_id
    Chat-->>Browser: 202 Accepted + task_id
    Chat->>Provider: server-side request with private API key
    Provider-->>Chat: model response
    Chat->>Task: write completed or failed state
    Browser->>Chat: GET ?task_id=...
    Chat-->>Browser: pending / completed / failed
```

This protects secrets and avoids exposing provider credentials in browser traffic. The proxy validates task IDs, cleans expired task files and supports a synchronous fallback only when explicitly requested by the private implementation.

---

## 5. Context, Memory And Artifacts

```mermaid
flowchart LR
    Msg[Conversation messages] --> CW[ContextWindowManager]
    Primer[Stable primers] --> CW
    Recent[Recent turns] --> CW
    Old[Middle history] --> Compress[Compression]
    Compress --> CW

    CW --> Prompt[LLM prompt context]

    Prompt --> Output[Model output]
    Output --> Memory[MemoryStore]
    Output --> Artifacts[ArtifactWorkspace]
    Output --> Guard[QualityGuard]

    Memory --> CW
    Artifacts --> Render[Structured panels]
    Guard --> Render
```

The context manager keeps stable primers and recent turns while compressing older middle content when the token budget is under pressure. This is important for GH tasks because the useful state may be a mix of design goals, plugin choices, node topology and code.

---

## 6. What Is Technically Valuable

| Area | Value |
| --- | --- |
| JIT-style prompt assembly | Active intents become a compact, request-specific instruction matrix |
| Workflow routing | Different execution paths for simple, retrieval, swarm, research, code and review tasks |
| Agent specialization | GH-specific roles reduce generic answers and force topology/code/plugin checks |
| Context compression | Long conversations stay usable without blindly forwarding all history |
| Artifact workspace | Plans, research notes, code and wiring outputs stay structured |
| Async proxy | Keeps browser responsive and API keys server-side |
| Quality guard | Detects repeated loops and risky unverified GH component claims |
| Wiring renderer | Converts graph-like answers into inspectable node/edge diagrams |
| Code panel | Makes generated scripts easier to inspect, copy and download |
| Secure auth changes | Uses bcrypt-style password verification and random server-stored tokens |

---

## 7. Module Responsibility Table

| Private module area | Public architectural role |
| --- | --- |
| core runtime | State machine, runtime states, workflow constants, role constants |
| services | LLM proxy client, KB retrieval, search fallback, summarization |
| workflows | Router, workflow engine, simple/ReAct/swarm and specialized flows |
| agents | Lead planning, specialist execution, critique and synthesis |
| runtime | Context window, memory, artifact workspace, loop and quality checks |
| code panel | Script display, line numbering, copy/download, language normalization |
| wiring panel | Node/connection normalization, SVG rendering, zoom/pan/export |
| PHP chat proxy | Async tasks, parameter validation, secret loading, provider request |
| PHP app API | Auth tokens, conversation persistence, SQLite settings |

---

## 8. Documentation Boundary

The following should stay out of public docs:

- provider API keys or personal access tokens
- exact private knowledge-base contents
- user data, logs, runtime task JSON and databases
- full production frontend or backend source
- server-specific paths, domains or credentials beyond public demo links
- copied internal prompts that would expose private product logic

The following is safe and useful:

- architecture responsibilities
- release history
- high-level workflow diagrams
- security boundary descriptions
- abstract module behavior
- sanitized API behavior
