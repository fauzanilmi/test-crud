# CRUD API NestJS

This CRUD API is built with NestJS, TypeORM, and Docker. It includes functionality for managing products, categories, shopping carts, and checkout processes.

## Features

- **Product Management**: Create, read, update, and delete products.
- **Category Management**: Manage product categories.
- **Shopping Cart**: Add products to a cart, view the cart, delete cart, delete item, and checkout.

## Technologies Used

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **UUID**
- **Docker**

## Installation

### Prerequisites

- Docker and Docker Compose

### Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/fauzanilmi/test-crud.git
    cd test-crud
    ```

2. **Build and Run the Application with Docker**:
    ```bash
    docker-compose up --build --watch
    ```


3. **API is now available at** `http://localhost:3000`.

### Docker Configuration

The application is configured to run with Docker using a `Dockerfile` and `docker-compose.yml`. 
