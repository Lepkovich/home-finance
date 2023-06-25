## Домашка к уроку «Создание проекта с нуля на JS»

Необходимо создать приложение для учета домашних финансов с авторизацией, согласно макету.
Для верстки проекта использвать Bootstrap.

### Страница авторизации
* Реализовать страницу авторизации по аналогии с тем, как это было сделано в проекте Quiz.
* Настроить валидацию поля email, пароль при вводе не должен быть виден.
* Фраза “Пройдите регистрацию” должна быть ссылкой на страницу регистрации.

### Страница регистрации
* Реализовать по аналогии с тем, как это было сделано в проекте Quiz.
* Настроить валидацию полей:
+ ФИО - может содержать русские буквы и пробелы. Каждое новое слово - с большой буквы
+ email должен быть корректным
+ пароль должен быть не менее 8 символов, содержать как минимум 1 букву в верхнем регистре и как минимум 1 цифру
+ пароли должны совпадать

Фраза “Войдите в систему” должна быть ссылкой на страницу авторизации.

### Layout основных страниц
* Справа на страницах сделать сайдбар, содержащий лого, меню, баланс и ФИО пользователя (пример второй слева на странице https://getbootstrap.com/docs/5.2/examples/sidebars/)
* Пункт меню “Категории” должен сворачиваться.
* В поле “Баланс” должен выводиться актуальный баланс, запрошенный с бэка. Баланс обновляется автоматически на бэкенде, хотя у вас есть готовый запрос PUT на его изменение вручную (можно добавить такой функционал по желанию. Например, чтобы при нажатии на баланс открывалось модальное окно с инпутом, где введено значение баланса, его можно изменить и сохранить).
* При клике на иконку пользователя появляется всплывающее меню с одним пунктом “Logout”, по клику на который происходит выход из системы.
* Остальная часть Layout - основной контент.

### Страница редактирования категории доходов
На этой странице есть поле и две кнопки. В поле изначально должно вставляться название редактируемой категории. При клике на кнопку “Сохранить” новое название из поля сохраняется в базу данных и затем происходит переход на страницу категорий. При клике на “Отмена” происходит переход на страницу категорий без сохранения.

### Страница создания категории доходов
На этой странице есть поле и две кнопки. В поле вводится название категории, оно не может быть пустым. При клике на кнопку “Создать” происходит создание новой категории и переход на страницу категорий. При клике на “Отмена” происходит переход на страницу категорий без сохранения.

### Страница категории расходов, страницы создания/редактирования категорий расходов
Реализовать аналогично страницам категорий доходов. 

### Страница Доходы и расходы
* На этой странице отображается таблица со всеми операциями. Поля таблицы отображены в макете.
* В каждой строке есть кнопки “Редактировать” (иконка карандаша) и “Удалить” (исконка корзины). При клике на кнопку “Редактировать” происходит переход на страницу редактирования дохода/расхода. При клике на “Удалить” появляется попап с запросом подтверждения. При подтверждении элемент удаляется.
* Над таблицей с доходами/расходами расположен фильтр операций по датам. По умолчанию активен пункт “Сегодня”. При клике на пункты фильтра соответствующий пункт становится активным, а операции фильтруются в соответствии с выбранным вариантом. При выборе варианта “Интервал” пользователь может ввести свой диапазон дат, и операции будут отфильтрованы по нему. Фильтрация должна происходить каждый раз, когда пользователь меняет диапазон.

### Страница создания дохода или расхода
На странице расположены 5 полей:
* Тип:
*select с 2 вариантами: доход и расход*
* Категория: 
*select, в который подтягиваются категории доходов или расходов (в зависимости от того, что выбрано в поле “тип”)*
* Сумма: 
*Поле числового типа*
* Дата:
*Выбор даты*
* Комментарий:
*Текстовая область*

При клике на кнопку “Создать” доход/расход записывается в базу данных. При клике на “Отмена” происходит переход на предыдущую страницу без сохранения.

### Страница редактирования дохода или расхода
* Поля на этой странице те же, что и на странице создания. При переходе на страницу поля должны быть заполнены данными, соответствующими редактируемому элементу.
* Кнопка “Сохранить” обновляет доход/расход в базе данных. При клике на “Отмена” происходит переход на предыдущую страницу без сохранения.

### Страница Главная
* Вверху страницы фильтр, как на странице “Доходы и расходы”. Работает он аналогичным образом.
* Вторая часть страницы разделена на 2 части. Слева расположен график доходов, справа - расходов. Графики нужно реализовать при помощи инструмента [Chart.js:](https://www.chartjs.org/docs/latest/samples/other-charts/pie.html "пример и инструкции")  