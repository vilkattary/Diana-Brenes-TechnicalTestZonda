# Test Plan –  Technical Test (ZONDA)

## Project
**Washington 55+ New Homes! – Listing Search Feature**

---

## Objective
Test the functionality of the *Washington 55+ New Homes!* listing search to verify that users can find relevant listings correctly using the search field and available filters (price range, bedrooms, city), as well as validate the correct behavior of the **Load More** button.

---

## Features to Test
Listing search using the location **Washington** and the category **55+ New Homes**, including:

- Search input (keywords, city, location)
- Filters:
  - Price range
  - Bedrooms
  - Location
- Result list rendering
- **Load More** button functionality

---

## Scope

### In Scope
- Empty and complete field search
- Location: Washington
- Validation of a single filter functionality
- Validation of multiple filters applied together
- Results update after filter application
- Site behavior after clicking the **Load More** button
- Basic validation of result cards (price, location, bedrooms)
- Environment: Production
- Device: Desktop (Windows 10 Pro)

---

## Out of Scope
- Authentication / Login
- Locations other than Washington:
  - Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,
    Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky,
    Louisiana, Maine, Maryland, Massachusetts, Michigan, Mississippi, Missouri,
    Montana, Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York,
    North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania,
    Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont,
    Virginia, Minnesota, West Virginia, Wisconsin, Wyoming
- Favorites / Saved listings
- Other categories:
  - Condos and Townhomes
  - Gated Communities
  - Luxury Homes
- SEO and marketing analytics
- API testing
- Performance testing
- Media assets validation
- Cross-browser testing
- Mobile (Android / iOS) and tablet testing (responsiveness)
- Testing in other environments (QA, Stage)

---

## Test Strategy
- Functional testing
- Basic performance observations during functional testing

---

## Assumptions
- Listings displayed are valid for the **55+ New Homes** category in Washington
- The production environment may contain variable or changing data
- Network conditions and site stability may vary

---

## Risks
- Lack of synchronization when applying filters
- Filters returning inconsistent or delayed results
- Flaky behavior due to dynamic or changing listing data
- Automation instability due to production anti-bot protections


---

## High-Level Test Types
- Manual Testing
    - Functional validation of search and filters
    - Exploratory testing focused on edge cases and unexpected behavior

- Automation Candidates (Automation implemented using Playwright (TypeScript))
  - Smoke test:
    - Basic search flow and validation of at least one listing card
  - Filter test:
    - Apply price range and bedrooms filter
    - Validate results change accordingly

- Data Validation
  - Validate that listing prices fall within selected price range
  - Validate mandatory fields (price, bedrooms, location) are present
  - Use mock assumptions where data is unpredictable

- Non-Functional (Brief)
  - Basic usability observations
  -  High-level accessibility checks during exploratory testing


---

## Environment & Test Data Approach
- Environment
  - Production (Live)
  - Desktop browser
  - Real production data

- Test Data
  - No predefined test data
  - Tests rely on existing live listings
  - Automation assertions are designed to be flexible to handle variable data


---

## Prioritization

- High Priority
  - Search functionality
  - Filter application and results update
  - Presence of mandatory listing data

- Medium Priority
  - Load More button behavior
  - Combination of multiple filters

- Low Priority
  - Minor UI inconsistencies
  - Non-blocking usability issues

---

## Timeline

- Day 1 (2 hours):
  - Requirements analysis
  - Test plan and test cases preparation

- Day 2 (6 hour):
  - Exploratory testing execution
  - Automation script execution

---

## Deliverables

- Test Plan
- Test Cases
- Automation scripts (Playwright)
- Test execution results
- Sample defect report

---

## Success Criteria

- All high-priority test cases executed
- No critical defects found
- Automation scripts execute successfully without blocking failures