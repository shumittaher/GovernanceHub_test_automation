# GovernanceHub Backend Quick Reference

## API URL

API URL is `config.apiBaseUrl` from `utils/config`.

## Mounted Routes

```text
/api/auth
/api/incidents
/api/users
/api/superadmin
```

---

# Authentication

## Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Validation:

```text
email must be valid email format
password required
```

Success:

```http
200 OK
```

Returns:

```json
{
  "token": "jwt-token",
  "user": {}
}
```

Invalid payload:

```http
400 Bad Request
```

Returns:

```json
{
  "status": "error",
  "message": "Invalid login payload",
  "errors": []
}
```

Invalid credentials:

```http
401 Unauthorized
```

Returns:

```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

Server error:

```http
500 Internal Server Error
```

Returns:

```json
{
  "status": "error",
  "message": "Unable to process login"
}
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

Validation:

```text
id must be a positive integer
tenant must exist
```

Errors:

```http
400 Bad Request
404 Not Found
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
tenant must exist
```

Success:

```http
201 Created
```

Errors:

```http
400 Bad Request
404 Not Found
```

### Delete Admin

```http
DELETE /api/superadmin/admins/:id
```

Success:

```http
204 No Content
```

Validation:

```text
id must be a positive integer
admin must exist
```

Errors:

```http
400 Bad Request
404 Not Found
```

---

# Notes For Automation

* Use unique test data with `Date.now()`
* Clean up created entities
* Use storage state authentication for UI tests
* Use API tests to validate backend rules
* Prefer Page Objects for UI tests
* Do not hardcode JWT tokens
* Use `superAdminUser` from `test-data/users`
* Use `config.apiBaseUrl` for API requests
