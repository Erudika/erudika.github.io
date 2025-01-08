---
layout: post
title: 'Status update - containers, Java 11 and more'
date: 2019-01-28 23:37:01
tags: [scoold, para, docker, kubernetes, helm, lucene, release]
author: alex@erudika.com
comments: false
img: img14.jpg
---

Over the past couple of months we've been busy maintaining [Para](https://paraio.org) and 
[Scoold](https://scoold.com) and a few patches have been released. The changes are minor and are mostly related 
to dependency upgrades. A few minor bugs have been fixed as well. Scoold has received some much welcome pull 
requests with translations from our awesome contributors. It is now available in 12 different languages! 

<!-- more -->

![](../assets/img/blogpost_media12.png)

Last year came the release of Java 11 and we're quite happy to announce that both Scoold and Para are fully 
compatible with JDK 11. This required that we upgrade most of the dependencies like Spring and Guice, for 
example. 

The latest release of Para is `1.31.1` and it contains a number of fixes. The code responsible for authenticating
users with LinkedIn has been updated and it's now compatible with their latest API v2.0. We recommend that you 
update your Para server to 1.31.1` if you're using LinkedIn.

SAML authentication has been a desired feature for some time so we've implemented it as part of the Para backend.
Hence, [Scoold PRO](https://www.scoold.com/) and all Para clients can take advantage of that and authenticate users 
through any given SAML IDP. This, coupled with existing LDAP support, makes it effortless for enterprise customers
to integrate their own identity provider with Para and Scoold.

The latest release of Scoold is `1.31.2`. The cookie security has been tightened with the addition of the new 
`SameSite` flag which is supposed to completely mitigate the risk of a possible CSRF attack. For better protection
against XSS attacks, we've also upgraded the template engine, Velocity, to 2.0. 

Scoold now comes in a WAR package as well. This makes it easy to deploy on a servlet container such as Apache Tomcat.
The JAR package is more appropriate for deploying Scoold to hosts without a servlet container, as it includes an
instance of the embedded Jetty server. This is the case for Heroku, for example.

Apart from Heroku, we've added support and documentation for lots of other deployment options — AWS, Azure, 
DigitalOcean and Google App Engine. Not only that, but we've added a new `helm/` folder with a Helm chart for those
of you who want to deploy Scoold to a Kubernetes cluster with a single command:

```
helm install --name my-scoold ./scoold
```

Read the [Scoold chart README](https://github.com/Erudika/scoold/tree/master/helm) for more details on how to 
configure the pod.

Para does not yet include a Helm chart because it has lots of different database combinations and it's hard to choose
the best option for everyone. It is available on Docker Hub and so is Scoold. To run a Para server locally with
Docker, simply run:

```
docker run -ti -p 8080:8080 --rm -v para-data:/para/data \
  -v $(pwd)/application.conf:/para/application.conf \
  -e JAVA_OPTS="-Dconfig.file=/para/application.conf" erudikaltd/para
```

To run just Scoold locally, try:

```
docker run -ti -p 8000:8000 --rm -v $(pwd)/application.conf:/scoold/application.conf \
  -e JAVA_OPTS="-Dconfig.file=/scoold/application.conf" erudikaltd/scoold
```

Or, to run both Para and Scoold locally with Docker use the `docker-compose` command from inside the Scoold folder:

```
docker-compose up
```

Each release of Para and Scoold has a tag and that tag is reflected on Docker Hub. So you can fetch a particular tag and
run that, or use the `:latest` tag which contains the most recent updates from the `master` branch. You can see all the 
containers available on [our Docker Hub page](https://hub.docker.com/u/erudikaltd), which includes all the Para plugins
as well.

## Lucene S3 Directory

Finally, we'd like to announce the availability of a new experimental project called 
[lucene-s3directory](https://github.com/albogdano/lucene-s3directory). It's a `Directory` implementation for Apache
Lucene which allows you to store your indices directly on AWS S3. This has been attempted before by Shay Banon (creator 
of Elasticsearch and Compass) but he later abandoned the project because S3 didn't have support for locks back then.
Since late 2018, S3 now supports two different types of locks on objects - legal hold locks and retention periods. 
The `S3Directory` implementation uses legal hold locks on `write.lock` files. 

The project passes the integration tests but it might still contain some bugs. We'd really appreciate it if you take it
for a spin and report any issues on [GitHub](https://github.com/albogdano/lucene-s3directory/issues).




