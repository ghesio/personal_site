// ghes.io - the site as an API reference.
// Every section is an endpoint; `short` is the TL;DR response, `full` the verbose one.

const API = [
  {
    tag: "profile",
    description: "Who I am, in machine-readable form",
    ops: [
      {
        method: "get",
        path: "/about",
        summary: "Who is this guy",
        open: true,
        short: {
          name: "Nicola Giannelli",
          role: "Senior Backend Engineer",
          location: "Siena, Italy",
          years_of_experience: 9,
          summary:
            "9 years on the same enterprise platform, from junior developer to technical owner of the backend handling conversations and the back-office.",
          spoken_languages: ["Italian", "English"],
        },
        full: {
          name: "Nicola Giannelli",
          role: "Senior Backend Engineer",
          location: "Siena, Italy",
          years_of_experience: 9,
          summary:
            "9 years on the same enterprise platform, from junior developer to technical owner of the backend handling conversations and the back-office.",
          also:
            "On-premise installations for banking customers, with strict high-availability requirements: releases there happen without the users ever noticing - that's the whole point.",
          cares_about: ["databases", "high availability", "observability", "privacy by design"],
          philosophy: "A good senior engineer deletes more code than they write.",
          favourite_language: "Java",
          spoken_languages: ["Italian", "English"],
        },
      },
      {
        method: "post",
        path: "/contact",
        summary: "Say hello",
        description: "Opens your mail client. No rate limiting, but please be kind.",
        requestBody: { to: "hi@ghes.io", subject: "Hello!", body: "string" },
        status: 202,
        statusText: "Accepted - I'll get back to you",
        short: { status: "accepted", channel: "email", github: "https://www.github.com/ghesio" },
        execute: "mailto:hi@ghes.io",
      },
    ],
  },
  {
    tag: "experience",
    description: "Where I've been and what I've done there",
    ops: [
      {
        method: "get",
        path: "/experience/quest-it",
        summary: "Software Engineer @ Quest-it (2017 - present)",
        short: {
          company: "Quest-it",
          role: "Software Engineer",
          tech_lead_since: 2023,
          period: { from: "2017-09", to: null },
          product:
            "Conversational platform, delivered as multi-tenant SaaS and as on-premise installations, for enterprise, banking and public sector customers.",
          highlights: [
            "Technical owner of the backend handling conversations and the back-office (~90% of the commits): new features and user stories are planned with me, and every change that touches it goes through my analysis, decisions, estimates and scoping.",
            "Built application tracing that, in some cases, cut incident diagnosis from 3-4 hours to about 10 minutes.",
            "Inherited and refactored the backend: up to 95% less database load on key APIs, thousands of lines removed, Flyway migrations introduced, Java 8 to 17.",
          ],
        },
        full: {
          company: "Quest-it",
          role: "Software Engineer",
          tech_lead_since: 2023,
          period: { from: "2017-09", to: null },
          product:
            "Conversational platform, delivered as multi-tenant SaaS and as on-premise installations, for enterprise, banking and public sector customers. Several backend services, including the one handling conversations and the back-office.",
          stack: ["Java", "Spring-based framework", "MySQL/MariaDB", "Solr", "Redis", "LLM providers", "in-house RAG"],
          phases: [
            {
              role: "Tech Lead, backend",
              period: { from: 2023, to: null },
              highlights: [
                "Technical owner of the backend handling conversations and the back-office (~90% of the commits): every development request that touches it goes through my functional analysis, implementation decisions, estimates and scoping, supporting the product team and project managers.",
                "Technical point of contact for enterprise customers: requirements gathering and analysis, progress reviews with customers, structured feedback to internal teams and agreed timelines met.",
                "Designed and rolled out MariaDB master-slave replication with no master downtime and no data loss.",
                "Co-designed, with two colleagues, the multi-instance architecture of the platform, with multiple nodes of the backend services and of the other components.",
                "Privacy by design for banking customers: encryption of sensitive data, automatic data deletion on expiry or on event, with an audit trail.",
                "Main technical point of reference, since 2022, for an on-premise installation for a banking customer: 15+ production releases on my own, with no chat downtime for users during standard updates; proactively found a resilience issue and coordinated the fix with the customer and the CTO - delivered a week early.",
                "Since 2023, customizations, integrations and releases for a second on-premise banking customer, integrated with a custom knowledge base built by two third-party companies: technical coordination with the customer's vendors.",
                "Pushed and carried out, with a colleague, the adoption of the Elastic Stack as the company observability platform: Elastic APM on every application with W3C distributed tracing. Introduced Uptime Kuma for fast reaction to service outages.",
                "Built application tracing that, in some cases, cut incident diagnosis from 3-4 hours to about 10 minutes, with no more local debugging.",
                "Automated staging deployment: from 15 to 5 minutes per release, with 2-4 releases a day.",
                "Introduced stateless JWT authentication, now the company standard.",
                "Planning of user stories and new features with stakeholders; for urgent requests with incomplete requirements, scope defined with stakeholders, then alternatives presented with explicit trade-offs on delivery time and maintenance cost.",
                "Onboarding and pair programming with colleagues from other teams and junior developers.",
              ],
            },
            {
              role: "Backend owner",
              period: { from: 2019, to: 2023 },
              highlights: [
                "Inherited and refactored the product backend: found the bottlenecks through the MySQL slow query log and custom logging, rewrote critical modules with caching (up to 95% less database load on some APIs), removed thousands of lines of obsolete code, introduced design patterns where they were missing.",
                "Introduced Flyway for versioned database migrations, replacing SQL scripts applied by hand before every release.",
                "Migrated the backend from Java 8 to Java 17.",
                "Built ETL flows for customer-specific modules.",
              ],
            },
            {
              role: "Software Engineer",
              period: { from: 2017, to: 2019 },
              highlights: ["Java backend services and full-text search on Solr and Elasticsearch."],
            },
          ],
        },
      },
      {
        method: "delete",
        path: "/legacy-code",
        summary: "What a senior engineer is for",
        description: "A good senior engineer deletes more code than they write.",
        short: {
          deleted: "thousands of lines of obsolete code",
          introduced: ["design patterns where they were missing", "caching on critical modules", "Flyway migrations", "Java 17 (from Java 8)"],
          database_load: "up to -95% on some APIs",
        },
      },
      {
        method: "get",
        path: "/experience/liquidweb",
        summary: "Software Developer @ Liquidweb (2016 - 2017)",
        short: {
          company: "Liquidweb",
          role: "Software Developer",
          period: { from: "2016-07", to: "2017-03" },
          summary: "Sensor data processing for assistive devices used by people with reduced mobility.",
        },
      },
      {
        method: "get",
        path: "/experience/dirty-deeds",
        summary: "Dirty deeds done dirt cheap @ everywhere (2013 - 2015)",
        deprecated: true,
        fullOnly: true,
        short: {
          period: { from: 2013, to: 2015 },
          roles: ["electrician's helper", "ADSL network technician", "freelance web developer (small static websites)"],
          summary:
            "While studying engineering I did a bit of everything. Cables, ladders, routers... and whatever else came along.",
        },
      },
    ],
  },
  {
    tag: "education",
    description: "The paperwork",
    ops: [
      {
        method: "get",
        path: "/education",
        summary: "Degrees, research and where it all started",
        short: [
          { title: "Master's Degree in Computer and Automation Engineering - Information Systems", grade: "110/110", school: "Università degli Studi di Siena", period: "2018 - 2021" },
          { title: "Research grant - ELA, Eurasian Latin Archive", school: "Università degli Studi di Siena - DIISM", period: "2018 - 2019", link: "https://ela.unisi.it" },
          { title: "Bachelor's Degree in Computer and Information Engineering", school: "Università degli Studi di Siena", period: "2011 - 2017" },
          { title: "High school diploma in Computer Science", grade: "100/100", school: "ITIS Tito Sarrocchi, Siena", period: 2011 },
        ],
        full: [
          {
            title: "Master's Degree in Computer and Automation Engineering - Information Systems",
            grade: "110/110",
            school: "Università degli Studi di Siena",
            period: "2018 - 2021",
            topics: ["machine learning", "natural language processing", "pattern recognition", "design of complex software systems", "bioinformatics"],
          },
          {
            title: "Research grant - ELA, Eurasian Latin Archive",
            school: "Università degli Studi di Siena - DIISM",
            period: "2018 - 2019",
            link: "https://ela.unisi.it",
            summary:
              "A document archive for medieval Latin texts, built on a search index and a relational database (Java EE, MySQL, Elasticsearch) for storage and semantic search.",
          },
          {
            title: "FabAcademy",
            school: "FabLab Toscana, Siena",
            period: 2017,
            summary: "2D and 3D CAD, prototyping, CNC machines, circuit board design, 3D printing.",
          },
          {
            title: "Bachelor's Degree in Computer and Information Engineering",
            school: "Università degli Studi di Siena",
            period: "2011 - 2017",
            summary: "My first steps in engineering: a long and (not so) pretty fun ride!",
          },
          {
            title: "High school diploma in Computer Science",
            grade: "100/100",
            school: "ITIS Tito Sarrocchi, Siena",
            period: 2011,
            summary: "Where it all started: I was already into computers before university.",
          },
          {
            title: "Cisco CCNA",
            school: "Siena",
            period: 2010,
            summary: "Network equipment maintenance, levels 1, 2, 3. Certification not renewed.",
          },
        ],
      },
    ],
  },
  {
    tag: "skills",
    description: "What I work with",
    ops: [
      {
        method: "get",
        path: "/skills",
        summary: "Stack and way of working",
        short: {
          top: ["Java", "Spring", "MySQL / MariaDB", "Solr", "Elasticsearch", "Flyway", "Docker", "Elastic APM", "Linux"],
        },
        full: {
          backend: ["Java", "Java EE", "Spring / Spring Boot", "REST APIs", "design patterns", "clean code", "TDD"],
          data: ["MySQL / MariaDB (replication, failover, Flyway migrations)", "Solr / Solr Cloud", "Elasticsearch", "ETL", "Redis (basic)"],
          llm_and_nlp: ["backend integration with LLM providers and RAG systems", "NLP (tokenization, POS tagging, entity extraction)"],
          reliability_and_operations: ["high availability", "performance analysis (Elastic APM, MySQL slow query log)", "Docker", "Bitbucket Pipelines", "Elastic APM", "distributed tracing", "Uptime Kuma", "Linux", "Bash"],
          security_and_privacy: ["encryption of sensitive data", "JWT", "data retention and audit", "dependency vulnerability management (Snyk, CVSS-based prioritization)", "GDPR (authorized to process personal data)"],
          way_of_working: ["Agile / Kanban", "Jira (stories, estimates, time tracking)", "Git", "conventional commits", "SonarQube (quality gates)"],
        },
      },
    ],
  },
  {
    tag: "publications",
    description: "From the research years",
    ops: [
      {
        method: "get",
        path: "/publications",
        summary: "Papers, posters and dissertations",
        short: { papers: 4, posters: 3, dissertations: 2, topics: ["NLP", "deep learning"], hint: "set verbose=true to list them" },
        full: {
          papers: [
            "N. Giannelli, M. Bianchini et al. - Segmentation of Aorta 3D CT Images Based on 2D Convolutional Neural Networks | Electronics 2021, 10, 2559",
            "E. Carbé, N. Giannelli - First steps in building the Eurasian Latin Archive | Qualitative and Quantitative Methods in Libraries, Jan. 2021, pp. 577-590",
            "E. Carbé, N. Giannelli - ELA: fasi del progetto, bilanci e prospettive | Atti del IX Convegno Annuale AIUCD, Università Cattolica del Sacro Cuore, Milano, pp. 61-66",
            "E. Carbé, N. Giannelli - A Digital Platform for the \"Latin Silk Road\": Issues and Perspectives in Building a Multilingual Corpus for Textual Analysis | DH2019",
          ],
          posters: [
            "E. Carbé, N. Giannelli - ELA: fasi del progetto, bilanci e prospettive | AIUCD, Milan, 15-17 January 2020",
            "E. Carbé, N. Giannelli - A Framework for the Eurasian Latin Archive using CLTK and NLTK | V4Py Summer Python School (V4 & DARIAH-CEH), Prague, 24-29 June 2019",
            "Stella, L. Rigutini, M. Bianchini, E. Carbé, N. Giannelli - The ELA Project | Spring School LiSeH 2019, Graz, 25 April 2019",
          ],
          dissertations: [
            "Tecniche di Deep Learning per la segmentazione di aorta - Master's, supervisor Prof. Monica Bianchini",
            "Support Vector Machine per la classificazione di dati provenienti da sensori - Bachelor's, supervisor Prof. Monica Bianchini",
          ],
        },
      },
    ],
  },
  {
    tag: "hobbies",
    description: "Runtime outside working hours",
    fullOnly: true,
    ops: [
      {
        method: "get",
        path: "/hobbies",
        summary: "What I do when I'm not at the keyboard (mostly)",
        short: [
          "trekking",
          "music addict",
          "saxophone player",
          "bookworm",
          "former taekwondoker",
          "lifting weights",
          "dockerizing stuff at home",
          "noob gamer",
          "science lover",
        ],
      },
    ],
  },
];

