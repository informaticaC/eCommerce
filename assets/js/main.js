async function getProducts() {
    try {
        const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
        const res = await data.json();

        window.localStorage.setItem("products", JSON.stringify(res)); //Se crea el localStorge de nombre products
        console.log("res:", typeof(res) , res );
        return res;
    } catch (error) {
        console.log(error);
    }
}

async function main() {

    const productsData = JSON.parse(window.localStorage.getItem("products")) || await getProducts();

    console.log('window.localStorage.getItem("products"): ', JSON.parse(window.localStorage.getItem("products")) ); //Se obtiene (get) el localStorge de nombre products


    console.log("productsData:=> " , typeof(productsData) ,productsData);

}

main();