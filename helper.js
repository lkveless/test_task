//Шаблон формы для загрузки файлов
const mainTemplate = `
        <html>
            <head>
                <title> Test task page </title>
                <style>
                    #inputForm{
                        display: flex;
                        flex-direction: column;
                        width: 20%;
                    }
                </style>
            </head>
            <body>
                <% if (typeof error !== 'undefined') {%>
                    <p><%= error %></p>
                <% } %>
                <form action="/" method="post" id="inputForm" enctype="multipart/form-data">
                    <label for="textField">Поле для текста</label>
                    <input type="text" id="textField" name="text">
                    <label for="fileInputFirst">Поле для загрузки первого файла (Base64)</label>
                    <input type="file" id="fileInputFirst" accept="text/plain, .txt" name="file1">
                    <label for="fileInputSecond">Поле для загрузки второго файла (Base64)</label>
                    <input type="file" id="fileInputSecond" accept="text/plain, .txt" name="file2">
                    <input type="submit" value="Отправить">
                </form>
            </body>
        </html>
    `;

const jsonData = {
    help: 'Отправьте запрос с данными. Файлы кодируйте в Base64.',
    example: {
        text: 'Текстовая строка',
        file1: "0KHQvtC00LXRgNC20LjQvNC+0LUg0L/QtdGA0LLQvtCz0L4g0YTQsNC50LvQsC4=",
        file2: "0KHQvtC00LXRgNC20LjQvNC+0LUg0LLRgtC+0YDQvtCz0L4g0YTQsNC50LvQsC4="
    }
}

const jaccardSimilarity = (text1, text2) => {
    // Функция для разделения текста на слова
    const tokenize = (text) => text.toLowerCase().match(/[a-zA-Zа-яА-ЯёЁ]+/g);
    // Разделение полученных текстов на слова
    const words1 = new Set(tokenize(text1));
    const words2 = new Set(tokenize(text2));
    // Нахождение пересечения слов
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    // Нахождение объединения слов
    const union = new Set([...words1, ...words2]);
    // Вычисление коэффициента схожести Жаккара
    const similarity = intersection.size / union.size;
    
    return similarity;
};
    
module.exports = {mainTemplate, jsonData, jaccardSimilarity};