import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue } from "@nextui-org/react";
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import auth, { db } from '@/app/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

const LatestTasks = () => {
    const rows = [
        { id: 1, animalType: "Cattle", quantity: 10, healthStatus: "Healthy", lastChecked: "2024-06-11", relatedTo: "Farm A" },
        { id: 2, animalType: "Pigs", quantity: 20, healthStatus: "Sick", lastChecked: "2024-06-10", relatedTo: "Farm B" },
        { id: 3, animalType: "Chickens", quantity: 15, healthStatus: "Healthy", lastChecked: "2024-06-12", relatedTo: "Farm C" },
        { id: 4, animalType: "Sheep", quantity: 8, healthStatus: "Healthy", lastChecked: "2024-06-11", relatedTo: "Farm D" },
        { id: 5, animalType: "Horses", quantity: 25, healthStatus: "Injured", lastChecked: "2024-06-10", relatedTo: "Farm E" },
    ];

    const columns = [
        { key: "id", label: "ID" },
        { key: "taskName", label: "Task Name" },
        { key: "description", label: "Description" },
        { key: "assignedDate", label: "Assigned Date" },
        { key: "dueDate", label: "Due Date" },
        { key: "status", label: "Status" }
    ];
    const [user] = useAuthState(auth);
    const [page, setPage] = React.useState(1);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const q = query(
                collection(db, "tasks"),
                orderBy("createdAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tasksData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),

                }));
                console.log(tasksData.filter((product) => product.by === user?.displayName));
                setTasks(tasksData);
                setLoading(false);
            }, (error) => {
                toast.error("Failed to fetch livestock");
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const rowsPerPage = 5;

    const pages = Math.ceil(tasks.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return tasks.slice(start, end);
    }, [page, tasks]);




    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-yellow-500  text-center  py-1 px-2 rounded-full'; // or any other Tailwind CSS classes for Pending
            case 'In Progress':
                return 'text-blue-500  text-center py-1 px-2 rounded-full'; // or any other Tailwind CSS classes for In Progress
            case 'Completed':
                return 'text-green-500 text-center  py-1 px-2  rounded-full'; // or any other Tailwind CSS classes for Completed
            default:
                return '';
        }
    };

    return (
        <>
            <h1 className='my-4'>Latest Task</h1>
            <Table
                aria-label="Tasks Table with Pagination"
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
                <TableBody className=' flex gap-5 flex-col' items={items}>
                    {(item) => (
                        <TableRow className=' py-5 my-3' key={item.id}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    className={column.key === 'status' ? getStatusClass(getKeyValue(item, column.key)) : '' + ' my-3'}
                                >
                                    {column.key === 'description'
                                        ? `${getKeyValue(item, column.key).slice(0, 10)}....`
                                        : getKeyValue(item, column.key)
                                    }
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

export default LatestTasks;
