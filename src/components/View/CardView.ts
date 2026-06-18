import { Component } from '../base/Component';
import { ensureElement, handlePrice } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { categoryMap } from '../../utils/constants';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

export class CardView extends Component<ICard> {

  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement | null;
  protected _price: HTMLElement | null;
  protected _button: HTMLButtonElement | null;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.card__title`, container);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._button = container.querySelector(`.card__button`);
    this._category = container.querySelector(`.card__category`);
    this._price = container.querySelector(`.card__price`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  // Сеттер и геттер для уникального ID
  set id(value: string) {
    this.container.dataset.id = value;
  }
  get id(): string {
    return this.container.dataset.id || '';
  }

  // Сеттер и гетер для названия
  set title(value: string) {
    this._title.textContent = value;
  }
  get title(): string {
    return this._title.textContent || '';
  }

  // Сеттер для кратинки
  set image(value: string) {
    this._image.src = CDN_URL + value;
  }

  // Сеттер для определения выбрали товар или нет
  set selected(value: boolean) {
    if (this._button && !this._button.disabled) {
      this._button.disabled = value;
    }
  }

  // Сеттер для цены
  set price(value: number | null) {
    if (this._price) { // Проверяем на null
    this._price.textContent = value
      ? handlePrice(value) + ' синапсов'
      : 'Бесценно';
    }
  }

  // Сеттер для категории
  set category(value: string) {
    if (this._category) {
    this._category.textContent = value;
    
    // Безопасное добавление класса с проверкой типа
    const categoryKey = value as keyof typeof categoryMap;
    
    // Проверяем, что ключ действительно существует в categoryMap
    if (categoryKey in categoryMap) {
      this._category.classList.add(categoryMap[categoryKey]);
    }
    }
    }
}

export class StoreItem extends CardView {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
  }
}

export class StoreItemPreview extends CardView {
  protected _description: HTMLElement | null;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }
}