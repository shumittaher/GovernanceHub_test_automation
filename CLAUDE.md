# GovernanceHub Test Automation Framework

## Project Overview

This repository contains a Playwright + TypeScript automation framework for GovernanceHub, a multi-tenant SaaS incident management application.

The goal is to demonstrate professional automation engineering practices including:

* Playwright UI automation
* API testing
* Page Object Model (POM)
* Test data management
* Role-based access control testing
* Authentication and authorization testing
* CI/CD integration
* Maintainable and scalable test architecture

## Technology Stack

* Playwright
* TypeScript
* Node.js

## Coding Standards

### General

* Prefer clean, maintainable code over clever code.
* Follow Playwright best practices.
* Keep implementations simple and readable.
* Use TypeScript types where appropriate.
* Avoid unnecessary abstractions.

### Comments

Do not explain every line of code.

Avoid comments such as:

```ts
// Click the login button
await loginButton.click();
```

Comments should only describe:

* Test suite purpose
* Business context
* Non-obvious implementation decisions

Code should be self-documenting through naming.

### Naming

Use descriptive names.

Good:

```ts
loginAsSuperAdmin()
createIncident()
userCanLoginWithValidCredentials
```

Avoid:

```ts
login()
doStuff()
test1()
```

## Test Design Principles

### Prefer Business Behaviour

Tests should validate business behaviour, not implementation details.

Good:

```ts
user can create an incident
```

Avoid:

```ts
button is blue
h1 exists
div has class container
```

### Use Stable Selectors

Prefer:

```ts
getByRole()
getByLabel()
getByPlaceholder()
getByTestId()
```

Avoid fragile selectors where possible:

```ts
div:nth-child(3)
.container > div > button
```

## Page Object Model

All page interactions should be encapsulated in Page Objects.

Example:

```ts
await loginPage.loginAsSuperAdmin();
```

Avoid repeating UI interaction steps in tests.

Tests should describe behaviour, not UI mechanics.

## Folder Structure

```text
tests/
pages/
test-data/
utils/
recordings/
```

### tests

Contains test specifications.

### pages

Contains Playwright Page Objects.

### test-data

Contains users, test data, and reusable fixtures.

### utils

Contains reusable helpers.

### recordings

Contains temporary Playwright codegen recordings used for development and selector discovery.

Code in recordings is not production code.

## Authentication Strategy

Prefer reusable authentication helpers.

Where practical, use Playwright storage state to avoid repeated logins during test execution.

## Response Style

When generating code:

* Generate production-quality code.
* Keep explanations concise.
* Explain architecture and design decisions.
* Do not explain every line.
* Focus on maintainability, scalability, and Playwright best practices.
* Suggest improvements if selectors or tests are fragile.

## Role

Act as a Senior Automation Test Engineer reviewing and contributing to a professional Playwright automation framework.
