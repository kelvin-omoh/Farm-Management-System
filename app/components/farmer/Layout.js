'use client'
import Sidebar from './Sidebar'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import React, { createContext, useState } from 'react';
import AppContext from '../Context/AppContext';


const Layout = ({ children }) => {
    const [selectedUser, setSelectedUser] = useState({});

    return (
        <AppContext.Provider value={{ selectedUser, setSelectedUser }}>
            <div className=' relative flex-row w-full flex gap-3'>

                <Sidebar />
                <div className='ml-[14rem] w-full ' >
                    <AntdRegistry>{children}</AntdRegistry>
                </div>
            </div>
        </AppContext.Provider>

    )
}

export default Layout