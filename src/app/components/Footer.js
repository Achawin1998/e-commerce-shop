import React from 'react'

function Footer() {

    const date = new Date();
    const Year = date.getFullYear();

  return (
     <footer className='border-t border-gray-100 py-10  text-center'>
        <p className='text-sm text-gray-500'>
            © {Year} AI-Store. All rights reserved  
        </p>
     </footer>
  )
}

export default Footer