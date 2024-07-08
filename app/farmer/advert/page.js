'use client'
import Layout from '@/app/components/farmer/Layout';
import { db } from '@/app/firebase.config';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const page = () => {
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", imageUrl: "" });
    const [editProductId, setEditProductId] = useState(null);



    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "advert"), (snapshot) => {
            const itemsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setItems(itemsList);
        });

        return () => unsubscribe();
    }, []);
    const handleAddProduct = async () => {
        await addDoc(collection(db, "advert"), newProduct);
        setNewProduct({ title: "", description: "", price: "", imageUrl: "" });
    };

    const handleEditProduct = async (id) => {
        const productRef = doc(db, "advert", id);
        await updateDoc(productRef, newProduct);
        setNewProduct({ title: "", description: "", price: "", imageUrl: "" });
        setEditProductId(null);
    };

    const handleDeleteProduct = async (id) => {
        await deleteDoc(doc(db, "advert", id));
    };




    const CustomLeftArrow = ({ onClick }) => {
        return (
            <button
                onClick={onClick}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-2 rounded-full shadow-lg z-10"
            >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
        );
    };

    const CustomRightArrow = ({ onClick }) => {
        return (
            <button
                onClick={onClick}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 p-2 rounded-full shadow-lg z-10"
            >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        );
    };
    return (
        <div>
            <Layout className=" flex flex-col-reverse" >

                <div className="container mx-auto p-6">
                    <h1 className="text-4xl font-bold text-center mb-6">Our Advert</h1>
                    <div className="relative flex overflow-x-auto">
                        <Carousel
                            useKeyboardArrows={true}
                            swipeable={true}
                            infiniteLoop={true}
                            autoPlay={true}
                            className=' h-[70vh] w-full '
                            showArrows={true}
                            showThumbs={true}
                            transitionTime={.8}
                            interval={2000}


                        >
                            {items.map((product) => (
                                <div key={product.id} className="p-4 bg-blue-950/80 text-white shadow-md rounded-lg mx-2">
                                    <div className="w-full   h-[60vh] mb-4">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="w-[70%] object-contain object-center h-full rounded-t-lg"
                                        />
                                    </div>
                                    <h2 className="text-xl font-semibold">{product.title}</h2>
                                    <p className="">{product.description}</p>
                                    <p className="text-green-600 font-bold">${product.price}</p>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>







                <div className="container mx-auto p-6">
                    <h1 className="text-3xl font-bold text-center mb-6">Advertisement   Board</h1>
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Title"
                            value={newProduct.title}
                            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                            className="border p-2 rounded mr-2"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="border p-2 rounded mr-2"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="border p-2 rounded mr-2"
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={newProduct.imageUrl}
                            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                            className="border p-2 rounded mr-2"
                        />
                        {editProductId ? (
                            <button onClick={() => handleEditProduct(editProductId)} className="bg-blue-500 text-white p-2 rounded">
                                Update Product
                            </button>
                        ) : (
                            <button onClick={handleAddProduct} className="bg-green-500 text-white p-2 rounded">
                                Add Product
                            </button>
                        )}
                    </div>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Image URL</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((product) => (
                                <tr key={product.id}>
                                    <td className="border px-4 py-2">{product.title}</td>
                                    <td className="border px-4 py-2">{product.description}</td>
                                    <td className="border px-4 py-2">${product.price}</td>
                                    <td className="border px-4 py-2">{product.imageUrl}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => {
                                                setNewProduct(product);
                                                setEditProductId(product.id);
                                            }}
                                            className="bg-yellow-500 text-white p-2 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white p-2 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </div>
    )
}

export default page
