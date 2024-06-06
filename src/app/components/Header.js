'use client'
import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/solid' // ตัวนี้เป็นตัวที่เอามาจาก libraly  npm i @heroicons/react@2.0.17
import { useShoppingCart } from 'use-shopping-cart';

function Header() {

  const { formattedTotalPrice , cartCount} = useShoppingCart() // เอามาอัพเดทตะกร้า

  return (
    <header className='sticky top-0 bg-white z-10 shadow'>
       <div className='container mx-auto p-6 flex justify-between'> 
        <Logo />

        <Link href={'/cart'}
          className='flex items-center space-x-1 text-gray-700 hover:text-gray-900'
        >
            <div className='relative'>
                <ShoppingCartIcon className='w-7 h-7 flex-shrink-0'/>                    
            </div>

            <p className='text-lg'>{formattedTotalPrice}</p>

            <span className='text-sm text-gray-500'>({cartCount})</span>
        </Link>
      </div>
    </header>
  )
}

export default Header