import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { API_URL} from './utils/constants';
import { Api } from './components/base/Api';
import { ensureElement } from './utils/utils';
import { Header } from './components/View/Header';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/View/Gallery';
import { CardCatalog } from './components/View/CardCatalog';
import { cloneTemplate } from './utils/utils';
import { ApiClient } from './components/base/ApiClient';
import { CartComponent } from './components/View/CartComponent';
import { Modal } from './components/View/Modal';
import { Buyer } from './components/Models/Buyer';
import { CardPreview } from './components/View/CardPreview';
import { Success } from './components/View/Success';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { CardCart } from './components/View/CardCart';
import { IBuyer } from './types';

const newApi = new Api(API_URL)
const larekApi = new ApiClient(newApi)

const events = new EventEmitter();

const productsCatalog = new Products(events)
const cartModel = new Cart(events)
const buyerModel = new Buyer(events)


//Контейнеры

const headerContainer = ensureElement<HTMLElement>('header', document.body);
const galleryContainer = ensureElement<HTMLElement>('.page__wrapper')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const modalContainer = ensureElement<HTMLElement>('.modal')
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); 
const successTemplate = ensureElement<HTMLTemplateElement>('#success')
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const orderSuccessContainer = successTemplate.content.cloneNode(true) as HTMLElement


const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order')
const formOrderContainer = cloneTemplate<HTMLFormElement>(formOrderTemplate)
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const formContactsContainer = cloneTemplate<HTMLFormElement>(formContactsTemplate)


// Представление

const headerView = new Header(events, headerContainer);
const galleryView = new Gallery(galleryContainer)
const modalView = new Modal(modalContainer, events)
const cartView = new CartComponent(cloneTemplate(basketTemplate), events)
const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewTemplate), events)
const orderSuccessView = new Success(orderSuccessContainer, events)
const formOrderView = new OrderForm(formOrderContainer, events)
const formContactsView = new ContactsForm(formContactsContainer, events)


// Реализация
function init() {

// Запрос всех товаров
  larekApi
  .getProductList()
  .then((data) => {
    productsCatalog.setProductItems(data);
  })
  .catch((err) => console.error(err));  

//Отрисовка каталога
  events.on('Products:addProducts', () => {
    const items = productsCatalog.getItems().map((item) => {
    const handleClick = () => {
      // item доступен через замыкание
      events.emit('cardCatalog:selected', { id: item.id });
      };
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate),  handleClick)
    return card.render(item)
    })

    galleryView.render({ catalog: items })
  })
  
// Клик по карточке из каталога
  events.on<{id: string}>('cardCatalog:selected', (selectedItem) => {
    const selectedProduct = productsCatalog.getItemById(selectedItem.id);
    if (!selectedProduct) {
        console.error('Товар не найден!');
        return;
    }
    productsCatalog.setSelectedItem(selectedProduct);
    
    cardPreviewView.buttonChange = cartModel.checkItem(selectedItem.id);
    
    modalView.open();
    modalView.render({ 
        content: cardPreviewView.render(selectedProduct) 
    });
});

  // Закрытие модального окна
  events.on('modal:close', () => {
    modalView.close()
  })

  // Нажатие на кнопку в карточке товара
  events.on('cardPreviewButton:click', () => {
    // Берем выбранный товар из модели продуктов
    const selectedProduct = productsCatalog.getSelectedItem();
    
    if (!selectedProduct) return; // Если товара нет
    
    // Проверяем в корзине
    const addedToCart = cartModel.checkItem(selectedProduct.id);
    
    // Применяем логику
    if (!addedToCart) {
        cartModel.addItem(selectedProduct);
    } else {
        cartModel.removeItem(selectedProduct);
    }
    
    // Обновляем кнопку в превью
    cardPreviewView.buttonChange = cartModel.checkItem(selectedProduct.id);
});

  // Получаем список товаров в корзине
  const getCartList = (): HTMLElement[] => {
     const cartList = cartModel.getSelectedItems().map((item, index) => {
        // Создаем колбэк для удаления
        const handleDelete = () => {
            events.emit('cart:remove', { id: item.id });
        };
        
        // Передаем колбэк в конструктор CardCart
        const card = new CardCart(cloneTemplate(cardCartTemplate), events, handleDelete);
        return card.render({...item, index: index + 1});
    });
    return cartList;
  }

  // Изменение в корзине
  events.on('cart:change', () => {
    cartView.render({
        lists: getCartList(),
        totalAmount: cartModel.getTotalPrice(),
        disabled: cartModel.getItemsQuantity() === 0
    })
    headerView.counter = cartModel.getItemsQuantity()
  })

  // Открытие корзины
  events.on('cart:open', () => {
      cartView.disabled = cartModel.getItemsQuantity() === 0
      modalView.open()
      modalView.render({ 
      content: cartView.render()})
  })
  
  // Удаление товара из корзины
  events.on<{id:string}>('cart:remove', ({id}) => {
    const product = productsCatalog.getItemById(id);
    console.log(product)
    if (!product) return;

    if (cartModel.checkItem(id)) {
      cartModel.removeItem(product);
    }  

  })
  

  //Создание заказа

  events.on('cart:makeOrder',() =>{
    modalView.render({ 
        content: formOrderView.render({})
    })
  })

  // Изменение данных о покупателе
events.on<Partial<IBuyer>>('buyer:change', ( data) => {
    buyerModel.updateBuyer(data)
})

// Заполнение формы адреса и выбора оплаты
events.on('formOrder:submit', () => {
    modalView.render({ 
        content: formContactsView.render({})
    })
})

