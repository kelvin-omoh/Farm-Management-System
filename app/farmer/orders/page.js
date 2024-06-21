'use client';
import Layout from '@/app/components/farmer/Layout';
import { db } from '@/app/firebase.config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import axios from 'axios';
import toast from 'react-hot-toast';

const Page = () => {
    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const orders = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(orders);
            setAllOrders(orders);
        }, (error) => {
            toast.error("Failed to fetch orders");
        });

        return () => unsubscribe();
    }, []);

    const verifyTransaction = async () => {
        for (const order of allOrders) {
            if (order && order.reference) {
                try {
                    const response = await axios.get(`/api/transaction/verify/${order.reference}`);
                    if (response.data.data.status === "success") {
                        const transactionResponseStatus = await axios.post(`/api/transaction/verify/${order.reference}`, {
                            order_id: response.data.data.metadata.order_id
                        });
                        toast.success('Your product has been ordered successfully!');
                        setTimeout(() => {
                            // addTransactionReference function is not defined, ensure to handle it appropriately
                        }, 3000);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    useEffect(() => {
        if (allOrders.length > 0) {
            verifyTransaction();
        }
    }, [allOrders]);

    const calculateQuantities = (productDetails) => {
        const quantities = {};
        productDetails.forEach(item => {
            if (item.name) {
                quantities[item.name] = (quantities[item.name] || 0) + item.quantity;
            }
        });
        return quantities;
    };

    const calculateQuantitiesForAllOrders = (orders) => {
        const quantities = {};
        orders.forEach(order => {
            const productDetails = order.productDetails;
            productDetails.forEach(item => {
                if (item.name) {
                    quantities[item.name] = (quantities[item.name] || 0) + item.quantity;
                }
            });
        });
        return quantities;
    };

    const quantities = calculateQuantitiesForAllOrders(allOrders);
    console.log(quantities);

    const [page, setPage] = useState(1);
    const rowsPerPage = 4;

    const pages = Math.ceil(allOrders.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return allOrders.slice(start, start + rowsPerPage);
    }, [page, allOrders]);

    return (
        <Layout>
            <h1 className='px-[4rem]'>Orders</h1>
            <Table
                className='px-[4rem]'
                aria-label="Orders table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Products Name</TableColumn>
                    <TableColumn>Quantity</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Address</TableColumn>
                    <TableColumn>City</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Reference</TableColumn>
                    <TableColumn>Paid</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {item => {
                        const quantities = calculateQuantities(item.productDetails);
                        return (
                            <TableRow className='  my-4 ' key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{Object.keys(quantities).join(', ')}</TableCell>
                                <TableCell>{Object.values(quantities).join(', ')}</TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>{item.city}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.reference}</TableCell>
                                <TableCell className={` px-4 py-2 my-4 ${item.paid ? 'bg-green-500' : 'bg-blue-950'} text-white `} >{item.paid ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        );
                    }}
                </TableBody>
            </Table>
        </Layout>
    );
}

export default Page;
