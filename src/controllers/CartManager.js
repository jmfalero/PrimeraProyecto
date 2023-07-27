import {promises as fs} from 'fs';
import {nanoid} from 'nanoid'; 
import ProductManager from './ProductManager.js';

const productALL = new ProductManager

class CartManager {
    constructor () {
        this.path = "./src/models/carts.json"; 
    }
    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);

    }
    writeCarts = async (carts) => {
    await fs.writeFile(this.path,JSON.stringify(carts)); 
    }
    
    exist = async (id) => {
        let carts = await this.readCarts() 
        return carts.find(cart => cart.id === id)
    }

    addCarts = async () => {
    let cartsOld = await this.readCarts();
    let id = nanoid ()
    let cartsConcat = [{id : id, products : []}, ...cartsOld]
    await this.writeCarts(cartsConcat)
    return "Carrito Agregado"
    }

    getCartById = async (id) =>{
         
        let CartById = await this.exist(id);
        if(!CartById) return "Carrito no encontrado";
        return CartById;

     };

     addProductInCart = async (cartID, productID) => {
        let CartById = await this.exist(cartID);
        if(!CartById) return "Carrito no encontrado";
        let productById = await productALL.exist(productID);
        if(!productById) return "Producto no encontrado";
       
        let cartsALL = await this.readCarts()
        let cartFilter = cartsALL.filter((cart) => cart.id != cartID);
        
        if(CartById.products.some(prod => prod.id === productID)){
            let MoreProductInCart = CartById.products.find((prod) => prod.id === productID);
            MoreProductInCart.cantidad + 1;
            let cartsConcat = [MoreProductInCart, ...cartFilter];
            await this.writeCarts(cartsConcat);
            return "Producto Sumado al Carrito";
        }

        CartById.products.push({id:productById.id, cantidad: 1})
        let cartsConcat = [CartById, ...cartFilter];
        await this.writeCarts(cartsConcat);
        return "Producto Agregado al Carrito";

     };


}
export default CartManager