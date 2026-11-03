// ghes.io - terminal style.
// Content lives in data.js (const API). Everything printed goes through
// textContent / createElement: user input is never parsed as HTML.
(function () {
  "use strict";

  const out = document.getElementById("out");
  const form = document.getElementById("prompt-line");
  const input = document.getElementById("cmd");
  const screen = document.getElementById("screen");

  // ---------- data access ----------
  const op = (path) => {
    for (const t of API) for (const o of t.ops) if (o.path === path) return o;
    return null;
  };
  const view = (o, verbose) => (verbose && o.full ? o.full : o.short);
  const period = (p) => {
    if (p == null) return "";
    if (typeof p !== "object") return String(p);
    return String(p.from) + " - " + (p.to == null ? "present" : String(p.to));
  };

  // ---------- output helpers ----------
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function span(text, cls) { return el("span", cls || "", text); }
  function link(text, href) {
    const a = el("a", "", text);
    a.href = href;
    if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }
  function cmdLink(text, cmd) {
    const b = el("button", "cmd-link", text);
    b.type = "button";
    b.addEventListener("click", (ev) => { ev.stopPropagation(); run(cmd || text, true); });
    return b;
  }
  // print(part, part, ...) -> one line. A part is a string or a DOM node.
  function print() {
    const d = el("div", "line");
    for (const p of arguments) {
      if (p == null || p === "") continue;
      d.appendChild(p instanceof Node ? p : document.createTextNode(String(p)));
    }
    out.appendChild(d);
    return d;
  }
  const blank = () => print("");
  const h2 = (t) => print(span(t, "h2"));
  const kv = (k, v, pad) => print(span((k + ":").padEnd(pad || 14), "k"), typeof v === "string" ? v : v);
  // hanging indent, so wrapped lines stay aligned on narrow screens
  function indent(n, hang) {
    const parts = Array.prototype.slice.call(arguments, 2);
    const d = print.apply(null, parts);
    d.style.paddingLeft = (n + hang) + "ch";
    if (hang) d.style.textIndent = -hang + "ch";
    return d;
  }
  const bullet = (text, ind) => indent((ind || "  ").length, 2, "- ", text);
  const err = (t) => print(span(t, "err"));
  const scrollDown = () => { screen.scrollTop = screen.scrollHeight; };

  // ---------- theme ----------
  function setTheme(name) {
    const dark = name === "tron" || name === "dark";
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("ghes-theme", dark ? "dark" : "light"); } catch (e) {}
    return dark ? "tron" : "paper";
  }
  const currentTheme = () => (document.documentElement.classList.contains("dark") ? "tron" : "paper");

  // ---------- flags ----------
  function parse(raw) {
    const words = raw.trim().split(/\s+/).filter(Boolean);
    const flags = new Set(words.filter((w) => w.startsWith("-")));
    const args = words.filter((w) => !w.startsWith("-"));
    const verbose = flags.has("-v") || flags.has("--verbose") || flags.has("--full");
    return { name: (args.shift() || "").toLowerCase(), args, flags, verbose };
  }
  const verboseHint = () => print(span("  tip: add -v (or --verbose) for the full story", "muted"));

  // ---------- commands ----------
  const C = {};
  const man = {};

  man.help = "list available commands";
  C.help = () => {
    h2("Available commands");
    const rows = [
      ["whoami", "the TL;DR"],
      ["about [-v]", "who is this guy"],
      ["experience [name] [-v]", "where I've been (quest-it, liquidweb)"],
      ["education [-v]", "degrees and research"],
      ["skills [-v]", "stack and way of working"],
      ["publications [-v]", "from the research years"],
      ["hobbies", "runtime outside working hours"],
      ["contact", "say hello"],
      ["theme [paper|tron]", "light or dark (no argument = toggle)"],
      ["ls, ll, cat <file>", "it's a filesystem, sort of"],
      ["cd, pwd", "move around"],
      ["history, clear, man <cmd>", "the usual suspects"],
      ["reset", "start the session over"],
      ["exit", "back to something fancier"],
    ];
    for (const [c, d] of rows) {
      const first = c.split(/[ ,]/)[0];
      print("  ", cmdLink(first), c.slice(first.length).padEnd(26 - first.length), span(d, "muted"));
    }
    blank();
    print(span("Tab completes, arrow keys browse history. -v works almost everywhere.", "muted"));
  };

  man.whoami = "print the TL;DR";
  C.whoami = () => {
    const a = op("/about").short;
    print(span(a.name, "b accent"), " - ", a.role, span("  (" + a.location + ")", "muted"));
    print(a.summary);
    print(span("speaks: ", "muted"), a.spoken_languages.join(", "));
    blank();
    print(span("next: ", "muted"), cmdLink("experience"), "  ", cmdLink("skills"), "  ", cmdLink("contact"), "  ", cmdLink("about -v"));
  };

  man.about = "who is this guy. -v for the full story";
  C.about = (p) => {
    const a = view(op("/about"), p.verbose);
    for (const [k, v] of Object.entries(a)) {
      kv(k, Array.isArray(v) ? v.join(", ") : String(v), 20);
    }
    if (!p.verbose) verboseHint();
  };

  const EXP = { "quest-it": "/experience/quest-it", liquidweb: "/experience/liquidweb", "dirty-deeds": "/experience/dirty-deeds" };

  man.experience = "where I've been. experience <quest-it|liquidweb> [-v]";
  C.experience = (p) => {
    const which = p.args[0];
    if (!which) {
      h2("Experience");
      for (const name of Object.keys(EXP)) {
        const o = op(EXP[name]);
        if (o.fullOnly && !p.verbose) continue;
        print("  ", cmdLink(name, "experience " + name + (p.verbose ? " -v" : "")), " ".repeat(14 - name.length), span(o.summary, o.deprecated ? "dim-strike" : "muted"));
      }
      blank();
      print(span("usage: experience <name> [-v]", "muted"));
      return;
    }
    const path = EXP[which.toLowerCase()];
    if (!path) return err("experience: no such job: " + which + " (try: " + Object.keys(EXP).filter((n) => !op(EXP[n]).fullOnly).join(", ") + ")");
    const o = op(path);
    if (o.deprecated) print(span("warning: this endpoint is deprecated. Kept for historical reasons.", "warn"));
    const d = view(o, p.verbose);
    print(span(d.company || "everywhere", "b accent"), d.role ? " - " + d.role : "", span("  " + period(d.period), "muted"));
    if (d.tech_lead_since) print(span("tech lead since " + d.tech_lead_since, "ok"));
    if (d.product) print(d.product);
    if (d.summary) print(d.summary);
    if (d.roles) for (const r of d.roles) bullet(r);
    if (d.stack) print(span("stack: ", "muted"), d.stack.join(", "));
    if (d.highlights) { blank(); for (const h of d.highlights) bullet(h); }
    if (d.phases) {
      for (const ph of d.phases) {
        blank();
        print(span(ph.role, "h2"), span("  " + period(ph.period), "muted"));
        for (const h of ph.highlights) bullet(h);
      }
    }
    if (!p.verbose && o.full) { blank(); verboseHint(); }
  };

  man.education = "degrees, research and where it all started. -v for details";
  C.education = (p) => {
    const list = view(op("/education"), p.verbose);
    h2("Education");
    for (const e of list) {
      blank();
      print(span(e.title, "b"), e.grade ? span("  " + e.grade, "ok") : "");
      indent(2, 0, span(e.school + " - " + e.period, "muted"));
      if (e.link) indent(2, 0, link(e.link.replace(/^https?:\/\//, ""), e.link));
      if (e.summary) indent(2, 0, e.summary);
      if (e.topics) indent(2, 0, span("topics: ", "muted"), e.topics.join(", "));
    }
    if (!p.verbose) { blank(); verboseHint(); }
  };

  man.skills = "what I work with. -v for everything";
  C.skills = (p) => {
    const s = view(op("/skills"), p.verbose);
    for (const [k, v] of Object.entries(s)) {
      print(span(k.replace(/_/g, " "), "h2"));
      indent(2, 0, v.join(" · "));
    }
    if (!p.verbose) { blank(); verboseHint(); }
  };

  man.publications = "papers, posters and dissertations. -v to list them";
  C.publications = (p) => {
    const o = op("/publications");
    if (!p.verbose) {
      const s = o.short;
      print(s.papers + " papers, " + s.posters + " posters, " + s.dissertations + " dissertations on " + s.topics.join(" and ") + ".");
      print(span("  tip: ", "muted"), cmdLink("publications -v"), span(" to list them", "muted"));
      return;
    }
    for (const [k, v] of Object.entries(o.full)) {
      blank();
      h2(k);
      for (const x of v) bullet(x);
    }
  };

  man.hobbies = "runtime outside working hours";
  C.hobbies = () => {
    const o = op("/hobbies");
    print(span(o.summary, "muted"));
    for (const h of o.short) bullet(h);
  };

  man.contact = "say hello";
  C.contact = () => {
    const o = op("/contact");
    const mail = o.execute.replace(/^mailto:/, "");
    kv("email", link(mail, o.execute), 10);
    kv("github", link(o.short.github.replace(/^https?:\/\/(www\.)?/, ""), o.short.github), 10);
    print(span(o.description, "muted"));
  };

  man.theme = "theme [paper|tron]. No argument toggles";
  C.theme = (p) => {
    const want = (p.args[0] || "").toLowerCase();
    if (!want) return print("theme set to ", span(setTheme(currentTheme() === "tron" ? "paper" : "tron"), "accent"));
    if (["paper", "light"].includes(want)) return print("theme set to ", span(setTheme("paper"), "accent"));
    if (["tron", "dark"].includes(want)) return print("theme set to ", span(setTheme("tron"), "accent"));
    err("theme: unknown theme '" + want + "'. Options: paper, tron");
  };

  // ---------- a tiny fake filesystem ----------
  // file: { run: command that prints it }, dir: { kids: {...} }. meta = [perms, links, owner, group, size, date, sortKey]
  const f = (run, meta) => ({ run, meta });
  const d = (kids, meta) => ({ kids, meta });
  const HOME = d({
    "about.txt": f("about -v", ["-rw-r--r--", 1, "ghes", "ghes", "1.2K", "Nov  2 17:40", 20261102174]),
    "contact.txt": f("contact", ["-rw-r--r--", 1, "ghes", "ghes", "128", "Nov  1 20:09", 20261101200]),
    "skills.txt": f("skills -v", ["-rw-r--r--", 1, "ghes", "ghes", "2.1K", "Nov  1 22:15", 20261101221]),
    "education.txt": f("education -v", ["-rw-r--r--", 1, "ghes", "ghes", "1.6K", "Oct 31 11:02", 20261031110]),
    "hobbies.txt": f("hobbies", ["-rw-r--r--", 1, "ghes", "ghes", "256", "Oct 12 08:30", 20261012083]),
    "publications.txt": f("publications -v", ["-r--r--r--", 1, "ghes", "ghes", "2.4K", "Jan 15  2021", 20210115000]),
    "experience": d({
      "quest-it.txt": f("experience quest-it -v", ["-rw-r--r--", 1, "ghes", "ghes", "6.8K", "Nov  2 17:40", 20261102174]),
      "liquidweb.txt": f("experience liquidweb", ["-r--r--r--", 1, "ghes", "ghes", "312", "Mar 31  2017", 20170331000]),
      ".dirty-deeds.txt": f("experience dirty-deeds", ["-r--r--r--", 1, "ghes", "ghes", "404", "Sep 30  2015", 20150930000]),
    }, ["drwxr-xr-x", 2, "ghes", "ghes", "4.0K", "Nov  2 17:40", 20261102174]),
    "legacy-code": d({
      "REFACTORING.md": f("@refactoring", ["-rw-r--r--", 1, "ghes", "ghes", "1.9K", "Mar 14  2023", 20230314000]),
    }, ["drwxr-xr-x", 2, "ghes", "ghes", "4.0K", "Mar 14  2023", 20230314000]),
    ".tracking-scripts": d({}, ["dr-xr-xr-x", 2, "nobody", "nogroup", "0", "Jan  1  1970", 19700101000]),
  }, ["drwxr-xr-x", 5, "guest", "guest", "4.0K", "Nov  2 18:36", 20261102183]);
  const PARENT_META = ["drwxr-xr-x", 12, "root", "root", "4.0K", "Jan  9  2026", 20260109000];

  let cwd = []; // path segments below ~
  const showPath = (segs) => "~" + segs.map((s) => "/" + s).join("");
  const promptPath = form.querySelector(".prompt .p");

  // resolve a path to { node, segs } or { error }
  function resolve(path) {
    path = path || ".";
    let segs;
    if (path === "~" || path.startsWith("~/")) { segs = []; path = path.slice(1); }
    else if (path.startsWith("/home/guest")) { segs = []; path = path.slice("/home/guest".length); }
    else if (path.startsWith("/")) return { error: "Permission denied" };
    else segs = cwd.slice();
    for (const part of path.split("/")) {
      if (!part || part === ".") continue;
      if (part === "..") { if (!segs.length) return { error: "Permission denied" }; segs.pop(); continue; }
      segs.push(part);
    }
    let node = HOME;
    for (const s of segs) {
      if (!node.kids || !node.kids[s]) return { error: "No such file or directory" };
      node = node.kids[s];
    }
    return { node, segs };
  }

  const nameNode = (name, node, segs) => {
    if (node.kids) return span(name + "/", name.startsWith(".tracking") ? "dim-strike" : "accent b");
    const rel = segs.slice(cwd.length).join("/");
    const sameBase = segs.slice(0, cwd.length).join("/") === cwd.join("/");
    return cmdLink(name, "cat " + (sameBase ? rel : showPath(segs)));
  };

  man.ls = "list files. ls [-alth] [dir]";
  C.ls = (p) => {
    const letters = [...p.flags].filter((x) => !x.startsWith("--")).join("");
    const all = letters.includes("a") || p.flags.has("--all");
    const long = letters.includes("l");
    const target = p.args[0] || ".";
    const r = resolve(target);
    if (r.error) return err("ls: cannot access '" + target + "': " + r.error);
    if (!r.node.kids) return print(nameNode(r.segs[r.segs.length - 1], r.node, r.segs));
    let entries = Object.entries(r.node.kids).map(([n, node]) => [n, node, r.segs.concat(n)]);
    if (!all) entries = entries.filter(([n]) => !n.startsWith("."));
    if (long) {
      if (all) {
        entries.push([".", r.node, r.segs]);
        entries.push(["..", r.segs.length ? resolve(showPath(r.segs.slice(0, -1))).node : { meta: PARENT_META, kids: {} }, r.segs.slice(0, -1)]);
      }
      entries.sort((a, b) => b[1].meta[6] - a[1].meta[6]); // -t: newest first
      print("total " + (entries.length * 4));
      for (const [n, node, segs] of entries) {
        const m = node.meta;
        const label = n === "." || n === ".." ? span(n, "accent b") : nameNode(n, node, segs);
        const row = print(
          m[0] + " " + String(m[1]).padStart(2) + " " + m[2].padEnd(6) + " " + m[3].padEnd(7) + " " + m[4].padStart(4) + " " + m[5] + " ",
          label
        );
        row.style.whiteSpace = "pre";
      }
    } else {
      if (all) entries.unshift([".", r.node, r.segs], ["..", null, null]);
      if (!entries.length) return;
      const line = print();
      entries.forEach(([n, node, segs], i) => {
        if (i) line.appendChild(document.createTextNode("  "));
        line.appendChild(node && n !== "." ? nameNode(n, node, segs) : span(n, "accent b"));
      });
    }
    if (all && r.segs.length === 0) print(span(".tracking-scripts: empty. There are none on this site.", "muted"));
    if (all && r.segs.join("/") === "experience") print(span(".dirty-deeds.txt: deprecated, kept for historical reasons.", "muted"));
  };
  man.ll = "alias ll='ls -alth'";
  C.ll = (p) => C.ls(parse("ls -alth " + (p.args[0] || "")));

  man.cat = "print a file. cat <file>";
  C.cat = (p) => {
    const target = p.args[0];
    if (!target) return err("cat: missing file operand (try ls)");
    const r = resolve(target);
    if (r.error) return err("cat: " + target + ": " + r.error);
    if (r.node.kids) return err("cat: " + target + ": Is a directory");
    if (r.node.run === "@refactoring") return refactoring();
    run(r.node.run, false);
  };

  man.cd = "change directory. cd [dir]";
  C.cd = (p) => {
    const target = p.args[0] || "~";
    const r = resolve(target === "-" ? "~" : target);
    if (r.error) return err("cd: " + target + ": " + r.error);
    if (!r.node.kids) return err("cd: " + target + ": Not a directory");
    cwd = r.segs;
    promptPath.textContent = showPath(cwd);
    document.querySelector(".titlebar .title").textContent = "guest@ghes.io: " + showPath(cwd);
  };

  man.pwd = "print working directory";
  C.pwd = () => print("/home/guest" + cwd.map((s) => "/" + s).join(""));

  // legacy-code/REFACTORING.md: the "delete more than you write" story
  function refactoring() {
    const o = op("/legacy-code");
    print(span("# " + o.summary, "h2"));
    blank();
    print(o.description);
    blank();
    print(span("removed:    ", "k"), o.short.deleted);
    print(span("introduced:", "k"));
    for (const x of o.short.introduced) bullet(x, "  ");
    print(span("db load:    ", "k"), o.short.database_load);
  }

  // rm and rmdir: always "Permission denied", whatever the target
  const denied = (cmd) => (p) => {
    const targets = p.args.length ? p.args : ["."];
    for (const t of targets) err(cmd + ": cannot remove '" + t + "': Permission denied");
  };
  man.rm = "remove files. Permission denied, always";
  C.rm = denied("rm");
  man.rmdir = "remove empty directories. Permission denied, always";
  C.rmdir = denied("rmdir");
  // privilege escalation: only "sudo su" and "su - <user>", and both fail
  const notSudoer = () => err("user guest not in sudoers, incident will be reported");
  man.su = "switch user. su - <user>";
  C.su = (p, raw) => (/^su(\s+-)?(\s+\S+)?$/i.test(raw) ? notSudoer() : err("su: invalid usage. Try: su - <user>"));
  C.sudo = (p, raw) => (/^sudo\s+su(\s+-)?(\s+\S+)?$/i.test(raw) ? notSudoer() : err("sudo: command not found"));

  man.history = "show command history";
  C.history = () => hist.forEach((h, i) => print(span(String(i + 1).padStart(4) + "  ", "muted"), h));

  man.reset = "reset the session: history, directory and screen, then boot again";
  C.reset = () => {
    hist.length = 0;
    hIdx = 0;
    C.cd(parse("cd ~"));
    out.textContent = "";
    form.hidden = true;
    try { sessionStorage.removeItem("ghes-booted"); } catch (e) {}
    setTimeout(boot, 0); // after the Enter that triggered it, so it doesn't skip the boot
  };

  man.clear = "clear the screen";
  C.clear = () => { out.textContent = ""; };

  man.man = "show the manual for a command";
  C.man = (p) => {
    const c = (p.args[0] || "").toLowerCase();
    if (!c) return print("What manual page do you want? For example, try 'man experience'.");
    if (!man[c]) return err("No manual entry for " + c);
    print(span(c, "b accent"), " - ", man[c]);
  };

  man.echo = "print text";
  C.echo = (p, raw) => print(raw.trim().replace(/^echo\s?/i, ""));
  man.date = "print the date";
  C.date = () => print(new Date().toString());
  man.uname = "print system information";
  C.uname = () => print("ghesOS 9.0.0 (Java 17, no trackers) siena-node-1");
  // exit / logout: back to the "fancy" version of the site
  const HOME_URL = "/";
  C.exit = () => {
    print("logout");
    print(span("Connection to ghes.io closed. Taking you back to something fancier...", "muted"));
    print(span("(not redirected? ", "muted"), link("go back", HOME_URL), span(")", "muted"));
    form.hidden = true;
    setTimeout(() => window.location.assign(HOME_URL), 900);
  };
  man.exit = "go back to the fancy version of the site";
  C.logout = C.exit;
  C.vim = () => print(span("You'll never get out. Stick with ", "muted"), cmdLink("cat"), span(".", "muted"));
  C.emacs = C.vim;
  C.nano = C.vim;

  const VISIBLE = ["help", "whoami", "about", "experience", "education", "skills", "publications", "hobbies", "contact", "theme", "ls", "ll", "cd", "pwd", "cat", "history", "clear", "reset", "man", "exit"];

  // ---------- run ----------
  const hist = [];
  let hIdx = 0;

  function echoPrompt(raw) {
    const line = print();
    line.className = "line prompt-line";
    const lab = form.querySelector(".prompt").cloneNode(true);
    lab.removeAttribute("for");
    line.appendChild(lab);
    line.appendChild(span(raw));
  }

  function run(raw, echo) {
    raw = String(raw);
    if (echo !== false) echoPrompt(raw);
    const trimmed = raw.trim();
    if (!trimmed) return scrollDown();
    if (echo !== false) { hist.push(trimmed); hIdx = hist.length; }
    const p = parse(trimmed);
    const fn = Object.prototype.hasOwnProperty.call(C, p.name) ? C[p.name] : null;
    if (fn) fn(p, trimmed);
    else err(p.name + ": command not found. Type 'help' for the list.");
    if (echo !== false && p.name !== "clear" && p.name !== "reset") blank();
    scrollDown();
  }

  // ---------- completion ----------
  // candidates for a partial path: "exp" -> "experience/", "experience/q" -> "experience/quest-it.txt"
  function pathPool(prefix, dirsOnly) {
    const cut = prefix.lastIndexOf("/");
    const base = cut >= 0 ? prefix.slice(0, cut + 1) : "";
    const r = resolve(base || ".");
    if (r.error || !r.node.kids) return [];
    const showHidden = prefix.slice(cut + 1).startsWith(".");
    return Object.entries(r.node.kids)
      .filter(([n, node]) => (showHidden || !n.startsWith(".")) && (!dirsOnly || node.kids))
      .map(([n, node]) => base + n + (node.kids ? "/" : ""));
  }

  function complete() {
    const v = input.value;
    const parts = v.split(/\s+/);
    let pool, prefix;
    if (parts.length <= 1) {
      pool = VISIBLE; prefix = parts[0] || "";
    } else {
      const c = parts[0].toLowerCase();
      prefix = parts[parts.length - 1];
      pool = c === "experience" ? Object.keys(EXP).filter((n) => !op(EXP[n]).fullOnly)
        : ["cat", "cd", "ls", "ll", "rm", "rmdir"].includes(c) ? pathPool(prefix, c === "cd")
        : c === "man" ? Object.keys(man)
        : c === "theme" ? ["paper", "tron"]
        : ["-v"];
    }
    const low = prefix.toLowerCase();
    const hits = pool.filter((x) => x.toLowerCase().startsWith(low)); // case-insensitive: REFACTORING.md
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      input.value = parts.join(" ") + (hits[0].endsWith("/") ? "" : " ");
    } else if (hits.length > 1) {
      echoPrompt(v);
      // list just the names, like bash does ("quest-it.txt", not "experience/quest-it.txt")
      print(span(hits.map((h) => h.replace(/^.*\/(?=.)/, "")).join("  "), "muted"));
      // complete the common prefix
      let common = hits[0];
      for (const h of hits) while (!h.toLowerCase().startsWith(common.toLowerCase())) common = common.slice(0, -1);
      if (common.length < prefix.length) common = prefix;
      parts[parts.length - 1] = common;
      input.value = parts.join(" ");
      scrollDown();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    run(v, true);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Tab") { e.preventDefault(); complete(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (hIdx > 0) input.value = hist[--hIdx]; }
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx < hist.length - 1) input.value = hist[++hIdx];
      else { hIdx = hist.length; input.value = ""; }
    } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); C.clear(); }
  });

  // click on the screen focuses the prompt, unless the visitor is selecting text
  screen.addEventListener("click", () => {
    const sel = window.getSelection();
    if ((!sel || sel.isCollapsed) && !form.hidden) input.focus({ preventScroll: true });
  });
  for (const b of document.querySelectorAll(".quick button")) {
    b.addEventListener("click", () => { if (!form.hidden) run(b.dataset.cmd, true); });
  }

  // ---------- boot ----------
  const BANNER = [
    "       _                     _       ",
    "  __ _| |__   ___  ___      (_) ___  ",
    " / _` | '_ \\ / _ \\/ __|     | |/ _ \\ ",
    "| (_| | | | |  __/\\__ \\  _  | | (_) |",
    " \\__, |_| |_|\\___||___/ (_) |_|\\___/ ",
    " |___/                               ",
  ];
  const BOOT = [
    ["Loading Java 17 runtime", "ok"],
    ["Flyway: schema up to date", "ok"],
    ["Replica in sync, lag 0s", "ok"],
    ["Elastic APM agent attached", "ok"],
    ["Scanning for tracking scripts... none found", "ok"],
    ["Legacy code: deprecated, scheduled for deletion", "warn"],
  ];

  function ready() {
    out.appendChild(el("pre", "ascii", BANNER.join("\n"))).setAttribute("aria-hidden", "true");
    print("Welcome to ", span("ghes.io", "accent b"), " - the personal terminal of Nicola Giannelli, senior backend engineer.");
    print("New here? Try ", cmdLink("whoami"), ", ", cmdLink("help"), " or ", cmdLink("ls"), ".");
    print(span("Go back to something fancier? Type ", "muted"), cmdLink("exit"), span(".", "muted"));
    blank();
    form.hidden = false;
    if (!window.matchMedia("(pointer: coarse)").matches) input.focus({ preventScroll: true });
    scrollDown();
  }

  function boot() {
    let seen = false;
    try { seen = sessionStorage.getItem("ghes-booted") === "1"; sessionStorage.setItem("ghes-booted", "1"); } catch (e) {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) return ready();

    let i = 0, timer = null, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      document.removeEventListener("keydown", finish);
      screen.removeEventListener("click", finish);
      ready();
    };
    const step = () => {
      if (i === 0) print(span("(press any key to skip)", "muted"));
      if (i < BOOT.length) {
        const [msg, kind] = BOOT[i++];
        print("[ ", span(kind === "ok" ? " OK " : "WARN", kind), " ] ", msg);
        timer = setTimeout(step, 180);
      } else {
        timer = setTimeout(finish, 450);
      }
    };
    document.addEventListener("keydown", finish);
    screen.addEventListener("click", finish);
    step();
  }

  boot();
})();
