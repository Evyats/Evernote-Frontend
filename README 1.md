# Evernote Frontend Service

A frontend for a simple Evernote-style notes app. Works with the backend service: https://github.com/Evyats/Evernote-Backend

## Projects

- `empty-react-tailwind-project`: Empty React + Vite + Tailwind template.
- `react-tailwind`: First version of the app frontend (Tailwind-based).
- `react-material-kit`: Second version, built on top of the Material Kit React (Minimal UI) template from https://github.com/minimal-ui-kit/material-kit-react and implemented using the Codex AI agent.

## Running Locally

### react-tailwind

```
cd react-tailwind
npm install
npm run dev
```

Set the environment variable `VITE_API_BASE_URL` to point at the backend, for example:

```
VITE_API_BASE_URL=http://localhost:8123
```

### react-material-kit

```
cd react-material-kit
npm install
npm run dev
```

Set the environment variable `VITE_API_BASE_URL_1` to point at the backend, for example:

```
VITE_API_BASE_URL_1=http://localhost:8123
```

## Deploying

### react-tailwind

- Set the root folder to `react-tailwind`.
- Configure environment variable `VITE_API_BASE_URL`.

### react-material-kit

- Set the root folder to `react-material-kit`.
- Configure environment variable `VITE_API_BASE_URL_1`.

## Screenshots

### react-tailwind

<table>
  <tr>
    <td><a href="screenshots/react-tailwind/1.png"><img src="screenshots/react-tailwind/1.png" width="260" alt="react-tailwind 1" /></a></td>
    <td><a href="screenshots/react-tailwind/2.png"><img src="screenshots/react-tailwind/2.png" width="260" alt="react-tailwind 2" /></a></td>
    <td><a href="screenshots/react-tailwind/3.png"><img src="screenshots/react-tailwind/3.png" width="260" alt="react-tailwind 3" /></a></td>
  </tr>
  <tr>
    <td><a href="screenshots/react-tailwind/4.png"><img src="screenshots/react-tailwind/4.png" width="260" alt="react-tailwind 4" /></a></td>
    <td><a href="screenshots/react-tailwind/5.png"><img src="screenshots/react-tailwind/5.png" width="260" alt="react-tailwind 5" /></a></td>
    <td><a href="screenshots/react-tailwind/6.png"><img src="screenshots/react-tailwind/6.png" width="260" alt="react-tailwind 6" /></a></td>
  </tr>
</table>

### react-material-kit

<table>
  <tr>
    <td><a href="screenshots/react-material-kit/1.png"><img src="screenshots/react-material-kit/1.png" width="260" alt="react-material-kit 1" /></a></td>
    <td><a href="screenshots/react-material-kit/2.png"><img src="screenshots/react-material-kit/2.png" width="260" alt="react-material-kit 2" /></a></td>
    <td><a href="screenshots/react-material-kit/3.png"><img src="screenshots/react-material-kit/3.png" width="260" alt="react-material-kit 3" /></a></td>
  </tr>
  <tr>
    <td><a href="screenshots/react-material-kit/4.png"><img src="screenshots/react-material-kit/4.png" width="260" alt="react-material-kit 4" /></a></td>
    <td><a href="screenshots/react-material-kit/5.png"><img src="screenshots/react-material-kit/5.png" width="260" alt="react-material-kit 5" /></a></td>
    <td><a href="screenshots/react-material-kit/6.png"><img src="screenshots/react-material-kit/6.png" width="260" alt="react-material-kit 6" /></a></td>
  </tr>
  <tr>
    <td><a href="screenshots/react-material-kit/7.png"><img src="screenshots/react-material-kit/7.png" width="260" alt="react-material-kit 7" /></a></td>
    <td><a href="screenshots/react-material-kit/8.png"><img src="screenshots/react-material-kit/8.png" width="260" alt="react-material-kit 8" /></a></td>
    <td></td>
  </tr>
</table>
