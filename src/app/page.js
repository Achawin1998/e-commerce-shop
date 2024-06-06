 
import ProductCard from "./components/ProductCard";
import { stripe } from "./utils/stripe";

// fetch product data 
export async function getData() {
  const inventory = await stripe.products.list({ // ตัวนี้คือ List all product  return all products ที่สร้างไว้กลับมาให้
    expand: ['data.default_price'], // ข้อมูลตอนแรกเป็นรหัส id เลยต้องใช้ expand เพื่อแสดงข้อมูล
    limit: 8, // เซ็ตตามจำนวนที่ต้องการ
  });

  const products = inventory.data.map(product => { 
    const price = product.default_price
    return {
      currency: price.currency, // return ค่าต่าง ๆ ส่งไปใน inventory หลังจาก นั้นให้ return ออกไปเป็นชื่อ {product} แล้วเอาไป map 
      id: product.id,
      name: product.name,
      price: price.unit_amount,
      image: product.images[0]
    }
  })
   
  return {products}
}


export default async function Home() {

  const product = await getData()
  //  console.log(product);


  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
      <div className="grid gap-8 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          {product.products.map((product , index) =>
            <ProductCard key={product.id} product={product} index={index} />
          )}
      </div>
    </div>
  );
}

  

// สามรถใช้แบบนี้ได้เหมือนกัน

// export default async function Home() {  

//   const inventory = await stripe.products.list({ // ตัวนี้คือ List all product ใน docs
//     expand: ['data.default_price'],
//     limit: 8, // เซ็ตตามจำนวนที่ต้องการ
//   });

//   const product = inventory.data.map(product => {
//     const price = product.default_price
//     return {
//       currency: price.currency,
//       id: product.id,
//       name: product.name,
//       price: price.unit_amount,
//       image: product.images[0]
//     }
//   })
//    console.log(inventory);


//   return (
//     <div className="container xl:max-w-screen-xl mx-auto py-12 px-6">
//       <div className="grid gap-8 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2">
//           {product.map((product) =>
//             <ProductCard product={product} />
//           )}
//       </div>
//       Test
//     </div>
//   );
// }

 