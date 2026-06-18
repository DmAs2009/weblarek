import { IOrder, IProduct, FormErrors, IOrderForm, IAppState } from '../../types';
import { BaseModel } from '../base/BaseModel'; // Или BaseModel, в зависимости от того, что используется

// Класс для товара
export class Product extends BaseModel<IProduct> {
  id: string = '';
  description: string = '';
  image: string = '';
  title: string = '';
  category: string = '';
  price: number | null = null;
  selected: boolean = false;

  constructor(data: Partial<IProduct>& { selected?: boolean } = {}, events?: any) {
    super(data, events);

    this.selected = data.selected ?? false;
  }
}

/*
  * Класс, описывающий состояние приложения
  * */
export class AppState extends BaseModel<IAppState> {
  // Корзина с товарами
  basket: Product[] = [];

  // Массив со всеми товарами
  store: Product[] = [];

  // Объект заказа клиента
  order: IOrder = {
    items: [],
    payment: '',
    total: 0,
    address: '',
    email: '',
    phone: '',
  };

  // Объект с ошибками форм
  formErrors: FormErrors = {};

  // Добавление товара в корзину
  addToBasket(value: Product) {
    this.basket.push(value);
  }

  // Удаление товара из корзины
  deleteFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id);
  }

  // Очистка корзины
  clearBasket() {
    this.basket.length = 0;
  }

  // Получение количества товаров в корзине
  getBasketAmount() {
    return this.basket.length;
  }

  // Установка ID товаров в заказ
  setItems() {
    this.order.items = this.basket.map(item => item.id);
  }

  // Установка полей заказа
  setOrderField(field: keyof IOrderForm, value: string) {
    (this.order as any)[field] = value;

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order);
    }
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  // Валидация контактных данных
  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Валидация данных заказа
  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('orderFormErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Обновление заказа
  refreshOrder() {
    this.order = {
      items: [],
      total: 0,
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
  }

  // Получение общей суммы корзины
  getTotalBasketPrice() {
    return this.basket.reduce((sum, next) => sum + (next.price || 0), 0);
  }

  // Установка товаров в магазин
  setStore(items: IProduct[]) {
    this.store = items.map((item) => new Product({ ...item, selected: false }, this.events));
    this.emitChanges('items:changed', { store: this.store });
  }

  // Сброс выбора товаров
  resetSelected() {
    this.store.forEach(item => item.selected = false);
  }
}