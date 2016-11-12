# Auth API
## Create user

#### POST /api/users/

Parameters:

- account_currency(number): Currency id.

```
Body:
{
	"email": "asd@s.1com",
	"password": "123",
	"username": "stas11",
	"first_name": "as",
	"last_name": "asd",
	"account_currency": 2
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


# Account and Transfers

## Retrieve account

#### GET /api/account/me/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
Status 200
Body:
{
	“amount” : 12.3,
  "currency": {
    "id": 1,
    "name": "USD"
  }
}
```

## Create transfer

#### POST /api/transfers/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
Body:
{
	"amount": 1,
	"transfer_type": 1
}
```

Response:

```
Status 201
Body:
{
  "amount": 1,
  "transfer_date": "2016-11-07T10:38:47.228884Z",
  "transfer_type": 1
}
```

Transfer types:
1 - Put money into account.
2 - Take away money from account.


## Transfers list

#### GET /api/transfers/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
Status 200
Body:
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "amount": 12.3,
      "transfer_date": "2016-11-07T09:10:49.027614Z",
      "transfer_type": 1
    },
    {
      "amount": 12.3,
      "transfer_date": "2016-11-07T09:10:55.408926Z",
      "transfer_type": 1
    },
    {
      "amount": 12.3,
      "transfer_date": "2016-11-07T09:18:34.398063Z",
      "transfer_type": 2
    },
    {
      "amount": 12.3,
      "transfer_date": "2016-11-07T09:19:45.205276Z",
      "transfer_type": 1
    }
  ]
}
```

# Currencies and currency pairs info

## Currencies list

#### GET /api/currencies/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
Status 200
Body:
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "USD"
    },
    {
      "id": 2,
      "name": "EUR"
    },
    {
      "id": 3,
      "name": "BYN"
    },
    {
      "id": 4,
      "name": "RUB"
    }
  ]
}
```

## Currency pairs

### Currency pairs list

#### GET /api/currency_pairs/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "EUR/USD",
      "base_currency": {
        "id": 2,
        "name": "EUR"
      },
      "quoted_currency": {
        "id": 1,
        "name": "USD"
      },
      "last_value": {
        "bid": 1.08565,
        "ask": 1.08553,
        "spread": 0.00011999999999989797,
        "creation_time": "2016-11-12T16:51:37.877316Z"
      }
    }
  ]
}
```

### Retrieve currency pair info

#### GET /api/currency_pairs/1/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
{
  "id": 1,
  "name": "EUR/USD",
  "base_currency": {
    "id": 2,
    "name": "EUR"
  },
  "quoted_currency": {
    "id": 1,
    "name": "USD"
  },
  "last_value": {
    "bid": 1.08565,
    "ask": 1.08553,
    "spread": 0.00011999999999989797,
    "creation_time": "2016-11-12T16:51:37.877316Z"
  }
}
```


## Currency pair values

#### GET /api/currency_pair_values/?currency_pair={currency_pair_id}/

Parameters:

- currency_pair_id (number): Currency pair id.

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "bid": 1.08565,
      "ask": 1.08553,
      "spread": 0.00011999999999989797,
      "creation_time": "2016-11-12T16:51:37.877316Z"
    }
  ]
}
```
