import {IProduct} from '../../types';

export class Products {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    setItems(products:IProduct[]): void {
        this.items = [...products];
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getItemById(id:string): IProduct | null {
        return this.items.find((product) => product.id === id) || null;
    }

    saveSelectedItem(product: IProduct) {
        this.selectedItem = {...product};
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }

}