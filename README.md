# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
В этом разделе будет представлена информация о моделях данных  приложения.

### Модель каталога товаров

#### Products

Данная модель представляет собой список всех существующих товаров. Используется для отображения всех товаров на главной странице.

#### Поля класса:

  private items: IProduct[] = [];
    Массив товаров - список всех существующих товаров, который мы получаем с сервера

  private selectedItem: IProduct | null = null;
    Выбранная карточка - карточка, которую выбрал пользователь

#### Методы класса:
  
  getItems - получение списка всех существующих товаров

  getItemById - получение товара по его ID

  saveSelectedItem - сохранение данных о выбраной карточки
    
  getSelectedItem - получить данные выбранной карточки
  

### Модель корзины

#### Cart

#### Поля класса:

  items: IProduct[] = []; - все товары в корзине

#### Методы класса:

  getItems - получение всех товаров в корзне
    
  addItem - для добавления товара в корзину

  removeItem - для удаления товара из корзины

  clearCart - очистка корзины

  getTotalPrice - подсчет общей цены товаров в корзине

  getItemsQuantity - получение количества товаров в корзине

  checkItem - проверка наличия товара в корзине


### Модель покупателя

export class Buyer {

#### Поля класса:

data: IBuyer = {
        payment: "null", - способ оплаты, по умолчанию null
        email: "", - адрес электронной почты
        phone: "", - номер телефона
        address: "" - адрес
    };

#### Методы класса:

  updateField - внесение изменений в данные пользователя

  getAllData -получение данных о пользователе

  clearAll - отчистка данных



### Слой коммутации

Для взаимодействия с сервером используется класс ProductOrderService.

Класс включает в себя два метода:

#### метод подучения списка товаров

данный метод использует GET запрос на сервер для получения списка всех товаров

async getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>('/product/');
  }

#### метод создания заказа

данный метод использует POST запрос на сервер для создания заказа

async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', orderData);
  }

### класс ProductOrderService

export class ProductOrderService {
  private api: Api;

  constructor(baseUrl: string) {
    this.api = new Api(baseUrl);
  }

  //Получает список товаров с сервера

  async getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>('/product/');
  }

  //Создаёт заказ на товары

  async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', orderData);
  }
}

### Слой представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Особенность в том, что в приложении только один экземпляр этого класса

#### Класс Form
Служит для проверки корректности заполнения форм

#### Класс Success 
Реализация содержимого окошка с результатом оформления заказа

#### Класс MainPage
Класс, описывающий главную страницу

##### Ссылки на внутренние элементы
  protected _counter: HTMLElement;
  protected _store: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

#####  Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._store = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

##### Сеттер для счётчика товаров в корзине
  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

##### Сеттер для карточек товаров на странице
  set store(items: HTMLElement[]) {
    this._store.replaceChildren(...items);
  }

##### Сеттер для блока прокрутки
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}

#### Класс CardView
Описывает карточку товара на главной странице

##### Сеттер и геттер для уникального ID
  set id(value: string) {
    this.container.dataset.id = value;
  }
  get id(): string {
    return this.container.dataset.id || '';
  }

##### Сеттер и гетер для названия
  set title(value: string) {
    console.log('Полученное название:', value);
    this._title.textContent = value;
  }
  
  get title(): string {
    return this._title.textContent || '';
  }

##### Сеттер для картинки
  set image(value: string) {
    this._image.src = value.startsWith('/')
    ? `${import.meta.env.VITE_API_ORIGIN}${value}`
    : `${CDN_URL}${value}`;
  }

##### Сеттер для определения выбрали товар или нет
  set selected(value: boolean) {
    if (this._button && !this._button.disabled) {
      this._button.disabled = value;
    }
  }

##### Сеттер для цены
  set price(value: number | null) {
    if (this._price) { // Проверяем на null
    this._price.textContent = value
      ? handlePrice(value) + ' синапсов'
      : 'Бесценно';
    }
  }

##### Сеттер для категории
  set category(value: string) {
    if (this._category) {
    this._category.textContent = value;
    
    // Безопасное добавление класса с проверкой типа
    const categoryKey = value as keyof typeof categoryMap;
    
    // Проверяем, что ключ действительно существует в categoryMap
    if (categoryKey in categoryMap) {
      this._category.classList.add(categoryMap[categoryKey]);
    }
    }
    }


#### Класс Basket
Класс для реализации корзины покупок

##### Сеттер для общей цены
  set price(price: number) {
    if (this._price) {
      this._price.textContent = handlePrice(price) + ' синапсов';
    }
  }

##### Сеттер для списка товаров 
  set list(items: HTMLElement[]) {
    if (this._list) {
      this._list.replaceChildren(...items);
    }
    
    if (this._button) {
      this._button.disabled = !items.length;
    }
  }

##### Метод отключающий кнопку "Оформить"
  disableButton() {
    if (this._button) {
      this._button.disabled = true;
    }
  }

##### Метод для обновления индексов таблички при удалении товара из корзины
  refreshIndices() {
    if (!this._list) return;

    Array.from(this._list.children).forEach(
      (item, index) =>
      (item.querySelector(`.basket__item-index`)!.textContent = (
        index + 1
      ).toString())
    );
  }

