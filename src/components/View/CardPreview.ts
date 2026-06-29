import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";
import { CDN_URL } from "../../utils/constants";

export interface ICardPreview extends ICard {
    category: string;
    image: string;
    imageAlt?: string;
    description: string;
}

export class CardPreview extends Card<ICardPreview> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents ){
        super(container);

        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container)
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container)
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        this.cardButton.addEventListener('click', () => {
            this.events.emit('cardPreviewButton:click')
        })
     
    }

    set price(value: number | null) {
        if(value === null) {
            this.cardButton.disabled = true
            this.cardButton.textContent = 'Недоступно'
        } else {
            this.cardButton.disabled = false
        }

        if (value) {
            this.cardPrice.textContent = `${value} синапсов`
            return
        }
        this.cardPrice.textContent = `Бесценно`
    }

    set category(value: string) {
        this.cardCategory.textContent = value
    }

    set image(value: string) {
        this.setImage(this.cardImage, CDN_URL + value, this.imageAlt)
    }

    set imageAlt(value: string) {
        this.cardImage.alt = value
    }

    set description(value: string) {
        this.cardDescription.textContent = value
    }

    set buttonChange(value: boolean) {
        this.cardButton.textContent = value 
        ? 'Удалить из корзины'
        : 'В корзину'
    }

}