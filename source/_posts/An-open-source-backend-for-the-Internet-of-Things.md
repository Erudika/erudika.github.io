layout: post
title: An open source backend for the Internet of Things
date: 2016-08-12 11:01:00
tags: [release, para, iot, devices]
author: alex@erudika.com
comments: true
img: img8.jpg
---

**Things** — those small, connected devices are now part of our daily lives. As we transition our focus from mobile to broader IoT development, the need for reliable and open source backend systems increases. There are so many applications for IoT — smart thermostats, air conditioning controllers, DIY home automation systems based on Raspberry Pi and Arduino, to name a few. We were planning to add IoT support to Para for a while now but it was only after a fellow developer's suggestion that we realized we should've done this sooner. 

<!-- more -->

![](https://erudika.com/assets/img/blogpost_media6.png)

There are several key players in terms of IoT cloud platforms, but we chose to focus on two — **AWS** and **Azure**. In Para `1.20.0` we've implemented basic support for both platforms which allows you to keep your devices in sync between your backend and the cloud. There's a new object called `Thing` which holds all the information about your device — the state of the device, the security credentials for the cloud and other important data. When a `Thing` is created, Para automatically calls the cloud provider and sets it up, returning all the information you need to connect your device to that cloud. It can then start pushing state changes and messages to the cloud containing any sensory data or other data of interest. In the case of AWS, Para would check for state changes on every read request and in the case of Azure it runs a separate thread for listening to cloud-to-device messages and updates `Thing` objects in the background. If you prefer one of these two approaches, we'd love to hear your feedback. 

Creating things from the Para API is really simple — you only need to configure your access keys for the cloud provider of your choice. Then you make a `POST` request:

```
POST /v1/things
{
  "name": "RPiThingy",
  "serviceBroker": "AWS"
}
```

The `serviceBroker` switches between IoT service providers and can either be "AWS" or "Azure". The request above will perform several tasks on AWS before it returns, it will:
 
- Create a device certificate
- Create a device policy and attach it to the certificate above
- Create a new thing (device) and attach it to the certificate above

Finally, a new `Thing` object is created within Para. The returned JSON object contains the inlined certificate and private key which should be transferred to the physical device. Once it starts sending data to AWS using the MQTT protocol you can poll for device state changes by reading the `Thing` object:

```
GET /v1/things/myapp:664870213421895680
```

AWS have what they call "device shadows" a persistent storage for device state which is useful for remembering what was the last state of the device if it ever got disconnected. Let's assume that this shadow has been updated by our Raspberry Pi thingy and it set a `temp = 24` variable. Once we read object like we did above, it gets the latest state from AWS. 

```
{
  "id": "664870213421895680",
  "timestamp": 1468601996535,
  "type": "thing",
  "appid": "myapp",
  "name": "RPiThingy"
  "serviceBroker": "AWS",
  "deviceState": {
  	"temp": 24
  }
}
```

If we make a change in our backend and change the `Thing` to have `temp = 26` then this change is automatically reflected on AWS and the shadow of the device is also updated.

```
PATCH /v1/things/myapp:664870213421895680
{
  "deviceState": {
    "temp": 26
  }
}
```

## Summary — getting started with Para and AWS IoT

1. Get an account from AWS and create a user with permissions to call the IoT API
2. Set the `para.aws_access_key` and `para.aws_secret_key` properties in your Para config file
3. Start the Para instance and create a `Thing` object through the API as shown above
4. Take note of the `deviceDetails` field returned by this request as it contains certificates for your device
5. Use the certificates to set up your device and connect it to AWS IoT
6. The `deviceState` field inside the Para `Thing` object is synced with the device shadow on AWS on every `GET` request
7. Update the deviceState from the Para API and it will be synced with the device shadow on AWS on every `PATCH` request.

## Other changes since `1.20` and plans for the next release

We've released quite a few improvements in `1.19` like the implementation of "join-like" queries using the method `findLinkedObjects()` this allows you to search for objects within a set of linked objects, in a many-to-many relationship. This feature relies on the `nested` query in Elasticsearch. 

Para now works with Microsoft accounts so you can authenticate users with valid Windows accounts. Additionally, we've added independent social sign in for apps with their own OAuth keys, meaning that each app in Para has its own private settings and these can contain security credentials for Facebook, Twitter, etc. This was not possible before for apps other than the root app. Hence, the new endpoint `/v1/_settings` was added for updating these new app settings. The full changelog can be found on [GitHub](https://github.com/Erudika/para/releases).

For the next release we're hoping to implement a new Cassandra `DAO`, which is now overdue. An interesting fact about Para is that it was originally implemented to only run on top of Cassandra as a database layer. This was back in days when Cassandra was below version 1.0 and had no official client library, instead we used the Hector client. Para is now database-agnostic but we really wanted to rewrite the original connector for Cassandra using the official Java drivers. 

*Have ideas for the next Para release? Chat with us [on Gitter](https://gitter.im/Erudika/para)!*
