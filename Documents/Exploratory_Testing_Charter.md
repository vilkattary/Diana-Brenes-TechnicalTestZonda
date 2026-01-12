
# Exploratory Testing Charter

## Goal

Explore the listing search and filter functionality to identify usability, **accessibility**, edge cases, and data inconsistencies not fully covered by scripted test cases.

---
## Areas to Explore

- Price filter behavior using slider vs manual input
- Interaction between multiple filters (price, bedrooms, bathrooms)
- Result refresh after applying filters

---
### Accessibility Exploration (Axe tool)

- Accessible names and labels for filter controls (inputs, selects, sliders, buttons)
- Semantic correctness of interactive elements (roles, landmarks, headings)
- Color contrast and visual feedback for selected filters and empty states

---
## Time-box

45 minutes

---
## Heuristics / Oracles

- Consistency: Results match selected filters
- Boundary values: Minimum and maximum price edges behave correctly
- Error prevention: Invalid inputs are handled gracefully
- Usability: Clear feedback after applying or clearing filters
- Accessibility: Controls are operable, perceivable, and understandable using keyboard and assistive technologies
- Data integrity: Prices and counts shown in UI are coherent
