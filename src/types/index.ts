export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiResponse {
  items: IProduct[];
}

// Интерфейс товара

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected?: boolean;
}

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

// Типы для заказа
export interface IOrderRequest extends IBuyer{
    total: number;
    items: string[];
} 

export interface IOrderResponse {
  id: string;
  total: number;
}

export type TPayment = "cash" | "online";

// Интерфейс покупателя

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Интерфейсы для категорий и цены товара

export type TItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
export type TItemPrice = number | null;

export const CategoryType: Record<TItemCategory, string> = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'кнопка': 'button',
    'дополнительное': 'additional',
}

//Интерфейс для описания одного товара

export interface IItem {
    id: string;
    itemIndex: number;
    category: TItemCategory;
    description: string;
    image: string;
    price: TItemPrice;
    title: string;
}

//Интерфейс для добавления в корзину

export interface ICardPreview extends IItem {
  inBasket: boolean;
  canAddToBasket: boolean;
}

// Интерфейс главной страницы с карточками

export interface ICardCatalog {
    items: IItem[];
    getItem(itemId:string) : IItem | undefined;
    getItemPrice(itemId:string) : TItemPrice | undefined;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IOrder {
  // Массив ID купленных товаров
  items: string[];

  // Способ оплаты
  payment: string;

  // Сумма заказа
  total: number;

  // Адрес доставки
  address: string;

  // Электронная почта
  email: string;

  // Телефон
  phone: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IAppState {
  // Корзина с товарами
  basket: IProduct[];
  // Массив карточек товара
  store:IProduct[];
  // Информация о заказе при покупке товара
  order: IOrder;
  // Ошибки при заполнении форм
  formErrors: FormErrors;
  // Метод для добавления товара в корзину
  addToBasket(value: IProduct): void;
  // Метод для удаления товара из корзины
  deleteFromBasket(id: string): void;
  // Метод для полной очистки корзины
  clearBasket(): void;
  // Метод для получения количества товаров в корзине
  getBasketAmount(): number;
  // Метод для получения суммы цены всех товаров в корзине
  getTotalBasketPrice(): number;
  // Метод для добавления ID товаров в корзине в поле items для order
  setItems(): void;
  // Метод для заполнения полей email, phone, address, payment в order
  setOrderField(field: keyof IOrderForm, value: string): void;
  // Валидация форм для окошка "контакты"
  validateContacts(): boolean;
  // Валидация форм для окошка "заказ"
  validateOrder(): boolean;
  // Очистить order после покупки товаров
  refreshOrder(): boolean;
  // Метод для превращения данных, полученых с сервера в тип данных приложения
  setStore(items: IProduct[]): void;
  // Метод для обновления поля selected во всех товарах после совершения покупки
  resetSelected(): void;
}