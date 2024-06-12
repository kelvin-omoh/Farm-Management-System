'use client'
import Layout from "@/app/components/farmer/Layout";
import LatestLiveStock from "@/app/components/farmer/livestock/Table";
import auth, { db } from '@/app/firebase.config';
import { Button } from "@nextui-org/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from 'react-hot-toast';


const Page = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [liveStocks, setLiveStocks] = useState([]);

    const [formData, setFormData] = useState({
        animalType: "",
        quantity: "",
        healthStatus: "",
        lastChecked: "",
        relatedTo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const createLiveStock = async (e) => {
        e.preventDefault();
        const createdAt = serverTimestamp();
        try {
            if (user.displayName) {
                setLoading(true);
                const docRef = await addDoc(
                    collection(db, `livestocks`),
                    { ...formData, createdAt, by: user.displayName }
                );
                console.log(docRef);
                toast.success("livestock added  successfully !");
                setLoading(false);
                setFormData({

                    animalType: "",
                    quantity: "",
                    healthStatus: "",
                    lastChecked: "",
                    relatedTo: "",
                })
            } else {
                toast.error("you are not signned In!");
                setLoading(false);
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Error adding livestock : ", error);
            setLoading(false);
        }
    }




    return (
        <div className="w-full px-[5rem] mx-auto">
            <Layout className="w-full">
                <h1 className="my-[1rem]">Livestock Management</h1>
                <form className="gap-4 w-full flex flex-col" onSubmit={(e) => createLiveStock(e)}>
                    <input
                        type="text"
                        name="animalType"
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        value={formData.animalType}
                        onChange={handleChange}
                        placeholder="Animal Type"
                    />
                    <input
                        type="text"
                        name="quantity"
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                    />
                    <input
                        type="text"
                        name="healthStatus"
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        value={formData.healthStatus}
                        onChange={handleChange}
                        placeholder="Health Status"
                    />
                    <input
                        type="text"
                        name="lastChecked"
                        value={formData.lastChecked}
                        onChange={handleChange}
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        placeholder="Last Checked"
                    />
                    <input
                        type="text"
                        name="relatedTo"
                        value={formData.relatedTo}
                        onChange={handleChange}
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        placeholder="Related To"
                    />
                    <Button disabled={loading} className={` bg-green-700 p-3 rounded-lg  text-white ${loading && 'bg-green-950'}  w-full border-2`} type="submit">{loading ? 'Adding....' : 'Add'}</Button>

                </form>
                <LatestLiveStock />
            </Layout>
        </div>
    );
};

export default Page
