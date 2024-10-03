import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from '../services';
import { CreateOrderDto, UpdateOrderDto } from '../dtos';
import { ParseMongoDBID } from '@libs/shared';

@Controller('orders')
export class OrdersHttpController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const data = await this.orderService.createOrder(createOrderDto);
    return data;
  }

  @Put(':id')
  async updateOrder(
    @Param('id', ParseMongoDBID) orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const data = await this.orderService.updateOrderDto(
      orderId,
      updateOrderDto,
    );
    return data;
  }

  @Get(':id')
  async getOrder(@Param('id', ParseMongoDBID) orderId: string) {
    const data = await this.orderService.findOrder(orderId);
    return data;
  }

  @Get()
  async getOrders() {
    const data = await this.orderService.findOrders();
    return data;
  }
}
