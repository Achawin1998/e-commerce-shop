'use client'
//ต้องใช้ use client เพราะต้องใช้ function 
import { formatCurrencyString , useShoppingCart } from 'use-shopping-cart'; // covert ค่าเงินให้เป็น usd
import { MinusSmallIcon , PlusSmallIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';


function FormatStringPageDetail({product}) {

  const [count , setCount] = useState(1)
  const { addItem } = useShoppingCart()

  const onAddToCart = (e) => {
    e.preventDefault();
    const id = toast.loading(`Adding ${count} item${count > 1 ? 's' : null}`) // id เอาไว้ อัปเดท
    addItem(product , { count })
    toast.success(`${count} ${product.name} added` , {id})
}

  return (
    <div>
          <div className='mt-4 border-t pt-4 '>
              <p className='text-gray-500'>Price:</p>
              <p className='text-xl font-semibold'>
                  {formatCurrencyString({
                    currency: product.currency,
                    value: product.price
                  })}
              </p>
          </div>

                {/* add minus button */}
          <div className='mt-4 border-t pt-4'>
                <p className='text-gray-500'>Quantity:</p>
            <div className='mt-1 flex items-center space-x-3'>
                <button disabled={count <= 1}
                  onClick={() => setCount(count - 1)}
                  className='p-1 rounded-md hover:bg-rose-100 hover:text-rose-500'>
                  <MinusSmallIcon className='w-6 h-6 flex-shrink-0' />
                </button>

                <p className='font-semibold text-xl'>{count}</p>

                <button  onClick={() => setCount(count + 1)}
                  className='p-1 rounded-md hover:bg-green-100 hover:text-green-500'>
                  <PlusSmallIcon className='w-6 h-6 flex-shrink-0' />
                </button>
            </div>
          </div>

          <button onClick={onAddToCart}
           className='w-full mt-4 border border-lime-500 py-2 px-6 bg-lime-500 hover:bg-lime-600 hover:border-lime-600 
           focus:ring-4 focus:ring-opacity-50 focus:ring-lime-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-md'>
              Add to cart
          </button>

    </div>
  )
}

export default FormatStringPageDetail