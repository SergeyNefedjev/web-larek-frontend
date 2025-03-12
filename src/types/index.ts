export interface IProduct{
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductsInfo {
  items: IProduct[];
  preview: string | null; 
  getProduct(productId: string): IProduct;  
  getProducts(): IProduct[];
}

export interface IBasketInfo {
  items: IProduct[];
  addProduct(product: IProduct): void;  
  deleteProduct(productId: string, payload: Function | null): void; 
  getProduct(productId: string): IProduct;
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

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' ;

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;