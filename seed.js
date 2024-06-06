
// ใช้ stripe ที่นี่
const Stripe = require('stripe')
const products = require ('./products')

// key ตรงนี้มาจาก doc
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

(() => { // เพิ่มข้อมูลลงใน stripe inventory
    products.forEach(async (product) =>
     await stripe.products.create({
            name: product.name,
            default_price_data: { // ใน docs พวก price ต้องกำหนดแบบนี้ก่อน
                currency: product.currency,
                unit_amount: product.price
            },
            images: [product.image]
        })
    )     
})()


// เลือก loop ได้ทั้ง 2 แบบ แบบล่าง สร้าง const เอาไป log เช็คค่าได้ 

// (async () => {   
//     for (const product of products) {
//         const stripeProduct = await stripe.products.create({
//             name: product.name,
//             default_price_data: {
//                 currency: product.currency,
//                 unit_amount: product.price
//             },
//             images: [product.image]
//         });
//     }
// })();
 