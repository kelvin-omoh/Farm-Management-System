'use client'
import Sidebar from './Sidebar'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, { createContext, useState } from 'react';
import AppContext from '../Context/AppContext';


const Layout = ({ children }) => {

    return (
        <div className=' relative flex-row w-full flex gap-3'>
            <Sidebar />
            <div className='ml-[14rem] w-[80%] ' >
                <AntdRegistry>{children}</AntdRegistry>
            </div>
        </div>

    )
}

export default Layout