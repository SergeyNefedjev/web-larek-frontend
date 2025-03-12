import './scss/styles.scss';
import { AppApi } from "./components/AppApi";
import { Api } from "./components/base/api";
import { EventEmitter } from "./components/base/events";
import { BasketInfo } from "./components/BasketInfo";
import { ProductsInfo } from "./components/ProductsInfo";
import { IApi, IInfoContacts, IProduct } from "./types";
import { API_URL, CDN_URL } from "./utils/constants";
import { Card } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { CardsContainer } from './components/CardsContainer';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Page } from './components/Page';
import { IDataPayment, DataPayment } from './components/DataPayment';
import { InfoContacts } from './components/InfoContacts';
import { AppState } from './components/AppState';
import { Success } from './components/Success';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi, CDN_URL);

events.onAll((event) => {
    console.log(event.eventName, event.data)
})

// поиск элементов в разметке 
const cardTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog'); // карточка на странице
const cardModalTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview'); // карточка в модальном окне
const cardBasketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-basket'); // карточка в корзине
const basketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket'); // это клон темплейта всей корзины
const formOderTemplete: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#order'); // тимлейт формы оплаты
const formContactsTemplete: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#contacts'); // тимплейт формы данных пользователя
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// создаем объекты
const page = new Page(document.body, events);
const galleryContainer = new CardsContainer(ensureElement<HTMLTemplateElement>('.gallery')); // контейнер, куда помещается массив карточек на главной странице
const productsData = new ProductsInfo(events); // массив товаров
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const basketData = new BasketInfo(events); // данные корзины
const order = new DataPayment(cloneTemplate(formOderTemplete), events);
const contacts = new InfoContacts(cloneTemplate(formContactsTemplete), events)
const appData = new AppState({}, events);
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => {
        modal.close();
        appData.clearOrder();
    }
});


api.getCards()
    .then((cards) => {
        productsData.items = cards;
    })
    .catch((err) => {
        console.error("Ошибка загрузки продуктов:", err);
    });

    events.on("catalog:update", () => {
        const cardsArray = productsData.items.map((card) => {
            const cardInstance = new Card(cloneTemplate(cardTemplate), events);
            return cardInstance.render(card);
        });
    
        galleryContainer.render({ catalog: cardsArray });
    });


// выбрать карточку
events.on(`card:select`, (data: { card: Card }) => {
    const { card } = data;
    const productModalData = productsData.getProduct(card.id);
    const cardModal = new Card(cloneTemplate(cardModalTemplate), events);

    const isCardInBasket = basketData.items.some(product => product.id === card.id);
    cardModal.updateAddButtonState(isCardInBasket);

    console.log(basketData.items.map(product => product.id))
    modal.render({
        content: cardModal.render(productModalData)
    });
})

events.on('card:add', (data: { card: Card }) => { 
    const { card } = data;  
    const basketItemData = productsData.getProduct(card.id); 
    basketData.addProduct(basketItemData); 
    modal.close(); 
  }); 
 
events.on('basket:open', () => { 
    modal.render({ 
        content: createElement<HTMLElement>('div', {}, [ 
            basket.render() 
        ]) 
    }); 
}); 
 
events.on('card:delete', (data: { card: Card }) => { 
    const { card } = data;  
    const basketItemData = productsData.getProduct(card.id); 
    basketData.deleteProduct(basketItemData.id);   
  }); 

events.on('basket:update', (data: { items: IProduct[] }) => { 
    const { items } = data; 
    basket.items = items.map((product, index) => { 
        const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events); 
        cardBasket.index = index + 1; 
        return cardBasket.render(product); 
    }); 
    basket.total = basketData.getTotalPrice() || 0; 
    page.counter = items.length; 
    
    modal.render({  
        content: basket.render()   
    }); 
}); 

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Открыть форму заказа
events.on('formPayment:open', () => {
    const isValid = Boolean(appData.order.payment && appData.order.address);
    modal.render({
        content: order.render({
            payment: appData.order.payment,
            address: appData.order.address,
            valid: isValid,
            errors: []
        })
    });
});

// Изменилось состояние валидации формы
events.on('formPaymentErrors:change', (errors: Partial<IDataPayment>) => {
    const { payment, address } = errors;  
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IDataPayment, value: string }) => {
    appData.setOrderField(data.field, data.value);
    
});

events.on('order:submit', (a) => {
    const isValid = Boolean(appData.order.email && appData.order.phone);
    modal.render({
        content: contacts.render({
            email: appData.order.email,
            phone: appData.order.phone,
            valid: isValid,
            errors: []
        })
    });
});

// Изменилось состояние валидации формы
events.on('formContactsErrors:change', (errors: Partial<IInfoContacts>) => {
    const { email, phone } = errors;  
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');

});

events.on(/^contacts\..*:change/, (data: { field: keyof IInfoContacts, value: string }) => {
    appData.setContactsField(data.field, data.value);
});

events.on('contacts:submit', () => {
    const orderData = {
        ...appData.order, 
        items: basketData.items.map(product => product.id), // Идентификаторы товаров
        total: basketData.getTotalPrice(), // Общая стоимость
    };
    api.postOrder(orderData)
        .then((result) => {
            basketData.clear();
            success.total = result.total;
            appData.clearOrder();
            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

