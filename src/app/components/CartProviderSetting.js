'use client'  // บังคับใช้ ี use client แต่หน้า layouy มันมีการใช้ metadata เลยต้องเป็น server 

import { CartProvider } from "use-shopping-cart"; // จัดการกับตะกร้าสินค้าในแอปพลิเคชันเว็บ เพื่อเพิ่มหรือลบสินค้าในตะกร้า รวมถึงการคำนวณราคารวมของสินค้าทั้งหมดในตะกร้า
// import ไปหน้า layout

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  // ใช้ public key 

export default function CartProviderSetting({children}) {

  return (
    <CartProvider stripe={stripeKey} cartMode="checkout-session" currency="USD">{children}</CartProvider>
  )
}
