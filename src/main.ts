//import '.scss/styles.scss';

import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products'; // Предполагаемый класс для товаров
import { apiProducts } from './utils/data';


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

//3. Проверка получения товара по ID

console.log('\n3. Получение всех товара по ID:');
console.log('Товар по ID:', productsModel.getItemById("b06cde61-912f-4663-9751-09956c0eed67"));


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

