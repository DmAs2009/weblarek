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
export interface IOrderRequest {
  payment: 'online' | 'cash';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // массив ID товаров
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IErrorResponse {
  error: string;
}

export type TPayment = "cash" | "online";

// Интерфейс покупателя

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
