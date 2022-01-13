(function () {
  var listId = 0;

  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoItem(name, done) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    if (done) {
      item.classList.add("list-group-item-success");
    }
    item.setAttribute("data-deal", listId);

    listId += 1;

    item.textContent = name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoApp(container, title = "Список дел", deals = [], key) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    console.log(items);
    let appTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    if (localStorage.getItem(key) !== "[]") {
      for (let item of items) {
        let todoItem = createTodoItem(item.text, item.status);
        let itemNum = todoItem.item.dataset.deal;
        console.log(todoItem.item);
        todoList.append(todoItem.item);
        todoItem.doneButton.addEventListener("click", function () {
          if (!item.status) {
            item.status = true;
          } else {
            item.status = false;
          }
          localStorage.setItem(key, JSON.stringify(items));
          todoItem.item.classList.toggle("list-group-item-success");
        });
        todoItem.deleteButton.addEventListener("click", function () {
          if (confirm("Вы уверены?")) {
            items.splice(itemNum, 1);
            localStorage.setItem(key, JSON.stringify(items));
            todoItem.item.remove();
          }
        });
      }
    } else {
      for (let item of deals) {
        let todoItem = createTodoItem(item.text, item.status);
        todoList.append(todoItem.item);
        items.push({
          text: item.text,
          status: item.status,
        });
        localStorage.setItem(key, JSON.stringify(items));
        todoItem.doneButton.addEventListener("click", function () {
          let itemNum = todoItem.item.dataset.deal;
          console.log(itemNum);
          if (!items[itemNum].status) {
            items[itemNum].status = true;
          } else {
            items[itemNum].status = false;
          }
          localStorage.setItem(key, JSON.stringify(items));
          todoItem.item.classList.toggle("list-group-item-success");
        });

        todoItem.deleteButton.addEventListener("click", function () {
          let itemNum = todoItem.item.dataset.deal;
          if (confirm("Вы уверены?")) {
            items.splice(itemNum, 1);
            localStorage.setItem(key, JSON.stringify(items));
            todoItem.item.remove();
          }
        });
      }
    }

    todoItemForm.input.addEventListener("input", function () {
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true;
      } else {
        todoItemForm.button.disabled = false;
      }
    });

    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value, false);
      let itemNum = todoItem.item.dataset.deal;
      items.push({
        text: todoItemForm.input.value,
        status: false,
      });
      localStorage.setItem(key, JSON.stringify(items));
      todoItem.doneButton.addEventListener("click", function () {
        if (!items[itemNum].status) {
          items[itemNum].status = true;
        } else {
          items[itemNum].status = false;
        }
        localStorage.setItem(key, JSON.stringify(items));
        todoItem.item.classList.toggle("list-group-item-success");
      });

      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          items.splice(itemNum, 1);
          localStorage.setItem(key, JSON.stringify(items));
          todoItem.item.remove();
          console.log(items);
        }
      });

      todoList.append(todoItem.item);

      todoItemForm.input.value = "";
      todoItemForm.button.disabled = true;
    });

    container.append(appTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
  }

  window.createTodoApp = createTodoApp;
})();
