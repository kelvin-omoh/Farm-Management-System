'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Spinner, image, User, Tooltip } from "@nextui-org/react";
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import auth, { db } from '@/app/firebase.config';
import toast from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import Image from 'next/image';
import { BsEye, BsPen, BsTrash } from 'react-icons/bs';
import AppContext from '../../Context/AppContext';

const LatestItems = () => {
    const rows = [
        { id: 1, productName: "Premium Cattle Feed", quantity: 500, price: 5000, location: "Barn", lastUpdated: "2024-06-11", relatedTo: "Livestock" },
        { id: 2, productName: "High-Quality Wheat Seeds", quantity: 1000, price: 2000, location: "Field", lastUpdated: "2024-06-10", relatedTo: "Crops" },
        { id: 3, productName: "Organic Fertilizers", quantity: 50, price: 10000, location: "Warehouse", lastUpdated: "2024-06-12", relatedTo: "Soil Management" },
        { id: 4, productName: "Fresh Fruits", quantity: 200, price: 5000, location: "Farmers Market", lastUpdated: "2024-06-11", relatedTo: "Fruits" },
        { id: 5, productName: "Heavy-Duty Tractor", quantity: 5, price: 5000, location: "Farm", lastUpdated: "2024-06-10", relatedTo: "Equipment" },
    ];

    const columns = [
        { key: "id", label: "Id" },
        { key: "Image", label: "image" },
        { key: "productName", label: "Product Name" },
        { key: "quantity", label: "Quantity" },
        { key: "price", label: "₦ Price" },
        { key: "location", label: "Location" },
        { key: "lastUpdated", label: "Last Updated" },
        { key: "relatedTo", label: "Related To" },
        { key: "actions", label: "Actions" }
    ];

    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    const [user] = useAuthState(auth);
    const { setSelectedFarmProduct, selectedFarmProduct } = useContext(AppContext);
    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(productsData);
            const productsWithImage = productsData.map(product => ({
                ...product,
                image: product.images?.[0] || ''
            }));
            setProducts(productsWithImage);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch products");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const rowsPerPage = 4;

    const pages = Math.ceil(products.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return products.slice(start, end);
    }, [page, products]);
















    const deleteProduct = async (productId) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this product?");
        if (!userConfirmed) {
            return;
        }
        try {
            const productRef = doc(db, "products", productId);
            console.log(productId);
            await deleteDoc(productRef);
            console.log("Document successfully deleted!");
            toast.success("Document successfully deleted!");
        } catch (error) {
            toast.error('Error deleting this product');
            console.error("Error deleting document: ", error);
        }
    };

    const statusColorMap = {
        active: "success",
        paused: "danger",
        vacation: "warning",
    };


    const renderCell = React.useCallback((product, columnKey) => {
        const cellValue = product[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        {product.id}
                    </div>
                );
            case "Image":
                return (
                    <div className="flex size-[30px] flex-col">
                        <Image width={1000} height={1000} className=' w-full h-full' src={product.image} alt='' />
                    </div>
                );
            case "productName":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-[black]">{product.productName}</p>
                    </div>
                );
            case "quantity":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-[black]">{product.quantity}</p>
                    </div>
                );
            case "price":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-[black]">{product.price}</p>
                    </div>
                );
            case "location":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-[black]">{product.location}</p>
                    </div>
                );
            case "relatedTo":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-[black]">{product.relatedTo}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-5">

                        <Tooltip content="Edit product">
                            <span className="text-lg text-[black] cursor-pointer active:opacity-50">
                                <BsPen onClick={() => {
                                    setSelectedFarmProduct({
                                        id: product.id,
                                        productName: product.productName || '',
                                        quantity: product.quantity || '',
                                        price: Number(product.price || 0),
                                        location: product.location || '',
                                        description: product.description || '',
                                        lastUpdated: product.lastUpdated || '',
                                        relatedTo: product.relatedTo || '',
                                        images: product.images || '',
                                        createdAt: product.createdAt || '',
                                        by: product.by || ''

                                    })
                                }}
                                    size={20} />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete product">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <BsTrash onClick={() => {
                                    deleteProduct(product.id)
                                }} size={20} />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);


    return (
        <>
            <h1 className='my-4'>Latest Items</h1>

            {loading ? <Spinner className=' mx-auto w-full' /> :
                <Table aria-label="Example table with custom cells" bottomContent={
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
                }>
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                {column.label}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={items}>
                        {(item, id) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>}
        </>
    );
}

export default LatestItems;