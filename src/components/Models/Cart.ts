import {IProduct} from '../../types'

export class Cart {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items];
    }
    
    addItem(product: IProduct): void {
        this.items.push(product);
    }

    removeItem(productId: string): void {
        this.items = this.items.filter((item) => item.id !== productId);
    } 

    clearCart():void {
        this.items = []
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total +(item.price || 0), 0);
    }

    getItemsQuantity(): number{
        return this.items.length
    }

    checkItem(productId: string): boolean {
        return this.items.some((item) => item.id === productId);
    } 
}