# GovernanceHub Backend Quick Reference

## API URL

API URL is config.apiBaseUrl from utils/config

## Mounted Routes

```text
/api/auth
/api/incidents
/api/users
/api/superadmin
```

---

# Super Admin

All routes require:

```text
authMiddleware
requireSuperadmin
```

## Tenants

### List Tenants

```http
GET /api/superadmin/tenants
```

Returns:

```json
{
  "tenants": []
}
```

### Create Tenant

```http
POST /api/superadmin/tenants
```

Request:

```json
{
  "name": "Test Tenant"
}
```

Validation:

```text
name required
```

Success:

```http
201 Created
```

### Delete Tenant

```http
DELETE /api/superadmin/tenants/:id
```

Success:

```http
204 No Content
```

---

## Tenant Admins

### List Admins

```http
GET /api/superadmin/admins
```

Returns:

```json
{
  "admins": []
}
```

### Create Admin

```http
POST /api/superadmin/admins
```

Request:

```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "AdminPass123!",
  "tenant_id": 1
}
```

Validation:

```text
name required
email valid
password minimum 8 chars
tenant_id positive integer
```

Success:

```http
201 Created
```

### Delete Admin

```http
DELETE /api/superadmin/admins/:id
```

Success:

```http
204 No Content
```

---

# Notes For Automation

* Use unique test data with Date.now()
* Clean up created entities
* Use storage state authentication for UI tests
* Use API tests to validate backend rules
* Prefer Page Objects for UI tests
