import fs from 'fs';

export class ProductManager {
    /**

     * @param {string} path 
     */
    constructor(path) {
        this.path = path;
    }

    /**
     * @param {Object} product 
     * @returns {Promise<string>} 
     */
    async addProduct(product) {

        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios")
            return "Todos los campos son obligatorios";
        }

        const products = await this.getProducts()

        if (products.length !== 0)
            if (products.some((existingProduct) => existingProduct.code === product.code)) {
                console.error("Producto existente con el mismo código")
                return "Producto existente con el mismo código";
            }

        let id = (await this.getProducts()).length;
        product.id =  ++id;
        products.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    /**
     * @returns {Promise<Array>} 
     */
    async getProducts() {
        if (!fs.existsSync(this.path)) {
            return [];
        }

        const products = await fs.promises.readFile(this.path, 'utf-8');
        try {
            const data = JSON.parse(products);

            return Array.isArray(data) ? data : [data];
        } catch (error) {
            console.error('Error al parsear el JSON:', error.message);
            return [];
        }
    }

    /**
     * @param {number} id 
     * @returns {Promise<Object|string>} 
     */
    async getProductById(id) {

        const products = await this.getProducts()
        const product = products.find((p) => p.id === id);
        if (product) {
            return product;
        }else {
            return "Not found"
        }
    }

    /**
     * @param {number} id 
     * @param {Object} updatedProduct 
     * @returns {Promise<string>} 
     */
    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index !== -1) {
            updatedProduct.id = id;
            products[index] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return "Producto modificado exitosamente";
        } else {
            return "Producto no encontrado";
        }
    }


    /**

     * @param {number} id 
     * @returns {Promise<string>} 
     */
    async deleteProduct(id) {
        const products = await this.getProducts();
        const updatedProducts = products.filter((p) => p.id !== id);

        if (products.length !== updatedProducts.length) {
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
            return "Producto eliminado exitosamente";
        } else {
            return "Producto inexistente";
        }
    }
}

/**

 * @returns {Promise<void>} 
 */
async function main()
{
    const client = new ProductManager("./db.txt")

    console.log(await client.getProducts())

    await client.addProduct({
        title: 'Zapatilla',
        description: 'Con cordones fluor',
        price: 10000,
        thumbnail: 'nike.jpg',
        code: 'za-001',
        stock: 50,
    })

    console.log(await client.getProducts())

    await client.addProduct({
        title: 'Zapatillas',
        description: 'Sin cordones fluor',
        price: 15000,
        thumbnail: 'nike.jpg',
        code: 'za-002',
        stock: 20,
    })

    console.log(await client.getProductById(1))

    console.log(await client.getProductById(99))

    await client.updateProduct(1,{
        title:"producto actualizado",
        description: "descripcion del producto actualizado",
        price:40000,
        thumbnail: "sin imagen",
        code: "zxy 321",
        stock: 3
    });

    console.log(await client.getProducts());


}
main()