## Ecommerce-PAAS

First, clone the repository by running: git clone [https://github.com/PrinceCEE/ecommerce-paas.git](https://github.com/PrinceCEE/ecommerce-paas.git)

To run the apps, make sure to have docker(and docker compose) installed and running.
The commands to run:

- docker compose build (This builds the services)
- docker compose up (This runs the services)

The hosted postman documentation can be found here [documentation](https://convre.postman.co/workspace/Ecommerce-PAAS~812c70e9-c513-4a0b-b132-2440727b98d6/collection/6886089-c0440cbb-48ea-4e62-8da8-a886af193432?action=share&creator=6886089&active-environment=6886089-066a2b00-2091-4c5a-8ff5-be4d02cb0ee6)

Each of the services exposes a couple of http endpoints:

### Owner Service (localhost:3000/owners):

- Create Owner (POST localhost:3000/owners)
  - firstName
  - lastName
  - email
  - address
  - password
- Login Owner (POST localhost:3000/owners/login)
  - email
  - password
- Get Owner (GET localhost:3000/owners/:ownerId)
- Get Owners (GET localhost:3000/owners)

### Product Service (localhost:3001/products):

- Create Product (POST localhost:3001/products)
  - ownerId
  - name
  - price (number string)
  - description
  - sku
- Update Product (POST localhost:3001/products/:productId)
  - name
  - price (number string)
  - description
  - sku
- Get Product (GET localhost:3001/products/:productId)
- Get Products (GET localhost:3001/products)

### Order Service (localhost:3002/orders):

- Create Order (POST localhost:3002/orders)
  - buyerInfo
    - name
    - email
    - deliveryAddress
  - instructions
  - items (array)
    - productId
    - quantity
- Update Order (POST localhost:3002/orders/:orderId)
  - buyerInfo
    - name
    - email
    - deliveryAddress
  - instructions
  - items (array)
    - productId
    - quantity
- Get Order (GET localhost:3002/orders/:orderId)
- Get Orders (GET localhost:3002/orders)
