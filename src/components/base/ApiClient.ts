import { IApi, IProduct, TProductListResponse, TOrderResponse, TOrderData } from "../../types";

export class ApiClient{
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api
    }

    async getProductList(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<TProductListResponse>('/product/')
            return response.items
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw error;
        }
    }
    
    
    async createOrder(orderData: TOrderData): Promise<TOrderResponse> {
        try {
            const response = await this.api.post<TOrderResponse>('/order/', orderData)
            return response
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            throw error;
        }
    }
    
}