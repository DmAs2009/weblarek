import {IProduct, IBuyer} from '../../types';

export class Goods {
    private goods: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    saveProducts(products:IProduct[]): void {
        this.goods = [...products];
    }

    getProducts(): IProduct[] {
        return [...this.goods];
    }

    getProductById(id:string): IProduct | null {
        return this.goods.find((product) => product.id === id) || null;
    }

    saveSelectedItem(product: IProduct): void {
        this.selectedItem = {...product};
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem ? {...this.selectedItem} : null;
    }

    isItemSlected(): boolean {
        return this.selectedItem !== null;
    }
}