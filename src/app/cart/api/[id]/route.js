import { stripe } from "src/app/utils/stripe";

export default async function handler(req, res) {
    if (req.method === "GET") {
      const id = req.query.id;
      try {
        if (!id.startsWith("cs_")) {  // ถ้า id session ไม่ได้เริ่มต้นด้วยตัวที่ตั้งค่านี้จะ ส่ง error ไป 
          throw new Error("Incorrect checkout session id");
        }
        const checkoutSession = await stripe.checkout.sessions.retrieve(id); //ตรวจสอบว่า  const id = req.query.id; ที่ส่งมาตรงกับ stripe id ไหม
        res.status(200).json(checkoutSession);
      } catch (error) {
        console.log(error);
        res.status(500).json({ statusCode: 500, message: error.message });
      }
    } else {
      res.setHeader("Allow", "GET");
      res.status(405).end("Method Not Allowed");
    }
  }
