import { Service } from 'typedi';
import { ProductModel } from './product.model';
import { ProductSaleDomainEntity } from '../../../../product-sales/domain/products-saled';

@Service()
export class ProductMapper {
  mapToProductSaleDomain(product: ProductModel): ProductSaleDomainEntity {
    return new ProductSaleDomainEntity(product.price);
  }
}