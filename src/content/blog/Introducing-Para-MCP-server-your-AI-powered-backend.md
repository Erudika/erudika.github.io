---
title: "Introducing the Para MCP Server — your AI-powered backend"
date: 2026-04-16
tags: ["ai", "mcp", "para"]
author: "alex@erudika.com"
excerpt: "If you're building AI-powered applications or just want to work more efficiently with your Para backend, the MCP server opens up entirely new possibilities."
img: "img23"
thumb: "blogpost_media22"
---

We're excited to announce a powerful new addition to Para: **built-in support for the Model Context Protocol (MCP)**.
With this update, your Para backend can now communicate directly with AI assistants like Claude, Codex or Gemini, allowing you to talk to your backend in a natural conversation.

<!-- more -->

![Blog media](@/images/blogpost_media22.png)

## What's Para MCP?

Think of MCP as a universal translator between AI assistants and your backend services. Instead of writing code to query your database, search for users, or update configurations, you can simply ask your AI assistant to do it for you - in plain English.

Want to find all users who signed up last week? Just ask. Need to check if your search index is healthy? Ask. Want to update an app setting or create a new object? You guessed it - just ask.

## Why This Matters

If you're building AI-powered applications or just want to work more efficiently with your Para backend, the MCP server opens up entirely new possibilities:

**Natural Data Access**: No more writing queries or remembering API endpoints. Ask your AI assistant to find, create, update, or delete data using everyday language.

**Configuration Made Easy**: Searching through configuration docs becomes a thing of the past. If you ask your assistant "What security options are available?", it can explore all 200+ Para configuration settings and help you find exactly what you need.

**Faster Debugging**: When something's not working right, you can ask your AI assistant to check server health, inspect objects, or review app settings - all without leaving your conversation.

**Smart Assistance**: AI assistants can help you understand your data model, suggest best practices, and even catch potential issues before they become problems.

## Getting Started with Para MCP

Setting up the Para MCP server is straightforward:

**1. Enable the MCP endpoint in Para** - Add one line to your Para configuration file `application.conf`:

```ini
para.mcp_server_mode = "rw"
```

Choose `"r"` for read-only access (perfect for production) or `"rw"` for full read-write capabilities.

**2. Get your token** - Generate a JWT bearer token using [Para CLI](https://www.npmjs.com/package/para-cli):

```bash
npx para-cli new-jwt --print
```

**3. Configure your AI agent** - Add Para to your local MCP settings (different AI agents use different files for this):

```json
{
  "mcpServers": {
    "para": {
      "type": "http",
      "url": "http://localhost:8080/v1/_mcp",
      "mode": "streamable",
      "headers": {
        "Authorization": "Bearer {PARA_JWT_TOKEN}"
      }
    }
  }
}
```

**4. Start talking** - Restart your AI agent and you're ready to go!

## Basic functionality of the Para MCP server

Once connected, your AI assistant gains powerful capabilities:

- **Browse and Learn**: Ask your AI assistant to show you Para's configuration reference, server metadata, or health status.
It's like having the entire Para documentation at your fingertips, ready to answer questions.

- **Search and Discover**: *"Find all users with @example.com email addresses"* or *"Show me all configuration options related to caching"* -
your AI assistant can search across both your data and configuration.

- **Create and Modify**: Need to create a new app, add a user, or update an object? Just ask.
In read-write mode, your AI assistant can perform full CRUD operations on your behalf.

- **Maintenance Tasks**: *"Rebuild the search index"* or *"clear the cache"* - any routine maintenance task can be carried out with a simple instruction.

## Security

We've designed the MCP server with security in mind:

- **Authentication required** - Every request needs a valid JWT token
- **Read-only mode** - Perfect for production, allowing exploration without modifications
- **Automatic redaction** - Sensitive values like secrets and tokens are automatically hidden
- **Root app protection** - Critical operations like creating new apps require root app access

## Real-World Examples

Here's what working with Para through an AI assistant looks like:

**You:** "Show me the 10 most recent users"<br/>
**AI:** *Searches Para and displays results with names, emails, and signup dates*

**You:** "What configuration options control search behavior?"<br/>
**AI:** *Searches config and explains search-related settings with their descriptions and current values*

**You:** "Create a new blog post object titled 'Getting Started with Para'"<br/>
**AI:** *Creates the object and confirms with the new object ID*

## The road ahead

The MCP server lays the foundation for richer AI-powered workflows, from automated testing to intelligent monitoring, data analysis, and beyond.
We're excited to see what you'll build with it. Whether you're using AI assistants to speed up your workflow, building AI-powered features into your applications, or exploring new ways to interact with your backend, the Para MCP server is here to help.

If you have any ideas or feedback for the MCP server, head over to the [project's GitHub page](https://github.com/erudika/para/issues) and open a new issue.

## Summary

The MCP server is available now in the latest version of Para. Check out the [complete documentation](https://paraio.org/docs) for detailed setup instructions, all available tools and resources, and troubleshooting tips.

Have questions? We'd love to hear from you. Join our community [on Gitter](https://gitter.im/Erudika/para).

Happy building!

*If you liked this post, you can try out Para today at [ParaIO.com](https://paraio.com).*
