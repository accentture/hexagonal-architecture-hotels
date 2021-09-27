import { Service } from 'typedi';
import { IQueries } from '../../../../../shared/interfaces/query.interface';
import { DataProduct } from '../../../application/services/data-product';
import { ProductModel } from './product.model';
import { ProductRepository } from './product.repository';

@Service()
export class ProductORM implements ProductRepository {
    async saveProduct(hotelId: number, dataProduct: DataProduct): Promise<any> {
        try {
            const product = new ProductModel();
            product.code = dataProduct.code;
            product.name = dataProduct.name;
            product.brand = dataProduct.brand;
            product.details = dataProduct.details;
            product.price = dataProduct.price;
            product.hotelId = hotelId;
            await product.save();

            return product;
        } catch (error) {
            console.log('------------', error);
        }
    }
    async getProducts(hotelId: number, queries: IQueries): Promise<any> {
        try {
            const products = await ProductModel.findAndCountAll({
                where: { hotelId: hotelId, state: true },
                limit: queries.limit,
                offset: queries.offset,
            });
            /* console.log('--------------products', products);
            if (products.count === 0) {
                throw new Error('-------------It was impossible to get products');
            } */
            return products;
        } catch (error) {
            console.log('------------', error);
        }
    }
    async getProduct(productId: number): Promise<any> {
        try {
            const product = await ProductModel.findByPk(productId);
            return product;
        } catch (error) {
            console.log('------------', error);
        }
    }
    async updateProduct(productId: number, dataProduct: DataProduct): Promise<any> {
        try {
            const product: any = await ProductModel.findByPk(productId);
            product.code = dataProduct.code;
            product.name = dataProduct.name;
            product.brand = dataProduct.brand;
            product.details = dataProduct.details;
            product.price = dataProduct.price;
            await product.save();

            return product;
        } catch (error) {
            console.log('------------', error);
        }
    }
    async removeProduct(productId: number): Promise<any> {
        try {
            const product: any = await ProductModel.findByPk(productId);
            product.state = false;
            await product.save();

            return product;
        } catch (error) {
            console.log('------------', error);
        }
    }
}
