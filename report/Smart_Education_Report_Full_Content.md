# Smart Education System — Final Year Project Report (Full Written Content)

**Use this file as the master text in Microsoft Word or Google Docs.** Set: A4, 12 pt, 1.5 line spacing, normal margins. Insert your **screenshots, architecture diagrams, DFDs, and ER diagrams** where marked *\[Insert figure …\]*. Those figures plus this text should bring you close to **~55 pages**. Replace bracketed placeholders (names, reg numbers, dates).

---

## Title page (fill placeholders)

**MAJOR PROJECT REPORT**  
**On**  
**Smart Education System: A Full-Stack E-Learning Platform with Generative AI, Multimodal Content, and Learning Analytics**

Submitted in partial fulfilment of the requirements for the award of the degree of  
**BACHELOR OF TECHNOLOGY**  
in  
**ELECTRONICS AND COMMUNICATION ENGINEERING**

**By**  
1. Augustine Fletcher A. S. — (Reg. No. _______________)  
2. Sharath S — (Reg. No. _______________)  
3. Saikarthik M — (Reg. No. _______________)

**Under the guidance of**  
_______________________  
(Name, designation, Department of ECE)

**DEPARTMENT OF ELECTRONICS AND COMMUNICATION ENGINEERING**  
**FACULTY OF ENGINEERING AND TECHNOLOGY**  
**SRM Institute of Science and Technology** — (Campus: _______________)  
**Chennai, India**  
**Month Year: _______________**

---

## Bonafide certificate (template)

This is to certify that the project report titled **“Smart Education System: A Full-Stack E-Learning Platform with Generative AI, Multimodal Content, and Learning Analytics”** is the bonafide work of the students listed above, carried out under my supervision. To the best of my knowledge, this work has not been submitted elsewhere for the award of any degree or diploma.

Signatures: Guide _______________ | HOD _______________  
Date: _______________ | Place: _______________

---

## Acknowledgement (template — edit tone/names)

We thank SRM Institute of Science and Technology for providing the academic environment and laboratory resources to complete this major project. We express gratitude to our Head of the Department for administrative support and to our project guide for technical direction, periodic reviews, and constructive feedback throughout design, implementation, and testing.

We acknowledge the maintainers of open-source frameworks and public documentation (Next.js, React, MongoDB, Mongoose, Tailwind CSS, and others) and the providers of educational and developer APIs that made integration of generative AI and media hosting practical within project timelines.

We thank our families and friends for encouragement during intensive development and demonstration preparation.

---

## Abstract (about one page when formatted)

Conventional learning portals often treat “learning” as a passive library: students download PDFs, watch videos, and only later seek help through separate search engines, generic chatbots, or office tools. That separation increases cognitive load, fragments the study context, and makes it harder for instructors to trace how assistance was obtained or to align automated help with course policies.

This project implements a **smart education system**: a single **full-stack web application** that unifies **multimodal subject delivery** (curated files and videos across tracks such as English, Tamil, and Social studies), **instructor publishing**, **learning analytics and gamification** (activities, XP, levels, badges, dashboards, leaderboards), and **embedded generative AI**. Generative capabilities—including **reading summarization**, **quiz generation from server-extracted PDF text**, **instructional diagram synthesis (Mermaid)**, **email drafting**, **speech-oriented assistance**, and **optional text-to-image generation (Stability SDXL)**—are executed **only on the server** via **Next.js Route Handlers**, using **Google Gemini** as the primary language-model stack with ordered model fallbacks and bounded in-memory caching. Optional SDXL supports creative assets. **MongoDB** with **Mongoose** stores users, activities, and catalog metadata; **Cloudinary** stores and delivers media via CDN URLs referenced from the database. **Authentication** combines **JWT**, **bcrypt** password hashing, and **optional Google OAuth**; some routes use **HttpOnly cookies** while others follow client token patterns—a documented point for future hardening in production.

The report documents **requirements**, **system architecture**, **module design**, **implementation details**, **testing strategy** with a functional checklist, **illustrative performance observations**, and **limitations** (provider dependence, assessment integrity, deployment and privacy). **Future work** includes normalizing JWT claims across routes, instructor review workflows for AI-generated assessments, streaming model output, formal user studies, and production-grade logging, rate limiting, and cost monitoring.

**Keywords:** E-learning, smart education, Next.js, MongoDB, generative AI, learning analytics, multimodal content, JWT, Cloudinary, gamification.

---

## Table of contents (copy into Word TOC or use as outline)

**Front matter**  
Bonafide certificate  
Acknowledgement  
Abstract  
Table of contents  
List of figures  
List of tables  
Abbreviations  

**Chapter 1 Introduction**  
1.1 Background and motivation  
1.2 Problem statement  
1.3 Objectives of the project  
1.4 Scope and delimitations  
1.5 Novelty and contributions  
1.6 Methodology (SDLC approach adopted)  
1.7 Report organization  

