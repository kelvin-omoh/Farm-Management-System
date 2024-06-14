'use client'
import React, { useContext, useEffect, useState } from 'react'
import ChatSide from './ChatSide';
import { AiOutlineSend } from 'react-icons/ai';
import { Button } from '@nextui-org/react';
import AppContext from '../../Context/AppContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth, { db } from '@/app/firebase.config';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
const RightSide = () => {
    const [user] = useAuthState(auth);
    const { selectedUser } = useContext(AppContext);
    const [receiverData, setreceiverData] = useState(selectedUser)
    const [chatMessage, setChatMessage] = useState("");

    const [allMessages, setAllMessages] = useState([]);

    useEffect(() => {
        setreceiverData(selectedUser)
    }, [selectedUser])

    const sendMessage = async () => {
        try {
            if (user && receiverData) {
                await addDoc(
                    collection(db, `farmers/${user.uid}/chatUsers/${receiverData.id}/messages`),
                    {
                        username: user.displayName,
                        messageUserId: user.uid,
                        message: chatMessage,
                        timestamp: new Date(),
                    }
                );

                await addDoc(
                    collection(db, `farmers/${receiverData.id}/chatUsers/${user.uid}/messages`),
                    {
                        username: user.displayName,
                        messageUserId: user.uid,
                        message: chatMessage,
                        timestamp: new Date(),
                    }
                );
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
        setChatMessage("");
    };

    useEffect(() => {
        if (receiverData) {
            const unsub = onSnapshot(
                query(
                    collection(db, `farmers/${user?.uid}/chatUsers/${receiverData?.id}/messages`),
                    orderBy("timestamp", "asc")
                ),
                (snapshot) => {
                    setAllMessages(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(), // Spread all document data
                        }))
                    );

                    console.log(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(), // Spread all document data
                        }))
                    );
                }
            );
            return unsub;
        }
    }, [user?.uid, receiverData?.id, setAllMessages]);



    return (
        <div className='chat w-fuzll  p-3'>
            <ChatSide allMessages={allMessages} />


            {selectedUser.id && (<div className=' px-3 mt-[1rem] w-full flex justify-center gap-4 items-center'>
                <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} className=' w-full p-3 rounded-sm border-black border-[1px] ' type="text" placeholder=' write something ...' name="" id="" />
                <Button onClick={() => sendMessage()} className=" flex gap-3 items-center">send <AiOutlineSend size={30} /></Button>
            </div>)}
        </div>
    )
}

export default RightSide