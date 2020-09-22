---
layout: post
title: Announcing Scoold Cloud
date: 2020-09-22 15:28:01
tags: [scoold, saas, hosting]
author: alex@erudika.com
comments: false
img: img17.jpg
---

We're happy to announce the availability of Scoold Cloud - the official hosting for Scoold Pro. We've been working
on it for the past few months and we can't wait for you to try it out. Now you can easily deploy a Scoold Pro 
server in the cloud. Scaling and upgrades are handled by us, leaving you to focus on your community. When used in
combination with our serverless backend, [Para](https://paraio.com), Scoold Cloud offers a simple and efficient
solution for knowledge sharing within your organization, with zero maintainance.

<!-- more -->

![](/assets/img/blogpost_media16.png)

## Deploy Scoold Pro in minutes

Hosting Scoold Pro yourself can be challenging especially if you don't have prior experience with hosting Java 
applications in the cloud. Many of our clients have asked us for help during the installation process and some 
even got stuck along the way because they are not familiar with the platform they are using. 
You are faced with many choices while deploying Scoold - you have to choose one of the many cloud providers 
(AWS, Azure, Google Cloud Platform, Heroku, DigitalOcean, etc.). Then, you can either choose to go with Docker 
or run the application directly. So we decided to simplify the whole process and offer Scoold as a service.
Scoold Cloud makes the deployment process effortless - it takes just a few clicks to run a fresh instance of 
Scoold Pro.

Let's run a new Scoold Pro server. First, visit [cloud.scoold.com](https://cloud.scoold.com/login) and register.
After login, click "New Deployment" on the Servers page. Let's choose a "SMALL" instance type and, since we don't
have a Para app yet, check the "Use demo app for now" checkbox. This will connect to a demo Para app filled with
example questions and answers.

<video width="100%" autoplay loop>
  <source src="/assets/vid/scooldcloud1.mp4" type="video/mp4">
</video>

Scoold Cloud runs on top of Amazon Web Services (AWS) and when you click "Deploy" it spins up one or multiple
EC2 instances along with a load balancer and sets up autoscaling automatically. Finally, it connects your cluster
to the internet by setting up your own `.cloud.scoold.com` subdomain with SSL enabled. The whole process takes
about 4-5 minutes.

<video width="100%" autoplay loop>
  <source src="/assets/vid/scooldcloud2.mp4" type="video/mp4">
</video>

You can view basic metrics in realtime like request count, response times and HTTP error count. You can also edit
the configuration file directly in your browser. Finally, you can terminate a server completely, thus releasing its
resources. Terminating a server **does not delete your data** in Para so you can simply redeploy the instance and
all your data will be there.


## Migration from Stack Overflow for Teams to Scoold Cloud

1. Open your Scoold Pro website and login as admin
2. Download your data archive from Stack Overflow by browsing to 'Admin settings -> Account info -> Download data'
3. On Scoold's Administration page click 'Import' and select the Stack Overflow archive (.zip)
4. Check "This archive was exported from Stack Overflow" and click import

All the data for your team on Stack Overflow, except for user badges, will be imported into Scoold.

## Migrating your existing Scoold server to Scoold Cloud

1. Deploy a new Scoold Pro server on Scoold Cloud
2. Open the `application.conf` file of your existing Scoold server and copy its contents
3. Paste the configuration inside the "Configuration" panel for your Scoold Cloud instance
4. Restart your Scoold Cloud instance

Keep in mind that for this operation to work you need to have Para deployed on a publicly accessible location.
If you use hosted Para (ParaIO.com) this won't be an issue, but if your Para is deployed on a private server or
on your local machine, Scoold Cloud will not be able to connect and your Scoold instance will appear broken.


## Subscription plans

![](/assets/img/scooldcloud_pricing.png)

Scoold Cloud pricing starts from &euro; 49 per for a single node deployment. For a load-balanced cluster of two nodes 
with high availability and failover, the price per month is &euro; 79. For larger installations you can deploy a 
4 node cluster for &euro; 129 per month. You can deploy as many instances as you like by purchasing deployment credits
from your "Account" page.

Billing is on a monthly basis. The prices don't include European Union VAT (not applicable to customers outside the EU).


*Need a Para backend for your Scoold Pro server? Sign up for a free account on [Para](https://paraio.com) - 
our fully managed backend service, supporting multiple Scoold instances. Questions? [Chat with us](https://cloud.scoold.com)!*