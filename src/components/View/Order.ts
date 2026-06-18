import { IEvents } from '../base/Events';
import { Form } from './FormValidation';


export interface IOrder {
  // Адрес
  address: string;

  // Способ оплаты
  payment: string;
}


export class Order extends Form<IOrder> {

  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add('button_alt-active')
        this._card.classList.remove('button_alt-active')
        this.onInputChange('payment', 'cash')
      })
    }
    if (this._card) {
      this._card.addEventListener('click', () => {
        this._card.classList.add('button_alt-active')
        this._cash.classList.remove('button_alt-active')
        this.onInputChange('payment', 'card')
      })
    }
  }

  // Метод, отключающий подсвечивание кнопок
  disableButtons() {
    this._cash.classList.remove('button_alt-active')
    this._card.classList.remove('button_alt-active')
  }
}