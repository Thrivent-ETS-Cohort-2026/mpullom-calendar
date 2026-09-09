# CalendArrr

CalendArrr is a pirate themed event management app that supports the following features:

### Account Management
- Sign up with email, password, and name
- Log in / log out of an account
- Edit profile details: name, email, password

### Event Management
- Create events with title, description, date/time, and location
- Edit events you’ve created
- Delete events you’ve created
- View event details

### Invitations & RSVPs
- Invite one or more registered users to an event
- Accept or decline event invitations
- See list of attendees and their RSVP status

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.


## 🚀 Running the Project

Follow these steps to run both the frontend interface and the mock backend server locally.

### 1. Start the Backend (`json-server`)

The application relies on `json-server` to mock REST endpoints and handle event/user data persistence.

```bash
# Start the mock backend on port 3002
npm run json-server
```

> **Note:** Ensure `json-server` remains running in this terminal session.

---

### 2. Start the Frontend (Vite + React)

Open a **new terminal tab or window** and launch the development server:

```bash
# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

Once started, open your browser and navigate to `http://localhost:5173`.
