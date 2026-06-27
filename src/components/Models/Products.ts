import {IProduct} from '../../types';
import { IEvents } from '../base/Events';

export class Products {
    private productItems: IProduct[] = [];
    private selectedProduct: IProduct | undefined =  undefined;

    constructor (protected events: IEvents) {}

    setProductItems(productItems:IProduct[]): void {
        this.productItems = productItems
        this.events.emit('Products:addProducts')
    }

    getItems(): IProduct[] {
        return this.productItems
    }

    getItemById(id:string): IProduct | undefined {
        return this.productItems.find((product) => product.id === id)
    }

    setSelectedItem(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('cardCatalog:openCard', { id: product.id })
    }

    getSelectedItem(): IProduct | undefined {
        return this.selectedProduct;
    }

}