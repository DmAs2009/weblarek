import {IProduct} from '../../types'
import { IEvents } from '../base/Events';

export class Cart {
    private selectedItems: IProduct[] = [];

    constructor (protected events: IEvents) {}

    getSelectedItems(): IProduct[] {
        return this.selectedItems;
    }
    
    addItem(product: IProduct): void {
        this.selectedItems.push(product);
        this.events.emit('cart:change')
    }

    removeItem(productToRemove: IProduct): void {
        this.selectedItems = this.selectedItems.filter((item) => item.id !== productToRemove.id);
        this.events.emit('cart:change')
    } 

    clearCart():void {
        this.selectedItems = [];
        this.events.emit('cart:change')
    }

    getTotalPrice(): number {
        return this.selectedItems.reduce((total, product) => {
            return total + (product.price ?? 0)
        }, 0)
    }

    getItemsQuantity(): number{
        return this.selectedItems.length
    }

    checkItem(productId: string): boolean {
        return this.selectedItems.some((item) => item.id === productId);
    } 
}