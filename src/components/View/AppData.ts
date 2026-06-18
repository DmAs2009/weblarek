import { IProduct, FormErrors, IOrder } from '../../types';
import { BaseModel } from '../base/BaseModel';
import { IAppState } from '../../types';
import { IOrderForm} from '../../types';
import { IEvents } from '../base/Events';

export class Product extends BaseModel<IProduct> {
  declare id: string;
  declare description: string;
  declare image: string;
  declare title: string;
  declare category: string;
  declare price: number | null;
  declare selected: boolean

  constructor(
    data: Partial<IProduct> = {},
    events: IEvents // ← второй обязательный параметр!
  ) {
    // Сначала создаем объект со значениями по умолчанию
    const defaults: IProduct = {
      id: '',
      description: '',
      image: '',
      title: '',
      category: '',
      price: null,
      selected: false,
      ...data
    };
    
    // Передаем ОБА аргумента в super()
    super(defaults, events);
    
    // Дополнительно можем обработать изображение
    this.fixImageUrl();
  }

  private fixImageUrl(): void {
    if (!this.image) {
      this.image = 'https://placehold.co/400x300/EEE/333?text=Нет+изображения';
      return;
    }
    
    // Если уже полный URL, оставляем как есть
    if (this.image.startsWith('http')) {
      return;
    }
    
    // Убираем начальный слеш
    const cleanPath = this.image.startsWith('/') 
      ? this.image.slice(1) 
      : this.image;
      
    // Формируем полный URL
    this.image = `https://larek-api.nomoreparties.co/${cleanPath}`;
  }
}

// Класс, описывающий состояние приложения

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

  addToBasket(value: Product) {
    this.basket.push(value);
  }

  deleteFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id)
  }

  clearBasket() {
    this.basket.length = 0;
  }

  getBasketAmount() {
    return this.basket.length;
  }

  setItems() {
    this.order.items = this.basket.map(item => item.id)
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order)
    }
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

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

  getTotalBasketPrice() {
   return this.basket.reduce((sum, product) => {
    const price = product.price;
    return sum + (price !== null ? price : 0);
    }, 0);
  }

  setStore(items: IProduct[]) {
    this.store = items.map((item) => new Product({ ...item, selected: false }, this.events));
    this.emitChanges('items:changed', { store: this.store });
  }

  resetSelected() {
    this.store.forEach(item => item.selected = false)
  }
}