**Chapter 2 Literature survey and related work**  
2.1 Online learning modalities and LMS ecosystems  
2.2 Intelligent tutoring, feedback, and educational technology  
2.3 Large language models and generative AI in education  
2.4 Learning analytics and dashboards  
2.5 Gamification in learning applications  
2.6 Full-stack web architectures for educational products  
2.7 Security patterns for web learning systems (JWT, OAuth, password storage)  
2.8 Multimedia delivery and cloud CDNs  
2.9 Summary of research gaps addressed by this project  

**Chapter 3 Existing systems and comparative study**  
3.1 Overview of mainstream learning platforms  
3.2 Feature comparison (qualitative matrix)  
3.3 Limitations of generic chat tools as “sidecar” assistance  
3.4 Summary: motivation for an integrated capstone implementation  

**Chapter 4 Requirements specification**  
4.1 Stakeholder analysis (student, teacher, admin)  
4.2 Functional requirements (detailed list)  
4.3 Non-functional requirements (security, performance, usability, maintainability)  
4.4 Hardware and software requirements (development and deployment)  
4.5 Constraints (API quotas, ethics, assessment integrity)  
4.6 Use cases (narrative + tabular summary)  

**Chapter 5 System analysis**  
5.1 Feasibility study (technical, economic, operational)  
5.2 Process description (high-level user journeys)  
5.3 Data flow analysis (context diagram, Level 0 and Level 1 — describe; *\[Insert DFD figures\]* )  
5.4 Risk analysis (misuse of AI, token leakage, data privacy)  

**Chapter 6 System design**  
6.1 Architectural overview (three-tier; client, Next.js server, MongoDB, Cloudinary, external AI)  
6.2 Component diagram description (*\[Insert figure\]* )  
6.3 Module decomposition (auth, catalog, teacher, analytics, agents, media)  
6.4 Database design (collections, key fields, relationships) — *\[Insert ER diagram\]*  
6.5 API design principles (REST-style Route Handlers, error contracts)  
6.6 AI pipeline design (PDF extraction → prompt → model fallback → parse → respond)  
6.7 Security design (roles, server-side enforcement, secrets handling)  
6.8 UI/UX design considerations (responsive layout, loading states)  

**Chapter 7 Implementation**  
7.1 Technology stack and rationale  
7.2 Project structure (App Router, `app/api`, `lib`, `model`, `store`)  
7.3 Authentication and session implementation  
7.4 Subject catalogs, PDF viewing, and downloads  
7.5 Teacher upload pipeline (Cloudinary + MongoDB metadata)  
7.6 Dashboard, activities, XP, badges, leaderboard  
7.7 AI service layer (Gemini integration, caching, JSON mode)  
7.8 PDF text extraction module  
7.9 Agent pages: Quiz, Chart, Email, Speech (and optional image)  
7.10 Error handling, logging, and configuration management  
7.11 Screenshots and walkthrough (*\[Insert 12–20 screenshots with captions\]* — major page count)  

**Chapter 8 Testing**  
8.1 Testing objectives and levels (unit, integration, system, UAT)  
8.2 Test environment and tools  
8.3 Functional test cases (detailed tables)  
8.4 Non-functional testing (basic performance, security sanity checks)  
8.5 Test results summary  

**Chapter 9 Results and discussion**  
9.1 Functional outcomes vs. requirements  
9.2 Illustrative latency observations (tabular summary; *\[Insert chart optional\]* )  
9.3 Qualitative observations from demonstrations  
9.4 Discussion of strengths and weaknesses  

**Chapter 10 Deployment, documentation, and maintenance**  
10.1 Environment variables and secrets  
10.2 Build and run instructions  
10.3 Known issues and workarounds  
10.4 Maintenance recommendations  

**Chapter 11 Legal, ethical, and societal considerations**  
11.1 Academic integrity and AI-generated assessments  
11.2 Privacy and document handling  
11.3 Bias, fairness, and transparency  

**Chapter 12 Conclusion and future scope**  
12.1 Conclusion  
12.2 Future enhancements  

**References**  

**Appendix A** — Sample API endpoint catalog (tabular)  
**Appendix B** — Environment variable checklist  
**Appendix C** — User guide (short)  
**Appendix D** — Plagiarism certificate / declaration (department format)  

---

## List of figures (fill page numbers after formatting)

1. Overall system architecture  
2. Request flow for a generative action  
3. Cache-first LLM generation flow  
4. PDF-aware assistance pipeline  
5. Representative ER / schema diagram  
6. Context- or Level-0 DFD  
7. Level-1 DFD (authentication)  
8. Level-1 DFD (AI analyze)  
9. Screenshot collage — student dashboard  
10. Screenshot — Agents workspace  
*(Add all figures you insert.)*  

---

## List of tables (fill page numbers)

1. Technology stack overview  
2. Feature comparison with mainstream LMS (qualitative)  
3. Functional requirements traceability  
4. Functional test case matrix  
5. Illustrative API latency summary  
6. Optional: XP event categories  

---

## Abbreviations

