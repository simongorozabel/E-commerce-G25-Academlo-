// URL Base
const baseURL = "https://ecommercebackend.fundamentos-29.repl.co/";
// Mostrar y Ocultar Carrito
const carToggle = document.querySelector(".car__toggle");
const carBlock = document.querySelector(".car__block");
// Dibujar productos en la WEB
const productsList = document.querySelector("#products-container");
// Carrito de compras
const car = document.querySelector("#car");
const carList = document.querySelector("#car__list");
const emptyButton = document.querySelector(".empty__button");
// Necesito tener un array que reciba los elementos que debo introducir en el carrito de compras.
let carProducts = [];

// Lógica para mostrar y ocultar el carrito
carToggle.addEventListener("click", () => {
  carBlock.classList.toggle("nav__car__visible");
  // Cuando NO tiene la clase nav__car__visible, la agrega. Si se le da click nuevamente y detecta la clase, la retira
});

// Vamos a crear una función que contenga y que ejecute todos los listeners al inicio de la carga del código.
enventListenersLoader();

function enventListenersLoader() {
  // Cuando se presione el botón "Add to car"
  productsList.addEventListener("click", addProduct);
  // Cuando se presione el botón DELETE del carrito de compras
  car.addEventListener("click", deleteProducts);
  //Cuando se precio EMPTY CARt
  emptyButton.addEventListener("click", emptyCar);
  // Se ejecuta  cuando se carga la página
  document.addEventListener('DOMContentLoaded', ()=>{
    carProducts = JSON.parse(localStorage.getItem('cart')) || [];
    carElementsHTML()
  })
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
      <button>Product Details</button>
    </div>
    </div>
    `;
  }
  productsList.innerHTML = html;
}

/* Agregar productos al carrito
      1. Capturar la información del producto al que se le de click: addProduct(event);

      2. Debo transformar la información HTML en un array de objetos.
      2.1. Debo validar si el elemento seleccionado ya se encuentra dentro del carrito. Si existe, le debo sumar una unidad para que no se repita.

      3. Debo imprimir, pintar, dibujar o mostrar en pantalla los productos dentro del carrito.
*/

// (1)---------------------------
function addProduct(event) {
  if (event.target.classList.contains("add__to__car")) {
    //.contains valida si el elemento existe dentro de la clase
    const product = event.target.parentElement.parentElement;
    // parentElement nos ayuda a acceder al padre inmediatamente superior del elemento.

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
    // textContent me permite pedir el texto que contiene un elemento.
    quantity: 1,
  };

  // Agregar un contador
  // Si dentro de carProducts ya existe un ID igual al que tengo previamente alojado en infoProduct, entonces le sumo 1 a la cantidad.

  // .some valida si existe algún elemento dentro del array que cumpla la condición
  if (carProducts.some((product) => product.id === infoProduct.id)) {
    // Si el producto al que le doy click en infoProduct ya existe en carProducts, entonces:
    const product = carProducts.map((product) => {
      // Como tengo un producto que ya existe dentro de carProducts, entonces debo mapearlo y sumarle una unidad a la cantidad del elemento igual.
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
  // console.log(carProducts);
  carElementsHTML();
}

// (3)-----------------------------

function carElementsHTML() {
  // Como cada vez que iteramos con forEach creamos un nuevo div, debemos depurar los duplicados reinicializando el contenedor carList con innerHTML vacío. Esto borra todo lo que puede estar repetido y vuelve a iterar sobre los elementos actualizados en el array de carProducts
  carList.innerHTML = "";

  carProducts.forEach((product) => {
    const div = document.createElement("div");
    // createElement, permite crear etiquetas desde el DOM.
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
    // appendChild permite insertar elementos al DOM, muy similar a innerHTML
    carList.appendChild(div);
  });
  productsStorage()
}

// Local Storage
function productsStorage() {
  localStorage.setItem('cart', JSON.stringify(carProducts))
}

// Eliminar productos del carrito

function deleteProducts(event) {
  if (event.target.classList.contains("delete__product")) {
    const productID = event.target.getAttribute("data-id");
    carProducts = carProducts.filter((product) => product.id !== productID);
    carElementsHTML();
  }
}
// Vacias el carrito completo
function emptyCar() {
  carProducts = [];
  carElementsHTML();
}

// Ventana Modal

// Local Storage
// Podemos guardar información en local storage
// localStorage.setItem("apellido", "Gorozabel");

// console.log(localStorage.getItem("apellido"))

// const usuario = {
//   name: 'Simon',
//   age:21
// }
// localStorage.setItem("usuario", JSON.stringify(usuario))

// const usuarioLocal = localStorage.getItem("usuario")
// console.log(JSON.parse(usuarioLocal))
