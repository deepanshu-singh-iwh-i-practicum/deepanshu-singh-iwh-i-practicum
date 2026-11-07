# HubSpot Integrating With HubSpot I: Foundations Practicum

A Node.js + Express application that reads and creates HubSpot custom object records.

## Features

- Express routes: `GET /`, `GET /update-cobj`, and `POST /update-cobj`
- Pug homepage table and record-creation form
- HubSpot CRM API integration using Axios
- Custom object: Digital Marketing Campaigns
- Properties: `Name` (string), `Platform` (string), and `Budget` (number)
- Custom object schema configured to associate with Contacts
- Environment variables keep the private app token out of source control

## 1. Prerequisites

Install Node.js (LTS) and Git. Use VS Code or another code editor.

## 2. Create your HubSpot developer test account and private app

In your HubSpot developer test account, create a private app named:

`Deepanshu's Practicum Private App`

Give it these scopes:
- `crm.schemas.custom` — read and write
- `crm.objects.custom` — read and write
- `crm.objects.contacts` — read and write

Copy the access token. Do not paste it into code or commit it to GitHub.

## 3. Configure the project

Open this folder in VS Code. In the terminal, run:

```bash
npm install
```

Copy `.env.example` to a new file named `.env` and paste your private app token into `HUBSPOT_ACCESS_TOKEN`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## 4. Create the custom object and sample records

Run:

```bash
npm run setup-hubspot
```

The setup script creates the Digital Marketing Campaigns custom object, its three properties, and three sample records. It prints the object type identifier. Copy the printed `HUBSPOT_OBJECT_TYPE=...` line into `.env`.

If HubSpot says the schema name already exists, do not repeatedly run the setup script. Check the custom object in HubSpot and use its existing object type identifier.

## 5. Run the app

```bash
npm start
```

Open `http://localhost:3000`.

Use **Add to this table** to create another campaign. The homepage retrieves the records from HubSpot.

## 6. Add the custom object list link

In HubSpot, open the custom object's list view. Copy its URL. Add it below, replacing the placeholders:

`https://app.hubspot.com/contacts/ACCOUNT_ID/objects/OBJECT_TYPE_ID/views/all/list`

## 7. GitHub workflow

First, fork the official starter repository:
https://github.com/HubSpot-Academy/integrating-with-hubspot-i-foundations-practicum

Rename your fork to:

`deepanshu-singh-iwh-i-practicum`

Clone **your fork**, not the Academy source repository. Copy these project files into that cloned repository, preserving the starter repository's required files if needed.

Then run:

```bash
git checkout main
git pull origin main
git branch working-branch
git checkout working-branch
git add .
git commit -m "First commit to my Integrating With HubSpot I: Foundations practicum repository."
```

Make additional meaningful commits as you build and test, for example:

```bash
git add .
git commit -m "Add HubSpot custom object setup"
git add .
git commit -m "Build campaign listing and creation routes"
git add .
git commit -m "Style practicum pages and update documentation"
```

Push the branch:

```bash
git push -u origin working-branch
```

On GitHub, create and merge a pull request from `working-branch` into `main`. Confirm the final repository is public and that the merged work is visible on `main`.

## 8. Before submitting

- Confirm `.env` is not in GitHub. Never publish your private app token.
- Confirm the README contains your real HubSpot custom object list-view link.
- Confirm there are at least three custom object records.
- Test all three routes locally.
- Confirm both Pug templates are present.
- Submit the public URL of your forked repository, not a preview or editor URL.

## Important

This folder is a project starter, not a completed HubSpot account setup or GitHub submission. You must create the test account/private app, supply your token locally, fork the Academy repository under your GitHub account, verify the generated custom object in your account, and submit your own public repository URL. HubSpot manually grades the work and requires your own meaningful commit history.