| Abbrev. | Expansion |
|--------|-------------|
| API | Application Programming Interface |
| CDN | Content Delivery Network |
| CRUD | Create, Read, Update, Delete |
| HTTP(S) | Hypertext Transfer Protocol (Secure) |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| LLM | Large Language Model |
| LMS | Learning Management System |
| ODM | Object Document Mapper (Mongoose) |
| OAuth | Open Authorization |
| PDF | Portable Document Format |
| REST | Representational State Transfer |
| SDXL | Stable Diffusion XL |
| UI/UX | User Interface / User Experience |
| JWT | JSON Web Token |

---

# Chapter 1 — Introduction

## 1.1 Background and motivation

Digital education has become a default channel for distributing lecture notes, readings, recorded explanations, and supplementary multimedia. Institutions and students increasingly expect platforms that work on mobile and desktop browsers, support rich media, and provide timely feedback. At the same time, recent advances in **large language models (LLMs)** and **multimodal generation** have made it practical—through managed APIs—to offer summarization, practice question generation, drafting aids, and visualization helpers inside applications, provided engineering controls exist for **latency**, **cost**, **privacy**, and **misuse**.

Despite these advances, many student workflows remain **fragmented**: a learner opens a PDF in one tab, a video portal in another, and a generic chat assistant in a third. That fragmentation increases **cognitive switching cost**, reduces **traceability** for instructors (what prompt produced what answer?), and makes it difficult to align assistance with **course-specific objectives** and **assessment policies**. A capstone-scale “smart education” implementation can explore how to embed assistance **inside** an authenticated educational workflow, returning **structured artifacts** (for example JSON for quizzes, Mermaid text for charts) that the application can render predictably.

This project is motivated by building a **single cohesive web application** that demonstrates modern full-stack engineering while addressing realistic constraints: **role-aware access**, **cloud-backed multimedia**, **persistence of learning events**, and **server-side orchestration** of generative AI so that **secrets never ship to the browser**.

## 1.2 Problem statement

The core problem is to **integrate** (1) multilingual subject delivery through **files and videos**, (2) **instructor publishing**, (3) **learning analytics and gamification**, and (4) **generative AI assistance**—including **PDF-aware** summarization and quiz generation—within **one deployable system**, with **auditable server routes**, **consistent authentication**, and **UI-friendly outputs** suitable for dashboards and classroom demonstration.

## 1.3 Objectives of the project

**O1 — Multimodal delivery:** Provide structured access to subject materials and videos across multiple tracks (implemented examples include English, Tamil, and Social studies hubs).

**O2 — Instructor workflow:** Support authenticated teachers in uploading and registering learning assets with metadata, storing large media outside the primary database document via **CDN references**.

**O3 — Embedded generative AI:** Implement server-side routes that call **Google Gemini** for NLP tasks and optional **Stability SDXL** for images, with **fallback models**, **JSON mode** where applicable, and **bounded caching** to reduce repeated spend.

**O4 — PDF-aware assistance:** Extract text from PDFs on the server and feed extracted text into summarization and generation prompts rather than sending opaque binary payloads to LLM APIs.

**O5 — Analytics and gamification:** Persist **activities**, support **XP**, **levels**, **badges**, and surface **dashboard** and **leaderboard** experiences.

**O6 — Security engineering:** Apply **password hashing**, **JWT sessions**, optional **Google OAuth**, and **server-side role checks** for privileged operations.

## 1.4 Scope and delimitations

**In scope:** A monolithic **Next.js (App Router)** application with **MongoDB**, **Cloudinary**, representative **API modules**, and **AI agent pages** suitable for capstone demonstration and technical documentation.

**Out of scope (explicit):** Enterprise-grade **LTI** integration with institutional LMS, **proctoring**, production **multi-tenant** tenancy hardening, large-scale **A/B testing** of learning gains, and statistically definitive claims about educational effectiveness (those require controlled studies and ethics review beyond this engineering scope).

## 1.5 Novelty and contributions

The novelty is primarily **engineering integration**: demonstrating how to combine **multimodal catalogs**, **teacher publishing**, **gamified analytics**, and **Gemini-centric** generative workflows in one repository with clear boundaries (`app/api/*`, `lib/*`, `model/*`). The system foregrounds **structured outputs** (JSON quizzes, Mermaid diagrams) to keep UI rendering predictable—an important practical pattern when embedding LLMs in products.

## 1.6 Methodology (SDLC)

The team followed an **iterative incremental** process aligned with agile practices suitable for a final-year project: requirements capture from repository analysis and supervisor guidance; prototype UI flows; vertical slices (auth → catalog → one agent); integration of persistence and media; hardening of error messages; preparation of demonstration scripts and a functional checklist for evaluation.

## 1.7 Report organization

Chapter 2 surveys literature and product context. Chapter 3 compares existing systems. Chapter 4 specifies requirements. Chapter 5 analyzes processes and data flows. Chapter 6 presents design. Chapter 7 details implementation. Chapter 8 documents testing. Chapter 9 discusses results. Chapter 10 covers deployment. Chapter 11 addresses ethics. Chapter 12 concludes.

---

# Chapter 2 — Literature survey and related work

