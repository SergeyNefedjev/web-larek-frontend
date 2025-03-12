# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src\common.blocks — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проектной работы 

Архитектура приложения соответствует паттерну MVP, где каждый слой имеет свою чёткую задачу: слой данных отвечает за хранение и обработку информации, слой представления отвечает за пользовательский интерфейс, а презентер выступает посредником между ними, обеспечивая обновление представления на основе изменений в данных.

### Базовый код 

#### Класс Api 
Класс Api предназначен для реализации HTTP запросов к серверу.

Свойства:
- baseUrl — базовый URL для всех запросов.
- options — параметры запроса.

Методы: 
- `handleResponse` - отвечает за обработку ответа от сервера
- `get` - отправляет GET-запрос по указанному адресу (эндпоинту) и возвращает результат, полученный от сервера, в виде Promise.
- `post` - метод для выполнения POST запроса.

#### Класс EventEmitter
Брокер событий позволяет компонентам системы отправлять и получать уведомления опроисходящих событиях. Презентеры используют этот класс для реагирования на события, аслои приложения — для их генерации.

Основные методы, реализуемые классом, описаны интерфейсом `IEvents`

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое впараметрах событие.

#### Класс Component

Это базовый, параметризованный (дженерик) класс для всех компонентов UI. Он требует указания типа данных, с которыми будет работать компонент. В конструктор передается DOM-элемент, в котором компонент будет отображаться. Метод render получает данные, устанавливает их в соответствующие поля компонента (через сеттеры) и возвращает обновленный DOM-контейнер.

Свойства:
- protected readonly container: HTMLElement - Корневой DOM-элемент

Конструктор:
- protected constructor(protected readonly container: HTMLElement)

Методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - Переключить класс
- protected setText(element: HTMLElement, value: unknown) - Установить текстовое содержимое
- setDisabled(element: HTMLElement, state: boolean) - Сменить статус блокировки
- protected setHidden(element: HTMLElement) - Скрыть
- protected setVisible(element: HTMLElement) - Показать
- protected setImage(element: HTMLImageElement, src: string, alt?: string) - Установить изображение с альтернативным текстом
- render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент 


### Слой данных

####  Класс ProductsInfo

Класс отвечает за управление информацией о товаре, отображаемой на странице. Он получает экземпляр брокера событий в конструкторе для обмена информацией с другими компонентами.
В полях класса хранятся следующие данные:

- _items - массив карточек с товаром 
- _preview - ID товара для показа в модальном окне.
- events - экземпляр класса EventEmitter для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- getProduct(productId: string) - по id возвращает карточку товара
- getProducts -  возвращает массив товаров 
- set preview(cardId: string | null) - Устанавливает id текущего товара
- get preview() - Возвращает id товара
- set items(items:IProduct[]) - Обновляет список товаров
- get items () - Возвращает текущий список товаров

### Класс BasketInfo

Класс, управляющий корзиной товаров и взаимодействующий с другими компонентами через брокер событий.
В полях класа храняться следующие данные: 

- _items - каталог товаров
-  events - экземпляр класса EventEmitter для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- addProduct(product: IProduct) - добавление товара
- deleteProduct(productId: string, payload?: () => void) - удаление товара 
- getProduct(productId: string): IProduct | undefined - получение карточки товара по id
- getTotalPrice(): number - получение общей стоимости
- clear - очистка корзины

### Класс AppState

Класс, управляющий данными, необходимыми для оформления заказа: контактной информацией, адресом доставки и способом оплаты. Также включает в себя логику для проверки корректности введенных данных.
В полях класа храняться следующие данные:

- order: IOrder = {
        payment: '',  
        address: '',
        email: '',
        phone: '',
    }; - информация о заказе
- formErrors: FormErrors = {} - объект, содержащий ошибки валидации полей формы оформления заказа. Ключами объекта являются имена полей, а значениями - сообщения об ошибках для этих полей.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- clearOrder() -  сбрасывает данные, введенные пользователем в процессе оформления заказа
- setOrderField(field: keyof IInfoPayment, value: string) - Изменяет значение поля в объекте order, связанного с оплатой или адресом.
- setContactsField(field: keyof IInfoContacts, value: string) - Изменяет значение поля в объекте order, связанного с контактной информацией.
- validateOrder - Выполняет валидацию данных об оплате и доставке.
- validateContacts - Выполняет проверку корректности контактных данных

### Классы представления 

Классы представления преобразуют данные в визуальное представление (HTML) и отображают его в заданном DOM-элементе на странице.

#### Класс Modal

Предоставляет базовую функциональность для создания и управления модальными окнами

- constructor(container: HTMLElement, protected events: IEvents) - конструктор принимает DOM-элемент контейнера и экземпляр EventEmitter для связи с другими компонентами через события.

Поля класса:
- protected closeButton - кнопка закрытия модального окна
- protected _content - содержимое модального окна

Методы:
- open() - метод для открытие модального окна
- close() - метод для закрытие модального окна
- render(data: IModalInfo): HTMLElement - метод отображает модальное окно, заполняя его содержимым на основе переданных данных.

#### Класс Card

