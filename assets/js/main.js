async function getProducts() {
    try {
        const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
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
                    <h3>
                        ${product.name} | <span><i><b>Stock</b>:</i> ${product.quantity}</span>
                    </h3>
                    <h4>
                        $${product.price}
                    </h4>

                    <div class="product__actions">
                        <i class='bx bxs-cart-add ' id="${product.id}"></i>                        
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
        if (e.target.classList.contains("bxs-cart-add")) {
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
            <div class="cart__product product ">
                <div class="cart__produc--image">
                    <img class ="cart__product_image_img" src="${image}" alt="image ${name}">
                </div>
                <div class="cart__product--body">
                    <h4>${name} | $${price}</h4>
                    <p>Stock: ${quantity}</p>
                    
                    <div class="cart__product--body-op">
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
   
}

main();