const MODELS = [
  { name: "Engineer", fields: [["name", "string"], ["role", "string"], ["location", "string"], ["years_of_experience", "integer"], ["spoken_languages", "array[string]"]] },
  { name: "Experience", fields: [["company", "string"], ["role", "string"], ["period", "Period"], ["highlights", "array[string]"]] },
  { name: "Period", fields: [["from", "string | integer"], ["to", "string | integer | null"]] },
];

// ---------- rendering ----------

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const highlight = (obj) =>
  esc(JSON.stringify(obj, null, 2)).replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\b\d+(?:\.\d+)?\b/g,
    (m, str, colon, bool) => {
      if (str) return colon ? `<span class="k">${str}</span>${colon}` : `<span class="s">${str}</span>`;
      if (bool) return `<span class="b">${m}</span>`;
      return `<span class="n">${m}</span>`;
    }
  );

let verbose = false;

const renderOp = (op, id) => {
  const body = verbose && op.full ? op.full : op.short;
  const status = op.status || 200;
  const statusText = op.statusText || "OK";
  const cls = op.deprecated ? "deprecated" : op.method;
  const params = op.full
    ? `<tr><td><code>verbose</code> <span class="in">query</span></td><td>boolean - currently <b>${verbose}</b></td></tr>`
    : `<tr><td colspan="2">No parameters</td></tr>`;
  return `
    <div class="opblock ${cls}" id="${id}">
      <div class="opblock-summary" role="button" tabindex="0" aria-expanded="${!!op.open}">
        <span class="method">${op.method.toUpperCase()}</span>
        <span class="path">${esc(op.path)}</span>
        <span class="summary-text">${esc(op.summary)}</span>
      </div>
      <div class="opblock-body ${op.open ? "" : "collapsed"}">
        ${op.deprecated ? `<div class="deprecated-note">Warning: deprecated - kept for historical reasons</div>` : ""}
        ${op.description ? `<div class="op-description">${esc(op.description)}</div>` : ""}
        <div class="section-title"><span>Parameters</span></div>
        <table class="params-table"><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>${params}</tbody></table>
        ${op.requestBody ? `<div class="section-title"><span>Request body</span></div>
          <div style="padding: 10px 20px 0"><div class="media-type">application/json</div><pre class="json">${highlight(op.requestBody)}</pre></div>` : ""}
        ${op.execute ? `<button class="btn execute" data-href="${op.execute}">Execute</button>` : ""}
        <div class="section-title"><span>Responses</span></div>
        <table class="responses-table">
          <thead><tr><th>Code</th><th>Description</th></tr></thead>
          <tbody><tr>
            <td class="status">${status}</td>
            <td><div>${esc(statusText)}</div><div class="media-type">application/json</div><pre class="json">${highlight(body)}</pre></td>
          </tr></tbody>
        </table>
      </div>
    </div>`;
};

