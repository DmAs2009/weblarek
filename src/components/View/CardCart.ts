import { Card, ICard } from "./Card";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface ICardCart extends ICard {
    index: number;
}

export class CardCart extends Card<ICardCart> {
    protected basketItemIndex: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, protected onClick: () => void  ) {
        super(container);

        this.basketItemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', this.onClick);
    }

    set index(value: number) {
        this.basketItemIndex.textContent = String(value);
    }
}