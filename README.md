# Tecnical Test Zonda
This repository contains a QA technical exercise focused on validating the Listing Search feature of a real estate platform.
The goal of this exercise is to demonstrate test design, automation style, data reasoning, and communication, within a limited time frame.
The selected site for this exercise is NewHomeSource, focusing on search results and filters such as price range and bedrooms.

---

## Scope
Feature under test: Listing Search

Included:

- Search results page
- Filters (price range, bedrooms)
- Result updates after applying filters
- Basic accessibility considerations
- Data validation examples using SQL

---

## Out of scope:

- User authentication
- Payment flows
- Backend implementation details
- Cross-browser compatibility beyond basic Playwright coverage

---

## Repository Structure

- README
- tests
    - pages (objects)
    - specs
    - playwright.config.ts
- documents
   - Test_Plan
   - Exploratory_Testing_Charter
   - Sample_Defect_Report
   - Improvement_Suggestions
   - SQL_Queries

---

## Test Documentation
All supporting QA documentation is available in the /documents folder:
   - Test_Plan: Test strategy, scope, risks, prioritization, and test types
   - Exploratory_Testing_Charter: Exploratory testing approach including accessibility focus
   - Sample_Defect_Report: Example accessibility defect identified during exploration
   - Improvement_Suggestions: Recommendations to strengthen quality via tooling, process, and monitoring
   - SQL_Queries.md: Example data validation queries based on an assumed schema


---

## How to Run the Tests
### Prerequisites
To run or review this project, the following tools are required:
- Visual Studio Code: Used as the primary IDE for test development and execution.
- GitHub account: Used to clone the repository and review the submission.
- Node.js (v18 or later recommended): Installed using the official Node.js installer. Required to install dependencies and run Playwright tests.
- Playwright VS Code Extension: Playwright is installed and managed via the Visual Studio Code extension, without manual installation through the terminal.

### Steps:

- Open Visual Studio Code
- Go to the Extensions panel
- Search for “Playwright Test for VS Code”
- Install the extension
- Follow the extension prompts to install Playwright dependencies if required

### Run Commands
- npx playwright test: to run all test
- npx playwright test tests/specs/yourtest.spec.ts: Run a specific test file
- npx playwright test --project=chromium/firefox/webkit: Run tests in a specific browser
- npx playwright show-report: To open report

---

## Author

Diana Brenes Muñoz – Technical Exercise Submission