Класс отвечает за создание и отображение карточки товара, заполняя её данными (название,изображение, описание, категория). Он получает шаблон карточки в конструкторе, чтопозволяет использовать разные варианты верстки. Также устанавливает обработчики событийна интерактивные элементы карточки.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.

Свойства:
- protected events: IEvents; 
- protected addBasketButton?: HTMLButtonElement; 
- protected deleteButton?: HTMLButtonElement;      
- protected _id: string; 
- protected _description?: HTMLElement; 
- protected _image?: HTMLImageElement; 
- protected _title: HTMLElement; 
- protected _category?: HTMLElement; 
- protected _price: HTMLElement;  
- protected cardItem: HTMLElement; 

Методы:
- updateAddButtonState(isInBasket: boolean) - управление статусом кнопки
- deleteCard - удаление карточки
- render(cardData: Partial<IProduct> | undefined) - Обновляет данные карточки товара
- set price(price: number | null) - Устанавливает цену товара
- set id(id) - Сохраняет уникальный идентификатор товара
- get id() - Возвращает сохраненный идентификатор


#### Класс CardsContainer

Класс отвечает за отображение списка карточек товаров в заданном DOM-элементе.

Поля класса:
- catalog - массив карточек

Метод:
- set catalog - отвечает за обновление отображения карточек товаров на странице

#### Класс Basket

Класс отвечает за визуальное представление корзины. Отображает кнопку, цену и нумерацию списка.

Поля класса:
- protected list: HTMLElement - список товаров
- protected totalElement: HTMLElement - общая цена товаров
- protected button: HTMLButtonElement - кнопка корзины

Метод:
- set total(total: number) - для подсчета общей стоимости товаров
- set items(items: HTMLElement[]) - активация/деактивация кнопки

#### Класс Form

Этот класс управляет поведением и данными формы, обрабатывает события, происходящие в форме, и обеспечивает взаимодействие с другими компонентами приложения. Конструктор принимает DOM-элемент, содержащий форму.

Поля:
- button - управление кнопкой
- errors - управление ошибками

Методы:
- onInputChange - отправляет уведомление в виде события при каждом изменении значения поля формы.
- buttonActive - управление кнопкой

#### Класс InfoContacts

Отвечает за управление формой для ввода контактной информации пользователя (email и телефон) на этапе оформления заказа.

Свойства:
- email: string - емаил пользователя
- phone: string - телефон пользователя 

Методы:
- set email(value: string) - Устанавливает значение поля email в форме
- set phone(value: string) -  Устанавливает значение поля phone в форме

#### Класс Page

Отвечает за управление основными элементами интерфейса страницы

Поля:
- protected basketCounter: HTMLElement - счетчик товаров в корзине
- protected wrapper: HTMLElement - оборачивает основное содержимое страницы
- protected basket: HTMLElement - корзина

Методы:
- set counter(value: number) - обновление отображаемого количества товаров в корзине
- set locked(value: boolean) - блокировка прокрутки страницы при открытии модального окна

#### Класс Success

Отвечает за отображение сообщения об успешном оформлении заказа

Поля:
- protected closeWindow: HTMLElement - закрытие моадльного окна
- protected totalAmount: HTMLElement - отображающий сумму списанных "синапсов"

Методы:
- set total(total: number)- обновление отображаемой суммы списанных средств


### Слой коммуникации

#### Класс AppApi

Класс, который управляет запросами к API бэкенда. В конструктор принимает экземпляр класса Api, который предоставляет методы для выполнения этих запросов.

Свойства:
- private apiBase: IApi;
- private cdn: string;

Методы:
- getCards(): Promise<IProduct[]> - Получает список товаров с сервера
- postOrder(orderData: IOrder): Promise<IOrderResult> - Отправляет данные заказа

## Взаимодействие компонентов
В index.ts реализуется логика, соединяющая классы представления с данными, используя паттерн презентера. Для обмена информацией между компонентами используются события, генерируемые брокером событий. В index.ts происходит создание экземпляров всех классов представления и настройка обработчиков событий, обеспечивающих взаимодействие между ними.

Список всех событий, которые могут генерироваться в системе:
События изменения данных (генерируются классами моделями данных)
- `catalog:update` - Обновление списка товаров в каталоге 
- `basket:update` - Изменение содержимого корзины 
- `modal:open` -  Открытие модального окна (блокирует прокрутку страницы)
- `modal:close` - Закрытие модального окна (разблокирует прокрутку страницы)

События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)
- `card:select` - выбор карточки для отображения в модальном окне
- `card:add` - Добавление товара в корзину
- `card:delete` -  Удаление товара из корзины
- `basket:open` - Открытие модального окна корзины
- `formPayment:open` - Открытие формы выбора способа оплаты
- `formContacts:open` - Открытие формы ввода контактной информации
- `formContactsErrors:change` - Изменение состояния валидации формы с контактной информацией
- `formPaymentErrors:change` -  Изменение состояния валидации формы выбора способа оплаты
- `/^contacts\..*:change/` - обработка изменений любого поля формы с контактами.
- `/^order\..*:change/` - обработка изменений любого поля формы с вьюором оплаты.
- `contacts:submit` - отправка данных заказа