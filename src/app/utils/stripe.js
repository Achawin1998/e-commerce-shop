// ไฟล์นี้จะทำให้ share stripe จาก หน้า seed ใช้ได้หลาย ๆ หน้า จะได้ไม่ต้องเรียกใช้ฟังชันบ่อย ๆ
import Stripe from "stripe";

export const stripe = Stripe(process.env.STRIPE_SECRET_KEY);