import { IApi, IOrder, IOrderResult, IProduct } from '../types';
import { ApiListResponse } from './base/api';

export class AppApi {
	private apiBase: IApi;
	private cdn: string;

	constructor(apiBase: IApi,  cdn: string) {
		this.apiBase = apiBase;
		this.cdn = cdn;
	}

	getCards(): Promise<IProduct[]> {
        return this.apiBase.get<ApiListResponse<IProduct>>(`/product`).then((response) =>
            response.items.map((card) => ({
                ...card,
                image: `${this.cdn}${card.image}`, // Преобразуем ссылку на изображение
            }))
        );
    }

	postOrder(orderData: IOrder): Promise<IOrderResult> {
		return this.apiBase.post<IOrderResult>('/order', orderData).then((result: IOrderResult) => result);
	}	
}