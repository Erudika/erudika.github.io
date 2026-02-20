#!/bin/bash

para-cli create './dist/about/*.html' --type 'blogpost' --sanitize
para-cli create './dist/projects/**/*.html' --type 'blogpost' --sanitize
para-cli create './dist/support/*.html' --type 'blogpost' --sanitize
para-cli create './dist/contact/*.html' --type 'blogpost' --sanitize

para-cli create './dist/blog/an-open-source*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/announcing-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/backend-frameworks-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/building-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/hello-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/implementing-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/introducing-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/jprime-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/para-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/saving-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/scoold-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/status-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/top-*/*.html' --type 'blogpost' --sanitize
para-cli create './dist/blog/webhooks-*/*.html' --type 'blogpost' --sanitize
