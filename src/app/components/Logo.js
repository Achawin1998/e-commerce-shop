import React from 'react'
import Link from 'next/link'

function Logo() {
  return (
    <Link href={'/'} className='flex items-center space-x-2'>
        <img src='/logo.svg' alt='Logo' width={42} height={42}/>
        <span className='hidden sm:inline-block font-extrabold text-3xl text-gray-700'> {/* กำหนดให้หายไปตอนจอขนาดเล็ก  */}
            A-Strore
        </span>
    </Link>
  )
}

export default Logo