import { Api } from '../base/Api';
import { IProductListResponse, IOrderRequest, IOrderResponse } from '../../types';

export class ProductOrderService {
  private api: Api;

  constructor(baseUrl: string) {
    this.api = new Api(baseUrl);
  }

  //Получает список товаров с сервера

  async getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>('/product/');
  }

  //Создаёт заказ на товары

  async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', orderData);
  }
}