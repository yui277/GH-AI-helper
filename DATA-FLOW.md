# Data Flow

**Project**: GH Helper（小壁蜂 OsmiaAI）
**Version**: 0.3.8-beta
**Scope**: public sanitized diagrams

This document focuses on project-specific data flows. It intentionally avoids generic diagrams for event buses, stores or basic MVC layers.

---

## 1. Request To Response

```mermaid
flowchart TD
    User[User question] --> UI[Browser UI]
    UI --> Store[Session state]
    Store --> Route[IntentRouter]
    Route --> NeedKB{Needs KB/search?}
    NeedKB -->|yes| Retrieval[KB + search retrieval]
    NeedKB -->|no| Runtime
    Retrieval --> Artifact[Research notes artifact]
    Artifact --> Runtime[Context runtime]
    Runtime --> Workflow{Workflow}
    Workflow --> Simple[Simple answer]
    Workflow --> React[ReAct loop]
    Workflow --> Swarm[Multi-agent swarm]
    Workflow --> Other[Research / code / methodology]
    Simple --> Gateway[LLMGateway]
    React --> Gateway
    Swarm --> Gateway
    Other --> Gateway
    Gateway --> Proxy[Server chat proxy]
    Proxy --> LLM[External LLM]
    LLM --> Guard[Quality guard]
    Guard --> Parser[Structured parser]
    Parser --> Output[Markdown / code / wiring output]
```

---

## 2. Async Task Flow

```mermaid
sequenceDiagram
    participant UI as Browser UI
    participant Proxy as PHP chat proxy
    participant Task as Task storage
    participant LLM as External LLM

    UI->>Proxy: POST chat request
    Proxy->>Proxy: validate model and parameters
    Proxy->>Task: create task
    Proxy-->>UI: 202 + task_id
    par Server execution
        Proxy->>LLM: request with server-side API key
        LLM-->>Proxy: completion result
        Proxy->>Task: mark completed or failed
    and Browser polling
        UI->>Proxy: GET task state
        Proxy-->>UI: pending
        UI->>Proxy: GET task state
        Proxy-->>UI: completed + result
    end
```

Security consequence: browser traffic never contains the provider API key.

---

## 3. Context Compression Flow

```mermaid
flowchart LR
    Primers[System primers] --> Window[Context window]
    Recent[Recent turns] --> Window
    Middle[Older middle turns] --> Pressure{Budget pressure}
    Pressure -->|low| Window
    Pressure -->|high| Compress[Compress middle context]
    Compress --> Window
    Window --> Prompt[Prepared prompt]
    Prompt --> LLM[LLM call]
    LLM --> Summary[Session summary]
    Summary --> Window
```

The current implementation keeps stable primers and recent turns while compressing older middle content once context pressure crosses an internal threshold.

---

## 4. Swarm Workflow Flow

```mermaid
flowchart TD
    Input[Complex GH request] --> Lead[LeadAgent creates plan]
    Lead --> Tasks[Dynamic task decomposition]
    Tasks --> M[Methodology agent]
    Tasks --> P[Plugin agent]
    Tasks --> N[Node agent]
    Tasks --> D[DataTree agent]
    Tasks --> F[Fabrication agent]
    Tasks --> S[Script agent]
    M --> Collect[Collect specialist outputs]
    P --> Collect
    N --> Collect
    D --> Collect
    F --> Collect
    S --> Collect
    Collect --> Critic[CriticAgent review]
    Critic --> Synth[Synthesizer final answer]
    Synth --> Artifact[Plan / code / wiring artifacts]
```

The actual agents selected depend on router analysis and active GH task intent. The public repo documents role categories, not internal prompts.

---

## 5. Structured Rendering Flow

```mermaid
flowchart LR
    Raw[Model response] --> Split[Structured response parser]
    Split --> Text[Markdown text]
    Split --> Code[Code block payload]
    Split --> Graph[Wiring graph payload]
    Code --> CodePanel[CodePanelRenderer]
    Graph --> Normalize[Normalize nodes and edges]
    Normalize --> WiringPanel[WiringPanelRenderer]
    Text --> Chat[Chat response]
    CodePanel --> Chat
    WiringPanel --> Chat
```

GH answers frequently need code and topology. Rendering them as structured panels makes the response easier to inspect than a single long text block.

---

## 6. Public Release Data Boundary

```mermaid
flowchart TB
    Public[Public GitHub docs] --> Safe[Architecture, diagrams, release notes]
    Private[Private project assets] --> Secrets[Secrets and keys]
    Private --> KB[Knowledge-base files]
    Private --> DB[Databases and task data]
    Private --> Source[Full app source]
    Secrets -.excluded.-> Public
    KB -.excluded.-> Public
    DB -.excluded.-> Public
    Source -.excluded.-> Public
```

Any update to this repository should pass a sensitive-content scan before pushing.
