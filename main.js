/*
Тестовое задание выполнено Рахманиным Артёмом

Для запуска программы используется команда node main.js
*/

const express = require('express');
const app = express();
const ejs = require('ejs');
const contentDisposition = require('content-disposition');
const multer = require('multer');
const {mainTemplate, jsonData, jaccardSimilarity} = require('./helper');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
    const acceptHeader = req.get('accept');

    if (acceptHeader && acceptHeader.includes('text/html')) {
        // Если запрос выполнен через браузер, отправится форма для загрузки файлов
        const html = ejs.render(mainTemplate);

        res.send(html)
    } else {
        // Если запрос выполнен как REST JSON API, отправится JSON-ответ
        res.json(jsonData);
    }

});

app.post('/', upload.fields([{name: 'file1'}, {name: 'file2'}]), (req, res) => {
    const text = req.body.text;

    if (!text || !req.files['file1'] || !req.files['file2']) {
        // Обработка ошибки: не все поля заполнены
        const data = { error: 'Не все поля заполнены' };
        const htmlError = ejs.render(mainTemplate, data);
        return res.send(htmlError);
    }

    //Обработка текста из полученных файлов
    const file1Buffer = req.files['file1'][0].buffer;
    const file2Buffer = req.files['file2'][0].buffer;

    const file1Content = file1Buffer.toString('utf8');
    const file2Content = file2Buffer.toString('utf8');

    // Функция для вычисления схожести между текстами в файлах
    const similarity = jaccardSimilarity(file1Content, file2Content);

    if (req.get('accept') && req.get('accept').includes('application/json')) {
        // Если запрос выполнен как REST JSON API, отправится JSON-ответ
        return res.json({
            text: text,
            similarity: similarity
        });
    } else {
        // Если запрос выполнен через браузер, отправится файл для скачивания
        const resultText = `Для запроса "${text}" сходство (расстояние) равно ${similarity}`;
        const filename = 'Ответ на запрос.txt';

        res.setHeader('Content-disposition', contentDisposition(filename));
        res.setHeader('Content-type', 'text/plain');
        res.end(resultText);
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`server is listening on ${PORT}`) });

