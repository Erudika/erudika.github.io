layout: post
title: 'Para v1.18 released, new site and jPrime'
date: 2016-03-06 23:46:35
tags: [para, release, mongodb, jprime]
author: alex@erudika.com
comments: true
img: img4.jpg
---


This past month was interesting and quite busy for us - we got valuable feedback and contributions from our clients,
fixed many bugs, released the [Android client for Para](https://github.com/Erudika/para-client-android) and a new
plugin for MongoDB. The number one request for this version was support for plugins and MongoDB. We've also updated
the documentation of our open source backend framework and redesigned the landing page on
[paraio.org](https://paraio.org). The docs should now look even better on mobile devices with high-DPI displays.

<!-- more -->

![](https://www.erudika.com/assets/img/blogpost_media3.png)

Para **v1.18** supports plugins for the three main components in our framework - `DAO`, `Search` and `Cache`. These
three interfaces are the foundation and their implementations define how objects are stored in a database, indexed by
 a search engine or cached in memory. Now you can create your own plugins that implement the `DAO`, for example,
 like we did for MongoDB. To create a plugin, you simply create a new Java project and import `para-core` using Maven.
 Then you implement one of the three interfaces above. Finally, put the compiled plugin inside a `lib` folder relative
 to the `para-x.y.z.war`. For more information about plugins,
 [refer to the documentation](https://paraio.org/docs/#008-plugins).

Our [para-dao-mongodb](https://github.com/Erudika/para-dao-mongodb) plugin is the first official plugin for Para and
it adds support for MongoDB. It was written by [Luca Venturella](https://github.com/lucav) and works with the latest
Mongo server v3.2. We plan to add more plugins like this for Cassandra, PostgreSQL and others. By writing your own
plugins you can extend and modify the core functionality of Para and make it work for your scenario and the technologies
you use. Here are some of the different possible integrations that can work great as plugins:

- **databases** (`DAO`): Cassandra, PostgreSQL, CouchDB, OrientDB
- **search systems** (`Search`): CloudSearch, Solr, Algolia
- **caches** (`Cache`): Memcached, Redis, Ehcache, Infinispan

In **v1.18** we also improved the permissions API by allowing developers to add permissions on specific objects by `id`.
The following code, for example, allows a user with id of `user1` to delete a specific `Post` object:

```java
paraClient.grantResourcePermission("user1", "posts/123", ["DELETE"]);
```

In addition to this, we added special flags to every `ParaObject` that control persistence, indexing and caching operations.
These flags are in the form of boolean properties and give you a fine-grained control over every object. You can now
create transient objects that only live in memory (`stored: false`, `indexed: false`, `cached: true`), or objects that
will never be cached (`stored: true`, `indexed: true`, `cached: false`).

The plan for the next few weeks is to add more integrations and a basic web UI, as requested by some of our fellow
developers. We'll be focusing on making Para work with [ng-admin](https://github.com/marmelab/ng-admin) and
[Restangular](https://github.com/mgonto/restangular), as well as, **iOS**.
And even though we regret the recent news of [Parse shutting down](http://blog.parse.com/announcements/moving-on/), we hope
that more web and mobile developers will find [Para](https://paraio.com) useful and a good alternative to the Parse service.

## Meet us at the jPrime conference

We'll be sponsoring [jPrime](http://jprime.io/) - a local conference with talks on Java, the JVM, mobile, web and best
practices, which will be held on **May 26-27th, 2016** in Sofia, Bulgaria. It's run by the
[Bulgarian Java User Group](https://jug.bg/en/) and backed by the biggest software companies in the city. If you're in
the area and into Java, you should definitely come to jPrime. Send us an email and we'll arrange for you some Para
stickers on the day of the conference.


*You can now chat with us [on Gitter](https://gitter.im/Erudika/para)!*

<small style="color: #aaa;">Mongo, MongoDB, and the MongoDB leaf logo are registered trademarks of MongoDB, Inc.</small>
