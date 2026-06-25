import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IForm {
    error: string;
}

export class Form<T extends IForm> extends Component<T> {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(container: HTMLFormElement) {
        super(container)

        this.form = container
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container)
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container)
    }

    set error(value: string) {
        this.errorElement.textContent = value
    }

    showError(errors: string[]): void {
        this.error = errors.join(', ')
        this.submitButton.disabled = errors.length !== 0
    }
}