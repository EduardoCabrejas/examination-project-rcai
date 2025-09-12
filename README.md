# AI Messaging Platform - Frontend Assessment

## Overview

This project is a message viewer interface that displays conversation histories between users and AI. The goal is to demonstrate proficiency in **Next.js 14**, **React**, **TypeScript**, and frontend best practices, while delivering a performant and intuitive user experience.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Assumptions](#assumptions)
- [Implemented Features](#implemented-features)
- [Technical Decisions & Rationale](#technical-decisions--rationale)
- [Known Limitations & Areas for Improvement](#known-limitations--areas-for-improvement)

---

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>

   ```

2. Install Dependencies
   npm install

# or

yarn install

3. Run the development server:

npm run dev

# or

yarn dev
Open your browser at http://localhost:3000

`All API requests from the frontend are proxied through a Next.js API route (/api/messages) to avoid direct calls to the external mock API.`

`Assumptions`
The external API provides messages with a standard structure including message_text, message_date, bot_sender, sent_by_customer, and customer fields.

"Business messages" are defined as messages that are neither from the bot nor from the customer.

Deleted messages are marked with an is_deleted flag.

Date grouping logic assumes local timezone handling for "Today", "Yesterday", and "This Week".

`Implemented Features`

## Core Requirements

- Next.js 14 App Router with TypeScript
- API route at /api/messages fetching data from external mock API
- Error handling in the API route
- Loading states on the frontend
- Message grouping by date: Today, Yesterday, This Week, Older
- Visual distinction between AI (bot), customer, and business messages
- Timestamps formatted for readability
- Sticky date headers for better scrolling context
- Responsive design (mobile, tablet, desktop)
- "Jump to bottom" button for navigation in long conversations
- Smooth scrolling and transitions between message groups

`Bonus / Optional Features`

- Keyboard navigation between messages (ArrowUp / ArrowDown) with persistent highlight
- Message selection and copy functionality via Enter or Ctrl+C
- Deselect messages by pressing Esc or clicking outside
- Search with highlight
- Accessibility features: ARIA labels, keyboard navigation support, focus management

`Technical Decisions & Rationale`

- useMessageFilters hook: handles date and type-based filtering of messages efficiently with useMemo for performance.
- useMessageNavigation hook: manages active message selection, keyboard navigation, copy functionality, and deselection (Esc / click outside) in a single, reusable hook.
- MessageGroupList component: manages a consistent global index for messages across groups, enabling correct keyboard navigation and copy behavior.
- MessageCard component: manages the distribution of the content of each message, as the date, type of message, the text and more.
- Highlighting search terms implemented in a dedicated function highlightText for clean code and maintainability.
- Framer Motion for smooth transitions when messages or groups are added/removed.
- Responsive design handled with Tailwind CSS for rapid and consistent styling.
- API requests are proxied through /api/messages to maintain frontend/backend separation and allow centralized error handling.

`Known Limitations & Areas for Improvement`

- Search is case-insensitive but currently does not support fuzzy matching.
- Accessibility could be enhanced further with focus management when jumping to messages via keyboard navigation.
- Virtualization of large message lists is not implemented; may affect performance with extremely long conversations.
- Tests are not included; adding unit and integration tests would improve maintainability.
- Currently, message highlight and scroll behavior are smooth, but large lists may benefit from virtualization to maintain performance.
