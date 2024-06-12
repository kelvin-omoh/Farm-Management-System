'use client'

import Layout from '@/app/components/farmer/Layout'
import React, { useState } from "react";
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import LatestItems from '@/app/components/farmer/dashboard/LatestItems';
import toast from 'react-hot-toast';
import { Timestamp, addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth, { db } from '@/app/firebase.config';

const Page = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productName: "",
        quantity: "",
        price: "",
        location: "",
        lastUpdated: "",
        relatedTo: "",

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const createFarmInventory = async (e) => {
        e.preventDefault();
        const createdAt = serverTimestamp();
        try {
            if (user.displayName) {
                setLoading(true);
                const docRef = await addDoc(
                    collection(db, `products`),
                    { ...formData, createdAt, by: user.displayName }
                );
                console.log(docRef);
                toast.success("product added to the inventory successfully !");
                setLoading(false);
                setFormData({
                    productName: "",
                    quantity: "",
                    price: "",
                    location: "",
                    lastUpdated: "",
                    relatedTo: "",
                })
            } else {
                toast.error("you are not signned In!");
                setLoading(false);
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Error adding product : ", error);
            setLoading(false);
        }
    }


    return (
        <div className=' w-full px-[5rem]   mx-auto '>



            <Layout className="w-full">
                <h1 className=' my-[1rem]' >Inventory Management </h1>


                <form className=' gap-4 w-full flex flex-col' onSubmit={(e) => createFarmInventory(e)}>


                    <input
                        type="text"
                        name="productName"
                        className=' border-amber-950 p-3 rounded-lg   w-full border-2'
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="Product Name"
                    />
                    <input
                        type="text"
                        name="quantity"
                        className=' border-amber-950 p-3 rounded-lg   w-full border-2'
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                    />
                    <input
                        type="text"
                        name="price"
                        className=' border-amber-950 p-3 rounded-lg   w-full border-2'
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="price"
                    />
                    <input
                        type="text"
                        name="location"
                        className=' border-amber-950 p-3 rounded-lg   w-full border-2'
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Location"
                    />
                    <input
                        type="date"
                        name="lastUpdated"
                        value={formData.lastUpdated}
                        onChange={handleChange}
                        className=' border-amber-950 p-3 rounded-lg   w-full border-2'
                        placeholder="Last Updated"
                    />
                    <input
                        type="text"
                        name="relatedTo"
                        value={formData.relatedTo}
                        onChange={handleChange}
                        className=' border-amber-950 p-3 rounded-lg  w-full border-2'
                        placeholder="Related To e.g cow"
                    />
                    <Button disabled={loading} className={` bg-green-700 p-3 rounded-lg  text-white ${loading && 'bg-green-950'}  w-full border-2`} type="submit">{loading ? 'Adding....' : 'Add'}</Button>
                </form>
                <LatestItems />


            </Layout>
        </div>
    )
}

export default Page