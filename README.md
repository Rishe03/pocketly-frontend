# Pocketly

A simulated digital banking mobile app built around saving. A customer logs in with a mobile number and a 4-digit MPIN, sees a main balance, splits money into goal-based savings **pockets**, and (in later phases) sets a daily spending cap, sends money to other users or partner banks, and cashes in or out through a simulated teller process.

> Frontend project for **ITE 18 – Application Development and Emerging Technologies**, Caraga State University (College of Computing and Information Sciences). This repository holds the **midterm** build. Pocketly is a simulation: no real money or real personal data is involved.

## Table of contents

- [Features and status](#features-and-status)
- [Screenshots](#screenshots)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Demo account](#demo-account)
- [Project structure](#project-structure)
- [Routes](#routes)
- [State management](#state-management)
- [Mock API](#mock-api)
- [Design](#design)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Roadmap for the Final](#roadmap-for-the-final)
- [Team](#team)
- [Credits and licenses](#credits-and-licenses)

## Features and status

Implemented (midterm):

- [x] Welcome screen that continues to the login
- [x] Login with an on-screen MPIN keypad, input validation and error handling
- [x] Route guard that protects signed-in pages
- [x] Home: balance card with hide/show, quick actions, 30-day overview, recent activity, bottom navigation
- [x] Goal Pockets list and Create pocket form (validation, duplicate-name error, live preview)

Designed in Figma, not built yet (planned for the Final):

- [ ] Pocket detail, Allocate funds and Withdraw sheets
- [ ] Cash-in and Cash-out with an expiring code and an admin confirmation step
- [ ] Transfer to a user and Bank Transfer, with daily cap warning and block
- [ ] Create account, Verify, Create MPIN, Forgot MPIN, Terms
- [ ] Insights, Settings and Profile
- [ ] Session persistence, unit/UI tests and online deployment

## Screenshots

| Login | Home | Goal Pockets | Create pocket |
|---|---|---|---|
| ![Login](docs/screenshots/login.png) | ![Home](docs/screenshots/home.png) | ![Goal Pockets](docs/screenshots/pockets.png) | ![Create pocket](docs/screenshots/create-pocket.png) |

## Tech stack

| Area | Technology |
|---|---|
| Framework | [Nuxt](https://nuxt.com) with [Vue 3](https://vuejs.org) (Composition API, `<script setup>`, TypeScript) |
| Routing | File-based routing from Nuxt (Vue Router) and route middleware |
| State management | [Pinia](https://pinia.vuejs.org) through `@pinia/nuxt` |
| Mock API | Nuxt server routes (Nitro) in `server/api` |
| Styling | Plain CSS with design tokens (CSS variables); scoped styles per component |
| Fonts | Poppins and Inter through `@fontsource` packages |
| Icons | Lucide-style SVG paths in one `AppIcon` component |
| Design | [Figma](https://www.figma.com/design/vQLVzKzR2cMHd8KeEBCYN5/ITE-18) |

## Getting started

Prerequisites: [Node.js](https://nodejs.org) 20 or newer, npm, and Git.

```bash
git clone https://github.com/Rishe03/pocketly-frontend.git
cd pocketly-frontend
npm install
npm run dev
```

Open <http://localhost:3000>. The Welcome screen appears first and continues to the login.

| Script | What it does |
|---|---|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Builds the app for production |
| `npm run preview` | Serves the production build locally |
| `npm run generate` | Generates a static version of the site |

## Demo account

The mock API has one simulated user. Use these to sign in:

| Mobile number | MPIN |
|---|---|
| `9171234567` | `1234` |

These are fake credentials for the simulation only. The mock API keeps its data in memory, so **restarting the dev server resets everything** (balance, pockets and transactions) to the starting values.

## Project structure

```text
pocketly-frontend/
├── app/
│   ├── app.vue                 # root: scales the 393 x 852 screen to fit the window
│   ├── assets/css/main.css     # design tokens (colors, fonts) and global styles
│   ├── components/             # reusable UI pieces
│   │   ├── AppIcon.vue         # shared SVG icons
│   │   ├── Keypad.vue          # on-screen numeric keypad
│   │   ├── MpinDots.vue        # MPIN progress dots
│   │   ├── GreetingHeader.vue  # avatar, greeting, notifications bell
│   │   ├── BalanceCard.vue     # main balance with hide/show
│   │   ├── QuickActions.vue    # cash-in, cash-out, transfer, bank transfer
│   │   ├── OverviewCard.vue    # 30-day overview
│   │   ├── ActivityCard.vue    # recent activity and empty state
│   │   ├── SavedCard.vue       # total saved across pockets
│   │   ├── PocketCard.vue      # one pocket with progress
│   │   ├── CreatePocketCard.vue
│   │   └── BottomNav.vue       # four-tab bottom navigation
│   ├── middleware/auth.ts      # route guard
│   ├── pages/                  # file-based routes
│   │   ├── index.vue           # welcome screen
│   │   ├── login.vue
│   │   ├── home.vue
│   │   └── pockets/
│   │       ├── index.vue       # Goal Pockets list
│   │       └── new.vue         # Create pocket form
│   ├── stores/                 # Pinia stores
│   │   ├── auth.ts
│   │   ├── wallet.ts
│   │   └── pockets.ts
│   └── utils/format.ts         # peso and account number formatting
├── server/
│   ├── api/                    # mock API endpoints
│   └── utils/db.ts             # shared in-memory mock data
├── public/                     # logo and welcome screen images
├── docs/                       # architecture, API notes, screenshots
└── nuxt.config.ts
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the layers work together.

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Welcome screen, then continues to `/login` (or `/home` if already signed in) | Public |
| `/login` | Login form | Public |
| `/home` | Dashboard | Protected |
| `/pockets` | Goal Pockets list | Protected |
| `/pockets/new` | Create a pocket | Protected |

Protected routes use `middleware/auth.ts`, which redirects signed-out visitors to `/login`.

## State management

Pinia stores keep data that several pages share:

| Store | Holds | Used by |
|---|---|---|
| `auth` | The signed-in user and `isLoggedIn`; `login()` and `logout()` | Login page, route guard, greeting header |
| `wallet` | Account number, balance, daily cap, transactions, and the hide-balance switch | Home, Pockets |
| `pockets` | The pocket list, total saved, progress percent; `createPocket()` | Pockets list, Create pocket |

Local component state (`ref`) is used for form fields, the MPIN being typed, and validation messages. The session lives in memory only, so refreshing the page signs the user out (persistence is planned for the Final).

## Mock API

Nuxt server routes in `server/api` act as the backend. The frontend calls them with `$fetch` from inside the Pinia stores.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/login` | Sign in with mobile number and MPIN |
| GET | `/api/account` | Balance, daily cap and account number |
| GET | `/api/transactions` | Recent transactions, newest first |
| GET | `/api/pockets` | List of pockets |
| POST | `/api/pockets` | Create a pocket (with an optional opening deposit) |

Request and response examples are in [docs/API.md](docs/API.md).

## Design

- Designed in Figma at the iPhone 16 size (393 × 852 px): [open the file](https://www.figma.com/design/vQLVzKzR2cMHd8KeEBCYN5/ITE-18).
- The app is laid out on a fixed 393 × 852 canvas that scales down proportionally to fit any window, so each screen matches the design and never needs scrolling.
- Colors: deep navy `#0B153B`, brand navy `#153A6E`, mid blue `#2F5D8C`, mist background `#F2F5F8`, white cards.
- Typography: Poppins for text, Inter for money amounts.

## Accessibility

- Native buttons and links with visible keyboard focus rings
- Visible labels on form fields; accessible names on icon-only buttons
- Validation errors announced to screen readers (`aria-live` / `role="alert"`) and invalid fields marked with `aria-invalid`
- Text contrast checked against WCAG 2.1 AA for the main text and placeholder colors
- The MPIN is shown only as dots, and the login error does not reveal which field was wrong

## Testing

Testing so far is manual: screen-by-screen checks against the Figma frames, form validation, sign-in and route protection, and the iPhone 16 size in browser DevTools. Automated unit and UI tests (Vitest) are planned for the Final.

## Roadmap for the Final

1. Finish Goal Pockets: detail, allocate and withdraw.
2. Cash-in and cash-out with expiring codes and admin confirm/reject.
3. Transfer to a user and to a partner bank, with the daily cap warning and block.
4. Account creation flow, Insights, Settings and the optional spending cap.
5. Session persistence, full validation, Vitest tests and an accessibility pass.
6. Deploy online and finish the documentation.

## Team

- Lhyzl Jhyn T. Dooma
- Krischelle Ann M. Mernilo

ITE 18 – CSDELM2, instructor: Glaicel Araneta.

## Credits and licenses

| Resource | License |
|---|---|
| [Nuxt](https://nuxt.com), [Vue](https://vuejs.org), [Pinia](https://pinia.vuejs.org) | MIT |
| [Poppins](https://fontsource.org/fonts/poppins) and [Inter](https://fontsource.org/fonts/inter) fonts (`@fontsource`) | SIL Open Font License 1.1 |
| Icon shapes based on [Lucide](https://lucide.dev) (derived from [Feather](https://feathericons.com)) | ISC and MIT |
| Pocketly logo and interface designs | Original work of the team |

This project is released under the [MIT License](LICENSE).
