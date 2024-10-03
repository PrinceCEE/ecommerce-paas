import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { OwnerRepository, ProductRepository } from '../repositories';
import { CreateProductDto, GetProductsDto, UpdateProductDto } from '../dtos';
import {
  EventNames,
  GrpcNames,
  GrpcServiceNames,
  OwnerService,
  RabbitMQNames,
} from '@libs/shared';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiResponse, OwnerResponse, ProductResponse } from '../types';
import { mapToProductEventResponse, mapToProductResponse } from '../utils';
import { FilterQuery } from 'mongoose';
import { Product } from '../schemas';

@Injectable()
export class ProductService implements OnModuleInit {
  private ownerService: OwnerService;

  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly productRepository: ProductRepository,
    @Inject(GrpcNames.OWNER) private ownerServiceClient: ClientGrpc,
    @Inject(RabbitMQNames.PRODUCT) private productServiceClient: ClientProxy,
  ) {}

  onModuleInit() {
    this.ownerService = this.ownerServiceClient.getService<OwnerService>(
      GrpcServiceNames.OWNER,
    );
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ApiResponse<{ product: ProductResponse }>> {
    let owner = await this.ownerRepository.findById(createProductDto.ownerId);
    if (!owner) {
      let ownerResponse: OwnerResponse = await firstValueFrom(
        this.ownerService.getOwner({
          ownerId: createProductDto.ownerId,
        }),
      ).then((res) => res.owner);

      owner = await this.ownerRepository.create(ownerResponse);
    }

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const productExists = await this.productRepository.findBySky(
      createProductDto.sku,
    );
    if (productExists) {
      throw new BadRequestException('Duplicate sku value');
    }

    const product = await this.productRepository.create(createProductDto);
    return {
      message: 'Product created',
      data: { product: mapToProductResponse(product) },
    };
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<{ product: ProductResponse }>> {
    const productExists = await this.productRepository.findOne(productId);
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    const product = await this.productRepository.update(
      productId,
      updateProductDto,
    );

    this.productServiceClient.emit(
      EventNames.PRODUCT_UPDATED,
      mapToProductEventResponse(product),
    );

    return {
      message: 'Product updated',
      data: { product: mapToProductResponse(product) },
    };
  }

  async getOneProduct(
    productId: string,
  ): Promise<ApiResponse<{ product: ProductResponse }>> {
    const product = await this.productRepository.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      message: 'Product fetched',
      data: { product: mapToProductResponse(product) },
    };
  }

  async getProducts(
    getProductsQuery: GetProductsDto,
  ): Promise<ApiResponse<{ products: ProductResponse[] }>> {
    const filterQuery: FilterQuery<Product> = {};
    if (getProductsQuery.ownerId) {
      filterQuery.owner = getProductsQuery.ownerId;
    }
    if (getProductsQuery.productIds?.length) {
      filterQuery._id = { $in: getProductsQuery.productIds };
    }

    const products = await this.productRepository.findAll(filterQuery);
    products.forEach((p) => {
      if (!p) throw new NotFoundException('Product not found');
    });

    return {
      message: 'Products fetched',
      data: {
        products: products.map((p) => mapToProductResponse(p)),
      },
    };
  }
}
