'use client';

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { PaystackButton } from 'react-paystack';
import toast from "react-hot-toast";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { AiFillWarning } from "react-icons/ai";
import Layout from "../components/Layout";
import { ProductsContext } from "../components/ProductsContext";

export default function Page() {
    const { selectedProducts, setSelectedProducts } = useContext(ProductsContext);
    const [productsInfos, setProductsInfos] = useState([]);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (selectedProducts.length === 0) return;
            try {
                const uniqIds = [...new Set(selectedProducts)];
                const productsSnapshot = await getDocs(query(collection(db, 'products'), where('id', 'in', uniqIds)));
                const productsData = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProductsInfos(productsData);
            } catch (error) {
                console.error('Error fetching selected products:', error);
            }
        };
        fetchData();
    }, [selectedProducts]);

    const handleQuantityChange = (id, increment) => {
        setSelectedProducts(prev => {
            const updated = [...prev];
            const index = updated.indexOf(id);
            if (increment > 0) {
                updated.push(id);
            } else if (index !== -1) {
                updated.splice(index, 1);
            }
            return updated;
        });
    };

    const verifyTransaction = async (reference) => {
        try {
            const response = await axios.get(`/api/transaction/verify/${reference}`);
            const transactionStatus = response.data.data.status;

            const createdAt = serverTimestamp();
            const productDetails = productsInfos.reduce((details, productInfo) => {
                const quantity = selectedProducts.filter(id => id === productInfo.id).length;
                if (quantity > 0) {
                    details.push({ name: productInfo.productName, quantity });
                }
                return details;
            }, []);
            const paid = transactionStatus === "success";
            const orderData = {
                productDetails,
                email,
                address,
                city,
                createdAt,
                reference,
                paid,
                amount: total,
                metaData: {
                    reference,
                    amount: total,
                    currency: "NGN"
                }
            };

            await addDoc(collection(db, 'orders'), orderData);
            toast.success("Your order was successfully processed!");
            setSelectedProducts([]);

        } catch (error) {
            console.log(error);
            toast.error("Error processing your order. Please try again.");
        }
    };

    const deliveryPrice = 500;
    const subtotal = selectedProducts.reduce((sum, id) => {
        const product = productsInfos.find(p => p.id === id);
        return sum + (product ? product.price : 0);
    }, 0);
    const total = subtotal + deliveryPrice;

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    const componentProps = {
        email,
        amount: total * 100,
        metadata: { name, email },
        publicKey,
        text: "Pay Now",
        onSuccess: ({ reference }) => verifyTransaction(reference),
        onClose: () => toast(
            <div className="shadow-lg border bg-white rounded-lg px-4 py-2 flex gap-4 items-center">
                <AiFillWarning size={40} className="text-[#ffa346]" />
                Transaction closed. Are you sure you don't want to continue? Try again!
            </div>
        )
    };

    return (
        <Layout>
            {selectedProducts.length === 0 ? (
                <div>No products in your shopping cart</div>
            ) : (
                productsInfos.map(productInfo => {
                    const quantity = selectedProducts.filter(id => id === productInfo.id).length;
                    if (quantity === 0) return null;
                    return (
                        <div className="flex mb-5 items-center" key={productInfo.id}>
                            <div className="bg-gray-100 p-3 rounded-xl shrink-0" style={{ boxShadow: 'inset 1px 0px 10px 10px rgba(0,0,0,0.1)' }}>
                                <div className="h-[10rem] w-[10rem]">
                                    <Image width={1000} height={1000} className="w-full h-full object-cover" src={productInfo.images[0]} alt={productInfo.productName} />
                                </div>
                            </div>
                            <div className="pl-4 items-center">
                                <h3 className="font-bold text-lg">{productInfo.productName}</h3>
                                <p className="text-sm leading-4 text-gray-500">{`${productInfo.description.slice(0, 30)}...`}</p>
                                <div className="flex mt-1">
                                    <div className="grow font-bold">₦{productInfo.price}</div>
                                    <div>
                                        <button onClick={() => handleQuantityChange(productInfo.id, -1)} className="border border-emerald-500 px-2 rounded-lg text-emerald-500">-</button>
                                        <span className="px-2">{quantity}</span>
                                        <button onClick={() => handleQuantityChange(productInfo.id, 1)} className="bg-emerald-500 px-2 rounded-lg text-white">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            <form method="POST">
                <div className="mt-8">
                    <input name="address" value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Street address, number" />
                    <input name="city" value={city} onChange={e => setCity(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="City and postal code" />
                    <input name="name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Your name" />
                    <input name="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="email" placeholder="Email address" />
                </div>
                <div className="mt-8">
                    <div className="flex my-3">
                        <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
                        <h3 className="font-bold">₦{subtotal}</h3>
                    </div>
                    <div className="flex my-3">
                        <h3 className="grow font-bold text-gray-400">Delivery:</h3>
                        <h3 className="font-bold">₦{deliveryPrice}</h3>
                    </div>
                    <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
                        <h3 className="grow font-bold text-gray-400">Total:</h3>
                        <h3 className="font-bold">₦{total}</h3>
                    </div>
                </div>
                <input type="hidden" name="products" value={selectedProducts.join(',')} />
            </form>
            <PaystackButton className="paystack-button bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-emerald-300 shadow-lg" {...componentProps} />
        </Layout>
    );
}
