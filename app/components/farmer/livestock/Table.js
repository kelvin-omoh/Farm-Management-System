import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue } from "@nextui-org/react";
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import auth, { db } from '@/app/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

const LatestLiveStock = () => {
    const rows = [
        { id: 1, animalType: "Cattle", quantity: 10, healthStatus: "Healthy", lastChecked: "2024-06-11", relatedTo: "Farm A" },
        { id: 2, animalType: "Pigs", quantity: 20, healthStatus: "Sick", lastChecked: "2024-06-10", relatedTo: "Farm B" },
        { id: 3, animalType: "Chickens", quantity: 15, healthStatus: "Healthy", lastChecked: "2024-06-12", relatedTo: "Farm C" },
        { id: 4, animalType: "Sheep", quantity: 8, healthStatus: "Healthy", lastChecked: "2024-06-11", relatedTo: "Farm D" },
        { id: 5, animalType: "Horses", quantity: 25, healthStatus: "Injured", lastChecked: "2024-06-10", relatedTo: "Farm E" },
    ];

    const columns = [
        { key: "id", label: "ID" },
        { key: "animalType", label: "Animal Type" },
        { key: "quantity", label: "Quantity" },
        { key: "healthStatus", label: "Health Status" },
        { key: "lastChecked", label: "Last Checked" },
        { key: "relatedTo", label: "Related To" }
    ];
    const [user] = useAuthState(auth);
    const [page, setPage] = React.useState(1);
    const [liveStocks, setLiveStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const rowsPerPage = 5;

    const pages = Math.ceil(liveStocks.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return liveStocks.slice(start, end);
    }, [page, liveStocks]);



    useEffect(() => {
        const q = query(collection(db, "livestocks"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const liveStocksData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),

            }));
            console.log(liveStocksData);
            setLiveStocks(liveStocksData);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch liveStocksData");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    return (
        <>
            <h1 className='my-4'>Latest Livestock</h1>
            <Table
                aria-label="Livestock Table with Pagination"
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
        </>
    );
}

export default LatestLiveStock;