## 2.1 Online learning modalities and LMS ecosystems

Blended and online modalities are central to institutional strategies. Mainstream LMS ecosystems emphasize extensibility (plugins, LTI), mature gradebooks, and administrative tooling. Research on asynchronous vs synchronous e-learning highlights trade-offs in engagement and scheduling flexibility (Hrastinski, 2008). Capstone implementations often trade ecosystem depth for a **single cohesive codebase** that is easier to demonstrate and reason about.

## 2.2 Intelligent tutoring and feedback

Intelligent tutoring research stresses timely feedback and structured practice. The educational value of any automated assistant depends on how outputs are constrained and reviewed. This motivates **embedded** assistants invoked from authenticated flows rather than unconstrained open chat disconnected from course materials.

## 2.3 Large language models and generative AI

Foundational work on language modeling (Brown et al., 2020) and analyses of emergent capabilities (Wei et al., 2022) underpin modern API-based LLM services. For engineering, the relevant themes are **structured generation**, **tool use**, **latency**, and **evaluation**. Educational deployments must address **hallucinations**, **difficulty calibration**, and **integrity** of assessments.

## 2.4 Learning analytics and dashboards

Learning analytics commonly aggregates events into dashboards for reflection and early intervention. Siemens and Long (2011) discuss analytics visibility in educational contexts. Our project adopts a lightweight approach: **activity logs** and progression fields suitable for demonstration rather than institutional-scale learning research.

## 2.5 Gamification

Gamification (points, levels, badges) is widely used to increase engagement; efficacy depends on design (Dicheva et al., 2015). Our platform uses XP-style progression tied to categories such as quiz usage and agent interactions, with explicit discussion of fairness and “gaming the system” in demonstrations.

## 2.6 Full-stack web architectures

Modern frameworks such as **Next.js** encourage colocating UI and server endpoints (Route Handlers), simplifying deployment compared to split repositories for some capstone teams. MongoDB-style document stores fit catalog-like metadata and user profiles; CDNs fit binary delivery.

## 2.7 Security patterns

JWT (RFC 7519) is a common bearer-token format for stateless sessions; bcrypt-style hashing is a standard practice for password storage (Provos and Mazières, 1999). OAuth enables delegated sign-in. Production systems must align cookie/token strategies and centralize secret management.

## 2.8 Multimedia delivery

CDNs reduce latency and offload bytes from application servers. Cloudinary-style workflows store references in the database while serving media from the edge—mirroring common production patterns.

## 2.9 Summary of research gaps

Many tools address either **content** or **chat**, but fewer student projects demonstrate **tight integration** with **PDF extraction**, **JSON-mode quiz rendering**, **Mermaid chart artifacts**, and **gamified analytics** in one authenticated stack. This project addresses that integration gap at engineering depth.

---

# Chapter 3 — Existing systems and comparative study

## 3.1 Mainstream platforms

Canvas, Moodle, and Blackboard provide mature LMS features: gradebooks, assignments, discussion forums, and integrations. They are strong institutionally but heavy for a small-team capstone reproduction.

## 3.2 Feature comparison (qualitative)

**Typical LMS strengths:** gradebook, proctoring integrations, LTI ecosystem, institutional admin.  
**This system strengths:** single deployable app, embedded generative tools with structured outputs, gamified widgets tailored to demo data, transparent API route code for oral defense.

**Typical LMS gaps for this project goal:** not focused on demonstrating custom Gemini orchestration inside a student-built codebase.

## 3.3 Sidecar chat limitations

Generic chatbots lack course-specific guardrails, structured quiz schemas, and auditable server routes tied to user accounts and activities. They also tempt learners to paste sensitive materials into third-party UIs.

## 3.4 Summary

The comparative study motivates a **custom integrated platform** aligned with capstone evaluation: clear modules, reproducible demo scripts, and explicit discussion of limitations vs enterprise LMS.

---

# Chapter 4 — Requirements specification

## 4.1 Stakeholders

**Students** consume materials, use agents, and accumulate XP. **Teachers** publish uploads where enabled. **Admins** (role modeled) manage higher-level access depending on implementation. **Developers** maintain environment configuration and API keys.

## 4.2 Functional requirements (detailed)

FR-01 User registration with validation.  
FR-02 Login and logout; session invalidation on logout.  
FR-03 Optional Google OAuth sign-in.  
FR-04 Token verification endpoint for protected client flows.  
FR-05 Browse subject file lists by track.  
FR-06 Browse subject video lists by track.  
FR-07 Open PDF viewer for learning PDFs.  
FR-08 Download or access assets as implemented.  
FR-09 Teacher upload route restricted by role.  
FR-10 Persist metadata in MongoDB and media in Cloudinary.  
FR-11 Dashboard shows progression and recent activities.  
FR-12 Leaderboard shows ranked demo data.  
FR-13 Track learning events via activity API.  
FR-14 Summarize reading text from extracted PDF content.  
FR-15 Generate quiz JSON with title and questions.  
FR-16 Generate Mermaid chart text for instructional diagrams.  
FR-17 Draft email bodies from learner intent.  
FR-18 Speech assistance via proxy route(s).  
FR-19 Optional SDXL image generation.  
FR-20 Structured error responses for missing env vars and upstream failures.

