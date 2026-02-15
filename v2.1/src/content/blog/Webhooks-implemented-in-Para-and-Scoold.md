---
title: "Webhooks implemented in Para and Scoold"
date: 2019-07-04
tags: ["scoold", "para", "webhooks", "release"]
author: "alex@erudika.com"
excerpt: "excerpt-123"
img: "img15.jpg"
---

With the release of Para `1.32.0` we've introduced support for webhooks for all apps. This feature is available now 
on [ParaIO.com](https://paraio.com) as well. This is very good news for everyone who wants to integrate Para with
external services. It makes Para even more flexible and enables you to have near real-time notifications for events
like `create`, `update` and `delete` for any object type you choose.

<!-- more -->

![](/src/images/blogpost_media13.png)

Webhooks are essentially `POST` requests made from Para to a destination URL of your choice. The destination has to
be able to process the request and return `200 OK`. This is a much more efficient way of communication and is well
summarized by the phrase **Don’t call us, we’ll call you!**.

<pre>
      Client
      +----------------------------------------------+
      +----------------------------------------------+
                     ^             |
                     |             |
         Here's some |             | OK! 10x!
         new data!   |             |
                     |             v
      +----------------------------------------------+
      +----------------------------------------------+
      Server

+-------------------------------------------------------->
                           Time
</pre>

The implementation is fully asynchronous and uses a queue for decoupling the message publishing from the actual 
processing and delivery of payloads. There's also a `LocalQueue` implementation which holds messages in memory and a 
`LocalRiver` (worker) which periodically pulls messages from the queue and forwards them to their destinations. 
The `AWSQueue` class implements webhooks processing based on [AWS SQS](https://aws.amazon.com/sqs/) queues and 
is recommended for production use. Any other queue server can be potentially supported via a plugin which implements 
the `Queue` interface.

Webhooks can be enabled in Para by adding `para.webhooks_enabled = true` in your `application.conf`. The same applies
for Scoold where they are enabled by default.

It's quite easy to subscribe to any event triggered by Para. There are 6 event types: `update`, `create`, `delete`, 
`updateAll`, `createAll`, `deleteAll`. These are triggered by their respective mutating operations on objects.
For example, a webhook might be a registered for all `update` events in Para, and also it might only be interested in 
updated `user` objects. So we can register a new webhook like so:

```
POST /v1/webhooks
{
  "urlEncoded": true,
  "update": true,
  "targetUrl": "https://destination.url",
  "secret": "secret",
  "typeFilter":"user"
}
```

If you don't want to use the API, simply open the web console and register your webhook with the simple user interface.

![](/src/images/para_webhooks1.png)

Of course, Para allows you to register multiple destination URLs so you can essentially receive identical event at two
different places. You can also register webhooks which are subscribed to all events on all types in Para:
```
POST /v1/webhooks
{
  "active": true,
  "urlEncoded": true,
  "update": true,
  "create": true,
  "delete": true,
  "updateAll": true,
  "createAll": true,
  "deleteAll": true,
  "targetUrl": "https://destination.url",
  "secret": "secret",
  "typeFilter":"*"
}
```
If the typeFilter is either blank or `*`, all selected events will be sent to the destination, regardless of the object
type.

All webhook payloads are signed by Para using `HmacSHA256` and each `Webhook` object has its own secret key. Securing webhooks
this way is essential because clients can verify the signature and check if the request is actually coming from Para rather than
a third party. It is highly recommended that you verify the signature of each payload contained in the `X-Webhook-Signature`
header. 

If a client is not responding to `POST` requests, Para will try again several times before giving up and eventually that 
destination URL will be disabled. However, you can always correct the URL and reenable the webhook. 

Each payload has a specific format which is similar to the other JSON responses of the Para REST API.
Here's an sample payload when URL-decoded:
```
{
  "appid": "myapp",
  "event": "create",
  "timestamp": 1486848081865,
  "items": [{}, ...]
}
```
The `items` field can contain one or more `ParaObject` objects which are the result of that particular event.

And the cool thing about webhooks in Para is that all clients can benefit from that immediately, without much effort.
In Scoold, for example, we've added webhooks support with a minimal amount of code. You can now listen to `create`
events on the `question` type, for example, to get notified when somebody asks a new question. 

*You can start playing with webhooks right away, by signing up for a free account on [Para](https://paraio.com) - 
our fully managed backend service for busy developers. Also, chat with us [on Gitter](https://gitter.im/Erudika/para)!*



