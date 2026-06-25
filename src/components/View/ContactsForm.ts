
import { Form, IForm } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IContactsFormData extends IForm {
    email: string;
    phoneNumber: string;
}

export class ContactsForm extends Form<IContactsFormData> {
    protected inputEmailElement: HTMLInputElement
    protected inputPhoneNumberElement: HTMLInputElement

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container)

        this.inputEmailElement = ensureElement<HTMLInputElement>('.form__input[name="email"]', this.container)
        this.inputPhoneNumberElement = ensureElement<HTMLInputElement>('.form__input[name="phone"]', this.container)

        this.inputEmailElement.addEventListener('input', (e) => {
            const target = e.currentTarget as HTMLInputElement;

            this.events.emit('buyer:change', { email: target.value.trim() })
        })

        this.inputPhoneNumberElement.addEventListener('input', (e) => {
            const target = e.currentTarget as HTMLInputElement;

            this.events.emit('buyer:change', { phone: target.value.trim() })
        })

        this.container.addEventListener('submit', (event) => {
            event.preventDefault()

            this.events.emit('formContacts:submit')
        })
        
        this.submitButton.disabled = true
    }

    set email(value: string) {
        this.inputEmailElement.value = value ?? ''
    }

    set phone(value: string) {
        this.inputPhoneNumberElement.value = value ?? ''
    }

}