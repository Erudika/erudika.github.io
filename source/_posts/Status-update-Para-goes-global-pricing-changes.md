---
layout: post
title: 'Status update - Para goes global, pricing changes'
date: 2021-02-01 10:38:27
tags: [para, baas, hosting]
author: alex@erudika.com
comments: false
img: img18.jpg
---

Our backend-as-a-service (BaaS) [Para](https://paraio.com) continued to grow over the past few months and now it's 
hosting over 450 active apps. We have about 10 paid customers from different parts of the globe - USA, Japan, Europe. 
Previously, the hosted Para service was available from a single AWS region - Ireland, EU. This meant that clients 
connecting from another continent would experience high latency for all requests to the backend, which would make
Para applications feel slow. It was time to address this problem.

<!-- more -->

![](/assets/img/blogpost_media17.png)


**Over the past month we expanded operations to two more regions - Tokyo, Japan and California, USA.** This means that 
Para is now a globally available backend service with high availability and on-demand scalability. This is really
exciting news because we are the only independent BaaS provider to offer such level of service with simple and 
predictable pricing. 

Para BaaS relies heavily on **AWS DynamoDB** for data storage and benefits from its immense scalability and replication 
features. We use global tables to replicate data across the three regions and on-demand scaling is enabled for 
each app table. Not only do we replicate the tables of paid apps, but even the free apps' data is globally replicated.

**But what is cross-region replication?** Each Para app stores data in a dedicated DynamoDB table in a single region.
When a request comes in from the same region or a nearby region (same continent), the latency is very good (< 200ms).
But if a request from a far away region comes in, the latency can increase to about 800ms which is terrible.
This is where cross-region replication comes in. The table from region A is replicated to regions B and C and we 
have carbon copies of that data in to more locations around the globe. Now, if a read request comes from region C,
it fetches the data from that region locally. Similarly, a write request from region B is written to region B but also
replicated to regions A and C in real time. This type of replication is also know as 
[multi-master replication](https://en.wikipedia.org/wiki/Multi-master_replication).

**This all sounds great, but what about the full-text search indexes?** Para offers full-text search on all objects 
in the database which requires that data to be indexed and reindexed on each write request. Keeping the search 
indices in sync across all active regions is a challenge. We decided to keep operations as simple as possible and
managed to synchronize the indices without complicating the architecture. With the help of AWS Simple Queue Service,
Para sends special messages on each write request to a queue in each of the other active regions. Then each regional
instance of Para pulls those messages from the queue and updates its local search index by fetching the updated data
from the local DynamoDB table. The process is simple, fast and scalable.

## Simplified scaling

The hosted Para service used capacity credits to allow users to scale their app. Each pricing plan included a number
of read and write credits and additional credits were available for purchase. If your Para app started to get more
traffic, you could buy more capacity credits and increase its throughput. 

Now, there is a better way to scale Para apps, thanks to the on-demand scaling feature in DynamoDB. It gives us
faster and automatic scaling of tables. We've enabled on-demand scaling for all existing apps, including all free apps.
With this change there is no need for capacity credits any more so we'll remove that feature from Para.
**So you don't have to do anything to accommodate more traffic - your app simply scales automatically!**


## Pricing changes

Finally, we've decided that it's time to simplify our pricing. There will be a single pricing plan which will cost
**€25 per app**. The new pricing will be in effect soon for new customers. Old customers will be charged the same 
prices as before. The currency is also changed from US Dollars to Euros because we are based in the EU.

The free plan is still available and lots of people use it for prototyping and building applications. The only change
to this plan will be the new restriction of 10000 objects per app. Apps with more than 10K objects will be disabled
until they upgrade to the paid plan.


*Hey, I'm Alexander - an indie solo developer working on [Para](https://paraio.com) BaaS in the open. Follow my 
bootstrapping journey on [Indie Hackers](https://www.indiehackers.com/albogdano). 
Questions? Ask me anything about Para [on Gitter](https://gitter.im/Erudika/para)!*