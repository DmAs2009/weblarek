export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export type TItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
export type TItemPrice = number | null;

export const categoryType: Record<TItemCategory, string> = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'кнопка': 'button',
    'дополнительное': 'additional',
}

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: TItemPrice;
}

export type TProductListResponse = {
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

export type TPayment = "cash" | "card" |'';

// Интерфейс покупателя

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Тип для данных заказа
export interface TOrderData extends IBuyer{
    total: number; 
    items: string[]; 
}

// Тип для успешного ответа заказа
export type TOrderSuccess = {
    id: string;
    total: number;
}

// Тип для ошибки заказа  
export type TOrderError = {
    error: string;
}

// Тип для ответа на создание заказа
export type TOrderResponse = TOrderSuccess | TOrderError;

