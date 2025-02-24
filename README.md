# Coding Challenge Project

This project contains a Currency Conversion API and a web client for interacting with the API.

## Prerequisites

- Node.js (v22 or higher)
- npm (v10 or higher)

## Project Structure

- `server/`: Contains the Currency Conversion API built with Node.js and Express.
- `web/`: Contains the web client built with Lit.

## Setup Instructions

### Server Setup

1. Navigate to the `server` folder:

    ```sh
    cd ./server
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the `server` folder and add your Fixer.io API key:

    ```plaintext
    FIXER_API_KEY=your_fixer_api_key
    PORT=3000
    ```

4. Start the server:

    ```sh
    npm start
    ```

### Web Client Setup

1. Navigate to the `web` folder:

    ```sh
    cd ./web
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Start the web client:

    ```sh
    npm start
    ```

## Running the Project

1. Start the server as described in the Server Setup section.
2. Start the web client as described in the Web Client Setup section.

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
