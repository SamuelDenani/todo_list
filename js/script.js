'use strict';

// Constant that defines the svg element for the remove task button image.
const removeIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';

// Constant that defines the svg element for the completed task button image.
const completeIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

/*
 * Initialize arrays containing ToDo Items.
 * If localStorage already contains items stored, the arrays are initialized
 * to the stored values. Otherwise, they are initalized to be empty arrays.
 */
const todos = (localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []);
const completed = (localStorage.getItem('completed') ? JSON.parse(localStorage.getItem('completed')) : []);

loadItems();

/*
 * When "+" button is clicked, it should add to the list an item with the text
 * inside the text input. It only adds the task if the text inside the input is true.
 */
document.getElementById('new-item-button').onclick = function () {
    const itemText = document.getElementById('new-item-input').value;
    if (itemText) {
        todos.push(itemText);
        addItemToDOM(itemText);
        document.getElementById('new-item-input').value = '';

        updateStorage();
    }
}

/* 
 * When user hits Enter key in keyboard it should add to the list an item with the 
 * text inside the text input. It only adds the task if the text inside the input is true;
 */
document.getElementById('new-item-input').addEventListener('keypress', function (event) {
    let itemText = document.getElementById('new-item-input').value;
    if ((event.keyCode == 13) && itemText) {
        todos.push(itemText);
        addItemToDOM(itemText);
        document.getElementById('new-item-input').value = '';

        updateStorage();
    }
})

/* Given a string, creates an item with the format:
 * <li>
 * 	Item text
 * 	<div class="buttons">
 * 		<button class="remove">
 * 			<svg></svg>
 * 		</button>
 * 		<button class="complete">
 * 			<svg></svg>
 * 		</button>
 * 	</div>
 * </li>
 * SVG code is in a constant.
 * It also takes a boolean that determines wether the item should
 * go in the completed list.
 */
function addItemToDOM(itemText, completed) {
    const item = document.createElement('li');
    item.innerText = itemText;

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.innerHTML = removeIcon;
    removeButton.onclick = removeItem;

    const completeButton = document.createElement('button');
    completeButton.classList.add('complete');
    completeButton.innerHTML = completeIcon;
    completeButton.onclick = completeItem;

    buttons.append(removeButton);
    buttons.append(completeButton);

    item.append(buttons);

    let listId = (completed ? 'completed-list' : 'todo-list');

    document.getElementById(listId).prepend(item);
}

/*
 * Removes the item from ToDo list arrays, from the interface and updates
 * the localStorage.
 */
function removeItem() {
    const item = this.parentNode.parentNode;
    const currentListId = item.parentNode.id;
    const text = item.innerText;

    item.remove();

    if (currentListId === 'todo-list') {
        todos.splice(todos.indexOf(text), 1);
    }
    else {
        completed.splice(completed.indexOf(text), 1);
    }

    updateStorage();
}

/*
 * Change the complete state of the item whose complete button called the
 * function. 
 * If the item is marked as completed, we remove it from the Completed List and array
 * and put in the ToDo List and array. If the item is marked as incomplete, we do the opposite.
 */
function completeItem() {
    const item = this.parentNode.parentNode;
    const currentListId = item.parentNode.id;
    const text = item.innerText;

    item.remove();

    if (currentListId === 'todo-list') {
        todos.splice(todos.indexOf(text), 1);
        completed.push(text);
        document.getElementById('completed-list').prepend(item);
    }
    else {
        completed.splice(completed.indexOf(text), 1);
        todos.push(text);
        document.getElementById('todo-list').prepend(item);
    }

    updateStorage();
}

/*
 * Loads the ToDo list with the  elements inside the arrays.
 */
function loadItems() {
    for (let i = 0; i < todos.length; i = i + 1) {
        addItemToDOM(todos[i]);
    }
    for (let i = 0; i < completed.length; i = i + 1) {
        addItemToDOM(completed[i], true);
    }
}

/*
 * Takes the ToDo list arrays and store the values in localStorage using
 * JSON.stringfy to save like a string.
 */
function updateStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completed', JSON.stringify(completed));
}