
/** 
  @typedef {import("express")} express
  @typedef {import("./ProductManager.js").ProductManager} ProductManager
 */

import express from "express";
import {ProductManager} from "./ProductManager.js";

const PORT = 8080;
const app = express();


app.use(express.urlencoded({extended:true}))


app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
})

/** 
 * @type {ProductManager}
 */
const productManager = new ProductManager("./db.txt");

/**
 * 
 * @name GET /products
 * @function
 * @memberof app
 * @async
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the products are fetched and the response is sent.
 */
app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    const products = limit ? await productManager.getProducts().then(data => data.slice(0, parseInt(limit))) : await productManager.getProducts();

    res.json({ products });
});

/**
 * .
 * @name GET /products/:pid
 * @function
 * @memberof app
 * @async
 * @param {express.Request} req 
 * @param {express.Response} res
 * @returns {Promise<void>} 
 */
app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);

    const product = await productManager.getProductById(productId);

    if (!product || product === "Not found") {
        return res.send({
            error: 'El producto no existe'
        });
    }
    res.json({ product });
});