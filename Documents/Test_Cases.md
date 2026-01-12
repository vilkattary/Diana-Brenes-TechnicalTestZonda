# Test Cases

This document describes the structured test cases for the Listing Search and Filters feature.


| ID    | Title                                              | Preconditions                 | Steps                                                       | Expected Result                                                      | Testing Methodology           |
| ----- | -------------------------------------------------- | ----------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- | -------------------- |
| TC-01 | Basic search returns results with mandatory fields | User is on the search page    | Perform a search for Washington                             | At least one result card is displayed with name, location, and price |  Automated (Smoke)  |
| TC-02 | Search page loads with default results             | User navigates to search page | Open the search page without applying filters               | Default results are displayed                                        | Manual               |
| TC-03 | Price filter – Min value only                      | Results are loaded            | Set Min price (e.g. 400,000), leave Max empty, apply filter | All results have prices ≥ Min                                        | Manual               |
| TC-04 | Price filter – Max value only                      | Results are loaded            | Set Max price (e.g. 700,000), leave Min empty, apply filter | All results have prices ≤ Max                                        | Manual               |
| TC-05 | Price filter – Min greater than Max                | Results are loaded            | Set Min price higher than Max price, apply filter           | Validation message shown or no results returned                      | Manual               |
| TC-06 | Bedrooms filter – minimum value                    | Results are loaded            | Apply 2+ bedrooms filter                                    | All results have at least 2 bedrooms                                 | Manual               |
| TC-07 | Bathrooms filter – minimum value                   | Results are loaded            | Apply 2+ bathrooms filter                                   | All results have at least 2 bathrooms                                | Manual               |
| TC-08 | Combined filters update results                    | Results are loaded            | Apply price range and bedrooms filter                       | Results update and reflect all applied filters                       | Automated (Filter) |
| TC-09 | Clear filters resets results                       | Filters are applied           | Clear all filters                                           | Results return to default state                                      | Manual               |
