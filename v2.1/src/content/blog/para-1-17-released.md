---
title: "Para v1.17 released"
date: 2016-01-05
tags: ["backend", "para", "release"]
author: "alex@erudika.com"
excerpt: "excerpt-123"
img: "img3.jpg"
---

We're happy to announce the release of Para v1.17. Last week we pushed the new version to Maven and now it's also
deployed on [ParaIO.com](https://paraio.com), our hosted backend service.

<!-- more -->

We've worked hard during the holidays to bring you several new features that will enable you to integrate Para in
projects that are client-side only like static web pages or mobile applications.

Here are all the new features in Para v1.17:

<!--
Added JSON Web Tokens support
Added methods to grant and revoke permissions for users
Fixed Maven's JAR and WAR assembly - there's a single 'fat' executable WAR now
Updated Elasticsearch to v2.1.1
Updated design & added features to web console
-->

## JSON Web Tokens support

![Blog media](../../images/blogpost_media2.png)

[JSON Web Tokens](https://jwt.io/) are a new standard for authenticating clients and users. Think of them as
'Cookies 2.0'. They are simply a signed JSON object containing some data about the authenticated user. The cool thing
about JWTs is that they are stateless and can be stored anywhere - cookies, local storage, memory, etc. They can securely
store information and claims about the user and that information is signed and cannot be tampered with.

Originally, Para supported only cookies and allowed users to sign in only to the server running Para.
This was quite limiting. Now with JWTs users can be authenticated and created per app
(see [the docs for apps](https://paraio.org/docs/#011-apps)) through the API.
Cookies are still supported but using web tokens is recommended. For example, to sign in a user with
Facebook you have to make a request like this:

```js
POST /jwt_auth
{
  "appid": "app:myapp",
  "provider": "facebook",
  "token": "eyJhbGciOiJIUzI1NiJ9.eWIiO..."
}
```

The token above is a Facebook access token which is exchanged for a Para access token in the form of JWT.
If that request succeeds, the access token for Para is returned and that user is now authenticated with `app:myapp`.

```js
{
  "jwt": {
    "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ...",
    "expires": 1450137214490,
    "refresh": 1450137216490
  },
  "user": {
    "id":"user1",
    "timestamp": 1399721289987,
    "type":"user",
    "appid":"myapp",
    ...
  }
}
```

That's it - there's no need to register the user. And this request can come from any client not just the backend.
An good use case would be an AngularJS app running on its own as a static single page app (SPA). The frontend code would
use our JavaScript client library to call `signIn()` to the Para backend server. Another use case could be a mobile app
running native Android code. The app's code, even though compiled, is not trusted and thus must not contain any
API access credentials like a `secret_key` for Para. In this case JWT is ideal because it gives that app (untrusted client)
temporary access to the API. Para access tokens are valid for one week, by default.

Special thanks to the guys at [Connect2ID](https://connect2id.com/products/nimbus-jose-jwt) for their excellent JWT
library for Java which we use in Para.

## Resource permissions

Soon after we decided to add JWT support, we realized that once a user has been authenticated with an app we need to
specify what that user can do, so we implemented basic resource permissions. By default users are not trusted and every
new app has zero permissions - the default policy is `deny all`. This is in contrast to the normal API access using a
`secret_key` for apps, in which case apps have full permissions and privileged access.

Resource permissions affect only users with JWT tokens and are stored in each app object. A permission has three parts -
a `subject_id`, a `resource_name` and a list of `methods`. It looks like this:

```js
{
  "user2": {
    "posts": ["GET", "POST"]
  }
}
```

This gives a subject with id `user2` permissions to access resource `posts` using HTTP methods `GET` and `POST` only.
The `posts` resource is just an example an is part of the API and is located at `/v1/posts`. Wildcards `*` are also
supported. So the following permission would give everyone full access to all resources for a given app:

```js
{
  "*": {
    "*": ["*"]
  }
}
```

Permissions can be granted and revoked through the API. There's also a method for checking permissions:

```txt
GET /v1/_permissions/{subjectid}/{resource}/{method}
```

## Support for Elasticsearch 2.x

Elasticseach is a key component of the Para backend server and we use it since version 0.13. With version 2.0 come many
new features and changes. We've modified and tested the code to be compatible with the new version.

You can [download the latest WAR file from GitHub](https://github.com/Erudika/para/releases/).
To run it just type `java -jar para-war.war` and it will start.

** We hope you will like the new features and feel free to try Para online at [paraio.com](https://paraio.com).
No need to install anything and it's free.**
