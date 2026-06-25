import './scss/styles.scss';

import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { apiProducts } from './utils/data';
import { ProductOrderService } from './components/Services/ProductOrderService';
import { API_URL } from './utils/constants';
import { Api, ApiListResponse } from './components/base/Api';
import { ensureElement } from './utils/utils';
import { Basket, StoreItemBasket } from './components/View/Basket';
import { Success } from './components/View/Success';
import { IOrderForm} from './types';
import { AppState } from './components/View/AppPage';
import { Page } from './components/View/MainPage';
import { Modal } from './components/View/Modal';
import { Order } from './components/View/Order';
import { StoreItem, StoreItemPreview } from './components/View/CardView';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate } from './utils/utils';
import { ContactsForm } from './components/View/ContactsForm';
import { Product } from './components/View/AppPage';


const events = new EventEmitter();

const api = new Api(API_URL)

// Тестирование Products

console.log('=== Тестирование Products ===');

const productsModel = new Products();

// 1. Проверка сохранения товаров
console.log('\n1. Сохранение товаров из API:');
productsModel.setItems(apiProducts.items);
console.log('Массив товаров после сохранения:', productsModel.getItems());

// 2. Проверка получения товаров
console.log('\n2. Получение всех товаров:');
console.log('Первые 3 товара:', productsModel.getItems().slice(0, 3));

// 3. Проверка получения товара по ID

console.log('\n3. Получение всех товара по ID:');
console.log('Товар по ID:', productsModel.getItemById("b06cde61-912f-4663-9751-09956c0eed67"));

// 4. Проверка сохранения выбранного товара

console.log('\n4. Проверка сохранения выбранного товара:');
console.log('Сохраняем товар выбранный товар:', productsModel.saveSelectedItem(apiProducts.items[0]));

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



// Все шаблоны
const storeProductTemplate =
  ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events)
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close')
    modal.close()
  }
})

// Получаем лоты с сервера
api.get('/product')
  .then((res: unknown) => {
    // Приводим тип к IApiResponse
    const apiResponse = res as { items: Product[] };
    
    // Проверяем, что items существует и является массивом
    if (apiResponse && Array.isArray(apiResponse.items)) {
      console.log('Загружено товаров:', apiResponse.items.length);
      appData.setStore(apiResponse.items);
    } else {
      console.warn('Структура ответа некорректна, используем тестовые данные');
    }
  })
  .catch((err: Error) => {
    console.error('Ошибка загрузки товаров:', err);
  });

// Изменились элементы каталога
events.on('items:changed', () => {
  page.store = appData.store.map((item) => {
    const product = new StoreItem(cloneTemplate(storeProductTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

// Открытие карточки
events.on('card:select', (item: Product) => {
  page.locked = true;
  const product = new StoreItemPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('card:toBasket', item)
    },
  });
  modal.render({
    content: product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      selected: item.selected
    }),
  });
});

// Добавление товара в корзину
events.on('card:toBasket', (item: Product) => {
  item.selected = true;
  appData.addToBasket(item);
  page.counter = appData.getBasketAmount();
  modal.close();
})

// Открытие корзины
events.on('basket:open', () => {
  page.locked = true
  const basketItems = appData.basket.map((item, index) => {
    const storeItem = new StoreItemBasket(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit('basket:delete', item)
      }
    );
    return storeItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  modal.render({
    content: basket.render({
      list: basketItems,
      price: appData.getTotalBasketPrice(),
    }),
  });
});

// Удалить товар из корзины
events.on('basket:delete', (item: Product) => {
  appData.deleteFromBasket(item.id);
  item.selected = false;
  basket.price = appData.getTotalBasketPrice();
  page.counter = appData.getBasketAmount();
  basket.refreshIndices();
  if (!appData.basket.length) {
    basket.disableButton();
  }
})

// Оформить заказ
events.on('basket:order', () => {
  modal.render({
    content: order.render(
      {
        address: '',
        valid: false,
        errors: []
      }
    ),
  });
});

// Изменилось состояние валидации заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Изменились введенные данные
events.on('orderInput:change', (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// Заполнить телефон и почту
events.on('order:submit', () => {
  appData.order.total = appData.getTotalBasketPrice()
  appData.setItems();
  modal.render({
    content: contacts.render(
      {
        valid: false,
        errors: []
      }
    ),
  });
})

// Покупка товаров
events.on('contacts:submit', () => {
  api.post('/order', appData.order)
    .then((res) => {
      events.emit('order:success', res);
      appData.clearBasket();
      appData.refreshOrder();
      order.disableButtons();
      page.counter = 0;
      appData.resetSelected();
    })
    .catch((err) => {
      console.log(err)
    })
})

// Окно успешной покупки
events.on('order:success', (res: ApiListResponse<string>) => {
  modal.render({
    content: success.render({
      description: res.total
    })
  })
})

// Закрытие модального окна
events.on('modal:close', () => {
  page.locked = false;
  appData.refreshOrder();
});