---
title: "'Scoold Pro now integrates with Microsoft Teams'"
date: 2021-07-23
tags: ["scoold", "ms teams", "integration"]
excerpt: "**I'm happy to announce that Scoold Pro is now integrated with Microsoft Teams!** Everyone who owns an active Scoold Pro license will get the new feature in the next release. All instances running on [Scoold Cloud](https://cloud.scoold.com) will also be updated and will benefit from the new integration."
canonical: "https://erudika.com/blog/Scoold-Pro-now-integrates-with-Microsoft-Teams"
---

**I'm happy to announce that Scoold Pro is now integrated with Microsoft Teams!** Everyone who owns an active Scoold Pro
license will get the new feature in the next release. All instances running on [Scoold Cloud](https://cloud.scoold.com) 
will also be updated and will benefit from the new integration. This was a highly-requested feature and it honestly
took more time than I anticipated but the end result is great. Teams is the third enterprise chat application which 
gets an offical Scoold integration, after Slack and Mattermost. All three support a similar feature set.

<!-- more -->

![](/src/images/blogpost_media18.png)

The Teams integration is implemented with the offical Bot Framework SDK for Java from Microsoft. Teams has a number of
integration points - tabs, personal app, message extensions, connectors and bots. Working with the platform is certainly
a level above Slack and Mattermost in terms of complexity. From a developer's perspective it is harder to navigate the
huge amount of documentation on the Microsoft Dev Center. A few simple features were hard to achieve like direct messages
from bots to users and direct chat notifications (Microsoft calls those 'proactive messages').

After a long coding session, I managed to get the integration up and running with just two of the Teams app features -
bots and message extensions. Scoold connects to your Teams channel via a bot and users can issue commands from chat - they
can compose questions and answers, search for content, people and tags on Scoold and share those with other teammates.
Notifications from Scoold to Teams are sent as proactive messages and there's even support for personal DMs when you 
somebody comments on your posts in Scoold.

You can follow the [mini getting started page](https://scoold.com/teams.html) for detailed installation instructions.
The main steps to get Scoold working with Teams are as follows:

1. Visit the Azure Poral and create an OAuth 2.0 web application client so that Scoold users can login with Microsoft
2. Visit the [Teams Developer Portal](https://dev.teams.microsoft.com/bots) and create a new Bot from the 
"Tools > Bot management" page.
3. Add the Bot ID and secret to your configuration file application.conf and restart Scoold:
4. Visit the "Administration" page in Scoold and click the "Add to Microsoft Teams" button, then link any of your 
channels to Scoold for notifications.
5. Download the zipped app package and sideload it (click Import app) in 
[Teams Developer Portal > Apps](https://dev.teams.microsoft.com/apps) or directly add it to the Teams app catalog.
6. Finally, click "Publish your app" to add it to your organization's app catalog. After approving the app in the 
[Teams Admin Center](https://admin.teams.microsoft.com/policies/manage-apps), you will then be able to install it as a 
Teams app for any of your teams.


## The Scoold Bot

A key part of the integration is the Scoold bot. Unfortunately Microsoft does not allow us to create bots programmatically 
as there's no API for that. So you'll have to create it manually. The good news is that it only takes a few clicks to 
create a new bot. Just visit the [Teams Developer Portal](https://dev.teams.microsoft.com/bots) and click "+ New Bot".

The Scoold Bot is simply an HTTP client application which talks to a trusted host (the Scoold server) and sends data to
Microsoft Teams. It is important that your bot is configured to trust the domain of your Scoold instance.
You can type `@Scoold help` to get a list of available commands. For example, you can quickly create a question by 
issuing the command `@Scoold ask How do I do X? Some more details...` and hitting Enter.

You can also update the bot icon and other bot properties at the [Bot Framework Portal](https://dev.botframework.com/bots) 
which is yet another page for managing bots (there are a total of 3 different ways to manage your bots!).

## Message extensions

Message extensions allow you to search for content on Scoold and also give you a couple of shortcuts for creating questions
and answers.

![](/src/images/teams_intro1.png)

You can easily find any question, person or tag on Scoold without leaving the Teams chat window. Embedding content from Scoold
is also supported, as well as link unfurling.

![](/src/images/teams_intro3.png)

## Easy installation

Scoold Pro will automatically generate the app package with the correct deteails filled in. Simply click "Download app package"
on the "Administration" page in Scoold.
You can easily install the Scoold app package by sideloading it directly to the Teams app catalog or you can import it into the
[Teams Developer Portal > Apps](https://dev.teams.microsoft.com/apps). There you can deploy it to your Teams organization.

That's it for now - all suggestions and tips for imporving this feature are welcome!


*Hey, I'm Alexander - an [indie solo developer](https://www.indiehackers.com/albogdano) working on 
[Scoold](https://scoold.com) and [Scoold Cloud](https://cloud.scoold.com) in the open. Questions? Ask me anything about Scoold 
[on Gitter](https://gitter.im/Erudika/scoold)!*
