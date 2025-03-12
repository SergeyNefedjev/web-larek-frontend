import {Component} from "./base/Component";
import {createElement, ensureElement} from "../utils/utils";
import {EventEmitter} from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected list: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = this.container.querySelector('.basket__price');
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('formPayment:open');
            });
        }
        this.items = [];
    }

    set total(total: number) {
        this.setText(this.totalElement, `${total} синапсов`);
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this.list.replaceChildren(...items);
            this.button.disabled = false; // Активируем кнопку, если есть элементы
        } else {
            this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.button.disabled = true; // Деактивируем кнопку, если корзина пуста
        }
    }
}