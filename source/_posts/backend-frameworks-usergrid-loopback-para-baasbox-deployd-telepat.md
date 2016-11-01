layout: post
title: Modern backend (BaaS) frameworks - an overview of Usergrid, LoopBack, Para, BaasBox, Deployd and Telepat
date: 2015-10-21 14:17:19
tags: [backend, baas, frameworks, para, API]
author: alex@erudika.com
comments: true
img: img2.jpg
---

Let's have a look at some modern open source backend frameworks that are available today. These frameworks act as your
server-side component of your website or app. Developers use them to build and iterate on products faster than ever
before by focusing on the "fun" part - the frontend (client-side).

<!-- more -->

The communication between your front-end code and the backend is usually done through HTTP(S) and the data is usually
in the form of JSON objects that are sent back and forth. The details about the whole process should be well documented
and part of the REST API documentation.

So why use a backend framework instead of writing my own? The main good reason is that these frameworks are packaged
as reusable components and are tried and tested by many developers. So instead of maintaining another piece of code -
the one you wrote yourself - you can use a package that's already out there and maintained for you.

Some BaaS frameworks are designed with focus on mobile app development (mBaaS) and some are more generic for building
anything from websites to desktop software or games. The ones that target mobile apps usually have features like
realtime push, notifications support and client libraries for Android and iOS. We'll cover both types of frameworks here.

## [UserGrid](http://usergrid.apache.org) [<i class="fa fa-github-square"></i>](https://github.com/apache/usergrid)
<img src="/assets/img/usergrid.png">

**Multitenant:** yes <br>
**Language:** Java <br>
**Database:** Cassandra <br>
**Documentation:** 9/10 <br>
**Client libraries:** Android, iOS, JavaScript, Ruby, Java, .NET, PHP

Usergrid is an Apache backend-as-a-service project built with Java. It's been around since 2011 and is actively
developed and maintained. The new version 2.0 is yet to be released and will require both Cassandra and Elasticsearch
in addition to a queue system like AWS SQS.

The project is very well documented but getting started involves quite a few steps. First you need to install Cassandra
and a servlet container like Tomcat. Then you deploy the WAR file to Tomcat and call a special URL to create a superuser
account which gives you access to the web-based console.

The API allows you to create and run multiple apps, which is a good thing because you might want to have a couple of
apps sharing the same backend and this also makes deployment easier. You also get all the basic CRUD functionality for
working with collections and entities (JSON objects). There are several built-in entity types like `user`, `group` and
`application`, for example. They all have `type` and `uuid` properties and the latter is an actual UUID string. Basic
entity relationships are also supported. Usergrid has good support for user and file management and has a simple
data model.

Authentication is implemented through OAuth 2.0 and it makes a distinction between user and app roles. Social login
is supported but it appears that only Facebook login works out-of-the-box. Other extra features include geolocation
queries and push notifications (in v2.0).

Usergrid is an excellent choice if you are building a mobile application or an enterprise-grade backend service in
your organization. It is used in production by quite a few companies.

## [LoopBack](http://loopback.io) [<i class="fa fa-github-square"></i>](https://github.com/strongloop/loopback)
<img src="/assets/img/loopback.png">

**Multitenant:** no <br>
**Language:** JavaScript <br>
**Database:** agnostic <br>
**Documentation:** 9/10 <br>
**Client libraries:** Android/Java, iOS, JavaScript <br>

LoopBack is a Node.js API framework by StrongLoop, part of IBM. It's been around since 2013 and is actively developed
and has great commercial support. It is focused on REST API development and provides a visual editor for editing and
deploying apps. Mobile app developers will love the Android and iOS SDKs and the push system.

The developer docs are extensive and clear but sometimes slow to navigate. Getting started is easy and there's a
Yeaoman-based scaffolding tool for generating new project skeletons. Developers have a great choice of database
connectors for all major SQL databases and MongoDB. For development you can also use an in-memory db.

