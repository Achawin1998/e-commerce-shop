import { stripe } from "src/app/utils/stripe";
 
async function lineItem(products, cartDetails) {  // สร้างข้อมูลที่่เอาไว้ในการสร้าง session กำหนด parameter 2 ตัว เพื่อเอาไว้รับค่า
    const lineItems = [];
  
    for (const [productId, product] of Object.entries(cartDetails)) {
      const productData = products.find((p) => p.id === productId);  // ทำการ เช็คค่า id 
      if (productData) {
        lineItems.push({
          price_data: {
            currency: productData.currency,
            product_data: {
              name: productData.name,
              images: [productData.image],
            },
            unit_amount_decimal: productData.price,
          },
          quantity: product.quantity,
        });
      }
    }
    return lineItems;
  }
  
 
export async function POST(req, res) {
    try {
      const cartDetails = await req.json(); // รับค่าข้อมูลสินค้าต่าง ๆ จากหน้า cart 
      const inventory = await stripe.products.list({ expand: ['data.default_price'] }); // นำตัว stripe มา map ข้อมูลเพื่อโชว์ข้อมูลสินค้าต่าง ๆ เหมือนหน้าแรก
      const products = inventory.data.map((product) => {
        const price = product.default_price;
        return {
          currency: price.currency,
          id: product.id,
          name: product.name,
          price: price.unit_amount,
          image: product.images[0],
        };
      });
      const lineItems = await lineItem(products, cartDetails); // เรียกใช้ฟังชันที่สร้าง และใส่ค่า product , cartDetails เพื่อเช็คว่า ค่าที่ได้รับมัน match กันมั้ย และเก็บค่าไว้ในตัวแปร
      const session = await stripe.checkout.sessions.create({ // กำหนด session ต่าง ๆ และสั่ง redirect ไปหน้า payment 
        mode: 'payment',
        payment_method_types: ['card'], // ใช้การจ่ายเป็นบัตร
        line_items: lineItems, // เรียกใช้ตรงนี้ ตัวนนี้คือข้อมูลต่าง ๆ ที่ได้รับกลับมาจาก lineItems
        success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`, // ได้รับ session id มาจาก checkout session create ถูก return มาตรงนี้
        cancel_url: `${req.headers.get('origin')}/cart`, // cancle กลับมาหน้า cart ที่เดิม ถ้าสำเร็จ redirect ไปหน้า payment
      }); 
      
      return new Response(JSON.stringify(session), { // return session ออกมา หน้า client
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
      if (error.type === 'StripeInvalidRequestError') {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        return new Response(JSON.stringify({ statusCode: 500, message: error.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }
  }