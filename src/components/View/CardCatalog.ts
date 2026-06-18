import { ICardCatalog, IItem } from "../../types";
import { IEvents } from "../base/Events";

export class CardCatalog implements ICardCatalog {
    protected _items: IItem[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(items:IItem[]) {
        this._items = items;
        this.events.emit('showcase:changed')
    }

    get items () {
        return this._items;
    }

    getItem(itemId:string) {
        return this._items.find((item) => item.id === itemId)
    }

    getItemPrice(itemId:string) {
        const item = this.getItem(itemId);
        return item ? item.price : undefined;
    }
}