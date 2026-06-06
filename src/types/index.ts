export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

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
  price: number | null;
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

export type TPayment = "cash" | "online" | "null";

// Интерфейс покупателя

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}
