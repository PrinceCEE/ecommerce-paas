import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { OrderRepository, ProductRepository } from '../repositories';
import { CreateOrderDto, UpdateOrderDto } from '../dtos';
import { GrpcNames, GrpcServiceNames, ProductService } from '@libs/shared';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiResponse, OrderResponse, ProductResponse } from '../types';
import { firstValueFrom } from 'rxjs';
import { getTotalAmount } from '../utils';
import { CacheService } from './cache.service';

@Injectable()
export class OrderService implements OnModuleInit {
  private productService: ProductService;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly cacheService: CacheService,

    @Inject(GrpcNames.PRODUCT)
    private readonly productServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService = this.productServiceClient.getService<ProductService>(
      GrpcServiceNames.PRODUCT,
    );
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<ApiResponse<{ order: OrderResponse }>> {
    const { items } = createOrderDto;

    const productsResponse: ProductResponse[] = await firstValueFrom(
      this.productService.GetProducts({ ids: items.map((i) => i.productId) }),
    ).then((res) => res.products);

    await this.productRepository.updateMany(productsResponse);

    const totalAmount = getTotalAmount(productsResponse);
    createOrderDto.totalAmount = totalAmount;
    createOrderDto.items.forEach((i) => {
      const product = productsResponse.find((p) => p.id === i.productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      i.unitPrice = product.price;
    });

    const order = await this.orderRepository.create(createOrderDto);
    return {
      message: 'Order created',
      data: { order },
    };
  }

  async updateOrderDto(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<ApiResponse<{ order: OrderResponse }>> {
    const orderExists = await this.orderRepository.findOne(orderId);
    if (!orderExists) {
      throw new NotFoundException('Order not found');
    }

    if (updateOrderDto.items?.length) {
      const productsResponse: ProductResponse[] = await firstValueFrom(
        this.productService.GetProducts({
          ids: updateOrderDto.items.map((i) => i.productId),
        }),
      ).then((res) => res.products);

      if (!productsResponse) {
        throw new NotFoundException('Products not found');
      }

      updateOrderDto.totalAmount = getTotalAmount(productsResponse);
      updateOrderDto.items.forEach((i) => {
        const product = productsResponse.find((p) => p.id === i.productId);
        if (!product) {
          throw new NotFoundException('Product not found');
        }

        i.unitPrice = product.price;
      });
      await this.productRepository.updateMany(productsResponse);
    }

    const order = await this.orderRepository.update(orderId, updateOrderDto);
    return {
      message: 'Order updated',
      data: { order },
    };
  }

  async findOrder(
    orderId: string,
  ): Promise<ApiResponse<{ order: OrderResponse }>> {
    let order = await this.cacheService.get(orderId);

    if (!order) {
      order = await this.orderRepository.findOne(orderId);
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      this.cacheService.set(orderId, order);
    }

    return {
      message: 'Order fetched',
      data: { order },
    };
  }

  async findOrders(): Promise<ApiResponse<{ orders: OrderResponse[] }>> {
    const orders = await this.orderRepository.findAll();
    return {
      message: 'Orders fetched',
      data: { orders },
    };
  }
}
