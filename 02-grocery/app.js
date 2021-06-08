const alertMsg = document.querySelector(".alert");

const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

const groceryContainer = document.querySelector(".grocery-container");
const form = document.querySelector(".grocery-form");
const groceryIn = document.getElementById("grocery");
const groceryList = document.querySelector(".grocery-list");

let editFlag = false;
let editId = "";
let editElement = "";

/* submit form */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = groceryIn.value;
  // using timestamp as uuid
  const id = Date.now().toString();

  if (value) {
    if (editFlag) {
      // editing
      editElement.innerHTML = value;
      displayAlert("Value Changed", "success");
      // edit local storage
      editLS(editId, value);
      setBackToDefault();
    } else {
      // render list item
      renderListItems(id, value);
      // display alert
      displayAlert("Added item", "success");
      // show container
      groceryContainer.classList.add("show-container");
      // add to local storage
      addToLS(id, value);
      // set back to default
      setBackToDefault();
    }
  } else {
    displayAlert("Please Enter Value", "danger");
  }
});

/* clear items */
clearBtn.addEventListener("click", () => {
  // grocceryList.innerHTML = "";
  /* As a rule of thumb, innerHtml is slow because the browser needs to reparse the html (even though it is being set to ''). 
  removeChild, however, directly modifies the DOM without any parsing needed. Therefore removeChild is faster. */
  while (groceryList.firstChild) {
    groceryList.removeChild(groceryList.firstChild);
  }
  groceryContainer.classList.remove("show-container");
  displayAlert("List Cleared", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
});

/* Displayig results */
const displayAlert = (text, action) => {
  alertMsg.textContent = text;
  alertMsg.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(() => {
    alertMsg.textContent = "";
    alertMsg.classList.remove(`alert-${action}`);
  }, 1000);
};

/* Set values to default */
const setBackToDefault = () => {
  groceryIn.value = "";
  editFlag = false;
  editId = "";
  editElement = "";
  submitBtn.textContent = "Add";
};

/* Delete function */
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  groceryList.removeChild(element);
  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove("show-container");
  }
  displayAlert("Item removed", "danger");
  setBackToDefault();
  // remove from the local storage
  removeFromLS(id);
};

/* Edit function */
const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  groceryIn.value = editElement.innerHTML;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = "edit";
};

/* add to local storage */
const addToLS = (id, value) => {
  const item = { id, value };
  let items = getLS();
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
};

/* remove from local storgae */
const removeFromLS = (id) => {
  let items = getLS();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};

/* Edit local sotorage */
const editLS = (id, value) => {
  let items = getLS();
  items = items.map((item) => (item.id === id ? { id, value } : item));
  localStorage.setItem("list", JSON.stringify(items));
};

/* Get data from Local Storage */
const getLS = () => JSON.parse(localStorage.getItem("list")) || [];

/* render list items */
const renderListItems = (id, value) => {
  const element = document.createElement("article");
  // add class
  element.classList.add("grocery-item");
  // add id
  // https://www.w3schools.com/tags/att_data-.asp
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
      <p class="title">${value}</p>
      <div class="btn-container">
        <button class="edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  // we cannot access the buttons before creating them so we are adding event listeners at the time of creation
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");
  editBtn.addEventListener("click", editItem);
  deleteBtn.addEventListener("click", deleteItem);
  // append child
  groceryList.appendChild(element);
};

/* setup from local storage */
const setupList = () => {
  let items = getLS();
  if (items.length > 0) {
    displayAlert("Loaded items", "success");
    items.forEach((item) => renderListItems(item.id, item.value));
    groceryContainer.classList.add("show-container");
  }
};

window.addEventListener("DOMContentLoaded", setupList);
