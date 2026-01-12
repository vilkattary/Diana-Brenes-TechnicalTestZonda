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

---

## Risks
- Lack of synchronization when applying filters
- Duplicate listings appearing in the results

---

## Timeline
- **Day 1 (2 hours):**
  - Requirement analysis
  - Test plan and test cases preparation
- **Day 2 (3 hours):**
  - Functional testing execution

---

## Deliverables
- Test cases
- Test execution reports

---

## Success Criteria
- 100% pass rate on high-priority test cases
- Zero critical defects

---

## Environment
- Production-like test environment

---

## Documentation
- Test Plan
- Compliance and testing documentation
