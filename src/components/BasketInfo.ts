import { IProduct, IBasketInfo } from "../types";
import { IEvents } from "./base/events";


export class BasketInfo implements IBasketInfo {
    protected _items: IProduct[] = []; 
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(items: IProduct[]) {
        this._items = items;
        this.events.emit('basket:update', { items: this._items });
    }

    get items() {
        return this._items;
    }
    deleteProduct(productId: string, payload?: () => void) {
        const initialLength = this._items.length;
        this._items = this._items.filter((item) => item.id !== productId);
        
        if (this._items.length < initialLength) {
            this.events.emit('basket:update', { items: this._items });
            if (payload) payload();
        } else {
            console.warn(`Товар с ID ${productId} не найден в корзине.`);
        }
    }
    addProduct(product: IProduct) {
        // Проверка, если товар уже есть в корзине
        const existingProduct = this._items.find(item => item.id === product.id);
            if (!existingProduct) {
            // Если товара нет в корзине, добавляем его
            this._items.unshift(product);
            this.events.emit('basket:update', { items: this._items });
        } else {
            // Если товар уже есть в корзине, выводим предупреждение
            console.warn(`Товар с ID ${product.id} уже в корзине.`);
        }
    }
    getProduct(productId: string): IProduct | undefined {
        return this._items.find((item) => item.id === productId);
    }
    // Очистить корзину
    clear() {
        this._items = [];
        this.events.emit('basket:update', { items: this._items });
    }
    // Получить общую стоимость товаров в корзине
    getTotalPrice(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0); 
        }, 0);
    }
}