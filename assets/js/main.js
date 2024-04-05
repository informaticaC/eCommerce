async function getProducts() {
    try {
        const data = await fetch("https://services-academlo-shopping.onrender.com/");//https://services-academlo-shopping.onrender.com/
        const res = await data.json();

        window.localStorage.setItem("products", JSON.stringify(res)); //Se crea el localStorge de nombre products
        
        //console.log("res:", typeof(res) , res );
        return res;
    } catch (error) {
        console.log(error);
    }
}


function printProducts(db) {
    let html = '';
    const productsHTML = document.querySelector(".products");
    for (const product of db.products) {
     // console.log(product);
        html +=`
            <div class="product">
                <div class="product__image">
                    <img class ="product__image--img" src="${product.image}" alt="image ${product.name}">
                </div>

                <div class="product__info">
                    <h4>
                    <span> $${product.price} </span> <span><i><b>Stock</b>:</i> ${product.quantity}</span>
                        ${product.quantity ?
                            ``
                            : "<span  class='soldOut'>Sold Out</span>"
                        }                 
                    </h4>
                    <h3>
                        ${product.name}
                    </h3>
                    
                    <div class="product__actions">
                    ${product.quantity ?
                        `<i class='bx bx-plus' id="${product.id}"></i>`
                        : ""
                    }   
                        
                    </div>
                </div>

            </div>

        `;
    }
    productsHTML.innerHTML = html;
}

function showCartHandler() {
    const iconCartHTML = document.querySelector(".bx-cart");
    const cartHTML = document.querySelector(".cart");
    iconCartHTML.addEventListener("click", function () {
      
        cartHTML.classList.toggle("cart__show");

    });
}

function addToCartFromProduct(db) {
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            const productFind = db.products.find((product) => product.id === id);

            if (db.cart[productFind.id]  ){
                if (db.cart[productFind.id].amount === productFind.quantity ) {
                    return alert("No tenemos más en bodega");
                }
                
                db.cart[productFind.id].amount++;

            } else {
                db.cart[productFind.id] = {...productFind, amount:1};
            }
           
            window.localStorage.setItem("cart", JSON.stringify(db.cart));//creo el local storage para la persistencia de datos
                                                                         //en este caso es un objeto {} a diferencia de products
                                                                         //que es un array de objetos [{}]
            //console.log(db.cart);
            printProductsInCart(db);
            printTotal(db);
            handlerPrintAmountProducts(db);
        }
    })
}

function printProductsInCart(db) {
    const cartProducts = document.querySelector(".cart__products");

    let html = "";
   
    for (const product in db.cart) {
        const {quantity, price, name, image, id,
        amount} = db.cart[product];
        console.log({quantity, price, name, image, id, amount});
        html += `
            <div class="cart__product">
                <div class="cart__produc--image">
                    <img class ="cart__product_image_img" src="${image}" alt="image ${name}">
                </div>
                <div class="cart__product--body">
                    <h4>${name} </h4>
                    <p>Stock: ${quantity} <span style="color: red;">| $${price}</span></p>
                    <p style="color: red;">Subtotal: $${amount * price}</p>

                    
                    <div class="cart__product--body-op" id="${id}">
                        <i class="bx bx-minus " id="${id}"></i>
                        <span>${amount} unit</span>
                        <i class="bx bx-plus " id="${id}"></i>
                        <i class="bx bx-trash " id="${id}"></i>
                    </div>
                </div>
            </div>
        `;
    }
   //console.log(cartProducts) ;
   //console.log(html);
   cartProducts.innerHTML = html;
}

function handleProductsInCart(db) {
    let cartProduct = document.querySelector(".cart__products");
    cartProduct.addEventListener("click", (e)=>{
        if(e.target.classList.contains("bx-plus")){

            const id = Number(e.target.id);
            if (db.cart[id].amount === db.products[id-1].quantity) {
                return alert( 'No hay mas productos en bodega!')
            }
            db.cart[id].amount++;
          
        }

        if(e.target.classList.contains("bx-minus")){
            const id = Number(e.target.id);
            if (db.cart[id].amount === 1) {
                const response = confirm(
                    "¿Estás seguro de que quieres eliminar este producto?"
                );
                if (response) {
                    delete db.cart[id];
                }           
               
            }else {
                db.cart[id].amount--; 
            }
               
        }

        if(e.target.classList.contains("bx-trash")){
            const id = Number(e.target.id);
           
            const response = confirm(
                "¿Estás seguro de que quieres eliminar este producto?"
            );
            if (response) {
                delete db.cart[id];
            }         
           
        }

        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        printProductsInCart(db);
        printTotal(db);
        handlerPrintAmountProducts(db);
    })
}



function printTotal(db) {
    const infoTotal = document.querySelector(".info__total");
    const infoAmount = document.querySelector(".info__amount");
    
    let totalProducts = 0; 
    let amountProducts = 0;

    for (const product in db.cart) {
        const { amount, price } = db.cart[product];
        totalProducts += amount * price;
        amountProducts += amount;
    }
    infoAmount.textContent =`${amountProducts} unidades` ; 
    infoTotal.textContent = `$${totalProducts}.00`;

    
}

function manejadorTotal(db) {
    const btnBuy = document.querySelector(".btn__buy");

    btnBuy.addEventListener("click", function () {
        // if (!Objet.values(db.cart).lenght)  return alert('Debes cargar algo en el carrito!');
        console.log('Object.values(db.cart).length:', Object.values(db.cart).length);
        if (!Object.values(db.cart).length) return alert('Debes cargar algo en el carrito!');
       
        const response = confirm ('Seguro que quieres comprar?');
        if (!response) return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id) {
                currentProducts.push({
                    ...product, quantity: product.quantity - productCart.amount,
                });
            }else{
                currentProducts.push(product);
            }
        }
       
        db.products = currentProducts;
        db.cart = {};
        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));
        
        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlerPrintAmountProducts(db);

    })
}

function handlerPrintAmountProducts(db){
    
    const amountProducts = document.querySelector(".amountProducts");
    let amount = 0;

    for(const product in db.cart){
        amount += db.cart[product].amount;
    }

    amountProducts.textContent = amount;
}

async function main() {
   
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };
    //   console.log("db.products Data:=> " , typeof(db.products) ,db.products);
     
    printProducts(db);
    showCartHandler();
    addToCartFromProduct(db);
    printProductsInCart(db);
    handleProductsInCart(db);
    printTotal(db);
    manejadorTotal(db)
    handlerPrintAmountProducts(db);

    

   

    
}

main();