## 4.3 Non-functional requirements

**Security:** bcrypt hashing; JWT; server-side role checks; secrets only on server.  
**Performance:** responsive UI; loaders for AI calls.  
**Usability:** mobile-friendly layout; clear navigation to hubs and agents.  
**Maintainability:** separate `lib` services and `model` schemas.  
**Reliability:** model fallbacks; JSON cleanup; cache TTL.

## 4.4 Hardware and software

**Developer workstation:** modern CPU, 8–16 GB RAM, Windows/macOS/Linux.  
**Software:** Node.js LTS compatible with Next.js version used; MongoDB instance; Cloudinary account; Google AI API access; optional Stability API key; browser Chrome/Edge for demos.

## 4.5 Constraints

API quotas and costs; network variability; assessment integrity risks; privacy considerations for uploaded PDFs.

## 4.6 Use cases (summary table — paste into Word as table)

| ID | Actor | Goal | Main flow |
|----|-------|------|------------|
| UC-01 | Student | Register | Submit form → persist user → login |
| UC-02 | Student | Study PDF | Open catalog → viewer → optional summarize |
| UC-03 | Teacher | Upload | Auth → upload → Cloudinary URL → MongoDB record |
| UC-04 | Student | Quiz practice | Agent UI → API → JSON → render |
| UC-05 | Student | Compete | Activities accumulate → leaderboard |

---

# Chapter 5 — System analysis

## 5.1 Feasibility

**Technical:** Stack is mainstream; APIs are documented.  
**Economic:** Demonstration can use free tiers/low spend with monitoring.  
**Operational:** Team can deploy to Vercel-like hosting or run locally for defense.

## 5.2 User journeys

Student journey: land → signup/login → choose subject hub → open material → optionally open Agents → receive structured output → dashboard updates. Teacher journey: login with teacher role → upload → verify listing.

## 5.3 Data flow analysis

Describe a **context diagram**: Student browser ↔ Next.js server ↔ MongoDB; Next.js ↔ Cloudinary; Next.js ↔ Gemini/Stability.

**Level 0:** “Learning platform” process exchanging data with users, DB, CDN, AI providers.

**Level 1 decompose** into: Authentication; Catalog read; Teacher write; Analytics read/write; AI analyze; Media upload.

*\[Insert DFD figures for context, Level 0, Level 1\]*

## 5.4 Risks

AI misuse; inconsistent token storage; oversized PDFs; model JSON failures; provider outages.

---

# Chapter 6 — System design

## 6.1 Architecture

Three-tier: **Presentation** (React pages, Zustand for auth UX), **Application** (Next.js Route Handlers), **Data** (MongoDB + Cloudinary + external AI). *\[Insert architecture diagram\]*

## 6.2 Modules

Authentication module; Catalog module; Teacher module; Analytics module; Agents module; Media module.

## 6.3 Database design

**User:** username/email/password hash, googleId optional, profile picture, role, XP/level/badges, stats, timestamps.  
**Activity:** type, metadata, timestamps, linkage to user.  
**Subject files/videos:** per-track models storing URLs and metadata.

*\[Insert ER diagram\]*

## 6.4 API design

REST-like JSON over HTTP; consistent error JSON; authorization checks at route entry.

## 6.5 AI pipeline

PDF URL → server fetch → extract text → build prompt → cache lookup → Gemini call with fallbacks → parse/sanitize → return payload → UI render.

## 6.6 Security design

Never expose API keys; validate JWT on server; enforce teacher role for uploads; discuss cookie vs localStorage trade-offs.

## 6.7 UI/UX

Tailwind utility styling; motion for polish; skeleton/loading states for AI latency.

---

# Chapter 7 — Implementation

## 7.1 Technology stack (narrative)

Next.js App Router hosts UI routes and `app/api/*` Route Handlers. Mongoose models define schemas. `lib/DB.js` centralizes Mongo connection reuse. `lib/ai21Service.js` implements Gemini calls with caching and fallbacks. `lib/stabilityService.js` implements SDXL calls. `lib/pdfText.js` supports PDF text extraction. Cloudinary config lives in `config/config.js`.

## 7.2 Repository structure (explain each folder)

`app/` pages and layouts; `app/api/` endpoints; `components/` or `Component/` shared UI; `model/` Mongoose schemas; `lib/` services; `store/` Zustand; `config/` cloud upload helpers.

## 7.3 Authentication implementation

Describe signup hashing, login JWT minting, verify route, logout clearing, Google OAuth route at high level.

## 7.4 Catalogs and PDF viewer

Explain list endpoints and client pages for materials/videos and PDF viewing route.

## 7.5 Teacher uploads

Multipart or URL-based flows as implemented; metadata persistence.

## 7.6 Analytics

Dashboard API aggregates; leaderboard sorting; XP increments on events.

## 7.7 AI integration

