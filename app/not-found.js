import Link from 'next/link'
import React from 'react'

const NoPageFound = () => {
  return (
    <div className='w-full h-screen flex flex-col  items-center justify-center'>
      <h1>
        404
      </h1>
      <Link href={"/"}>
      <p className='underline decoration-[.1px]'>
        Return To Home Page
      </p>
      </Link>
    </div>
  )
}

export default NoPageFound