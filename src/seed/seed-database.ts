import { initialData } from "./seed";
import prisma from '../lib/prisma'


async function main() {

    // 1. Borrar gregistros previos
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const {categories, products } = initialData

    // Insertar categorias
    const categoriesData = categories.map( category => ({
        name: category
    }));

    await prisma.category.createMany({
        data: categoriesData
    });

    const categoriesDB = await prisma.category.findMany();

    const categoriesMap = categoriesDB.reduce((map, category) => {

        map[ category.name.toLowerCase() ] = category.id

        return map;
    }, {} as Record<string, string>);

    // Productos

    products.forEach( async (product) => {
        const { images, type, ...item } = product

        const dbProduct = await prisma.product.create({
            data: {
                ...item,
                categoryId:categoriesMap[type]
            }
        });

        // Imagenes
        const imagesData = images.map( image => ({
            url: image,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        });

    });


    console.log('Seed Ejecutado')
}



(() => {

   if (process.env.NODE_ENV === 'production') return;

    main();
})();