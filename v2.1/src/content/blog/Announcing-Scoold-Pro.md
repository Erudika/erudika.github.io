---
title: "Announcing Scoold Pro"
date: 2018-10-15
tags: ["scoold", "enterprise", "release"]
author: "alex@erudika.com"
excerpt: "excerpt-123"
img: "img12.jpg"
---

**We are happy to announce the availability of Scoold Pro!** We've added a number of useful features to it and made it easier for integration with your existing infrastructure. Scoold Pro fits well inside an enterprise environment and can also be hosted on your company's intranet. SAML authentication allows for a faster onboarding and unlimited spaces give you the freedom to assign a separate space to each one of your teams within your organization.

<!-- more -->

![](/src/images/blogpost_media10.png)

Scoold was launched more than a year ago and so far has been quite successful as Stack Overflow clone. It quickly became one of the [top open source SO clones out there](https://meta.stackexchange.com/questions/2267/stack-exchange-clones).

![](/src/images/pro_i18n.png)

People from all around the world deploying Scoold in production and it got a few hundred stars on GitHub (thanks!). Also our generous contributors have translated Scoold in more than 10 languages, including Chinese and Hindi.

## Development in the past year

In the past year we were busy adding features to the open source version and we have fixed a ton of issues and improved the documentation. Scoold is now on [Docker](https://hub.docker.com/r/erudikaltd/scoold/) and it's really easy to get it up and running quickly. The most notable features were "Spaces" and LDAP authentication support. Spaces are essentially isolated groups where people can ask/answer questions which are relevant only to that specific group. For example, we could create a space called "Dev team" and add all our software developers to it. The best part of this is that spaces are free! Most of the SO clones will charge your for this feature and in Scoold it's open source and available to everyone.

LDAP support was also in high demand so we implemented it in both [Para](https://paraio.org) and Scoold. It's now possible to connect to your existing LDAP directory and sign in users effortlessly. Active Directory is also supported. Additionally, we've implemented OAuth 2.0 authentication so that your users can login through any OAuth/OpenID Connect identity provider.

As feature requests started piling up, we decided to release a paid version and continue adding new features to it. Both the open source and paid versions will continue to be actively maintained and developed in parallel. The pricing model for Scoold Pro is quite straightforward and we don't care how many users you have. We charge a one-time fee for 1 year of updates, per server.

So, let's go over the Pro features.

## Sticky / Favorite posts

![](/src/images/pro_favs.png)


These are two small features so we combined them into one. Sticky posts are a useful little feature which allows you to highlight important questions and announcements. This feature is typically found in forum software and basically "pins" a post to the top of the page. You can also "like" any question which adds it to your favorites so that you can later go back to that question quickly.


## SAML support

![](/src/images/pro_saml.png)


This is an enterprise feature allow Scoold to talk to your corporate identity servers enabling people to login with SAML. Scoold acts as a service provider (SP) for your identity provider (IDP). There are quite a few options to configure here so you must know what you're doing.


## Anonymous posts

Anonymous posts are useful if you want to make onboarding easier. It lowers the barrier for new users and increases engagement. When enabled, new users will be able to ask and answer questions without a registration. On such anonymous posts, the author is displayed as "Anonymous". This feature is disabled by default.

## Unlimited spaces

Spaces are normally limited to 10, but in Pro this limit goes away. You can assign a space to each team or department in your organization. By default there's a public "default" space where all questions go. When you create a new space and assign users to it they will still see all the other questions when they switch to the "default" space.

## Multiple admins and identity domains

You are no longer limited to a single admin user. Administrators can also promote anyone to become an admin or a moderator. You can also specify all your company domains in the configuration and restrict new registrations to users with emails only from those whitelisted domains.

## Advanced syntax highlighting

![](/src/images/pro_syntax.png)


The syntax highlighting of code snippets has been enhanced and supports additional languages like LaTeX, Velocity, WebAssembly, JSX/TSX and PL/SQL. MathJax integration is also available by turning on its feature flag.


## Image uploads

With image uploads, people can upload screenshots and embed them in their posts. Uploaded image files can have maximum size of 2 MB. Image uploads are handled by Imgur. In the future, more upload services could be supported such as S3. To initiate a new image upload, open up the Markdown editor and drag'n'drop the image you want to upload. A link will automatically appear when the upload is finished. For this feature to work correctly you have to specify your Imgur API client ID.

## Security notifications

Scoold has had a strict Content Security Policy and reports since the very beginning. In Pro we've taken this a step further and added email notifications for admins. Administrators and moderators will receive an email when a new report comes in. They can also receive an email report each time the Content Security Policy (CSP) gets violated.

Scoold Pro is available for purchase from [scoold.com](https://scoold.com). It's *299 EUR, one-time fee* so you can buy it once and host it on one of your servers indefinitely. You're also eligible for free updates and fixes for a period of 1 year. Buying Pro would also support the development of Scoold in general. Cheers!


*Want to give Scoold a try? Go to [demo.scoold.com](https://demo.scoold.com)*
