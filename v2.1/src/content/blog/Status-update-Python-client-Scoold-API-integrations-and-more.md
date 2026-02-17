---
title: "Status update - Python client, Scoold API, integrations and more"
date: 2020-03-22
tags: ["scoold", "para", "API", "slack", "mattermost", "python"]
author: "alex@erudika.com"
excerpt: "excerpt-123"
img: "img16.jpg"
---


Over the past year or so we've added a number of new features and integrations to Scoold and Para. In particular,
Scoold has received hundreds of bug fixes and dozens of pull requests on GitHub. The community has been quite
active with feature requests and suggestions.
We're also happy to report that profits from Scoold Pro are increasing and we're proud to have several large clients,
like Cisco, IBM and DBS Bank, who have successfully deployed it in production.

<!-- more -->

![Blog media](../../images/blogpost_media15.png)

## Python Client for Para

The big news around Para is the availability of the new Para client written in Python. This has been a feature request
for a while now and we finally shipped it in February of 2020. The Python ecosystem is evergrowing and we're happy
to support one of the most popular programming environments out there.

You can quickly install the Python client from PyPi by executing the following command:

```sh
$ pip3 install paraclient
```

Then you import the library like this:

```python
from paraclient import ParaClient

paraclient = ParaClient('ACCESS_KEY', 'SECRET_KEY');
```

Pull requests and bug reports are more than welcome on the [project's page on GitHub](https://github.com/Erudika/para-client-python).

## Scoold Pro integrated with Slack and Mattermost

First we added integration between Scoold Pro and Slack in version `1.33.0` last summer. It allows you to connect
Scoold Pro to a number of Slack teams and channels. You can directly map Slack channels to Scoold spaces.
Once you authorize the selected channels, Scoold Pro will start sending in-chat notifications for key events
like the creation of a new question or answer, or whenever somebody on your team was mentioned in a Scoold post.

Not only that, but you can ask and answer questions directly from Slack, using the `/scoold` slash command.
Asking a question on Slack is as easy as writing `/scoold ask How do I do X?`. To answer, simply type in
`/scoold answer [question URL] Here's my answer...`. You can also turn any chat message into a Scoold question
or answer by using the special message actions. If you wish to compose a longer post you can open up a special
dialog box, where you can write longer text.

Approving questions and answers without leaving the channel is another handy feature for moderators who wish to
keep an eye on new posts on Scoold. If new posts require explicit approval from moderators, Scoold Pro will notify
the chat by presenting the option to "Approve" or "Delete" the newly created post.

Then, around Xmas 2019 we released the Mattermost integration. Mattermost is the open source Slack alternative which
can be self-hosted and is used by a huge number of companies. Scoold Pro integrates with Mattermost in exactly the
the same way as with Slack and the two integrations have identical features. The only difference is that the
integration with Mattermost is part of Scoold Pro rather than Para. This means that Scoold can be installed behind
a firewall and still connect to a local instance of Mattermost even if the Para backend is hosted elsewhere on
a public cloud.

There are lots of other nice features so be sure to check out the [Scoold Pro + Slack](https://scoold.com/slack.html)
and [Scoold Pro + Mattermost](https://scoold.com/mattermost.html) web pages for more information.

## Scoold API

The long-awaited RESTful API is finally available in Scoold `1.38.0` (for both OSS and Pro). I has been in development
for a few months now and was long overdue. You can check out the [Swagger documentation](https://demo.scoold.com/apidocs)
for the full list of API resources. There are no API clients at the moment but you can easily generate one from
the [API schema](https://demo.scoold.com/api.json), using [Swagger Codegen](https://swagger.io/tools/swagger-codegen/).

This is a fully-fledged API, meaning you can execute all read and write operations in Scoold programmatically. It is
much easier to call the Scoold API and create a new question, for example, than to call the Para API and construct
the question object manually. This is because there are extra steps and logic behind each and every Scoold task, like
creating a new post or user.

When combined with webhooks, the Scoold API allows you to create complex and powerful integrations for the needs of
your organization. See the [README](https://github.com/Erudika/scoold#rest-api) to learn more.

## Backup and restore

Another important new feature has landed in Scoold `1.37.0` and that is the ability to create full copies of the Scoold
database which can later be restored. Scoold administrators can download zipped copies of the data from the
"Administration" page. Each ZIP archive contains a number of JSON files which contain the data extracted from Para for
the corrsponding Scoold application.

To restore a previously created backup, simply select a ZIP archive and click the "Import" button. You can also
import a single JSON file containing one or more Para objects. This is useful in situations where you only want
to do a partial restore of some of the objects.

## Themes

And finally, we've improved the customizabitly of Scoold with support for custom theming and 5 ready-to-use themes.
There's also a new dark mode. Take a look:

![Blog media](../../images/dark_mode.png)

Scoold administrators can create custom themes by modifying the CSS of an existing theme or by creating a custom
stylesheet from scratch.

*You can download Scoold from [Scoold.com](https://scoold.com) and sign up for a free account on [Para](https://paraio.com) -
our fully managed backend service, supporting multiple Scoold instances. Questions? Chat with us [on Gitter](https://gitter.im/Erudika/para)!*

