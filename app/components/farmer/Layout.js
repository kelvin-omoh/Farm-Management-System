'use client'
import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <div className=' relative flex-row w-full flex gap-3'>
            <Sidebar />
            <div className='ml-[14rem] w-full ' >
                {children}
            </div>
        </div>
    )
}

export default Layout