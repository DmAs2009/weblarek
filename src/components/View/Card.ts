import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


export interface ICard {
    title: string;
    price: number | null;
}

export class Card<T extends ICard> extends Component<T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container)
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container)
    }

    set title(value:string) {
        this.cardTitle.textContent = String(value);
    }

    set price(value: number | null) {
        if (value) {
            this.cardPrice.textContent = `${value} синапсов`
            return
        }
        this.cardPrice.textContent = `Бесценно`
    }
}