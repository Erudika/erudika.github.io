---
title: "How to add HTML form handling to your website for free"
date: 2026-03-23
tags: ["forms", "backend", "open-source", "para"]
author: "alex@erudika.com"
excerpt: "Para now supports handling HTML form submissions directly, including email notifications, CAPTCHA verification, and optional message storage - all without writing a single line of backend code."
img: "img21"
thumb: "blogpost_media20"
---

**Static websites are cool, until they need a contact form.** The moment you add one, you have to wire up a backend service, pay for a third-party form provider, or send users to a mailto link and hope for the best. So recently, we rolled out a new feature in Para - **HTML form handling**.

Para has always been a backend for people who don’t want to manage a backend. With the new forms feature, that promise now includes HTML form handling. You can set up a contact form, capture leads, or manage support requests. Para will validate the submission, verify the CAPTCHA, send the email, and optionally store the message. No backend code is needed.

<!-- more -->

![Blog media](../../images/blogpost_media20.png)

This tutorial walks through the complete setup: creating a form configuration in Para, building the HTML form, and handling the server response.

## How it works

Para's form handling works in two modes:

- **Public form endpoint** - `POST /v1/_forms/{appid}/{formid}` accepting `multipart/form-data`. For browser-based HTML forms submitted by anonymous users.
- **Authenticated API** - `POST /v1/_emails` with an API key. Can be called from your server-side code and you can use Para as service for sending transactional emails.

In this article, I will focus on the public endpoint. It's designed to be used directly as the `action` URL on an HTML `<form>` element.
The Para backend server will check for a stored `Form` configuration object by ID, and use it to determine the recipient list, CAPTCHA settings, and formatting rules.
Finally if the CAPTCHA challenge passes, Para would send the email on your behalf.

Recipients and rendering behavior are controlled by the server (Para), for each `Form` object separately.
A public user cannot change where the email goes or how the message body is rendered.

## Step 1: Deploy Para or use Para Cloud

