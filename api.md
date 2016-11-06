# Auth API
## Create user

#### POST /api/users/

```
Body:
{
	"email": "asd@s.1com",
	"password": "123",
	"username": "stas11",
	"first_name": "as",
	"last_name": "asd"
}
```

Response:

```
Status 201
Body:
{
  "id": 4,
  "email": "asd@s.11com",
  "username": "stas111",
  "first_name": "as",
  "last_name": "asd"
}
Headers:
Token: “50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

## Retrieve user info

#### GET /api/users/me/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
Status 200
Body:
{
  "id": 4,
  "email": "asd@s.11com",
  "username": "stas111",
  "first_name": "as",
  "last_name": "asd"
}
```

## Login

#### POST /api/auth/login/

```
Body:
{
	"email": "asd@s.1com",
	"password": "123"
}
```

Response:
```
Status 201
Body:
{
  "id": 4,
  "email": "asd@s.11com",
  "username": "stas111",
  "first_name": "as",
  "last_name": "asd"
}
Headers:
Token: “50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

## Logout

#### DELETE /api/auth/logout/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response 
```
Status 204
```

