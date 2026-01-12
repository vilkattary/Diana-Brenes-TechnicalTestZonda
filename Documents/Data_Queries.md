# Data Validation – Example SQL Queries

This document contains example SQL queries that could be used to validate
data correctness for the search and filter functionality.

> Note:  
> The following queries are based on an assumed simplified database schema, s the actual schema is not available. The goal is to demonstrate data validation reasoning rather than exact implementation.

---

## Assumed Simplified Schema


```sql
communities (
  community_id INT PRIMARY KEY,
  name VARCHAR,
  city VARCHAR,
  state VARCHAR,
  min_price INT,
  max_price INT,
  is_active BOOLEAN
);

listing (
  listing_id INT PRIMARY KEY,
  community_id INT,
  price INT,
  bedrooms INT,
  bathrooms DECIMAL,
  is_available BOOLEAN
);

search_results (
  search_id INT,
  listing_id INT
);

```
---

## SQL Queries

### Query 1 – Listingso on a specific city 
```sql
SELECT
  l.listing_id,
  c.name AS community_name,
  c.city,
  c.state,
  l.price,
  l.bedrooms,
  l.bathrooms
FROM communities c
JOIN listing l
  ON c.community_id = l.community_id
WHERE c.city = 'Washington'
  AND c.is_active = TRUE
  AND l.is_available = TRUE;

```

### Query 2 – Detect listings missing required fields
```sql
SELECT
  l.listing_id,
  c.name AS community_name,
  l.price,
  c.min_price,
  c.max_price
FROM communities c
JOIN listing l
  ON c.community_id = l.community_id
WHERE l.price < c.min_price
   OR l.price > c.max_price;

```
