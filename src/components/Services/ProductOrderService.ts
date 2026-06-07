import { IProductListResponse, IOrderRequest, IOrderResponse, IApi } from '../../types';

export class ProductOrderService {

  constructor(private readonly api: IApi) {}

  //Получает список товаров с сервера

  async getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>('/product/');
  }

  //Создаёт заказ на товары

  async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', orderData);
  }
}