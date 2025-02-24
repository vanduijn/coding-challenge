# Currency Conversion API

This is a simple currency conversion API built with Node.js, Express, and the [Fixer.io](https://fixer.io)  API. It provides endpoints to retrieve exchange rates and convert currency amounts.

## Features

- Retrieve exchange rates for a given base currency.
- Convert an amount from one currency to another.
- Caching of exchange rates to reduce API calls.

## Prerequisites

- Node.js (v22 or higher)
- npm (v10 or higher)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/vanduijn/coding-challenge.git
    ```

2. Navigate to the [server](../server/) folder:

    ```sh
    cd ./server
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

4. Create a `.env` file in the [server](../server/) folder and add your Fixer.io API key:

    ```plaintext
    FIXER_API_KEY=your_fixer_api_key
    PORT=3000
    ```

## Running the Server

To start the server, run:

```sh
npm start
```

## Service Endpoints

### Retrieve Exchange Rates

**Endpoint:** `GET /api/rates/:base`

**Description:** Retrieves exchange rates for a given base currency.

**Example Request:**

```sh
curl -X GET "http://localhost:3000/api/rates/USD"
```

### Convert Currency

**Endpoint:** `GET /api/convert`

**Description:** Converts an amount from one currency to another.

**Example Request:**

```sh
curl -X GET "http://localhost:3000/api/convert?from=USD&to=EUR&amount=100"
```