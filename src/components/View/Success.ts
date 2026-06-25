import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";


interface ISuccess {
    success: HTMLElement;
    description:HTMLElement;
    button:HTMLButtonElement;
    totalAmount: number;
}

export class Success extends Component<ISuccess> {
    protected successDescription:  HTMLElement;
    protected successButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.successDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container)

        this.successButton.addEventListener('click', () => { events.emit('modal:close') });
    }

    set totalAmount(value: number) {
        this.successDescription.textContent = String(`Списано ${value} синапсов`);
    }
}

