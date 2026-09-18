/* =========================================================
   AI TOOLS FOR TEACHERS — MAIN JAVASCRIPT
   Vanilla JS only
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const siteHeader = $("#siteHeader");
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  /* Mobile menu */
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$(".nav-link", mainNav).forEach(link => link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded","false");
    }));
  }

  /* Sticky navbar shadow */
  const updateHeader = () => siteHeader?.classList.toggle("scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, {passive:true});

  /* Search */
  const runSearch = query => {
    const q = query.trim();
    if (!q) return;
    window.location.href = `category.html?search=${encodeURIComponent(q)}`;
  };
  const heroSearch = $("#heroSearch");
  heroSearch?.addEventListener("submit", e => { e.preventDefault(); runSearch($("#searchInput")?.value || ""); });
  $("#navSearch")?.addEventListener("click", () => {
    const q = prompt("What would you like to find?");
    if (q) runSearch(q);
  });

  /* Generic card helpers */
  const card = p => `
    <article class="post-card">
      <a class="card-image" href="${p.id}.html" aria-label="${escapeHtml(p.title)}">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" width="800" height="450">
      </a>
      <div class="card-content">
        <span class="post-badge" style="position:static;align-self:flex-start">${escapeHtml(p.category)}</span>
        <h3><a href="${p.id}.html">${escapeHtml(p.title)}</a></h3>
        <p>${escapeHtml(p.excerpt)}</p>
        <div class="post-meta"><span class="avatar">ET</span><span>Editorial Team</span><span>•</span><time datetime="${p.dateISO}">${p.date}</time><span>•</span><span>${p.readTime}</span></div>
        <a class="read-link" href="${p.id}.html">Read More →</a>
      </div>
    </article>`;

  const popular = p => `<div class="popular-item"><a href="${p.id}.html"><img src="${p.image}" alt="" loading="lazy" width="60" height="60"></a><div><a href="${p.id}.html">${escapeHtml(p.title)}</a><small>${p.date}</small></div></div>`;

  /* Homepage */
  const featured = $("#featuredPost");
  const grid = $("#postsGrid");
  const loadMore = $("#loadMore");
  if (featured && grid && typeof posts !== "undefined") {
    const p = posts[0];
    featured.innerHTML = `<article class="featured-card"><a class="featured-image-wrap" href="${p.id}.html"><span class="post-badge">${escapeHtml(p.category)}</span><img src="${p.image}" alt="${escapeHtml(p.title)}" loading="eager" width="800" height="450"></a><div class="featured-content"><span class="eyebrow">Featured article</span><h2><a href="${p.id}.html">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.excerpt)}</p><div class="post-meta"><span class="avatar">ET</span><span>Editorial Team</span><span>•</span><time datetime="${p.dateISO}">${p.date}</time><span>•</span><span>${p.readTime}</span></div><a class="read-link" href="${p.id}.html">Read More →</a></div></article>`;
    let shown = 3;
    const render = () => { grid.innerHTML = posts.slice(1, 1 + shown).map(card).join(""); if (loadMore) loadMore.hidden = shown >= posts.length - 1; };
    render();
    loadMore?.addEventListener("click", () => { shown += 2; render(); });
  }

  /* Shared sidebar / footer */
  const popularContainer = $("#popularPosts");
  if (popularContainer && typeof posts !== "undefined") popularContainer.innerHTML = posts.slice(0,5).map(popular).join("");
  const footerPosts = $("#footerPosts");
  if (footerPosts && typeof posts !== "undefined") footerPosts.innerHTML = posts.slice(0,3).map(p => `<a href="${p.id}.html">${escapeHtml(p.title)}</a>`).join("");

  /* Category page */
  const categoryPosts = $("#categoryPosts");
  if (categoryPosts && typeof posts !== "undefined") {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");
    let filtered = posts;
    if (category) filtered = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      filtered = posts.filter(p => `${p.title} ${p.category} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(q));
    }
    const title = $("#categoryTitle");
    const desc = $("#categoryDescription");
    if (title) title.textContent = search ? `Search results for “${search}”` : (category || "All Articles");
    if (desc) desc.textContent = search ? `${filtered.length} article${filtered.length===1?"":"s"} matched your search.` : `Practical ${category ? category.toLowerCase() : ""} resources for educators.`;
    categoryPosts.innerHTML = filtered.length ? filtered.map(card).join("") : `<div class="sidebar-card"><h3>No articles found</h3><p>Try another category or search phrase.</p></div>`;
  }

  /* Post page */
  const postHeader = $("#postHeader");
  if (postHeader && typeof posts !== "undefined") {
    const filename = location.pathname.split("/").pop().replace(".html", "");
    const id = filename || "gemini-api-free-tier-guide-teachers-2026";
    const p = posts.find(x => x.id === id) || posts[0];
    document.title = `${p.title} | AI Tools For Teachers`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `${location.origin}${location.pathname}`;
    postHeader.innerHTML = `<div class="post-header"><span class="post-badge">${escapeHtml(p.category)}</span><h1>${escapeHtml(p.title)}</h1><div class="post-meta"><span class="avatar">ET</span><strong>Editorial Team</strong><span>•</span><time datetime="${p.dateISO}">${p.date}</time><span>•</span><span>${p.readTime}</span><span>•</span><button class="text-link share-btn" data-share="${p.id}" style="border:0;background:none;cursor:pointer;margin:0;padding:0">Share</button></div><img class="post-featured" src="${p.image}" alt="${escapeHtml(p.title)}" width="800" height="450"><div class="image-caption">${escapeHtml(p.category)} · AI Tools For Teachers</div></div>`;
    const schema = $("#postSchema");
    if (schema) schema.textContent = JSON.stringify({"@context":"https://schema.org","@type":"BlogPosting","headline":p.title,"description":p.excerpt,"author":{"@type":"Organization","name":"AI Tools For Teachers"},"datePublished":p.dateISO,"image":p.image,"mainEntityOfPage":location.href});
    const related = $("#relatedPosts");
    if (related) related.innerHTML = posts.filter(x => x.id !== p.id).slice(0,3).map(card).join("");
    $(".share-btn")?.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(location.href); alert("Article link copied."); }
      catch { prompt("Copy this article link:", location.href); }
    });
  }

  /* Forms */
  $("#newsletterForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const message = $("#newsletterMessage");
    if (message) message.textContent = "Thanks — you're on the list. (Demo form)";
    e.currentTarget.reset();
  });
  $("#commentForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const message = $("#commentMessage");
    if (message) message.textContent = "Thanks for your comment. (Demo form)";
    e.currentTarget.reset();
  });

  /* Active navigation */
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    const base = href.split("?")[0];
    if ((path === "index.html" && base === "index.html") || (path === base && path !== "index.html")) link.classList.add("active");
  });

  /* Escape dynamic text */
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }
});