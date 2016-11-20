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
    "second_name": "sa",
    "last_name": "asd",
    "birth_date": "1212-12-12",
    "answer_secret_question": "some answer",
    "account_currency": 2
}
```

Response:

```
Status 201
Body:{
  "id": 2,
  "email": "asd@s.1com",
  "username": "stas11",
  "first_name": "as",
  "second_name": "sa",
  "last_name": "asd",
  "birth_date": "1212-12-12",
  "answer_secret_question": "some answer"
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
  "id": 1,
  "email": "admin@admin.com",
  "username": "admin",
  "first_name": "stas111",
  "second_name": "ass",
  "last_name": "so",
  "birth_date": "1222-12-12",
  "answer_secret_question": "some quest"
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
        "creation_time": "2016-11-12T16:51:37.877316Z",
        "currency_pair": 2
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
    "creation_time": "2016-11-12T16:51:37.877316Z",
    "currency_pair": 2
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
      "creation_time": "2016-11-12T16:51:37.877316Z",
      "currency_pair": 1
    }
  ]
}
```
# Order

## Create order

### POST /api/orders/

Parameters:
- currenct_pair_id (number): Currency pair id.
- type (number): 1 - Long order, 2 - Short order.

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
Body:
{
	"currency_pair_id": 1,
	"type": 1,
	"initial_amount": 100
}
```

Response:

```
Status: 201
Body:
{
  "id": 10,
  "user": {
    "id": 1,
    "email": "admin@admin.com",
    "username": "admin",
    "first_name": "",
    "last_name": ""
  },
  "currency_pair": {
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
      "bid": 1.4317038319441,
      "ask": 1.44609281517972,
      "spread": -0.0143889832356201,
      "creation_time": "2016-11-15T13:50:16.184274Z",
      "currency_pair": 2
    }
  },
  "status": 1,
  "type": 1,
  "start_time": "2016-11-16T09:07:32.432107Z",
  "start_value": {
    "bid": 1.4317038319441,
    "ask": 1.44609281517972,
    "spread": -0.0143889832356201,
    "creation_time": "2016-11-15T13:50:16.184274Z",
    "currency_pair": 1
  },
  "end_time": null,
  "end_value": null,
  "amount": 69.1518545354034
}
```

## Close order

### POST /api/orders/1/close/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
Status: 200
Body:
{
  "id": 1,
  "user": {
    "id": 1,
    "email": "admin@admin.com",
    "username": "admin",
    "first_name": "",
    "last_name": ""
  },
  "currency_pair": {
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
      "bid": 1.4317038319441,
      "ask": 1.44609281517972,
      "spread": -0.0143889832356201,
      "creation_time": "2016-11-15T13:50:16.184274Z",
      "currency_pair": 2
    }
  },
  "status": 2,
  "type": 1,
  "start_time": "2016-11-16T08:54:19.276055Z",
  "start_value": {
    "bid": 1.4317038319441,
    "ask": 1.44609281517972,
    "spread": -0.0143889832356201,
    "creation_time": "2016-11-15T13:50:16.184274Z",
    "currency_pair": 2
  },
  "end_time": "2016-11-16T09:02:01.678146Z",
  "end_value": {
    "bid": 1.4317038319441,
    "ask": 1.44609281517972,
    "spread": -0.0143889832356201,
    "creation_time": "2016-11-15T13:50:16.184274Z",
    "currency_pair": 2
  },
  "amount": 69.1518545354034
}
```

## Orders list

### GET /api/orders/

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
Body:
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "email": "admin@admin.com",
        "username": "admin",
        "first_name": "",
        "last_name": ""
      },
      "currency_pair": {
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
          "bid": 1.4317038319441,
          "ask": 1.44609281517972,
          "spread": -0.0143889832356201,
          "creation_time": "2016-11-15T13:50:16.184274Z",
          "currency_pair": 2
        }
      },
      "status": 2,
      "type": 1,
      "start_time": "2016-11-13T14:20:45.371189Z",
      "start_value": {
        "bid": 1.05,
        "ask": 1.0885,
        "spread": -0.03849999999999998,
        "creation_time": "2016-11-13T14:18:05.925312Z",
        "currency_pair": 2
      },
      "end_time": "2016-11-13T14:35:47.970464Z",
      "end_value": {
        "bid": 1.05,
        "ask": 1.0885,
        "spread": -0.03849999999999998,
        "creation_time": "2016-11-13T14:18:05.925312Z",
        "currency_pair": 2
      },
      "amount": 91.869545245751
    }
  ]
}
```

## Filtered orders list

### GET /api/orders/?status=1

```
Headers:
Authorization: ”Token 50ded0eaddc3e2005d31fcb3a0fcd50339242537”
```

Response:

```
Body:
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 10,
      "user": {
        "id": 1,
        "email": "admin@admin.com",
        "username": "admin",
        "first_name": "",
        "last_name": ""
      },
      "currency_pair": {
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
          "bid": 1.4317038319441,
          "ask": 1.44609281517972,
          "spread": -0.0143889832356201,
          "creation_time": "2016-11-15T13:50:16.184274Z",
          "currency_pair": 2
        }
      },
      "status": 1,
      "type": 1,
      "start_time": "2016-11-16T09:07:32.432107Z",
      "start_value": {
        "bid": 1.4317038319441,
        "ask": 1.44609281517972,
        "spread": -0.0143889832356201,
        "creation_time": "2016-11-15T13:50:16.184274Z",
        "currency_pair": 2
      },
      "end_time": null,
      "end_value": null,
      "amount": 69.1518545354034
    }
  ]
}
```


# Currencies delivery through websockets

[Example.](https://github.com/dealing-center-tofi/dealing-center-backend/blob/master/currencies_delivery/websockets_test/index.js)

## Server events

### authorize

```
Body: {'token': 'A123asdefcasdtoken123'}
```

### subscribe
Subscribe for currencies delivery.

### unsubscribe
Unsubscribe from currencies delivery.

## Client events

### authorized
Send after successful `authorize` event.

### new values
New currency pair values.

```
Body: 
[
  {
    "bid": 1.4317038319441,
    "ask": 1.44609281517972,
    "spread": 0.0143889832356201,
    "creation_time": "2016-11-15T13:50:16.184274Z",
    "currency_pair": 2
  },
  {
    "bid": 1.4317038319441,
    "ask": 1.44609281517972,
    "spread": 0.043889832356201,
    "creation_time": "2016-11-15T13:50:16.184274Z",
    "currency_pair": 1
  }
]
```
