import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected openFlag: boolean = false;

    constructor(container:HTMLElement, protected events:IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this._content = ensureElement<HTMLElement>('.modal__content', this.container);
        
        this._closeButton.addEventListener('click', () => {
            this.events.emit('modal:close')
        })

        this.container.addEventListener('click', (event) => {
            if (event.target === container) {
                this.events.emit('modal:close')
            }
        })
    }

    set content(value: HTMLElement) {
        this._content.innerHTML = ''
        this._content.appendChild(value);
    }

    open() {
        if (this.openFlag) { return }
        this.container.classList.add('modal_active')
        this.openFlag = true
    }

    close() {
        if (!this.openFlag) { return }
        this.container.classList.remove('modal_active')
        this.openFlag = false
    }

    isOpen(): boolean {
        return this.openFlag
    }

}