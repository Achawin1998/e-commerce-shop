'use client'
import React , { useState } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import Link from 'next/link'
import CartProduct from '../components/CartProduct'

function Cart() { 

    const { cartCount , cartDetails ,formattedTotalPrice ,clearCart , redirectToCheckout } = useShoppingCart();

    // 1. cartCount แสดงจำนวนสินค้า
    // 2. cartDetails แสดงข้อมูล รายการสินค้าในตะกร้าที่ผู้ใช้เลือกซื้อ
    // 3. clearCart ล้างสินค้าทุกตัวที่บันทึกไว้
    // 4. formattedTotalPrice แสดงยอดรวม total
    // 5. redirectToCheckout ใช้ในการ redirect ไปหน้า Checkout
    

    const [isRedirecting , setIsRedirecting] = useState(false)

 
    const onCheckOut = async () => {
        if (cartCount > 0) {
            try {
                setIsRedirecting(true);
                const response = await fetch('http://localhost:3000/cart/api/checkout-sessions', { 
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cartDetails) // ส่งข้อมูล
                });
                const { id } = await response.json(); // ดึงค่า id ออกมา
                const result = await redirectToCheckout(id); // ถ้าสำเร็จก็จะ redirect ไปที่หน้า checkout 
                if (result.error) {
                    console.log('Error in result', result);
                }
            } catch (error) {
                console.log("Error to redirect", error);
            } finally {
                setIsRedirecting(false);
            }
        }
    }
  

  return (
    <div className='container xl:max-w-screen-xl mx-auto py-12 px-6'>
        {cartCount > 0 ? (
         <>
             <h2 className='text-4xl font-semibold'>Your shopping cart</h2>

             <p className='mt-1 text-xl'>
               {cartCount} items {''}   {/* แสดงจำนวนสินค้าที่เพิ่มลงไป  */}
                <button onClick={() => clearCart()}
                className='opacity-50 hover:opacity-100 text-base capitalize'>
                (Clear all)
                </button>
             </p>
         </>
        ) : (
         <>
            <h2 className='text-4xl font-semibold'>
                Your shopping cart is empty.
            </h2>  
            <p className='mt-1 text-xl'>
                Check out our awesome products <Link className=' text-red-500 hover:text-red-700    hover:underline' href='/'>here!</Link>
            </p>
         </>          
        )}

        {cartCount > 0 && (
            <div className='mt-12 space-y-4'>

                {/* แปลค่าข้อมูล Object ให้เป็น arrays */}
                {Object.entries(cartDetails).map(([productId , product]) => (   // destructure key กับ product ออกมา เป็นค่าที่ได้มาจากการ log Object.entries
                    <CartProduct key={productId} product={product} />
                ))} 
 
                <div className='flex flex-col items-end border-t py-4 mt-8'> 
                    <p className='text-xl'>Total: {''}
                        <span className='font-semibold'>{formattedTotalPrice}</span>
                    </p>

                    <button onClick={onCheckOut}
                     disabled={isRedirecting}
                     className='border rounded-md py-2 px-6 bg-yellow-500 hover:border-yellow-600
                     border-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-opacity-50 focus:ring-yellow-500 text-white 
                     transition-color disabled:opacity-50 disabled:cursor-not-allowed default:hover:bg-yellow-500 mt-4 max-w-max'>
                        {isRedirecting ? 'Redirecting...' : 'Go to Checkout'}
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default Cart