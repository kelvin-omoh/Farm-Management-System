'use client'
import React, { useEffect, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Spinner } from "@nextui-org/react";
import { collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/app/firebase.config';
import { toast } from 'react-toastify';
const LatestItems = () => {
    const rows = [
        { id: 1, productName: "Premium Cattle Feed", quantity: 500, price: 5000, location: "Barn", lastUpdated: "2024-06-11", relatedTo: "Livestock" },
        { id: 2, productName: "High-Quality Wheat Seeds", quantity: 1000, price: 2000, location: "Field", lastUpdated: "2024-06-10", relatedTo: "Crops" },
        { id: 3, productName: "Organic Fertilizers", quantity: 50, price: 10000, location: "Warehouse", lastUpdated: "2024-06-12", relatedTo: "Soil Management" },
        { id: 4, productName: "Fresh Fruits", quantity: 200, price: 5000, location: "Farmers Market", lastUpdated: "2024-06-11", relatedTo: "Fruits" },
        { id: 5, productName: "Heavy-Duty Tractor", quantity: 5, price: 5000, location: "Farm", lastUpdated: "2024-06-10", relatedTo: "Equipment" },
    ];

    const columns = [
        { key: "id", label: "ID" },
        { key: "productName", label: "Product Name" },
        { key: "quantity", label: "Quantity" },
        { key: "price", label: "₦ Price" },
        { key: "location", label: "Location" },
        { key: "lastUpdated", label: "Last Updated" },
        { key: "relatedTo", label: "Related To" }
    ];

    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);



    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),

            }));
            console.log(productsData);
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch products");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const rowsPerPage = 5;

    const pages = Math.ceil(products.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return products.slice(start, end);
    }, [page, products]);



    return (
        <>
            <h1 className='my-4'>Latest Items</h1>

            {loading ? <Spinner className=' mx-auto w-full' /> :
                <Table
                    aria-label="Farm Inventory Table with Pagination"
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
                        {columns.map((column) => (
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        ))}
                    </TableHeader>

                    <TableBody items={items}>

                        {(item) => (
                            <TableRow key={item.id}>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>{getKeyValue(item, column.key)}</TableCell>
                                ))}
                            </TableRow>
                        )}


                    </TableBody>
                </Table>
            }
        </>
    );
}

export default LatestItems;