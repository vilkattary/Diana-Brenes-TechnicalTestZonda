
# BUG - Accessibility: Market select element is missing an accessible name

## Environment
- Site: NewHomeSource
- URL: https://www.newhomesource.com/state/washington/active-adult
- Environment: Live (Production)


---

## Steps to Reproduce

- Navigate to https://www.newhomesource.com/state/washington/active-adult
- Open browser developer tools.
- Inspect the Market filter select element.
- Locate the following HTML element: 
```html
<select data-param="MarketId" id="marketId" data-commit="true">
```

---

## Expected Result
The select element should have an accessible name so it can be correctly announced by screen readers.
This can be provided by at least one of the following:

- An explicit label element
- An implicit (wrapped) label
- An aria-label attribute
- An aria-labelledby attribute referencing a valid element
- A title attribute

---

## Actual Result
The select element does not have an implicit or explicit label, aria-label, aria-labelledby, or title attribute.
As a result, assistive technologies announce the control without context, making it unclear what the select is used for.

---

## Evidence
Verify evidence folder to find the evidence screenshot.

---

## Severity
High

---

## Suggested Fix:
Add an accessible name to the select element by associating it with a visible label or by adding a meaningful aria-label or aria-labelledby attribute.



