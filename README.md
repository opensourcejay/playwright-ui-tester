# 🧪 Playwright-UI-Tester

A Playwright-powered UI testing and reporting framework that simulates 100+ concurrent users interacting with a Google-style mock UI. It verifies core UI functionality, injects random failures, and generates a clean, modern HTML report with logs, timestamps, and interactive graphs.

---

## 📌 What It Does

- Simulates **100+ headless browser sessions** in parallel using Playwright
- Tests a **Google like UI** with:
  - Search box
  - Checkbox
  - Dropdown menu
  - Help modal
- **Injects random errors** for failure testing
- Logs detailed steps and outcomes per user
- Outputs a modern **HTML report** with:
  - ✅ Pass/Fail breakdown (pie chart)
  - ⏱ Duration per user (bar chart)
  - 📋 Detailed table with per-user actions, errors, timestamps

---

## 🧪 What It Tests

Each simulated user performs the following:

1. **Visits** the local test UI  
   `http://localhost:8080/test-page.html`

2. **Fills out the search box** with `"Artificial Intelligence"`

3. **Clicks the Search button** and verifies the results panel appears

4. **Checks** a Terms & Conditions checkbox

5. **Selects a topic** from the dropdown

6. **Clicks Help** to open a modal window

7. **(Optional)** Triggers one of several intentional random errors:
   - Wrong selector
   - Skipped action
   - Invalid dropdown option
   - Skipped modal verification

---

## 📁 Project Structure

```bash
.
├── runTest.js          # Main test runner (parallel orchestration)
├── userFlow.js         # Single-user simulation logic
├── test-page.html      # Mock Google-style test UI
├── report.html         # Auto-generated HTML report (after test run)
├── package.json
```

## 🛠 Setup & Installation
1. Clone the repo
```
git clone https://github.com/opensourcejay/playwright-ui-tester.git
cd playwright-ui-tester
```
2. Install dependencies
```
npm install
```
This installs:

playwright for browser automation

http-server for hosting the test UI

Also install browser binaries for Playwright:

```
npx playwright install
```
🌐 Start the Test UI
Start the local HTTP server:

```
npm run serve
```
Visit in your browser:

```
http://localhost:8080/test-page.html
```
This page mimics Google’s layout and elements but is 100% local.

🚀 Run the Test Suite
In a second terminal:

```
node runTest.js
```
This will:

- Launch 100 parallel user sessions
- Simulate full browser interactions
- Inject random failures
- Log all user actions

Generate report.html in the root directory

📊 View the Report
After the test completes:

```
open report.html   # macOS
start report.html  # Windows
```

Or just double-click report.html.

The report includes:

- Pie chart: Success vs Fail
- Bar chart: Duration per user
- Detailed per-user logs with:
- Action steps
- Error messages (if any)
- Duration (ms)
- Timestamp

