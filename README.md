- Owner Service Entities
  - Profiles (Create, Read, Update, Delete)
- Product Service Entities
  - Products (Create, Read, Update, Delete)
  - Owners (Create, Read, Update, Delete)
- Order Service
  - Orders (Create, Read, Update, Delete)
  - Products (Create, Read, Update, Delete)
  - OrderItems (Create, Read, Update, Delete)

# Flow

- All services open up and rest, http and grpc communication.
- The http endpoints are front-facing, while the grpc endpoints are for inter-service communication.
- The owner service emits 'owner.updated', 'owner.deleted' events
- The product service listens to 'owner.updated', 'owner.deleted' events
- The product service emits 'product.updated', 'product.deleted' events
- The order service listens to 'product.updated', 'product.deleted' events
