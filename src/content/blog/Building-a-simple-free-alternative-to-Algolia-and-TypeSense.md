---
title: "Building a simple and free alternative to Algolia and TypeSense for your website"
date: 2026-02-26
tags: ["search", "frontend", "open-source", "para"]
author: "alex@erudika.com"
excerpt: "Let's build a new version of our simple search box which uses our Para backend for indexing documents. The content is first ingested and processed by Para, then we use clientside code to query the data."
img: "img10"
thumb: "blogpost_media19"
---

**Static site generators are great** because they allow us to ship quickly, deploy to a CDN, and forget about infrastructure. For blogs, documentation portals, and marketing sites, this model is hard to beat. However, once you need proper search, things get complicated. We’ve always felt that the search box on our static website could be improved and sending users off to Google was not an ideal solution.

Many teams choose Algolia. It’s powerful, mature, and has many features, but not everyone is satisfied with it. Pricing can become unpredictable as traffic increases. The setup adds complexity to your stack. In some cases, it feels like overkill for a small or medium-sized static website.

<!-- more -->

![Blog media](../../images/blogpost_media19.png)

Sometimes, we need simple solutions for static websites.

In this tutorial, I’ll show you how you can add a simple and free search widget as an alternative to Algolia and TypeSense.
The solution is modern, lightweight and offers full-text search capability without the operational and financial burden.
The content will be indexed at build time, not crawled after deployment. That difference matters.
Instead of depending on an external crawler to discover and parse your pages, we push the generated HTML directly to the search backend as part of the build process. The index always reflects exactly what was deployed.

There are JavaScript-only alternatives like TypeSense or Pagefind.js that work entirely in the browser. They are solid tools, but they usually require generating and sending a search index to the client. As your content grows, that index also grows, affecting the bundle size and initial load speed. Our approach keeps the browser lightweight by querying a backend search API, while still maintaining the static nature of the site.

This solution works with **any static website**. There is no framework lock-in and no special plugins needed. It doesn’t matter whether you’re using Astro, Hugo, Jekyll, 11ty, Hexo, Next.js, or plain HTML files. If your site produces HTML at build time, it can be indexed.

On the frontend, we’ll use TailwindCSS for styling the modal and results list, but that’s completely optional. You can adjust the markup to fit any CSS framework or none at all.

Importantly, there are no external JavaScript dependencies. There are no search SDKs or UI libraries. Just pure, modern vanilla JavaScript using `fetch()`, `AbortController`, and a bit of DOM manipulation.

## The problem with “static” search

Static sites don’t have a backend. There’s no database, no full-text index, no query engine. That’s by design.

The typical solutions look like this:

- Redirect to Google with `site:yourdomain.com`
- Pre-generate a JSON index and search it client-side
- Use a hosted search provider like Algolia

The first option feels unpolished.  
The second works for small sites but doesn’t scale well - large JSON payloads, slow initial loads, and limited ranking capabilities.  
The third is powerful, but not always free and not always simple.

So what if we want:

- Real full-text search  
- Proper indexing and ranking  
- Zero servers to manage  
- Minimal cost (free if possible)

We can build that using Para as a backend search API, while keeping the frontend 100% static.

## Architecture overview

The idea is straightforward:

1. Build your static site as usual.
2. After build, extract the generated HTML files.
3. Send them to Para for indexing.
4. Query Para directly from the browser using JavaScript.

Your site remains static. Para becomes your search engine.

## Step 1: Install the Para CLI

We’ll use the Para CLI to ingest the generated HTML files. If you don't have a Para app or the Para server running locally, go to [Para Cloud](https://paraio.com) and create a free account, then create a new app.

```bash
$ npm install -g para-cli
$ para-cli setup
```

During setup, configure your Para endpoint to be either `http://localhost:8080` for local testing or a public URL. You can point it to your own Para instance or use the hosted service at `https://paraio.com`.

## Step 2: Index your generated HTML

After your static site is built (for example into a dist/ directory), we can index the HTML files directly.

Create a simple shell script and execute the `para-cli create` command for every directory that you wish to be indexed:

```bash
#!/bin/bash
para-cli create './dist/about/*.html' --type 'blogpost' --sanitize
para-cli create './dist/projects/**/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/*.html' --type 'blogpost' --sanitize
```

What this does:

1. Reads each HTML file
2. Extracts meaningful content
3. Sanitizes markup
4. Sends it to Para
5. Stores it as objects of type `blogpost`

Now your static pages are fully indexed and searchable. You can automate this step in CI after each deployment.

## Step 3: Add the search modal UI

Next, we need a search interface. Below is a minimal modal-based search dialog with keyboard shortcuts - `/` or `Ctrl + K`.