Explain JSON mode for quizzes, Mermaid string return for charts, email proxy, speech proxy, caching keys, and model list fallback behavior.

## 7.8 PDF extraction

Node-based extraction; error handling for corrupt PDFs; length limits if any.

## 7.9 Agents pages

Summarize Quiz/Chart/Email/Speech pages responsibilities.

## 7.10 Errors and configuration

Missing `MONGODB_URI`, missing AI keys, upstream 429/5xx handling, user-visible toasts.

## 7.11 Screenshots (major page count driver)

Insert **at least 12–20 captioned screenshots**, each ~1/3–1/2 page with captions: Landing, Signup, Login, Subject file hub, Subject video hub, PDF viewer, Dashboard, Leaderboard, Teacher page, Agents hub, Quiz agent, Chart agent, Email agent, Speech agent, optional image output, sample error toast, network tab (optional, redacted). This section alone can add **8–15 pages** when formatted.

---

# Chapter 8 — Testing

## 8.1 Levels

Unit-level checks where applicable; integration tests for API routes manually; system testing through scripted walkthroughs; UAT with peers acting as learners/teachers.

## 8.2 Environment

Local development server; MongoDB database; keys in `.env.local` (never commit secrets).

## 8.3 Functional test cases (expand into multi-page table in Word)

Duplicate the following into a wide table with columns: **TC ID, Preconditions, Steps, Expected, Actual, Status, Remarks**.

TC-AUTH-01 Register new user — expect success message and DB record.  
TC-AUTH-02 Login correct password — expect token/cookie behavior per route.  
TC-AUTH-03 Login wrong password — expect failure.  
TC-AUTH-04 Logout — expect session cleared client-side and server expectations documented.  
TC-AUTH-05 Google OAuth (if configured) — expect successful redirect flow.  

TC-CAT-01 List English files — non-empty or empty state handled.  
TC-CAT-02 List Tamil videos — renders list.  
TC-CAT-03 Open PDF viewer — loads viewer without crash for sample PDF.  

TC-TCH-01 Teacher upload without role — expect forbidden.  
TC-TCH-02 Teacher upload with role — expect Cloudinary URL stored.  

TC-ANA-01 Dashboard loads for user with activities — recent events visible.  
TC-ANA-02 Leaderboard ordering — plausible ordering for seeded data.  

TC-AI-01 Summarize without API key — expect controlled error.  
TC-AI-02 Summarize with key — returns text.  
TC-AI-03 Quiz JSON — parses and renders UI.  
TC-AI-04 Chart returns Mermaid text.  
TC-AI-05 Email draft returns body.  
TC-AI-06 Speech route returns guidance text (flow-dependent).  
TC-AI-07 SDXL optional — longest latency; verify completion or graceful failure.  

*(Add 15–25 more rows for edge cases: large PDF, malformed model JSON, network timeout, refresh during request, concurrent requests.)*

## 8.4 Non-functional tests

Measure rough latencies for dashboard vs summarize vs quiz vs SDXL; document methodology (manual, N trials).

## 8.5 Summary

All critical demo paths pass when keys configured; documented failures when not.

---

# Chapter 9 — Results and discussion

## 9.1 Requirements satisfaction

Map FR IDs to evidence (demo clip, screenshot, test pass).

## 9.2 Performance discussion

Catalog routes typically sub-second on good networks; LLM dominated by provider; SDXL longest.

## 9.3 Qualitative feedback

Peers reported convenience of embedded tools; instructors would want review workflows for AI quizzes.

## 9.4 Strengths and weaknesses

Strengths: integration, structured outputs, gamification. Weaknesses: assessment integrity, token strategy consistency, production logging absent.

---

# Chapter 10 — Deployment and maintenance

## 10.1 Environment variables

List `MONGODB_URI`, Cloudinary keys, JWT secret, Gemini key, Stability key, Google OAuth client values—describe purpose without pasting secrets.

## 10.2 Build/run

`npm install`, `npm run dev`, production build command; hosting notes.

## 10.3 Known issues

Document any JWT field mismatch between routes if present; JSON preamble from models; large PDF memory.

## 10.4 Maintenance

Centralize logs, add rate limits, rotate keys, monitor costs.

---

# Chapter 11 — Legal, ethical, and societal considerations

Discuss plagiarism risks with AI-generated text; consent for peer testing; responsible disclosure if vulnerabilities found; fairness in leaderboards.

---

# Chapter 12 — Conclusion and future scope

## 12.1 Conclusion

The project successfully integrates multilingual delivery, publishing, analytics/gamification, and server-orchestrated generative AI in a modern full-stack application suitable for capstone demonstration.

## 12.2 Future scope

Normalize auth; instructor review tools for AI assessments; streaming tokens; formal studies; privacy reviews; hardened deployment.

---

# References (expand to 15–25 in your final Word file)

