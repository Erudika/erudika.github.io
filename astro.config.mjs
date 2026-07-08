import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/data/site-data.json"
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  integrations: [sitemap({
    filter: (page) => {
      if (page.includes('/503/')) return false;
      return true;
    },
    serialize(item) {
      if (item.url === 'https://erudika.com/') {
        item.priority = 1.0; item.changefreq = 'weekly'; return item;
      }
      if (/\/projects\/[^/]+\/$/.test(item.url)) {
        item.priority = 0.9; item.changefreq = 'monthly'; return item;
      }
      if (/\/blog\/[^/]+\/$/.test(item.url) && !item.url.includes('/tags/') && !item.url.includes('/page/')) {
        item.priority = 0.8; item.changefreq = 'yearly'; return item;
      }
      if (item.url === 'https://erudika.com/blog/') {
        item.priority = 0.8; item.changefreq = 'weekly'; return item;
      }
      if (/\/blog\/page\//.test(item.url)) {
        item.priority = 0.4; item.changefreq = 'weekly'; return item;
      }
      if (item.url === 'https://erudika.com/blog/tags/') {
        item.priority = 0.5; item.changefreq = 'monthly'; return item;
      }
      if (/\/blog\/tags\/[^/]+\/$/.test(item.url)) {
        item.priority = 0.3; item.changefreq = 'monthly'; return item;
      }
      if (['/privacy/', '/imprint/', '/gdpr-dpa/'].some(p => item.url.includes(p))) {
        item.priority = 0.2; item.changefreq = 'yearly'; return item;
      }
      item.priority = 0.6; item.changefreq = 'monthly'; return item;
    }
  })],
  trailingSlash: 'always', // if hosted on GitHub: always !
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  site: site.organization.url,
  vite: {
    plugins: [tailwindcss()]
  },
  redirects: {
    "/blog/2015/10/16/hello-world/": "/blog/hello-world/",
    "/blog/2015/10/21/backend-frameworks-usergrid-loopback-para-baasbox-deployd-telepat/": "/blog/backend-frameworks-usergrid-loopback-para-baasbox-deployd-telepat/",
    "/blog/2016/01/05/para-1-17-released/": "/blog/para-1-17-released/",
    "/blog/2016/03/06/Para-v1-18-released-new-site-and-jPrime/": "/blog/para-v1-18-released-new-site-and-jprime/",
    "/blog/2016/03/25/Para-Web-Console-the-admin-UI-for-your-backend/": "/blog/para-web-console-the-admin-ui-for-your-backend/",
    "/blog/2016/06/01/jPrime-roundup-Para-client-iOS-Swift/": "/blog/jprime-roundup-para-client-ios-swift/",
    "/blog/2016/06/09/Building-the-stack-from-scratch-with-Angular-2/": "/blog/building-the-stack-from-scratch-with-angular-2/",
    "/blog/2016/08/12/An-open-source-backend-for-the-Internet-of-Things/": "/blog/an-open-source-backend-for-the-internet-of-things/",
    "/blog/2016/11/21/Saving-money-on-DynamoDB-with-Global-Secondary-Indexes/": "/blog/saving-money-on-dynamodb-with-global-secondary-indexes/",
    "/blog/2016/12/12/Implementing-full-text-search-for-your-static-site/": "/blog/implementing-full-text-search-for-your-static-site/",
    "/blog/2017/04/27/Introducing-Scoold-an-open-source-Q-and-A-platform/": "/blog/introducing-scoold-an-open-source-q-and-a-platform/",
    "/blog/2018/10/15/Announcing-Scoold-Pro/": "/blog/announcing-scoold-pro/",
    "/blog/2018/12/30/Top-5-open-source-Q-A-platforms/": "/blog/top-5-open-source-q-a-platforms/",
    "/blog/2019/01/28/Status-update-containers-Java-11-and-more/": "/blog/status-update-containers-java-11-and-more/",
    "/blog/2019/07/04/Webhooks-implemented-in-Para-and-Scoold/": "/blog/webhooks-implemented-in-para-and-scoold/",
    "/blog/2019/08/14/Building-a-full-stack-application-from-scratch-with-React/": "/blog/building-a-full-stack-application-from-scratch-with-react/",
    "/blog/2020/03/22/Status-update-Python-client-Scoold-API-integrations-and-more/": "/blog/status-update-python-client-scoold-api-integrations-and-more/",
    "/blog/2020/09/22/Announcing-Scoold-Cloud/": "/blog/announcing-scoold-cloud/",
    "/blog/2021/02/01/Status-update-Para-goes-global-pricing-changes/": "/blog/status-update-para-goes-global-pricing-changes/",
    "/blog/2021/07/23/Scoold-Pro-now-integrates-with-Microsoft-Teams/": "/blog/scoold-pro-now-integrates-with-microsoft-teams/"
  }
});