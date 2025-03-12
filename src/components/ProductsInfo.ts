import { IProduct, IProductsInfo } from "../types";
import { IEvents } from "./base/events";

export class ProductsInfo implements IProductsInfo {
    protected _items: IProduct[] = []; 
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(items:IProduct[]) {
        this._items = items;
        this.events.emit("catalog:update", { items: this.items });
    }

    get items () {
        return this._items;
    }

    getProduct(productId: string) {
        return this._items.find((item) => item.id === productId); 
    }

    getProducts() {
        return this._items;
    }

    // Установка и получение превью
    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return;
        }
        const selectedCard = this.getProduct(cardId);
        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected');
        }
    }

    get preview() {
        return this._preview;
    }
}