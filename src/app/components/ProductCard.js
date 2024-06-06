'use client'  // โชว์ข้อมูลต่าง ๆ ในหน้าแรก
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Rating from './Rating'
import { formatCurrencyString , useShoppingCart } from 'use-shopping-cart' // covert ค่าเงินให้เป็น usd
import toast from 'react-hot-toast'
 


function ProductCard({product , index}) {

  const { addItem } = useShoppingCart();

    const onAddToCart = (e) => {
        e.preventDefault();
        const id = toast.loading('Adding 1 item...') // id เอาไว้ อัปเดท
        addItem(product)
        toast.success(`${product.name} added` , {id})
    }

    

  return (
    <Link href={`/product/${product.id}`} className='border-2 rounded-md group 
    overflow-hidden'>
        <div className='relative w-full h-64'> 
          <Image 
            priority={index === 0}  // ถ้าไม่ใส่มันจะเป็น lazy loading
            src={product.image}  
            alt={product.name} 
            fill sizes='100%' 
            style={{
              objectFit:'contain' // ทำให้เวลาย่อหน้้าจอแล้วขยายหน้าจอแล้วภาพไม่ยืด
            }}
          />
        </div>

        <div className='bg-white p-6'>
                <p className='font-semibold text-lg'>{product.name}</p>
                 <Rating />

           <div className='mt-4 flex items-center justify-between space-x-2'>
              <div>
                <p className='text-gray-500'>Price</p>
                <p className='text-lg font-semibold'>{formatCurrencyString({
                  currency: product.currency,
                  value: product.price
                })}</p>
              </div>

              <button onClick={onAddToCart} className='border rounded-lg py-1 px-4'>
                 Add to cart
              </button>
          </div>
        </div>


    </Link>
  )
}

export default ProductCard