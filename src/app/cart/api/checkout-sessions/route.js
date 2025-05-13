import { stripe } from "src/app/utils/stripe";
import { NextResponse } from "next/server";
 
async function lineItem(products, cartDetails) {  // สร้างข้อมูลเอาไว้ในการสร้าง session คือเป็นการ สร้่างตัว clone ข้อมูลขึ้นมา
  const lineItems = [];

  for (const [productId, product] of Object.entries(cartDetails)) {
    const productData = products.find((p) => p.id === productId);  // เช็ค id 
    if (productData) {
      lineItems.push({
        price_data: {
          currency: productData.currency,
          product_data: {
            name: productData.name,
            images: [productData.image],
          },
          unit_amount: productData.price,
        },
        quantity: product.quantity,
      });
    }
  }
  return lineItems;
}

export async function POST(req) {
  try {
    const cartDetails = await req.json(); // รับค่า จากหน้า cary 
    const inventory = await stripe.products.list({ expand: ['data.default_price'] }); // นำตัว stripe ที่เป็นข้อมูลแต่ละร้ายการ มา map เพื่อโชซืข้อมูลสินค้าต่าง ๆ
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

    const response = new NextResponse(JSON.stringify(session), { // return session ออกมา หน้า client
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    response.headers.set('Access-Control-Allow-Origin', '*'); // กำหนด CORS เพื่ออนุญาติให้เข้าได้ทุก domain 
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.log(error);
    if (error.type === 'StripeInvalidRequestError') {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new NextResponse(JSON.stringify({ statusCode: 500, message: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}

export async function OPTIONS() {  // ตั้งค่าให้อนุญาติทุก domain ตัวนี้จะถูกเรียกใช้ก่อนเพื่อเช็คว่าอนุญาตให้ทำคำขอนี้จาก origin ที่เป็นแหล่งที่มาของคำขอหรือไม่
  const response = new NextResponse(null, {
    status: 204,  // ถ้าจริง ฟังก์ชันนี้จะสร้างและส่งคำตอบที่มีสถานะ 204 และ header ที่ระบุว่าอนุญาตให้ทำคำขอจริงได้ จากนั้นก็ขึ้นไปยังตัวข้างบนเพื่อรันฟังชันอย่างปกติ
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
  return response;
}

//การเพิ่ม Access-Control-Allow-Origin, Access-Control-Allow-Methods, และ Access-Control-Allow-Headers headers 
//ทำให้เว็บแอปพลิเคชันของคุณสามารถส่งคำขอ POST ไปยังเซิร์ฟเวอร์ Next.js และส่งคำขอ API ไปยัง Stripe ได้โดยไม่มีปัญหา CORS ที่เกี่ยวข้อง