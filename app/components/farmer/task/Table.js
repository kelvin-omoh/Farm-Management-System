import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue } from "@nextui-org/react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import auth, { db } from '@/app/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';

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
        { key: "status", label: "Status" },
        { key: "actions", label: "Actions" }
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
                const newTasksData = tasksData.filter(task => task.by === user?.displayName)
                setTasks(newTasksData);
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



    const deleteTask = async (taskId) => {
        try {
            await deleteDoc(doc(db, 'tasks', taskId));
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task. Please try again.");
        }
    };

    const editTaskStatus = async (taskId, newStatus) => {
        try {
            const taskRef = doc(db, 'tasks', taskId);
            await updateDoc(taskRef, { status: newStatus });
            toast.success("Task status updated successfully!");
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status. Please try again.");
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'text-yellow-500 outline-yellow-500  outline text-center  py-1 px-2 rounded-full'; // or any other Tailwind CSS classes for Pending
            case 'In Progress':
                return 'text-blue-500 outline-blue-500 outline  text-center py-1 px-2 rounded-full'; // or any other Tailwind CSS classes for In Progress
            case 'Completed':
                return 'text-green-500 outline-green-500 outline text-center  py-1 px-2  rounded-full'; // or any other Tailwind CSS classes for Completed
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
                        <TableRow className='py-5 my-3' key={item.id}>
                            <TableCell className={` ${item.status === 'Completed' ? 'text-gray-400' : 'text-black'}`}>{item.id}</TableCell>
                            <TableCell className={` ${item.status === 'Completed' ? 'text-gray-400' : 'text-black'}`}>{item.taskName}</TableCell>
                            <TableCell className={` ${item.status === 'Completed' ? 'text-gray-400' : 'text-black'}`}>{item.description.slice(0, 10)}...</TableCell>
                            <TableCell className={` ${item.status === 'Completed' ? 'text-gray-400' : 'text-black'}`}>{item.assignedDate}</TableCell>
                            <TableCell className={` ${item.status === 'Completed' ? 'text-gray-400' : 'text-black'}`}>{item.dueDate}</TableCell>
                            <TableCell>
                                <select
                                    className={`rounded-full outline-1  py-1 px-2 ${getStatusClass(item.status)}`}
                                    value={item.status}
                                    onChange={(e) => editTaskStatus(item.id, e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </TableCell>
                            <TableCell>
                                <button onClick={() => deleteTask(item.id)} className="px-2 py-1 rounded text-white bg-red-500">Delete</button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

export default LatestTasks;
