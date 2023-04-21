// URL Base
const baseURL = "https://ecommercebackend.fundamentos-29.repl.co/";
// To show and hide cart
const carToggle = document.querySelector(".car__toggle");
const carBlock = document.querySelector(".car__block");
// To "draw" products in web
const productsList = document.querySelector("#products-container");
// To shopping cart logic
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
const emptyButton = document.querySelector(".empty__button");
// Elements to be added at the shopping cart
let carProducts = [];
// modalContainer
const modalContainer = document.querySelector("#modal-container");
const modalElement = document.querySelector("#modal");
let modalDetails = [];

// Show and hide cart with toggle
// add and remove the class to show toggle with click
carToggle.addEventListener("click", () => {
  carBlock.classList.toggle("nav__car__visible");
});

// To execute all the event listeners at the beginning
enventListenersLoader();

function enventListenersLoader() {
  // Click to "Add to car"
  productsList.addEventListener("click", addProduct);
  // Click to X to delete product in cart
  car.addEventListener("click", deleteProducts);
  // Click to empty all cart
  emptyButton.addEventListener("click", emptyCar);
  // Execute when page is loaded
  document.addEventListener("DOMContentLoaded", () => {
    carProducts = JSON.parse(localStorage.getItem("cart")) || [];
    carElementsHTML();
  });
  // Click to show modal window
  productsList.addEventListener("click", modalProduct);
  // Click to close modal window
  modalContainer.addEventListener("click", closeModal);
}

function getProducts() {
  axios
    .get(baseURL)
    .then(function (response) {
      const products = response.data;
      printProducts(products);
    })
    .catch(function (error) {
      console.log(error);
    });
}
getProducts();

function printProducts(products) {
  let html = "";
  for (let i = 0; i < products.length; i++) {
    html += `
    <div class="product__container">
      <div class="product__container__img">
        <img src="${products[i].image}" alt="image">
      </div>
      <div class="product__container__name">
        <p>${products[i].name}</p>
      </div>
      <div class="product__container__price">
      <p>$${products[i].price.toFixed(2)}</p>
    </div>
    <div class="product__container__button">
      <button class="car___button add__to__car" id="add__to__cart" data-id="${
        products[i].id
      }">Add to Car</button>
      <span>stock:</span><button class="car___button">${
        products[i].quantity
      }</button>
    </div>
    <div class="product__container__rating">
    <p>⭐⭐⭐⭐⭐</p>
    </div>
    <div class="product__container__details" >
      <button class="product__details" >Product Details</button>
    </div>
    </div>
    `;
  }
  productsList.innerHTML = html;
}

// Adding products to cart (1, 2 and 3)
// (1)---------------------------
function addProduct(event) {
  if (event.target.classList.contains("add__to__car")) {
    const product = event.target.parentElement.parentElement;
    carProductsElements(product);
  }
}

// (2)------------------------------
function carProductsElements(product) {
  const infoProduct = {
    id: product.querySelector("button").getAttribute("data-id"),
    image: product.querySelector("img").src,
    name: product.querySelector(".product__container__name p").textContent,
    price: product.querySelector(".product__container__price p").textContent,
    quantity: 1,
  };

  // Add a counter
  if (carProducts.some((product) => product.id === infoProduct.id)) {
    const product = carProducts.map((product) => {
      if (product.id === infoProduct.id) {
        product.quantity++;
        return product;
      } else {
        return product;
      }
    });
    carProducts = [...product];
  } else {
    carProducts = [...carProducts, infoProduct];
  }
  carElementsHTML();
}

// (3)-----------------------------
function carElementsHTML() {
  carList.innerHTML = "";

  carProducts.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="car__product">
        <div class="car__product__image">
          <img src="${product.image}">
        </div>
        <div class="car__product__description">
          <p>${product.name}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="car__product__button">
          <button class="delete__product" data-id="${product.id}">
            X
          </button>
        </div>
      </div>
      <hr>
    `;
    carList.appendChild(div);
  });
  productsStorage();
}

// Local Storage
function productsStorage() {
  localStorage.setItem("cart", JSON.stringify(carProducts));
}

// Empty selected product in Cart
function deleteProducts(event) {
  if (event.target.classList.contains("delete__product")) {
    const productID = event.target.getAttribute("data-id");
    carProducts = carProducts.filter((product) => product.id !== productID);
    carElementsHTML();
  }
}
// Empty all the Cart
function emptyCar() {
  carProducts = [];
  carElementsHTML();
}

// Modal Window
function modalProduct(event) {
  if (event.target.classList.contains("product__details")) {
    modalContainer.classList.add("show__modal");
    const product = event.target.parentElement.parentElement;
    //  console.log(product)
    modalDetailsElement(product);
  }
}

function closeModal(event) {
  if (event.target.classList.contains("icon__modal")) {
    modalContainer.classList.remove("show__modal");
    modalElement.innerHTML = "";
    modalDetails = [];
  }
}

function modalDetailsElement(product) {
  const infoDetails = [
    {
      id: product.querySelector("button").getAttribute("data-id"),
      image: product.querySelector("img").src,
      name: product.querySelector(".product__container__name p").textContent,
      price: product.querySelector(".product__container__price p").textContent,
    },
  ];
  modalDetails = [...infoDetails];
  modalElementsHTML();
}

function modalElementsHTML() {
  modalElement.innerHTML = "";

  modalDetails.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="modal__product">
          <div class="modal__product__description">
            <p>${product.name}</p>
            <p>${product.price}</p>
          </div>
          <div class="modal__product__image">
            <img src="${product.image}">
          </div>
          <p>Sizes:</p>
          <div class="modal__product__sizes">
            <button>S</button>
            <button>M</button>
            <button>L</button>
            <button>XL</button>
            <button>2XL</button>
            <button>3XL</button>
          </div>
          <div class="modal__add__to__cart" >
          <button id="add__to__cart" data-id="${product.id}">Add to Car</button>
          </div>
        </div>
          <div class="modal__image__design" >
            <img src="${product.image}">
          </div>
    `;
    modalElement.appendChild(div);
  });
}
