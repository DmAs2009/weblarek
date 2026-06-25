import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ICartComponentsData {
    lists: HTMLElement[];
    totalAmount: number;
    disabled: boolean;
}

export class CartComponent extends Component<ICartComponentsData>  {
    protected itemList: HTMLUListElement;
    protected totalPriceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this.itemList = ensureElement<HTMLUListElement>('.basket__list', this.container)
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container)
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container)

        this.orderButton.addEventListener('click', () => {
            this.events.emit('cart:makeOrder');
        })
    }

    set lists(items: HTMLElement[]) {
        this.itemList.innerHTML = ''
        items.forEach(item => {
            this.itemList.appendChild(item)
        })

    }

    set totalAmount(value:number) {
        this.totalPriceElement.textContent = `${value} синапсов`
    }

    set disabled(state:boolean) {
        this.orderButton.disabled = state;
    }
}