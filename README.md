# Порядок дій для перетворення з sqlite в xml:

1. Потрібно скопіювати і вставити файл .sqlite в папку з цим (sqliteToXml) проектом.
2. В файлі .sqlite потрібно змінити формат на .db.
3. Потрібно перевірити, чи є папка в проекті "node_modules", якщо її немає потрібно написати в терміналі "npm i".
4. Якщо немає "nodemon" то потрібновиконати таку команду в терміналі: "npm install -g nodemon".
5. Якщо знову виникає якась помилка, потрібно видалити папку "node_modules" з проекту і знову виконати команду "npm i".
6. Якщо вже немає ніяких помилок, запускаємо в терміналі "npm run dev".
7. Успішно згенерений файл .xml тепер доступний в папці проекту.