1. S. Hrastinski, “Asynchronous and synchronous e-learning,” *Educational Quarterly*, vol. 31, no. 1, pp. 51–55, 2008.  
2. J. Wei *et al.*, “Emergent abilities of large language models,” *TMLR*, 2022.  
3. T. Brown *et al.*, “Language models are few-shot learners,” *NeurIPS*, 2020.  
4. Vercel, Next.js Documentation, https://nextjs.org/docs  
5. MongoDB Inc., Mongoose Documentation, https://mongoosejs.com/docs/guide.html  
6. Google, Gemini API Documentation, https://ai.google.dev/gemini-api/docs  
7. Stability AI, Platform API Reference, https://platform.stability.ai/docs/api-reference  
8. Cloudinary Documentation, https://cloudinary.com/documentation  
9. M. Jones, J. Bradley, N. Sakimura, RFC 7519 JWT, IETF, 2015.  
10. N. Provos, D. Mazières, “A future-adaptable password scheme,” *USENIX ATEC*, 1999.  
11. G. Siemens, P. Long, “Penetrating the fog: Analytics in learning and education,” *EDUCAUSE Review*, 2011.  
12. S. Dicheva *et al.*, “Gamification in education: A systematic mapping study,” *Educational Technology & Society*, 2015.  
13. NIST SP 800-63B Digital Identity Guidelines (authentication), 2017.  
14. Meta Open Source, React Documentation, https://react.dev  
15. D. M. West, Brookings TechTank blog on education technology inequality, 2022.  

---

# Appendix A — API endpoint catalog (expand to 2–4 pages)

Create a table: **Method, Path, Purpose, Auth, Request summary, Response summary**. Populate from your `app/api` tree (login, signup, logout, verify, english/tamil/social routes, teacher upload, dashboard, leaderboard, track-activity, ai/analyze, proxy routes for quiz/chart/email/speech, Google auth, etc.). Every row adds density toward 55 pages.

---

# Appendix B — Environment variable checklist

One page table: variable name, required/optional, purpose, example format (masked).

---

# Appendix C — Short user guide

Step-by-step for student demo and teacher demo (2–4 pages with bullets).

---

# Appendix D — Plagiarism / declaration

Paste the official SRM forms. **Critical:** ensure chapter titles in the plagiarism table **match** this report’s chapters (not leftover CNN/website titles).

---

## How to reach ~55 pages reliably

1. Paste this markdown into Word; apply **Heading 1/2/3** styles; generate **automatic TOC**.  
2. Insert **15–25 captioned figures** (architecture, DFDs, ER, screenshots). Figures are usually the fastest way to add pages without padding.  
3. Expand **Appendix A** into a full endpoint catalog from your codebase.  
4. Expand **Chapter 8** test cases to **40+ rows** with real “Actual” results from your runs.  
5. Add **1–2 pages** of literature extra citations with short paragraphs each.  

This file path: `report/Smart_Education_Report_Full_Content.md`

---

# ADDENDUM — Extra detail to expand page count (paste after Chapter 7 or as appendices)

## Detailed narrative: Why server-side AI orchestration

Browser-based direct calls to LLM providers would expose API keys and complicate CORS and metering. By routing all generative actions through Next.js Route Handlers, the system can (a) attach user identity and roles, (b) attach extracted PDF text without sending raw binary to the model provider where not needed, (c) normalize errors into JSON the UI can toast, and (d) implement caching keys based on task plus prompt prefixes. This design is central to the “smart” claim: assistance is not a bolt-on bookmark but part of the authenticated application boundary.

## Detailed narrative: PDF extraction upstream of prompting

When learners request summarization or quiz generation, the pipeline first obtains text from the PDF using server-side tooling. That separation matters for three reasons. First, prompts remain textual and auditable in logs (subject to privacy policy). Second, the LLM receives content in a form it can process reliably. Third, the engineering team can enforce maximum text length or chunking policies before spending tokens on overly large documents.

## Chapter 11 expanded — Legal, ethical, and societal considerations (full prose)

**Academic integrity.** AI-generated quizzes can help practice, but they are not a substitute for formally validated assessment banks. Instructors should review difficulty, correctness, and alignment with learning outcomes. The platform should be presented in defense as a study aid, not an autonomous grader.

**Privacy.** Uploaded PDFs and speech audio (if used) may contain personal or copyrighted material. A production deployment needs retention policies, encryption at rest depending on hosting, and clear user notices.

**Fairness and leaderboards.** Gamification can motivate some students while demotivating others. Optional participation, transparent XP rules, and avoiding sensitive personal data on public leaderboards are recommended practices to discuss in the report.

**Security ethics.** Storing JWTs in localStorage is convenient but increases XSS risk compared to HttpOnly cookies for session tokens. The report should acknowledge trade-offs honestly.

**Dependence on vendors.** Gemini and Stability availability and pricing change; the project documents graceful degradation when keys are missing.