```html
<button class="btn btn-ghost btn-sm" onclick="site_search_modal.showModal()" aria-label="Open search" title="Search '/' or Ctrl+K">
<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="11" cy="11" r="7"></circle>
  <path d="M20 20l-3.5-3.5"></path>
</svg>
</button>

<dialog id="site_search_modal" class="modal">
  <div class="top-24 absolute xs:w-full sm:w-10/12 md:w-6/12 max-w-3xl modal-box">
    <div class="mt-1">
      <div class="flex items-center gap-2 w-full input input-bordered">
        <svg class="opacity-70 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="M20 20l-3.5-3.5"></path>
        </svg>
        <input id="site-search-input" type="search" list="options" class="grow" placeholder="Search…"
          role="combobox" aria-controls="searchbox" aria-expanded="true" aria-autocomplete="list"/>
      </div>
    </div>
    <ul id="site-search-results" class="space-y-2 mt-3 text-sm"></ul>
    <div class="flex pt-4 text-xs">
      <span class="grow">
        <kbd class="kbd kbd-sm">▲</kbd> <kbd class="kbd kbd-sm">▼</kbd>
        <kbd class="kbd kbd-sm">Enter</kbd> to select, 
        <kbd class="kbd kbd-sm">Esc</kbd> to close
      </span>
      <strong class="justify-end text-right">
        Search powered by <img src="https://erudika.com/para_logo.svg" class="inline-block max-w-16" alt="Para" loading="eager">
      </strong>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
```

## Step 4: Query Para from the client side

Here is the client-side logic (note: replace `app:myapp` with an actual app ID from Para):

```js
  const appID = "app:myapp";
  const isLocal = false;
  const paraEndpoint = isLocal ? "http://localhost:8000" : "https://paraio.com";
  const searchToggle = document.getElementById("site_search_modal");
  const searchInput = document.getElementById("site-search-input");
  const resultsList = document.getElementById("site-search-results");
  const noResults = "<li>No Results</li>";
  let searchAbortController;
  let searchDebounce;
  let activeIndex = -1;

  const openSearch = () => {
    if (searchToggle) {
      searchToggle.showModal();
    }
  };

  const renderResults = (items) => {
    if (!resultsList) return;
    resultsList.innerHTML = items.length === 0 ? noResults : "";
    activeIndex = -1;
    items.forEach((item) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.url;
      link.textContent = item.name;
      link.className = "block rounded-[3px] px-3 py-3";
      li.className = "border border-base-300 hover:border-sky-700 rounded-[3px]"
      li.appendChild(link);
      resultsList.appendChild(li);
    });
  };

  const updateActiveResult = (index) => {
    if (!resultsList) return;
    const items = Array.from(resultsList.querySelectorAll("li"));
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add("border-sky-700", "bg-base-200");
      } else {
        item.classList.remove("border-sky-700", "bg-base-200");
      }
    });
  };

  const search = async (query) => {
    if (!resultsList) return;
    const trimmed = query.trim();
    if (!trimmed) {
      resultsList.innerHTML = "";
      return;
    }
    if (searchAbortController) {
      searchAbortController.abort();
    }
    searchAbortController = new AbortController();
    try {
      const response = await fetch(`${paraEndpoint}/v1/blogposts?limit=6&q=${encodeURIComponent(trimmed || "*")}`, {
        signal: searchAbortController.signal,
        headers: {
          "Authorization": 'Anonymous ' + appID
        }
      });
      if (!response.ok) return;
      const data = await response.json();
      renderResults(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      if (error.name !== "AbortError") {
        resultsList.innerHTML = "";
      }
    }
  };

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const value = event.target.value;
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        search(value);
      }, 250);
    });

    searchInput.addEventListener("keydown", (event) => {
      if (!resultsList) return;
      const items = Array.from(resultsList.querySelectorAll("a"));
      if (items.length === 0) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        updateActiveResult(activeIndex);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        updateActiveResult(activeIndex);
      } else if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        items[activeIndex].click();
      }
    });
  }

  window.addEventListener("keydown", (event) => {
    const key = event.key;
    const isShortcut = key === "/" || (key.toLowerCase() === "k" && event.ctrlKey);
    if (isShortcut) {
      event.preventDefault();
      openSearch();
      return;
    }
  });
```

## Final result

*That’s it!* You can try out the search bar by pressing `/` or `Ctrl + K` on this page.

The full code for the search widget is available [on JSFiddle](https://jsfiddle.net/b310mqoj/7/).

<script async src="//jsfiddle.net/9jfn1tcd/5/embed/result,html,js,css/dark/"></script>

*If you liked this post, you can try out Para at [ParaIO.com](https://paraio.com) or chat with me
[on Gitter](https://gitter.im/Erudika/para).*
