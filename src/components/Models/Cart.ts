import {IProduct} from '../../types'

export class Cart {
    private items: IProduct[] = [];
    private totalPrice: number = 0;

    getItems(): IProduct[] {
        return [...this.items];
    }
    
    addItem(product: IProduct): void {
        this.items.push(product);
        this.totalPrice += product.price || 0;
    }

    removeItem(productId: string): void {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.totalPrice -= this.items[index].price || 0;
            this.items.splice(index, 1);
        }
    }

    clearCart():void {
        this.items = []
        this.totalPrice = 0;
    }

    getTotalPrice(): number {
        return this.totalPrice;
    }

    getItemsQuantity(): number{
        return this.items.length
    }

    checkItem(productId: string): boolean {
        const index = this.items.findIndex(item => item.id === productId);
        return index !== -1
    }
}