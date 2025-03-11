export interface IProduct{
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IProductsInfo {
  items: IProduct[];
  preview: string | null; 
  getProduct(): IProduct; 
  getProducts(): IProduct[];
}


export interface IBasketInfo {
  items: IProduct[];
  addProduct(): void; 
  deleteProduct(): void; 
  getProduct(): IProduct;
  getTotalPrice(): number;
  clear(): void;
}

export interface IInfoPayment {
  payment: string;
  address: string;
}

export interface IInfoContacts {
  email: string,
  phone: string,
}

export interface IOrder extends IInfoPayment, IInfoContacts {
}

export interface IAppState {
  preview: string | null;
  order: IOrder | null;
}

export type PostApiMethods = 'POST' | 'PUT' | 'DELETE' ;

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: object, method?: PostApiMethods): Promise<T>;
}

export interface IOrderResult {
  id: string;
  total: number;
}

