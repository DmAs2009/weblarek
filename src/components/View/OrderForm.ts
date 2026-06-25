import { TPayment } from "../../types";
import { Form, IForm } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IOrderFormData extends IForm {
    paymentMethod: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container)

        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container)
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container)
        this.addressInput = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container)

        this.cardButton.addEventListener('click', () => {
            this.events.emit('buyer:change', { payment: this.cardButton.getAttribute('name') })
        })

        this.cashButton.addEventListener('click', () => {
            this.events.emit('buyer:change', { payment: this.cashButton.getAttribute('name') })
        })

        this.addressInput.addEventListener('input', (e) => {
            const target = e.currentTarget as HTMLInputElement;
            
            this.events.emit('buyer:change', { address: target.value.trim() });
        });

        this.container.addEventListener('submit', (event) => {
            event.preventDefault()

            this.events.emit('formOrder:submit')
        })

        this.submitButton.disabled = true

    }

    
    set paymentMethod(value: TPayment) {
        if(value === 'card') {
            this.cashButton.classList.remove('button_alt-active')
            this.cardButton.classList.add('button_alt-active')
        }

        if(value === 'cash') {
            this.cardButton.classList.remove('button_alt-active')
            this.cashButton.classList.add('button_alt-active')
        }
    }

    set address(value: string) {
        this.addressInput.value = value ?? ''
    }

}