// Проверяем правильность данных, обновляем данные пользователя, отправляем заказ, если он успешный - выводим сообщение.
events.on<{ email: string; phoneNumber: string;}>('formContacts:submit', async () => {
            
    try {
          modalView.render({ 
            content: orderSuccessView.render({
            totalAmount: cartModel.getTotalPrice()
            })
          })

          buyerModel.clearBuyerData()
          cartModel.clearCart()

        } catch (err) {
            console.error('Ошибка при создании заказа:', err)
        }
    }
  )

// Создание заказа, валидация форм, переход к оплате
events.on('order:updated', () => {
    const buyer = buyerModel.getBuyerData()
    const errors = buyerModel.validate()

    formOrderView.paymentMethod = buyer.payment
    formOrderView.address = buyer.address
    
    formContactsView.email = buyer.email
    formContactsView.phone = buyer.phone

    const contactErrors: string[] = [];
    if (errors.email) contactErrors.push(errors.email);
    if (errors.phone) contactErrors.push(errors.phone);
    
    const orderErrors: string[] = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);

    formOrderView.showError(orderErrors);
    formContactsView.showError(contactErrors);
})

}

init()















/*
// Тестирование Products

console.log('=== Тестирование Products ===');

const productsModel = new Products(events);

// 1. Проверка сохранения товаров
console.log('\n1. Сохранение товаров из API:');
productsModel.setProductItems(apiProducts.items);
console.log('Массив товаров после сохранения:', productsModel.getItems());

// 2. Проверка получения товаров
console.log('\n2. Получение всех товаров:');
console.log('Товары:', productsModel.getItems());

// 3. Проверка получения товара по ID

console.log('\n3. Получение всех товара по ID:');
console.log('Товар по ID:', productsModel.getItemById("b06cde61-912f-4663-9751-09956c0eed67"));

// 4. Проверка сохранения выбранного товара

console.log('\n4. Проверка сохранения выбранного товара:');
console.log('Сохраняем товар выбранный товар:', productsModel.setSelectedItem(apiProducts.items[0]));

// 5. Вывод выбранного товара

console.log('\n4. Проверка сохранения выбранного товара:');
console.log('Возвращаем сохраненный товар:', productsModel.getSelectedItem());


productsModel.getSelectedItem()

// Тестирование Buyer

console.log('\n=== Тестирование Buyer ===');

const buyerModel = new Buyer();

// 1. Проверка начальных данных
console.log('\n1. Начальные данные покупателя:');
console.log('Полные данные:', buyerModel.getAllData());

// 2. Проверка обновления полей
console.log('\n2. Обновление полей покупателя:');
buyerModel.updateField('email', 'test@example.com');
buyerModel.updateField('phone', '+1234567890');
buyerModel.updateField('address', 'Test Street, 123');

console.log('Данные после обновления:', buyerModel.getAllData());

// 3. Проверка очистки данных
console.log('\n4. Очистка данных покупателя:');
buyerModel.clearAll();
console.log('Данные после очистки:', buyerModel.getAllData());

// Тестирование Cart

console.log('\n=== Тестирование Cart ===');

const cartModel = new Cart();

// 1: Проверка начального состояния корзины
console.log('\n1. Проверка товаров в корзине:');
console.log('Список товаров:', cartModel.getItems());

// 2: Добавление товара, проверка цены и количества товаров
console.log('\n2. Добавление товара в корзину:');
console.log(`Добавляем товар: ${apiProducts.items[0]} (ID: ${apiProducts.items[0].id})`);
cartModel.addItem(apiProducts.items[0]);
console.log('Проверяем список товаров:', cartModel.getItems());
console.log('Проверяем количество товаров:', cartModel.getItemsQuantity());
console.log('Проверяем общую цену товаров:', cartModel.getTotalPrice());

// 3: Добавление второго, проверка цены и количества товаров
console.log('\n3. Добавление второго товара:');
console.log(`Добавляем товар: ${apiProducts.items[1]} (ID: ${apiProducts.items[1].id})`);
cartModel.addItem(apiProducts.items[1]);
console.log('Проверяем список товаров:', cartModel.getItems());
console.log('Проверяем количество товаров:', cartModel.getItemsQuantity());
console.log('Проверяем общую цену товаров:', cartModel.getTotalPrice());

// 4: Удаление второго товара
console.log('\n4. Удаление второго товара:');
console.log(`Удаляем товар: ${apiProducts.items[1]} (ID: ${apiProducts.items[1].id})`);
cartModel.removeItem(apiProducts.items[1].id);
console.log('Список товаров:', cartModel.getItems());

// 5: Проверка наличия товара
console.log('\n4. Проверка наличия товара:');
console.log(`Товар ${apiProducts.items[0].title} существует: ${cartModel.checkItem(apiProducts.items[0].id) ? 'Да' : 'Нет'}`);
console.log(`Товар ${apiProducts.items[1].title} существует: ${cartModel.checkItem(apiProducts.items[1].id) ? 'Ошибка' : 'Нет'}`);

// 7: Очистка корзины
console.log('\n6. Очистка корзины:');
console.log(`Очищаем корзину...`);
cartModel.clearCart();
console.log(`Количество товаров после очистки: ${cartModel.getItemsQuantity()} (${cartModel.getItemsQuantity() === 0 ? 'Корзина пуста' : 'Корзина не пуста'})`);
console.log('Список товаров после очистки:', cartModel.getItems());

// Получение списка товаров
const service = new ProductOrderService(api);
(async () => {
  try {
    const products = await service.getProducts();
    console.log('Все товары:', products.items);
    console.log('Всего товаров:', products.total);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
  }
})();
*/
