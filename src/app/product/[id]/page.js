import React from 'react';
import { stripe } from 'src/app/utils/stripe';
import Image from 'next/image'
import { CheckIcon } from '@heroicons/react/24/solid'
import FormatStringPageDetail from '../FormatStringPageDetail';

 
 async function ProductPage({params}) { // แสดงสินค้าแต่ละตัว

  const inventory = await stripe.products.list({ // ตัวนี้คือ List all product ใน docs มันจะ return all products ที่สร้างไว้กลับมาให้
    expand: ['data.default_price'], // ข้อมูลตอนแรกเป็นรหัส id เลยต้องใช้ expand เพื่อแสดงข้อมูล
  });
  const products = inventory.data.map(product => { 
    const price = product.default_price
    return {
      currency: price.currency,  
      id: product.id,
      name: product.name,
      price: price.unit_amount,
      image: product.images[0]
    }
  })
    const product = products.find(product => product.id === params.id)
    console.log(product);
  
 

  return (
    <div className='container lg:max-w-screen-lg mx-auto py-12 px-6'>
      <div className='flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-12'>

        <div className='relative w-72 h-72 sm:w-96 sm:h-96'>
          <Image 
            src={product.image}
            alt={product.name}
            style={{ objectFit: 'contain' }}
            fill sizes='100%' 
            priority
          />
        </div>

        <div className='w-full flex-1 max-w-md border border-opacity-50 rounded-md shadow-lg p-6 bg-white'> {/* ตั้งให้เห้นแค่ 448px  */}  
            <h2 className='text-3xl font-semibold'>{product.name}</h2>
            <p className='pt-2 flex items-center space-x-2'>
              <CheckIcon className='text-lime-500 w-5 h-5' />
              <span className='font-semibold'>In stock</span>
            </p>

          {/* เพื่อให้หน้านี้เป็น server เลยต้องนำฟังชันต่าง ๆ ไปใช้อีกหน้าแล้ว import มา */}
          <div>
             <FormatStringPageDetail product={product} />
          </div>

        </div>
      </div>
    </div>

  )
}

export default ProductPage

