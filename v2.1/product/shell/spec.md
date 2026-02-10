# Application Shell Specification

## Overview
A responsive top-navigation shell for the Erudika company site that keeps the brand header, navigation, and user menu consistent while allowing any roadmap section to render inside a flexible content area. It leans on the Space Grotesk/Inter type pairing and indigo/amber/slate palette for a modern-but-trustworthy SaaS feel.

## Navigation Structure
- Marketing Foundation → /marketing-foundation
- Projects & Solutions Showcase → /projects
- Content Hub & Blog → /content
- Support, Contact & Trust → /support
- SEO & Performance Infrastructure → /seo
- Settings (auxiliary) → /settings

## User Menu
Top-right avatar with dropdown containing the user name, role/status, links to Profile & Account, and a Logout action. On mobile the avatar sits beside the hamburger button, expanding into a sheet.

## Layout Pattern
Top navigation bar with brand/logo on the left, navigation links centered/left-aligned, and user controls on the right. On desktop, nav links display inline. On tablet/mobile, a Menu button reveals the nav in a full-width slide-down panel.

## Responsive Behavior
- **Desktop:** 72px tall sticky header, inline navigation, hover/active states using indigo primary with amber underline accents. Content area constrained to max-w-6xl with generous padding.
- **Tablet:** Header reduces padding; navigation collapses behind a Menu icon that toggles a sheet under the header; user menu remains accessible via avatar button.
- **Mobile:** Single-row header with logo, menu toggle, and avatar. Navigation reveals as vertical list with large tap targets and neutral slate background. Content area uses smaller spacing.

## Design Notes
- Primary color (indigo) drives active nav background and focus ring; secondary (amber) used for hover underline + notification dot. Neutral slate backgrounds ensure contrast in light/dark modes.
- Typography: Space Grotesk for nav labels and logo wordmark; Inter for body text inside the shell. Mono font reserved for any status badges in future.
- Include Help icon linking to documentation shortcut in the header utility row for quick reference.
