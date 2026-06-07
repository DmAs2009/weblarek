import './scss/styles.scss';

import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { apiProducts } from './utils/data';
import { ProductOrderService } from './components/Services/ProductOrderService';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';

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