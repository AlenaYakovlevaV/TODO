(function() {
    let listArray = [], 
    listName = '';
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2'); //создание заголовка
        appTitle.innerHTML = title; //передает название из параметра title
        return appTitle; //возвращает заголовок
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form'); //создание формы
        let input = document.createElement('input'); //создание поля ввода
        let buttonWrapper = document.createElement('div'); //создание контейнера
        let button = document.createElement('button'); //создание кнопки

        form.classList.add('input-group', 'mb-3'); //добавление классов
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела'; //добавление атрибута
        buttonWrapper.classList.add('input-group-append'); 
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело'; //добавление текста кнопке
        button.disabled = true;
        buttonWrapper.append(button); //добавление кнопки в поле кнопок
        form.append(input); //добавление инпута в форму
        form.append(buttonWrapper); //добавление поля кнопок в форму

        input.addEventListener('input', function() {
            if(input.value !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        return {
            form, //форма (объект)
            input, //инпут
            button, //кнопка
        };
    }

    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul'); //создаем список
        list.classList.add('list-group'); //задаем класс
        return list; //возвращаем срисок дел
    }
    //создание пунктов списка
    function createTodoItem(obj) { 
        let item = document.createElement('li'); //создаем пункт списка
        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div'); //контейнер для кнопок
        let doneButton = document.createElement('button'); //кнопка готово
        let deleteButton = document.createElement('button'); //кнопка удаления

        //устанавливаем стили для элемента списка, а также для размещения кнопок
        //в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name; //задание текста пункта из параметра ф-ции
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово'; //добавление текста на кнопку
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить'; 

        if (obj.done == true) {
            item.classList.add('list-group-item-success');
        }

        //Добавляем обработчики на кнопки
        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');

            for (const listItem of listArray) {
                if (listItem.id == obj.id) {
                    listItem.done = !listItem.done;
                }    
            }
            saveList(listArray, listName);
        });
        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove();

                for (let i=0; i<listArray.length; i++) {
                    if (listArray[i].id == obj.id) {
                        listArray.splice(i,1);
                    }    
                }
                saveList(listArray, listName);
            }
        });

        //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton); //добавление кнопки в див
        buttonGroup.append(deleteButton); 
        item.append(buttonGroup); //добавление группы кнопок в пункт

        //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item, //пункт
            doneButton, //состояние кнопки готово
            deleteButton, //состояние кнопки удалить
        };
    }

    function getNewID(arr) {
        let max = 0;
        for (const item of arr) {
            if(item.id>max) max = item.id;
        }
        return max + 1;
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr))
        console.log(JSON.stringify(arr))
    }

    function createTodoApp(container, title = 'Список дел', keyName) {

        let todoAppTitle = createAppTitle(title);
        let todoItemform = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;

        container.append(todoAppTitle);
        container.append(todoItemform.form);
        container.append(todoList); 

        let localData = localStorage.getItem(listName);

        if (localData !== null && localData !== '') {
            listArray = JSON.parse(localData);
        }

        for (const itemList of listArray) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        //браузер создает событие submit на форме по нажатию на enter или на кнопку создания дела
        todoItemform.form.addEventListener('submit', function(e) {
            //эта строчка необходима, чтобы предотвратить стандартное действие браузера
            //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            //игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemform.input.value) {
                // todoItemform.button.disabled = true;
                return;
            } 

            let newItem = {
                id: getNewID(listArray),
                name: todoItemform.input.value,
                done: false,
            };

            let todoItem = createTodoItem(newItem);

            listArray.push(newItem);

            saveList(listArray, listName);

            //создаем и добавляем в список нвоое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            todoItemform.button.disabled = true;
            //обнуляем значение в поле, чтобы не пришлось стирать вручную
            todoItemform.input.value = '';
            // if (!todoItemform.input.value) {
            //     todoItemform.button.disabled = true;
            // }
        });
    }

    window.createTodoApp = createTodoApp;

})();