# Invoice Generator

A privacy-first invoice generator that runs entirely in the browser. No accounts, no servers, no data ever leaves your device.

Built with React, TypeScript, and Vite.

Deployed on [wisp.place](https://wisp.place/).

## Features

- **Fully local** — all data stays in your browser, nothing is sent anywhere
- **Multiple invoice templates** — Classic, Minimal, Elegant, and Blue; switch between them with a live preview
- **PDF export** — open a PDF in a new tab or download it directly
- **Optional local persistence** — opt-in to save your form inputs to `localStorage` so they survive page refreshes
- **Live preview** — the invoice preview updates in real time as you type

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Output is in `dist/`. The build runs `tsc` for type checking before bundling, so the build will fail on any type errors.

### Deploy on wisp.place

1. replace YOUR-HANDLE in package.json
2. `npm run deploy`
3. deployed example: [blue-invoice](https://blue-invoice.wisp.place/)

## Adding a New Template

1. Create an HTML file in `public/`, e.g. `public/invoice_template_mytheme.html`
2. Use the placeholder tokens listed below in your HTML
3. Register it in `utils.ts`:

```ts
export const TEMPLATES: Template[] = [
  // ...existing templates
  { id: "mytheme", label: "My Theme", path: "/invoice_template_mytheme.html" },
];
```

The new template will immediately appear in the dropdown.

### Template tokens

| Token                     | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `{SENDER_NAME}`           | Your name or business name                       |
| `{SENDER_ADDRESS}`        | Street address                                   |
| `{SENDER_CITY_STATE_ZIP}` | City, state, ZIP                                 |
| `{SENDER_EMAIL}`          | Email address                                    |
| `{SENDER_PHONE}`          | Phone number                                     |
| `{CLIENT_NAME}`           | Client / bill-to name                            |
| `{INVOICE_NO}`            | Invoice number                                   |
| `{INVOICE_DATE}`          | Invoice date (formatted)                         |
| `{DUE_DATE}`              | Due date (30 days after invoice date, formatted) |
| `{DESCRIPTION}`           | Work description                                 |
| `{FROM_TO}`               | Work period, e.g. `Mar 1 to Mar 31 (22 days)`    |
| `{HOURS}`                 | Hours worked                                     |
| `{HOURLY_RATE}`           | Hourly rate (formatted as currency)              |
| `{AMOUNT}`                | Total amount (formatted as currency)             |

## Environment Variables

| Variable        | Description                  |
| --------------- | ---------------------------- |
| `VITE_APP_NAME` | App name shown in the header |

Create a `.env.local` file to override locally without affecting the committed `.env`:

```
VITE_APP_NAME=My Invoice App
```

## Tech Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) — PDF generation (loaded via CDN)
- [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) — real-time type checking during dev
- [wisp.place](https://wisp.place/) - static site hosting

## License

ISC
