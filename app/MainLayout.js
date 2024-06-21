'use client'
import { NextUIProvider } from '@nextui-org/react'
import AppContext from './components/Context/AppContext';
import { useState } from 'react';

export function Providers({ children }) {
    const [selectedUser, setSelectedUser] = useState({});
    const [selectedFarmProduct, setSelectedFarmProduct] = useState({});

    return (
        <NextUIProvider>
            <AppContext.Provider value={{ selectedUser, setSelectedUser, selectedFarmProduct, setSelectedFarmProduct }}>

                {children}
            </AppContext.Provider>
        </NextUIProvider>
    )
}