const render = () => {
  const open = new Set([...document.querySelectorAll(".opblock")].filter((el) => !el.querySelector(".opblock-body").classList.contains("collapsed")).map((el) => el.id));
  const html = API.filter((t) => verbose || !t.fullOnly)
    .map((t) => {
      const ops = t.ops
        .map((op, i) => ({ op, id: `op-${t.tag}-${i}` }))
        .filter(({ op }) => verbose || !op.fullOnly)
        .map(({ op, id }) => renderOp(open.size ? { ...op, open: open.has(id) } : op, id))
        .join("");
      return `
        <section class="tag-section">
          <h2 class="tag-header" data-toggle="tag-${t.tag}"><span>${t.tag}</span><small>${esc(t.description)}</small><span class="arrow">&#9662;</span></h2>
          <div id="tag-${t.tag}">${ops}</div>
        </section>`;
    })
    .join("");
  document.getElementById("tags").innerHTML = html;
};

const renderModels = () => {
  document.getElementById("models-body").innerHTML = MODELS.map(
    (m) => `<div class="model"><div class="model-name">${m.name} {</div>${m.fields
      .map(([k, t]) => `&nbsp;&nbsp;${k}: <span class="type">${t}</span>`)
      .join("<br>")}<br>}</div>`
  ).join("");
};

