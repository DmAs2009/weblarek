import { handlePrice } from '../../utils/utils';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
  description: number;
}

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ISuccessActions
  ) {
    super(container);

    this._button = ensureElement<HTMLButtonElement>(`.${blockName}__close`, container);
    this._description = ensureElement<HTMLElement>(`.${blockName}__description`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  set description(value: number) {
    this._description.textContent = 'Списано ' + handlePrice(value) + ' синапсов'
  }
}
