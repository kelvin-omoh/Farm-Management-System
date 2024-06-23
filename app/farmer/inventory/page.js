'use client'

import Layout from '@/app/components/farmer/Layout'
import React, { useContext, useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem, Button, image, Textarea } from "@nextui-org/react";
import LatestItems from '@/app/components/farmer/dashboard/LatestItems';
import toast from 'react-hot-toast';
import { Timestamp, addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth, { Storage, db } from '@/app/firebase.config';
import { BsImage, BsImageAlt, BsX } from 'react-icons/bs';
import { AiOutlineFileImage, AiTwotoneFileImage } from 'react-icons/ai';
import { ReactSortable } from "react-sortablejs";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import AppContext from '@/app/components/Context/AppContext';


const categories = [
    { label: "Choose a category", value: "" },
    { label: "Fresh fruits (e.g. oranges, bananas, mangoes)", value: "fresh-fruits" },
    { label: "Fresh vegetables (e.g. tomatoes, peppers, okra)", value: "fresh-vegetables" },
    { label: "Grains and cereals (e.g. rice, maize, beans)", value: "grains-cereals" },
    { label: "Livestock (e.g. cows, goats, pigs)", value: "livestock" },
    { label: "Poultry (e.g. chickens, turkeys, ducks)", value: "poultry" },
    { label: "Fish (e.g. catfish, tilapia)", value: "fish" },
    { label: "Honey and beeswax products", value: "honey-beeswax" },
    { label: "Animal feeds and supplements", value: "animal-feeds" },
    { label: "Farm equipment and tools", value: "farm-equipment" },
    { label: "Fertilizers and pesticides", value: "fertilizers-pesticides" },
    { label: "Seeds and seedlings", value: "seeds-seedlings" },
    { label: "Organic skincare products (e.g. shea butter, black soap)", value: "skincare-products" },
    { label: "Traditional herbs and spices", value: "herbs-spices" },
    { label: "Handmade crafts and artisan goods", value: "handmade-crafts" },
    { label: "Farm-related books and educational materials", value: "books-educational-materials" },
    { label: "Cooking oils (e.g. palm oil, coconut oil)", value: "cooking-oils" },
    { label: "Ready-to-eat Nigerian dishes and snacks", value: "nigerian-dishes-snacks" },
    { label: "Agricultural services (e.g. crop consulting, soil testing)", value: "agricultural-services" },
    { label: "Farm-themed apparel and merchandise", value: "farm-themed-apparel" },
    { label: "Agritourism experiences and farm tours", value: "agritourism-experiences" },
];

const Page = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        productName: "",
        quantity: "",
        price: 0,
        description: "",
        location: "",
        lastUpdated: "",
        relatedTo: "",
        images: []
    });

    const { setSelectedFarmProduct, selectedFarmProduct } = useContext(AppContext);

    useEffect(() => {
        if (selectedFarmProduct) {
            setFormData(selectedFarmProduct);
            console.log(selectedFarmProduct);
        }
    }, [selectedFarmProduct]);

    const removeImage = (indexToRemove) => {
        setFormData((prevData) => ({
            ...prevData,
            images: prevData.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const updateImagesOrder = (images) => {
        if (images) {
            const urls = images.map(image => image);
            setFormData(prevData => ({
                ...prevData,
                images: urls
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUploadError = (error) => {
        toast.error('Error uploading image');
        console.error('Error uploading image:', error);
    };

    const uploadImages = async (ev) => {
        try {
            const files = ev.target.files;
            if (files.length > 0) {
                setIsUploading(true);
                for (const file of files) {
                    const path = `/images/${file.name}`;
                    const imageRef = ref(Storage, path);
                    await uploadBytes(imageRef, file);
                    const url = await getDownloadURL(imageRef);
                    setFormData((prevData) => ({
                        ...prevData,
                        images: [...(prevData.images || []), url]
                    }));
                }
                toast.success('Image uploaded successfully!');
            }
            setIsUploading(false);
        } catch (error) {
            handleUploadError(error);
            setIsUploading(false);
        }
    };


    const createOrUpdateProduct = async () => {
        setLoading(true);
        const createdAt = serverTimestamp();

        try {
            if (selectedFarmProduct?.id) {
                const productRef = doc(db, "products", selectedFarmProduct.id);
                const docSnap = await getDoc(productRef);

                if (!docSnap.exists()) {
                    throw new Error(`No document found with ID: ${selectedFarmProduct.id}`);
                }

                await updateDoc(productRef, {
                    ...formData,
                    id: selectedFarmProduct.id,
                    price: Number(formData.price),
                    createdAt
                });

                toast.success("Product updated successfully!");
            } else {
                if (!user?.displayName) {
                    throw new Error("You are not signed in!");
                }
                const newProductId = newProductRef.id;
                // Create a new document with an auto-generated ID
                const newProductRef = await addDoc(collection(db, "products"), {
                    ...formData,
                    price: Number(formData.price),
                    createdAt,
                    id: newProductId,
                    by: user.displayName
                });

                toast.success("Product added to the inventory successfully!");

                // Use the generated document ID as the product ID

                setFormData(prevState => ({
                    ...prevState,
                    id: newProductId // Set the product ID in the form data
                }));
            }

            // Reset form and selected product
            setFormData({
                productName: "",
                quantity: "",
                price: 0,
                description: "",
                location: "",
                lastUpdated: "",
                relatedTo: "",
                images: []
            });
            setSelectedFarmProduct(null);
        } catch (error) {
            toast.error(error.message || 'Error processing request');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full px-[5rem] mx-auto'>
            <Layout className="w-full">
                <h1 className='my-[1rem]'>Inventory Management</h1>
                <form className='gap-4 w-full flex flex-col' onSubmit={(e) => {
                    e.preventDefault();
                    createOrUpdateProduct();
                }}>
                    <label className="flex gap-4 flex-col">
                        Product Name
                        <input
                            type="text"
                            name="productName"
                            className='border-amber-950 p-3 rounded-lg w-full border-2'
                            value={formData.productName}
                            onChange={handleChange}
                            placeholder="Product Name"
                        />
                    </label>
                    <label className="flex gap-4 flex-col">
                        Quantity
                        <input
                            type="text"
                            name="quantity"
                            className='border-amber-950 p-3 rounded-lg w-full border-2'
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Quantity"
                        />
                    </label>
                    <label className="flex gap-4 flex-col">
                        Description
                        <Textarea
                            name="description"
                            className='border-amber-950 p-3 rounded-lg w-full border-2'
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />
                    </label>
                    <label className="flex gap-4 flex-col">
                        Price of each
                        <input
                            type="number"
                            name="price"
                            className='border-amber-950 p-3 rounded-lg w-full border-2'
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price of each"
                        />
                    </label>
                    <label className="flex gap-4 flex-col">
                        Location
                        <input
                            type="text"
                            name="location"
                            className='border-amber-950 p-3 rounded-lg w-full border-2'
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Location"
                        />
                    </label>
                    <label className="flex gap-4 flex-col">
                        Last Updated
                        <input
                            type="date"
                            name="lastUpdated"
                            className='border-amber-950 p-3 rounded-lg w-full border-2'
                            value={formData.lastUpdated}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="flex gap-4 flex-col">
                        Related To
                        <select
                            name="relatedTo"
                            className='border-amber-950 p-3 rounded-lg w-full border-2'
                            value={formData.relatedTo}
                            onChange={handleChange}
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    {isUploading && (
                        <div className="h-24 flex items-center">
                            Loading ...
                        </div>
                    )}
                    <ReactSortable
                        list={formData.images}
                        className="flex flex-wrap gap-1"
                        setList={updateImagesOrder}
                    >
                        {formData?.images?.map((link, index) => (
                            <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                                <BsX onClick={() => removeImage(index)} className="w-6 cursor-pointer" />
                                <div className='size-[50px]'>
                                    <img src={link} alt="" className="w-full h-full object-cover rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </ReactSortable>
                    <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <div>Add image</div>
                        <input type="file" onChange={uploadImages} className="hidden" />
                    </label>
                    <Button disabled={loading} className={`bg-green-700 p-3 rounded-lg text-white ${loading && 'bg-green-950'} w-full border-2`} type="submit">
                        {loading ? (selectedFarmProduct?.id ? 'Updating....' : 'Adding....') : (selectedFarmProduct?.id ? 'Update' : 'Add')}
                    </Button>
                </form>
                <LatestItems />
            </Layout>
        </div>
    );
};

export default Page;