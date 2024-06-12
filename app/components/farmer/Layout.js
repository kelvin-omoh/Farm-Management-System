'use client'
import React from 'react'
import Sidebar from './Sidebar'
import { AntdRegistry } from '@ant-design/nextjs-registry';


const Layout = ({ children }) => {
    return (
        <div className=' relative flex-row w-full flex gap-3'>
            <Sidebar />
            <div className='ml-[14rem] w-full ' >
                <AntdRegistry>{children}</AntdRegistry>
            </div>
        </div>
    )
}

export default Layout