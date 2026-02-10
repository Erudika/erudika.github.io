---
title: "Para Cloud: zero-downtime upgrades on Bun"
date: 2026-01-12
tags: ["Cloud", "Release"]
excerpt: "How we cut cold start latencies while keeping clusters evergreen."
canonical: "https://erudika.com/blog/para-cloud-upgrades"
og:image: "/old-website-assets/img/para_cloud.png"
---

Para Cloud now rolls out upgrades with zero downtime across EU and US regions. We tuned the upgrade pipeline to keep
containers warm and to avoid thundering herds during traffic spikes.

## What changed

- Canary deploys that automatically roll forward once cluster health stays green
- Bun-powered build steps to reduce artifact creation time
- Continuous verification checks before any shard is upgraded

## Why it matters

Upgrades stay invisible to end-users while your team ships improvements faster. If you run Para on your own
infrastructure, the same playbook is available to you.
