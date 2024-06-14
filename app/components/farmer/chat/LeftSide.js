'use client'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { BsPerson } from 'react-icons/bs'
import AppContext from '../../Context/AppContext'
import { Button } from '@nextui-org/react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import auth, { db } from '@/app/firebase.config'
import { useAuthState } from 'react-firebase-hooks/auth'
import Image from 'next/image'
const listOfUsers = [
    {
        id: '1',
        name: 'John',
        message: "Hello world, how are you doing?",
        time: "10:34 AM"
    },
    {
        id: '2',
        name: 'Jane',
        message: "Good morning! Are we still on for lunch?",
        time: "08:20 AM"
    },
    {
        id: '3',
        name: 'Doe',
        message: "Hi there! Long time no see.",
        time: "09:15 AM"
    },
    {
        id: '4',
        name: 'Alice',
        message: "Can you send me the report?",
        time: "11:45 AM"
    },
    {
        id: '5',
        name: 'Bob',
        message: "I'm running late. Be there in 10.",
        time: "12:05 PM"
    },
    {
        id: '6',
        name: 'Charlie',
        message: "Happy Birthday! Have a great day!",
        time: "07:30 AM"
    },
    {
        id: '7',
        name: 'Eve',
        message: "Let's catch up later this week.",
        time: "01:20 PM"
    },
    {
        id: '8',
        name: 'Frank',
        message: "Don't forget about the meeting at 3 PM.",
        time: "02:45 PM"
    },
    {
        id: '9',
        name: 'Grace',
        message: "Congratulations on your promotion!",
        time: "04:10 PM"
    },
    {
        id: '10',
        name: 'Heidi',
        message: "Can you review the document I sent?",
        time: "05:30 PM"
    }
];

const LeftSide = () => {
    const [user] = useAuthState(auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeUser, setActiveUser] = useState(null);
    const [allUsers, setAllUsers] = useState([])
    const [loadings, setLoading] = useState(false)
    const handleUserClick = (user) => {
        setSelectedUser(user);
        setActiveUser(user.id);
    };

    useEffect(() => {
        const q = query(collection(db, "farmers"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),

            }));
            console.log(Data);
            setAllUsers(Data);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch users");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    const filteredUsers = allUsers.filter(newuser => {
        const isCurrentUser = newuser.name === user?.displayName;
        const matchesSearch = newuser.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Include the current user if they match the search, but only once
        if (isCurrentUser && matchesSearch && searchQuery.toLowerCase() === user?.displayName.toLowerCase()) {
            return true;
        }

        // Include other users that match the search query
        return matchesSearch;
    });
    const { setSelectedUser } = useContext(AppContext);



    return (
        <div className=' h-full w-full pt-[3rem] px-[1em]'>
            <div className=' h-full w-full flex flex-col '>
                <span className=' flex w-full items-center justify-center gap-4   '> <div className='size-14'>
                    <Image src={user?.photoURL} alt='' width={1000} height={1000} className='  size-full rounded-full  ' />
                </div>

                    <div>
                        <h1 className=' font-semibold    text-[#758229] text-[18px]  '>{user?.displayName || 'Guest'}</h1>
                        <h1 className='  text-[14px]  '>Farmer( Me )</h1>
                    </div>
                </span>

                <div className=' mt-[40px] w-full'>
                    <input
                        className="w-full p-3 rounded-md bg-white border-[1px]"
                        type="text"
                        placeholder="Search for farmers"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />   <hr className=' mt-[3rem]' />
                </div>

                <div className=' overflow-y-scroll  h-full flex flex-col gap-5'>
                    {filteredUsers.map((newuser, i) => (
                        <div
                            key={i}
                            onClick={() => handleUserClick(newuser)}
                            className={`cursor-pointer h-[5rem] ${activeUser === newuser?.id ? 'bg-[#475e0bc5]' : 'bg-[#465e0b78]'
                                } hover:bg-[#475e0bc5] text-white p-5 rounded-xl flex items-center w-full gap-[3rem] justify-between group`}
                        >
                            <div className='flex items-center gap-4'>
                                <div className='size-11'>
                                    <Image src={newuser?.photoURL} alt='' width={1000} height={1000} className='  size-full rounded-full  ' />
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <h1 className={`text-[14px]   ${activeUser === newuser?.id ? 'text-gray-200' : 'text-gray-200'
                                        } transition-colors duration-200 font-medium`}>{newuser?.name === user?.displayName ? 'Me' : newuser?.name}</h1>
                                    <p className={`flex w-full items-center text-[12px] whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-gray-200 ${activeUser === newuser?.id ? 'text-gray-200' : ''} transition-colors duration-200`}>
                                        {newuser?.message ? (
                                            newuser?.message?.length > 20 ? `${newuser?.message?.slice(0, 20)}...` : `${newuser?.message}`
                                        ) : (
                                            `Send message to ${newuser?.name}`
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className='text-[12px]'>{user?.time ? user?.time : ''}</p>
                            </div>
                        </div>
                    ))}

                </div>





            </div>

        </div>
    )
}

export default LeftSide