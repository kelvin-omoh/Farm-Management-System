'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../../Context/AppContext';
import auth from '@/app/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';


// const conversation = [
//     {
//         "timestamp": "2024-06-14T10:00:00Z",
//         "sender": "Alice",
//         "message": "Hey Bob, how are you today?"
//     },
//     {
//         "timestamp": "2024-06-14T10:05:00Z",
//         "sender": "Bob",
//         "message": "Hi Alice! I'm doing great, thanks for asking."
//     },
//     {
//         "timestamp": "2024-06-14T10:10:00Z",
//         "sender": "Alice",
//         "message": "That's good to hear! Did you finish the report?"
//     },
//     {
//         "timestamp": "2024-06-14T10:15:00Z",
//         "sender": "Bob",
//         "message": "Yes, I finished it yesterday. I'll send it over to you."
//     },
//     {
//         "timestamp": "2024-06-14T10:20:00Z",
//         "sender": "Alice",
//         "message": "Great, thanks Bob!"
//     },
//     {
//         "timestamp": "2024-06-14T10:25:00Z",
//         "sender": "Bob",
//         "message": "You're welcome! Here's a longer message to test the max width and auto height of the message box. sorry for that message though you're not allowed to have more than one message at a time and you're not allowed to have more than one message at a time and you're not allowed to have more than one message at a time and you're not allowed to have more than one message at a time and you aren     not allowed to have more than one message at a time and you're not allowed"
//     }
// ];
const ChatSide = ({ allMessages }) => {

    const [user] = useAuthState(auth);
    const { selectedUser } = useContext(AppContext);
    const [conversations, setConversations] = useState(allMessages)
    console.log(allMessages);
    const messagesEndRef = useRef(null); // Ref for scrolling to bottom


    useEffect(() => {
        setConversations(allMessages)
        console.log(conversations);

    }, [allMessages])

    // Function to scroll to bottom of messages container
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        // Scroll to bottom whenever conversations change (new message)
        scrollToBottom();
    }, [conversations]);


    const formatTimestamp = (timestamp) => {
        const dateObj = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object

        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        minutes = minutes < 10 ? '0' + minutes : minutes;

        const formattedTime = hours + ':' + minutes + ' ' + ampm;

        return formattedTime;
    };


    return (
        <div className=' h-full w-full'>

            <div className='chat  flex justify-center items-center w-full p-3'>
                {selectedUser.id ? (
                    <h2 className='text-lg font-bold mb-3'>Chat with {selectedUser.name}</h2>
                ) : (
                    <h2 className='text-[40px] items-center text-center font-bold flex flex-col mt-[20vh]'>Select a user to chat! <span className=' my-10' >
                        Welcome TO FMS where communication meet the needs
                    </span>

                    </h2>
                )}
            </div>

            {selectedUser.id && (
                <div className=' bg-[#0824080b] rounded-lg backdrop-blur-md  h-[80vh]  chat-messages p-5 flex flex-col gap-4  relative overflow-y-scroll'>

                    <div className='chat-messages p-5 flex flex-col gap-4 h-full  relative overflow-y-scroll'>
                        {conversations.map((messages, index) => (<>
                            <div
                                key={index}
                                className={`message-container ${user?.uid == messages.messageUserId ? 'ml-auto' : 'mr-auto'} max-w-[70%] rounded-lg p-3 ${user?.uid == messages.messageUserId ? 'bg-[#08082b] text-white' : 'bg-gray-200 text-gray-800'} ${user?.uid == messages.messageUserId ? 'text-right' : 'text-left'}`}
                            >
                                {messages.message}

                            </div>
                            <p className={` px-3 ${user?.uid == messages.messageUserId ? 'text-right' : 'text-left'}`}>{formatTimestamp(messages.timestamp)}</p>
                        </>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>


                </div>
            )}
        </div>
    )
}

export default ChatSide