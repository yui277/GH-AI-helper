# Extension Guide

**Project**: GH Helper（小壁蜂 OsmiaAI）
**Version**: 0.3.8-beta
**Scope**: public sanitized extension notes

This guide describes where the private system can be extended. It does not publish production code, internal prompts, knowledge-base JSON or deployable file paths.

---

## 1. Extension Surfaces

| Surface | What can be extended | Public boundary |
| --- | --- | --- |
| Agent roles | Add or refine GH specialist perspectives | Role purpose can be documented; private prompts stay private |
| Workflow router | Add routing criteria or workflow types | Decision schema can be summarized; internal prompt text stays private |
| Knowledge base | Add native component, plugin or workflow knowledge | Categories can be described; JSON contents stay private |
| Structured renderers | Add visual panels for new output types | Renderer behavior can be described; production UI code stays private |
| Backend proxy | Add providers, limits, task behavior or telemetry | API behavior can be summarized; secrets and source stay private |
| Persistence | Add saved artifacts, metadata or preferences | Schema should be described only when sanitized |

---

## 2. Adding A New Agent Role

Use a new role only when it adds a distinct GH review perspective. Avoid adding agents that merely rephrase existing roles.

Good candidates:

- structural reasoning for GH definitions that interact with analysis tools
- environmental analysis for Ladybug/Honeybee style workflows
- optimization review for Galapagos/Wallacei style strategies
- fabrication costing or material nesting review

Checklist:

- define the role's GH-specific responsibility
- define what it must verify
- define what it must not hallucinate
- define how its output is merged by the lead/synthesizer path
- add quality checks if the role introduces new factual claims

---

## 3. Extending Workflows

Add a workflow only when routing to existing workflows would blur the output contract.

Examples:

| New workflow idea | When it is justified |
| --- | --- |
| optimization_review | The answer must compare solver strategy, fitness goals and constraints |
| plugin_migration | The answer must replace plugin-heavy definitions with native alternatives |
| teaching_mode | The answer must explain a GH concept step by step for learners |
| definition_audit | The answer must critique an existing definition and produce repair steps |

Each workflow should define:

- trigger conditions
- required context
- allowed retrieval behavior
- expected artifacts
- quality checks
- fallback path

---

## 4. Extending The Knowledge Base

The knowledge base should stay small, targeted and verifiable. It is not a place to copy broad tutorials.

Good KB entries:

- precise native component behavior
- plugin capability and dependency notes
- Data Tree edge cases
- common GH workflow patterns
- fabrication constraints tied to GH output

Avoid:

- generic Rhino or Grasshopper introductions
- copied web pages
- unverifiable plugin claims
- long prose that cannot be matched by keywords
- private commercial content that should not be redistributed

---

## 5. Extending Structured Output

Structured panels are useful when plain text is not enough.

| Output type | Renderer value |
| --- | --- |
| code | line numbers, language normalization, copy/download |
| wiring | node/edge inspection, placement steps, SVG export |
| audit report | checklist and risk ranking |
| parameter table | editable design variables and ranges |
| optimization run | objectives, constraints and candidate comparison |

The output schema should be forgiving enough to normalize small LLM variations, but strict enough to avoid rendering incorrect topology.

---

## 6. Security Checklist For Extensions

- never put API keys in browser code
- never commit knowledge-base private JSON to this public repo
- never include runtime task files or databases in examples
- avoid publishing complete private prompts
- validate IDs before reading server-side task storage
- clamp provider parameters server-side
- keep user data out of logs used in public docs

---

## 7. Documentation Checklist

When documenting a new extension publicly, include:

- what problem it solves
- which layer it touches
- what artifact it produces
- what safety checks it adds
- what private data remains excluded

Do not include full production source unless it has been explicitly prepared as a sanitized public example.
