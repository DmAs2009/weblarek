import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { ICard } from "./Card";
import { categoryMap, CategoryKey } from "../../utils/constants";


export interface ICardCatalog extends ICard {
    
    category: string;
    image: string;
    imageAlt?: string;
}

export class CardCatalog extends Card<ICardCatalog> {
    protected cardCategory: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents){
        super(container);
        
        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    
        this.container.addEventListener('click', () => {
            this.events.emit('cardCatalog:selected', { id: this.id })
        })
    }

    set category(value: CategoryKey) {
        const className = categoryMap[value]

        if(!className) { return }

        this.cardCategory.classList.add(className)
        this.cardCategory.textContent = value
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value, this.imageAlt)
    }

    set imageAlt(value: string) {
        this.imageElement.alt = value
    }
}