If you don't have a Para server running, go to [Para Cloud](https://paraio.com) and create a free account, then create a new app.
To get started by deploying a self-hosted Para server, follow the getting started guide in the [Para Docs](https://paraio.org/docs).

## Step 2: Create a Form object

Before the public endpoint is active, you need to create a `Form` object in Para using the standard object API. This is a one-time setup step.

On Para Cloud, create the "Create object" button  to create a new `Form`, or send an authenticated `POST /v1/forms` request with your API credentials:

```json
{
  "type": "form",
  "name": "My Website Contact Form",
  "captchaSecretKey": "YOUR_CAPTCHA_SECRET_KEY",
  "notifyEmails": ["webmaster@domain.com"],
  "messageStorageEnabled": false,
  "plaintextOnly": false,
  "markdownEnabled": true,
  "redirectTo": "https://yoursite.com/thanks-page"
}
```

The fields you configure here - `notifyEmails`, `plaintextOnly`, `markdownEnabled`, `redirectTo` - cannot be overridden by a public client submission.
Once created, Para generates a `formActionURI` for this object:

```
/v1/_forms/myapp/1942581154968244224
```

That's the URL you'll use as the `action` attribute on your HTML form. 
For example, if your Para server is `https://paraio.com`, the form would be declared like so:

```html
<form action="https://paraio.com/v1/_forms/myapp/1942581154968244224" 
  method="post" enctype="multipart/form-data">
```

### Form protection with CAPTCHA

The `captchaSecretKey` field accepts a server-side secret from any of the three supported CAPTCHA providers:

- **Cloudflare Turnstile** - submit the token as `cf-turnstile-response`
- **hCaptcha** - submit the token as `h-captcha-response`
- **reCAPTCHA v3** - submit the token as `g-recaptcha-response`

Para detects which provider to verify against based on which parameter is present in the form submission.
You only need to follow the instructions provided by your CAPTCHA provider and integrate their script in your HTML code.

## Step 3: Build the HTML form

Here is a minimal contact form using Cloudflare Turnstile for CAPTCHA:

```html
<form
  action="https://paraio.com/v1/_forms/myapp/contact-form"
  method="post"
  enctype="multipart/form-data"
>
  <div>
    <label for="name">Name</label>
    <input id="name" type="text" name="name" required maxlength="255">
  </div>
  <div>
    <label for="email">Email</label>
    <input id="email" type="email" name="email" maxlength="255">
  </div>
  <div>
    <label for="subject">Subject</label>
    <input id="subject" type="text" name="subject" maxlength="255">
  </div>
  <div>
    <label for="message">Message</label>
    <textarea id="message" name="message" required maxlength="5000"></textarea>
  </div>
  <!-- Cloudflare Turnstile widget -->
  <div class="cf-turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY"></div>
  <button type="submit">Send message</button>
</form>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer>
</script>
```

Replace `YOUR_TURNSTILE_SITE_KEY` with the public site key from your Cloudflare Turnstile dashboard and `YOUR_CAPTCHA_SECRET` in the `Form` object with the corresponding secret key.

That's all the HTML you need. When a user submits this form, Para will:

1. Load the `Form` object by app ID and form ID.
2. Verify the CAPTCHA token with Cloudflare.
3. Validate the form fields.
4. Send an email to all addresses in `notifyEmails`.
5. Store the submission as a `formdata` object if `messageStorageEnabled` is `true`.
6. Redirect the browser to `redirectTo`.

## Step 4: Handle the response

### Redirecting on submit

If you specify a redirect URL in `redirectTo` when creating the `Form`, Para would redirect users to that URL after they submit the form.
If a redirect URL is missing, the response would be a JSON object with the status of the operation (useful for AJAX submissions).

You can create a simple static thank-you page at `/thanks` and point `redirectTo` to it.

### Submission failures

If the submission fails (invalid CAPTCHA, missing required fields, rate limit exceeded), the redirect URL receives error details as query parameters:

```
https://yoursite.com/thanks?status=403&message=Form+validation+failed+due+to+invalid+CAPTCHA+response.
```

You can read these in JavaScript on the thank-you page and show an appropriate message to the user:

```js
const params = new URLSearchParams(window.location.search);
const status = params.get("status");
const message = params.get("message");

if (status && status !== "200") {
  document.getElementById("result").textContent = message || "Something went wrong.";
}
```

If there were no errors and the form was submitted successfully, there would be no `message` or `status` query parameters in the URL.

## File attachments

Your forms can also have file attachments in them. Add a file input to your form with a field named `file`:

```html
<input type="file" name="file">
```

Para will include the uploaded file as an email attachment. No extra configuration is needed.

## Markdown parsing in messages

If you want to allow Markdown formatting in the message body, set `plaintextOnly: false` and `markdownEnabled: true` on your `Form` object.
By default, Para will simply treat each message as plain text and strip all HTML tags from it.
Optionally, you can enable HTML tags in the form body with `plaintextOnly: false` and `markdownEnabled: false`.

## Summary

| | Public endpoint `/v1/_forms` | API endpoint `/v1/_emails` |
|---|---|---|
| Authentication | None (CAPTCHA required) | API key / signed request |
| Request content type | `multipart/form-data` | `application/json` |
| CAPTCHA | Required | Not required |
| Recipients | Set on `Form` object | Set in request payload |
| File attachment | Yes | Yes (base64 data URI) |
| Message storage | Optional via `Form` | No |
| Redirect | Optional via `Form` | No |

Using Para's form handling endpoint is a no-brainer solution for any website, especially for static websites.
Create the `Form` object once, point your HTML form at the generated action URL, add a CAPTCHA widget, and you're done.

We're using Para form handling in production for the contact forms on our landing pages:
[scoold.com](https://scoold.com/imprint/contact-us/) and [the contact form on this site](https://erudika.com/contact/).

*If you liked this post, you can try out Para at [ParaIO.com](https://paraio.com) - it's **free for developers***