## Appendix A — Starter API catalog (copy into Word; widen columns)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | /api/signup | Register user | No |
| POST | /api/login | Login, issue JWT / cookie | No |
| POST | /api/logout | End session | Yes |
| GET | /api/verify | Validate token, return user | Yes |
| GET | /api/auth/google | Google OAuth flow handler | Varies |
| GET | /api/english | List English subject items | Varies |
| GET | /api/englishfile | English file catalog | Varies |
| GET | /api/englishvideo | English video catalog | Varies |
| GET | /api/tamil | Tamil route | Varies |
| GET | /api/tamilfile | Tamil file catalog | Varies |
| GET | /api/social | Social route | Varies |
| GET | /api/socialfile | Social file catalog | Varies |
| POST | /api/teacher/upload | Teacher media upload | Teacher |
| GET | /api/dashboard | Dashboard data | Yes |
| GET | /api/leaderboard | Leaderboard data | Yes |
| POST | /api/track-activity | Log learning activity | Yes |
| POST | /api/ai/analyze | Central AI analysis / generation | Yes |
| POST | /api/proxy/quiz | Quiz generation proxy | Yes |
| POST | /api/proxy/chart | Chart / Mermaid proxy | Yes |
| POST | /api/proxy/chart/png | Chart PNG helper (if used) | Yes |
| POST | /api/proxy/email | Email drafting proxy | Yes |
| POST | /api/proxy/speech | Speech assistance proxy | Yes |

For each row, add in Word two more columns: **Request summary** (JSON fields or query), **Response summary** (success shape / error codes). That expansion yields multiple pages.

## Appendix C expanded — User guide (student)

1. Open the application URL in a modern browser.  
2. Create an account on the signup page; choose a strong password.  
3. Log in; confirm you reach the home or dashboard experience without errors.  
4. Navigate to **Subjects** (files or videos) for English, Tamil, or Social as available.  
5. Open a PDF material; verify viewer controls (scroll, pages).  
6. Open **Agents**; run **Summarize** on a PDF context if the UI provides that workflow; wait for completion and read output.  
7. Run **Quiz** generation; verify questions render from JSON.  
8. Run **Chart**; verify Mermaid text or rendered diagram depending on UI.  
9. Run **Email** drafting with a sample intent; edit before sending externally.  
10. Try **Speech** assistance if enabled; verify microphone permissions in browser.  
11. Open **Dashboard**; confirm recent activities appear after agent usage.  
12. Open **Leaderboard**; confirm ranking updates for demo accounts.  
13. Log out; confirm protected pages are inaccessible until login.

## Appendix C expanded — User guide (teacher)

1. Ensure account has teacher role (as seeded or assigned by admin process).  
2. Navigate to teacher upload interface.  
3. Upload a file or provide metadata per UI; submit.  
4. Verify success message and that new item appears in the relevant subject listing.  
5. Confirm Cloudinary-hosted URL opens in browser.

## Extra functional test cases (add to Chapter 8 table)

TC-SEC-01 Attempt teacher upload as student — expect 403/forbidden behavior.  
TC-SEC-02 Call verify with invalid token — expect unauthorized.  
TC-SEC-03 Call verify with expired token — expect unauthorized.  
TC-PDF-01 Summarize extremely large PDF — document behavior (truncate / slow / error).  
TC-PDF-02 Corrupt PDF upload attempt — expect controlled failure.  
TC-AI-08 Rapid double-submit on quiz — verify UI disables button / no duplicate DB spam.  
TC-AI-09 Model returns invalid JSON — verify error toast and no UI crash.  
TC-DB-01 Disconnect MongoDB — expect meaningful error on API routes.  
TC-CDN-01 Invalid Cloudinary env — expect upload failure with clear message.  
TC-OAUTH-01 Misconfigured Google client — expect OAuth error screen.  
TC-UX-01 Resize window to mobile width — layout remains usable.  
TC-UX-02 Keyboard navigation on forms — tab order acceptable.

## Suggested figures list with one-paragraph captions each (write captions in Word)

**Figure F-1 Overall architecture.** Caption should name browser, Next.js server, MongoDB, Cloudinary, Gemini, SDXL, and show HTTPS boundaries.  
**Figure F-2 Sequence: login.** Caption walks through POST /api/login, bcrypt compare, JWT mint, cookie optional.  
**Figure F-3 Sequence: summarize PDF.** Caption walks through PDF fetch, extract text, prompt build, Gemini call, response.  
**Figure F-4 ER diagram.** Caption explains User–Activity relationship and subject collections.  
**Figure F-5 Screenshot montage: subject hubs.** Caption explains multilingual organization.  
**Figure F-6 Screenshot: Agents hub.** Caption enumerates agent tiles.  
**Figures F-7–F-18** Individual agent screenshots with short captions.

## Glossary of implementation terms (1–2 pages)

Define: Route Handler, App Router, Mongoose schema, Zustand store, HttpOnly cookie, JSON Web Token claims, Mermaid, SDXL cfg/steps, subthreshold swing (if accidentally mentioned—remove if not relevant), CDN, ObjectId, metadata document, activity event types, XP formula (describe qualitatively if exact weights vary).

---

**Page-count reminder:** Pure text in this file is long but **55 pages** in Word usually requires **figures + tables + appendices**. Use the starter API table, **20+ screenshots**, **DFD/ER diagrams**, and **40+ test rows** to reach the department page target without low-quality filler.

