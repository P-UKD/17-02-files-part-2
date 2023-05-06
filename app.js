import fs from 'fs';

/**
 * Додає новий продукт до CSV файлу з продуктами.
 * @param {string} csvFilePath - шлях до CSV файлу.
 * @param {string} id - ідентифікатор продукту.
 * @param {string} name - назва продукту.
 * @param {number} price - ціна продукту.
 * @throws {Error} Якщо продукт з таким ідентифікатором вже існує в CSV файлі.
 */
function addProduct(csvFilePath, id, name, price) {
    const existingProduct = getProduct(csvFilePath, id);
    if (existingProduct) {
        throw new Error(`Продукт з ідентифікатором ${id} вже існує в CSV файлі.`);
    }
    fs.appendFileSync(csvFilePath, `${id},${name},${price}\n`);
}

/**
 * Знаходить продукт в CSV файлі за його ідентифікатором.
 * @param {string} csvFilePath - шлях до CSV файлу.
 * @param {string} id - ідентифікатор продукту.
 * @returns {Array<string>|undefined} Масив, що містить інформацію про продукт ([id, name, price]), або undefined якщо продукт не знайдено.
 */
function getProduct(csvFilePath, id) {
    const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvFileContent.split('\n');
    const productLine = lines.find(line => line.split(',')[0] == id);
    if (!productLine) {
        return undefined;
    }
    const productArray = productLine.split(',');
    return productArray;
}

/**
 * Оновлює існуючий продукт в CSV файлі.
 * @param {string} csvFilePath - шлях до CSV файлу.
 * @param {string} id - ідентифікатор продукту.
 * @param {string} name - нова назва продукту.
 * @param {number} price - нова ціна продукту.
 */
function updateProduct(csvFilePath, id, name, price) {
    const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvFileContent.split('\n');
    const updatedLines = lines.map(line => {
        const [productId, productName, productPrice] = line.split(',');
        if (productId === id) {
            return [productId, name, price].join(',');
        }
        return line;
    });
    const updatedCsvFileContent = updatedLines.join('\n');
    fs.writeFileSync(csvFilePath, updatedCsvFileContent);
}

/**
 * Видаляє існуючий продукт з CSV файлу.
 * @param {string} csvFilePath - шлях до CSV файлу.
 * @param {string} id - ідентифікатор продукту.
 * @throws {Error} Якщо продукт з таким ідентифікатором не знайдено в CSV файлі.
 */
function deleteProduct(csvFilePath, id) {
    const csvFileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvFileContent.split('\n');
    const index = lines.findIndex(line => line.split(',')[0] == id);
    if (index === -1) {
        throw new Error(`Продукт з ідентифікатором ${id} не знайдений.`);
    }
    lines.splice(index, 1);
    const updatedCsvFileContent = lines.join('\n');
    fs.writeFileSync(csvFilePath, updatedCsvFileContent);
}

// Тестування

const filePath = './products.csv';

// Очищуємо файл перед тестами

fs.writeFileSync(filePath, '');

// Додаємо продукт

const product = {
    id: '1',
    name: 'Product 1',
    price: 100
};

addProduct(filePath, product.id, product.name, product.price);

const [writtenId, writtenName, writtenPrice] = getProduct(filePath, product.id);

// Перевіряємо дані продукту

if (product.id != writtenId || product.name != writtenName || product.price != writtenPrice) {
    // Помилка якщо дані не співпадають
    throw new Error('Щось пішло не так.');
}

// Оновлюємо продукт

const newName = 'Product 2';
const newPrice = 200;

updateProduct(filePath, product.id, newName, newPrice);

const [updatedId, updatedName, updatedPrice] = getProduct(filePath, product.id);

// Перевіряємо, чи зміни відображаються в CSV файлі

if (updatedName != newName || updatedPrice != newPrice) {
    // Помилка якщо дані не співпадають
    throw new Error('Щось пішло не так.');
}

// Видаляємо продукт

deleteProduct(filePath, product.id);

const deletedProduct = getProduct(filePath, product.id);

// Перевіряємо, чи продукт був видалений

if (deletedProduct !== undefined) {
    // Помилка якщо продукт не був видалений
    throw new Error('Щось пішло не так.');
}

// Повідомлення про успішне виконання тестів

console.log('Всі тести пройдено успішно!');