// ---------- interactions ----------

document.addEventListener("click", (e) => {
  const exec = e.target.closest(".execute");
  if (exec) {
    window.location.href = exec.dataset.href;
    return;
  }
  const summary = e.target.closest(".opblock-summary");
  if (summary) {
    const body = summary.nextElementSibling;
    body.classList.toggle("collapsed");
    summary.setAttribute("aria-expanded", String(!body.classList.contains("collapsed")));
    return;
  }
  const header = e.target.closest("[data-toggle]");
  if (header) {
    document.getElementById(header.dataset.toggle).classList.toggle("collapsed");
    header.classList.toggle("collapsed-header");
  }
});

document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("opblock-summary")) {
    e.preventDefault();
    e.target.click();
  }
});

const verboseSelect = document.getElementById("verbose");
verboseSelect.addEventListener("change", () => {
  verbose = verboseSelect.value === "true";
  try {
    localStorage.setItem("ghes-full-story", verbose ? "1" : "0");
  } catch (e) {}
  render();
});

// Accept: text/html = the human-readable site
const HOME_URL = "/";
const acceptSelect = document.getElementById("accept");
acceptSelect.value = "json";
acceptSelect.addEventListener("change", () => {
  if (acceptSelect.value === "html") window.location.assign(HOME_URL);
});

const themeSelect = document.getElementById("theme");
themeSelect.value = document.documentElement.classList.contains("dark") ? "dark" : "light";
themeSelect.addEventListener("change", () => {
  const dark = themeSelect.value === "dark";
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("ghes-theme", dark ? "dark" : "light");
  } catch (e) {}
});

try {
  verbose = localStorage.getItem("ghes-full-story") === "1";
} catch (e) {}
verboseSelect.value = String(verbose);

document.getElementById("models-body").previousElementSibling.classList.add("collapsed-header");
render();
renderModels();

console.log(`
  _   _   _   _
 / \\ / \\ / \\ / \\
( J | A | V | A )
 \\_/ \\_/ \\_/ \\_/
`);
console.log(`Please no more CSS. Thx Giannelli 🍌`);
