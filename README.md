# 🐝 BeeHive Communications Hub

An AI-powered communications management platform for routing, classifying, and managing inbound messages across multiple channels.

## Features

### Core Messaging
- **Multi-channel support** — Email, Phone, Chat, Social, SMS
- **AI-powered classification** — Automatic priority, department, and confidence scoring
- **Message management** — Search, filter, sort, assign, and update messages
- **Internal notes** — Add team-facing notes to any message
- **Change history / audit trail** — Full log of all modifications

### Dashboards (Landscape Layout)
- **Manager / Admin Dashboard** — Team analytics, workload distribution, charts, and team directory
- **Employee Dashboard** — Personal work queue with stats and assigned messages
- **Recent Tasks table** — Quick view of latest tasks with ID, channel, priority, status, and owner
- **AI Insights panel** — Actionable AI suggestions, daily digests, trend alerts with Apply/Dismiss
- **AI Performance Insights** — 6 metric cards, AI analysis, pattern detection, human-in-the-loop disclaimer, and interactive trend chart (Volume/Response/Priority with line/bar toggle)

### Role-Based Access
- **Admin** — Full access: Messages, Dashboard, Integrations
- **Manager** — Messages, Dashboard, Integrations
- **Employee** — Messages, Dashboard (personal scope)

### Integrations
- Email (Gmail / Outlook)
- Instagram (Meta Business API)
- Shopify (Webhooks)
- Telephony (Twilio / Flute)
- Universal ingestion architecture with webhook details

### Additional Features
- 🌙 Dark mode toggle
- 🔔 Notification panel with system alerts
- ⚙️ Settings with profile and preferences
- 📤 Manual message upload
- ⚠️ Urgent unassigned alerts
- 🤖 AI capability banners per role
- ✅ Confirmation dialogs for high-impact changes
- 📋 Tooltips showing AI reasoning on badges

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Demo Accounts

| Name            | Role     | Department |
|-----------------|----------|------------|
| Sarah Johnson   | Employee | Sales      |
| Michael Chen    | Manager  | Sales      |
| Emily Davis     | Employee | HR         |
| James Wilson    | Employee | Marketing  |
| Lisa Anderson   | Employee | Finance    |
| David Brown     | Employee | Support    |
| Rachel Green    | Manager  | Marketing  |
| Tom Harris      | Manager  | HR         |
| System Admin    | Admin    | Sales      |

### Build for Production

```bash
npm run build
```

Outputs optimized files to the `build/` folder.

## Tech Stack

- **React 18** — UI framework
- **Tailwind CSS 3** — Utility-first styling
- **SVG** — Custom trend charts
- **Context API** — State management

## Project Structure

```
beehive-app/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          # Main application (all components)
│   ├── index.js          # React entry point
│   └── index.css         # Tailwind imports
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## License

© 2026 BeeHive Communications Hub
