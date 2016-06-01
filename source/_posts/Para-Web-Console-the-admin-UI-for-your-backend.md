layout: post
title: Para Web Console - the admin UI for your backend
date: 2016-03-25 01:02:02
tags: [para, ng-admin, angular, frontend]
author: alex@erudika.com
comments: true
img: img5.jpg
---


Yesterday we released a simple web management console for Para. It's open source, client-side only and lets you connect
to any of your Para servers and manage your objects easily through the web interface. It's powered by AngularJS and
uses the great libraries [ng-admin](https://github.com/marmelab/ng-admin) and [Restangular](https://github.com/mgonto/restangular).
The console works for both local and remotely deployed servers and you are more than welcome to modify it for your needs.
We'd appreciate any [pull requests on GitHub](https://github.com/erudika/para-admin-ui).

<!-- more -->

![](https://www.erudika.com/assets/img/pwc1.png)

Once you connect to Para with your access keys, you see the dashboard where you see some aggregated information about
your app and server. On the left there is a list of object types. These include both core types defined in Java classes
and user-defined types created through the API. To create a custom type from the console, go to the "Edit App view"
and edit the `Datatypes` field by adding your own type, then refresh the page and it will appear on the left. Also
you can edit the resource permissions for your app.

![](/assets/img/pwc1_p1.png)

All types, except Linker (read-only), support CRUD operations in the web console. You can create and edit objects
easily and you can also do full-text search and browse through all the pages of results. We hope to add more
improvements to the project soon, like address visualization on a map and automatic configuration of custom fields.

![](/assets/img/pwc1_p2.png)

We've also updated Para to v1.18.3 to support the new type of tokens used by the web console. You can now generate
JWTs on the client-side and create "super" tokens from your access keys. These tokens give you full-access to the
API for a limited time, until they expire. They are simple to work with and can be sent as a request header.
Other improvements in this version include:

- Added support for anonymous permissions and guest access to the API
- Fixed default permissions to allow users to access their child objects (object created by them)
- Fixed CORS and GZip filters conflicts

The admin interface is client-side only and your secret key is *never* sent over the the network. Instead, a JWT
access token is generated locally and sent to the server on each request (valid for a week).

We created the web console as a supplementary tool to our paid backend management interface on [paraio.com](https://paraio.com).
It has all the features of the web console and more - backup and restore, simple permission management
and scalability controls. And we offer free accounts for developers!

*Have questions or suggestions? Chat with us [on Gitter](https://gitter.im/Erudika/para)!*

