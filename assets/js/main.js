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
                <div class="product_image">
                    <img src="${product.image}" alt="image ${product.name}">
                </div>

                <div class="product_info">
                    <h3>
                        ${product.name} | <span><i><b>Stock</b>:</i> ${product.quantity}</span>
                    </h3>
                    <h4>
                        $${product.price}
                    </h4>

                    <div class="product_actions">
                        <i class='bx bxs-cart-add' id="${product.id}"></i>                        
                    </div>
                </div>

            </div>

        `;
    }
    productsHTML.innerHTML = html;
}


async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || (await getProducts()),
        cart: {},
    };
    
      console.log("db.products Data:=> " , typeof(db.products) ,db.products);
      
      printProducts(db);
    
}

main();