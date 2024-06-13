'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link';
import React from 'react'
import { AiOutlineBarChart, AiOutlineBars } from 'react-icons/ai'
import { BsBookmark, BsCartDashFill, BsChat, BsChatFill, BsGraphUp, BsPerson, BsShop } from 'react-icons/bs'
import { GiMailbox, GiSittingDog } from "react-icons/gi";
import Image from 'next/image';
import auth from '@/app/firebase.config';

import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
const Sidebar = () => {
    const pathname = usePathname()
    const [user] = useAuthState(auth);
    const router = useRouter()
    const logout = async () => {
        try {
            await signOut(auth);
            router.push('/')
        } catch (error) {
            console.log(error);
        }

    };
    const sidebarNav = [
        {
            id: 1,
            icon: <BsGraphUp />,
            text: 'Dashboard',
            route: "/farmer/dashboard"
        },
        // {
        //     id: 2,
        //     icon: <BsChat />,
        //     text: 'Communication',
        //     route: "/farmer/chat"
        // },
        {
            id: 2,
            icon: <BsShop />,
            text: 'Shop',
            route: "/"
        },
        {
            id: 3,
            icon: <BsBookmark />,
            text: 'Inventory',
            route: "/farmer/inventory"
        },
        {
            id: 4,
            icon: <GiSittingDog />,
            text: 'LiveStock',
            route: "/farmer/livestock"
        },

        {
            id: 5,
            icon: <AiOutlineBars />,
            text: 'Task',
            route: "/farmer/task"
        },
        {
            id: 5,
            icon: <BsCartDashFill />,
            text: 'Orders',
            route: "#"
        },
        {
            id: 5,
            icon: <div onClick={logout} className=' flex flex-col items-center gap-4'>
                {user &&
                    <div className=' flex flex-col gap-4'>
                        <Image className=' rounded-full  size-10' width={1000} height={1000} src={`${user?.photoURL}`} alt='' />

                    </div>
                }
            </div>,
            text: 'SignOut',
            route: "/"
        }
    ]
    return (
        <div className=' p-3  text-white bg-green-950  w-[14rem] fixed  top-0 left-0 h-[100vh] '>
            <h1 className=' text-center mb-[5rem] '>FMS</h1>
            <div className=' h-full'>

                <ul className='   flex flex-col h-full gap-[3rem] mb-[3rem] '>
                    {sidebarNav.map((item) => (
                        <Link key={item.id} href={item.route} className={`${pathname === item.route && 'bg-white/50 font-semibold'} p-3 hover:bg-white/50 hover:text-green  flex gap-3 items-center `}>
                            {item.icon} {item.text}
                        </Link>
                    ))}
                </ul>



            </div>
        </div>
    )
}

export default Sidebar