The flexibility of JavaScript is great for quickly developing apps with less boilerplate code. LoopBack helps
with that further by providing a handy model generator for building your classes quickly. These can be validated
with the built-in validation methods. Entity relationships are very well supported. The security model is complex
with user roles, principals and ACLs.

Basic user authentication is part of the core and third-party login support can be implemented using Passport
modules. There's also a module for OAuth. Geolocation, push and file services are built-in. For anything else
there's `npm` and tons of modules on GitHub.

LoopBack is great for REST API service generation and very rapid prototyping. Developers can get up and running in
minutes by building a custom API using the given CLI tool. LoopBack is a very good fit for all projects written in
JavaScript.


## [Para](https://paraio.org) [<i class="fa fa-github-square"></i>](https://github.com/Erudika/para)
<img src="/assets/img/paraio.png" style="border: 1px solid #CCCCCC">

**Multitenant:** yes <br>
**Language:** Java <br>
**Database:** agnostic <br>
**Documentation:** 9/10 <br>
**Client libraries:** Java, JavaScript, .NET, PHP, Android, iOS <br>

Para is our own little backend framework. It is powered by Java and was released in early 2014. Out of the box, Para
integrates with Elasticsearch and DynamoDB and Hazelcast but developers are not limited to using these defaults.
The design is flexible enough so that anyone can implement the interfaces for search, persistence and caching functionality.
We have plans to include connectors for [MongoDB](https://github.com/Erudika/para-dao-mongodb) (done!) and Cassandra soon.

Para is focused on simplicity and flexibility and it can host multiple apps on a single server. Although you can use
it to power your mobile backend, we wanted to make the framework simpler by providing the core functionality and thus
we created a general-purpose BaaS. Some of our clients are using it as an API server for their Angular frontend, while
others use it as an alternative to Parse for their mobile development.

The [documentation](https://paraio.org/docs) is great, contained in a single webpage for easy navigation and API methods
are described clearly. Getting started is pretty easy - download the executable WAR package and run it:
```bash
$ java -jar para-x.y.z.war
$ curl localhost:8080/v1/_setup
```
This will give you the keys needed for making authenticated requests to the server using any of our API clients.
If you wish to integrate Para with your own code, there's a package on Maven central - just search for `para-server`.
The WAR file can also be deployed to inside a servlet container like Tomcat.

The core API consists of three main interfaces for searching, storing and caching object. Implement those and you
have your own custom server. The data model is simple and all classes implement the `ParaObject` interface. This gives
them some basic properties like `id`, `type` and `name`. Entities can link to other entities by forming one-to-one,
one-to-many and many-to-many relationships. Basic constraint checkers, such as `required`, `min`, `max`, `regexp`,
can be used to validate object properties. Full-text search is enabled by default for all objects.

Authentication between clients and the server is not based on OAuth, [intentionally](http://hueniverse.com/2012/07/26/oauth-2-0-and-the-road-to-hell/).
Instead we implement the simple and robust AWS Signature 4 algorithm for signed requests. User management, fine-grained
permissions and support for JSON Web Tokens are available since version 1.17. Para also has built-in support for third-party
authentication with Facebook, Twitter, Google+, GitHub and LinkedIn.

Para is a good choice if you are building a cloud-based web service and it's great for rapid prototyping.
It's an easy-to-use and flexible platform that scales well. A backend for busy developers.

## [BaasBox](http://www.baasbox.com) [<i class="fa fa-github-square"></i>](https://github.com/baasbox/baasbox)
<img src="/assets/img/baasbox.png">

**Multitenant:** yes, [since v0.8.4](http://www.baasbox.com/the-importance-of-managing-multiple-apps-with-one-backend) <br>
**Language:** Java <br>
**Database:** OrientDB <br>
**Documentation:** 9/10 <br>
**Client libraries:** Android/Java, iOS, JavaScript <br>

BaasBox is another mBaaS with a nice web-based admin console. It supports everything a mobile developer would
need to run a backend server. It's been around since early 2013. It provides good support for Android and iOS
clients and JavaScript.

The docs are very nice and detailed, very easy to navigate. Getting started is very easy - unzip the file and run
the Bash/bat script and you open up the console on `localhost:9000/console`.  The server is running on top of OrientDB
which is sort of a hybrid database and has a lot of cool features.

BaasBox is easy to learn and has a nice REST API that speaks JSON. It's got full support for CRUD operations on objects
and collections of objects and also allows you to link them in one-to-many or many-to-many relationships. Social
features are excellent - you have social login, friendship/followers API and user management. Other features include
files and assets API, push notifications and a plugin system.

BaasBox is a good choice as a mBaaS for building mobile backend services. If you are a mobile app developer
definitely consider BaasBox for your backend.

## [Deployd](http://deployd.com) [<i class="fa fa-github-square"></i>](https://github.com/deployd/deployd)
<img src="/assets/img/deployd.png" style="border: 1px solid #CCCCCC">

**Multitenant:** no <br>
**Language:** JavaScript <br>
**Database:** MongoDB <br>
**Documentation:** 7/10 <br>
**Client libraries:** none <br>

Deployd is an API building platform for Node.js and runs on top of MongoDB. It's been around since 2012. The cool
thing about it is its web dashboard and the CLI tool called `dpd`. The framework, it seems, was designed to be used
as part of your project only, i.e. not as a standalone external API server, and has no client libraries available
(tell me if I'm wrong!).

The project is well documented and has plenty of examples and code. They have dedicated installers for Windows and Mac
that will help you get started. To create a new project you run `$ dpd create my-app` and then start the server
with `dpd -d`. That's it.

Deployd plays well with other JavaScript frameworks like AngularJS and Backbone.js. It has great support for
collections (plain old JS objects) and events. Events can be emitted and processed easily. User management is
built-in. Other functionality like social login support is provided by third-party modules.

Deployd is good for those who like a nice web admin UI and build JavaScript apps with Node.js. If you like
MongoDB and Node.js, you'll love Deployd!

## [Telepat](http://telepat.io) [<i class="fa fa-github-square"></i>](https://github.com/telepat-io/telepat-api)
<img src="/assets/img/telepat.png">

**Multitenant:** yes <br>
**Language:** JavaScript <br>
**Database:** agnostic <br>
**Documentation:**  6/10 <br>
**Client libraries:** Android, iOS, JavaScript <br>

Telepat is the youngest framework of the bunch. It's a realtime data sync solution for mobile and other applications.
It's fairly new -  first released in 2015. The framework is focused on realtime push and flexibility. It's database
agnostic but seems to be designed to work with NoSQL databases like Couchbase. Search is
implemented on top of Elasticsearch.

The documentation is a work in progress but looks great. The early stage of the project means that we should
expect some changes to the API. Getting started requires you to launch Elasticsearch, Redis and Kafka servers
first but they provide a nice Docker package that will help you with that.

The API is simple with CRUD methods for users and applications. User management is supported and authentication is
implemented with passwords and tokens.

Telepat is really new but shows a lot of potential. Lots of new features are planned and others are almost finished
like push notifications. It's well worth checking out especially if you're building realtime apps.

## Summary

We've shown how developers can leverage open source backend frameworks to accelerate time-to-market and enhance
their products' security and scalability. While some frameworks cater to mobile developers and make very specific
choices in terms of technology stack, other try to have broader use cases and be database-agnostic.

In order to decide which BaaS package is best for your project, start by defining its scope and platform - is it
going to be a mobile app or a website, for example. Then choose the framework that has the best documentation and
client library for your specific platform and language - C#, Java, Javascript, etc. Finally get the code and run it
locally on your development machine and give it a try.

Happy coding!

