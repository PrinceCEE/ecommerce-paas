import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { OwnerRepository, ProductRepository } from '../repositories';
import { CreateProductDto, GetProductsDto, UpdateProductDto } from '../dtos';
import { GrpcNames, GrpcServiceNames, OwnerService } from '@libs/shared';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiResponse, OwnerResponse, ProductResponse } from '../types';
import { mapToProductResponse } from '../utils';

@Injectable()
export class ProductService implements OnModuleInit {
  private ownerService: OwnerService;

  constructor(
    private readonly ownerRepository: OwnerRepository,
    private readonly productRepository: ProductRepository,
    @Inject(GrpcNames.OWNER) private ownerServiceClient: ClientGrpc,
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
        this.ownerService.findById({
          ownerId: createProductDto.ownerId,
        }),
      );

      owner = await this.ownerRepository.create(ownerResponse);
    }

    if (!owner) {
      throw new NotFoundException('Owner not found');
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
    const products = await this.productRepository.findAll(
      getProductsQuery?.ownerId && { owner: getProductsQuery.ownerId },
    );

    return {
      message: 'Products fetched',
      data: {
        products: products.map((p) => mapToProductResponse(p)),
      },
    };
  }
}
