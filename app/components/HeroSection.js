'use client'
import React, { useEffect, useMemo, useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import pic1 from "../assets/damian-ochrymowicz-zoMwCm7lrQ0-unsplash.jpg"
import pic2 from "../assets/francesco-ungaro-Yxt4bdVcBec-unsplash (1).jpg"
import Image from 'next/image'
import Chart from "chart.js/auto";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CategoryScale } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { BsGoogle, BsX } from 'react-icons/bs'
import { AiOutlineBars, AiOutlineX } from 'react-icons/ai';
import { toggle } from '@nextui-org/theme';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import auth, { db } from '../firebase.config';


Chart.register(CategoryScale);

const HeroSection = () => {
    const provider = new GoogleAuthProvider();
    const [toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false);
    const navigate = useRouter();

    const signInWithGoogleAsUser = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await createUserDocument(user);
            toast.success("User Authenticated Successfully!");
            setLoading(false);
            navigate.push("/");
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
            console.error("Error signing in with Google: ", error.message);
        }
    };
    const signInWithGoogleAsFarmer = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const farmer = result.user;
            await createFarmerDocument(farmer);
            toast.success("farmer Authenticated Successfully!");
            setLoading(false);
            navigate.push("/farmer/dashboard");
        } catch (error) {
            setLoading(false);
            toast.error(error.message);
            console.error("Error signing in with Google: ", error.message);
        }
    };

    const createUserDocument = async (user) => {
        setLoading(true);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists()) {
            const { displayName, email, photoURL } = user;
            const createdAt = new Date();

            try {
                await setDoc(userRef, {
                    name: displayName ? displayName : name,
                    email,
                    photoURL: photoURL ? photoURL : "",
                    createdAt,
                });
                toast.success("Account Created!");
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
                console.error("Error creating user document: ", error);
                setLoading(false);
            }
        }
    };


    const createFarmerDocument = async (farmer) => {
        setLoading(true);
        if (!farmer) return;

        const farmerRef = doc(db, "farmers", farmer.uid);
        const farmerData = await getDoc(farmerRef);

        if (!farmerData.exists()) {
            const { displayName, email, photoURL } = farmer;
            const createdAt = new Date();

            try {
                await setDoc(farmerRef, {
                    name: displayName ? displayName : name,
                    email,
                    photoURL: photoURL ? photoURL : "",
                    createdAt,
                });
                toast.success("Account Created!");
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
                console.error("Error creating farmer document: ", error);
                setLoading(false);
            }
        }
    };

    return (


        <div className=' relative h-[100vh] overflow-hidden w-[100vw]'>
            <div className=' rounded-lg z-20 mx-auto w-[100%] text-center flex flex-col gap-2 items-center absolute  bottom-[22%] px-[2rem] py-2 justify-center'>
                <h1 className=' font-[montesearat] mb-3 text-white text-[22px]  '>Discover fresh, quality farm products delivered straight to your door!</h1>
                <button onClick={signInWithGoogleAsUser} className=' text-[12px] rounded-lg gap-2 px-4 mx-auto text-center flex items-center  py-2 bg-white'> <BsGoogle /> SignIn with Google</button>
            </div>

            <div className={` rounded-lg z-20 absolute right-4 top-8  transition-all delay-100   `}>

                <button onClick={() => setToggle(!toggle)} className='  bg-blue-800 p-2 rounded-md   text-white'>
                    {
                        !toggle ? <AiOutlineBars size={30} /> : <BsX size={30} />

                    }

                </button>

            </div>
            <div className={` bg-green-900/50 backdrop-blur-sm h-[90%] mx-auto  rounded-lg z-20 w-full  flex flex-col gap-2 items-center absolute    right-0 py-2 justify-end   transition-all delay-100 ${toggle ? 'top-[4.5rem]' : 'top-[-1000rem]'}     `}>

                <ul className=' m-auto w-ful gap-6 h-full flex justify-center items-center flex-col'>
                    <li className=' font-[montesearat] mb-3 text-white text-[42px]  '>Welcome to FMS</li>
                    <li className=' font-[montesearat]  text-white text-[22px]'> SignIn as Farmer
                    </li>
                    <li><button onClick={signInWithGoogleAsFarmer} className=' text-[12px] rounded-lg gap-2 px-4 mx-auto text-center flex items-center  py-2 bg-white'> <BsGoogle /> SignIn with Google</button></li>
                </ul>
            </div>

            <Carousel infiniteLoop={true} transitionTime={1} autoPlay={true} className=' w-[100vw] h-[100vh] ' showArrows={false}>
                <div className='relative w-[100vw] h-[100vh]'>
                    <Image
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full contrast-150 brightness-150  "
                        alt=""
                        src={pic1}
                    />
                    <div className='absolute top-0 left-0 w-full h-full bg-[#1c1c1c87] z-10'></div>
                </div>
                <div className='relative w-[100vw] h-[100vh]'>
                    <Image
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full contrast-125 brightness-105"
                        alt=""
                        src={pic2}
                    />
                    <div className='absolute top-0 left-0 w-full h-full bg-[#1c1c1c87] z-10'></div>

                </div>
            </Carousel>



            {/* 

            <div className='h-[100vh] w-[100vw]'>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Farm Inventory</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="productId"
                            value={newItem.productId}
                            onChange={handleInputChange}
                            placeholder="Product ID"
                            className="border p-2 mr-2"
                        />
                        <input
                            type="number"
                            name="quantity"
                            value={newItem.quantity}
                            onChange={handleInputChange}
                            placeholder="Quantity"
                            className="border p-2 mr-2"
                        />
                        <input
                            type="text"
                            name="location"
                            value={newItem.location}
                            onChange={handleInputChange}
                            placeholder="Location"
                            className="border p-2 mr-2"
                        />
                        <input
                            type="date"
                            name="lastUpdated"
                            value={newItem.lastUpdated}
                            onChange={handleInputChange}
                            className="border p-2 mr-2"
                        />
                        <input
                            type="text"
                            name="relatedTo"
                            value={newItem.relatedTo}
                            onChange={handleInputChange}
                            placeholder="Related To"
                            className="border p-2 mr-2"
                        />
                        <button
                            onClick={addItem}
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            Add Item
                        </button>
                    </div>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Product ID</th>
                                <th className="border px-4 py-2">Quantity</th>
                                <th className="border px-4 py-2">Location</th>
                                <th className="border px-4 py-2">Last Updated</th>
                                <th className="border px-4 py-2">Related To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td className="border px-4 py-2">{item.id}</td>
                                    <td className="border px-4 py-2">{item.productId}</td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">{item.location}</td>
                                    <td className="border px-4 py-2">{item.lastUpdated}</td>
                                    <td className="border px-4 py-2">{item.relatedTo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='w-[80vw] h-[50vh]'>
                    <h2 style={{ textAlign: "center" }}>Inventory Chart</h2>
                    <Line
                        data={chartData}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: "Farm Inventory Quantities"
                                },
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />
                </div>
            </div> */}










        </div>

    )
}

export default HeroSection