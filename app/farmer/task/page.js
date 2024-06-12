'use client'

import Layout from '@/app/components/farmer/Layout'
import React, { useState } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Button } from "@nextui-org/react";
import { BsPen, BsTrash } from 'react-icons/bs';
import LatestTasks from '@/app/components/farmer/task/Table';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth, { db } from '@/app/firebase.config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';


const Page = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        taskName: "",
        description: "",
        assignedDate: "",
        dueDate: "",
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const createdAt = serverTimestamp();
        try {
            if (user.displayName) {
                setLoading(true);
                const docRef = await addDoc(
                    collection(db, `tasks`),
                    { ...formData, createdAt, by: user.displayName }
                );
                console.log(docRef);
                toast.success("Tasks added successfully !");
                setLoading(false);
                setFormData({
                    taskName: "",
                    description: "",
                    assignedDate: "",
                    dueDate: "",
                    status: "",
                });
            } else {
                toast.error("you are not signned In!");
                setLoading(false);
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Error adding task : ", error);
            setLoading(false);
        }

    };








    return (
        <div className="w-full px-[5rem] mx-auto">
            <Layout className="w-full">
                <h1 className="my-[1rem]">Task Management</h1>
                <form className="gap-4 w-full flex flex-col" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="taskName"
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        value={formData.taskName}
                        onChange={handleChange}
                        placeholder="Task Name"
                    />
                    <input
                        type="text"
                        name="description"
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <input
                        type="date"
                        name="assignedDate"
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        value={formData.assignedDate}
                        onChange={handleChange}
                        placeholder="Assigned Date"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                        placeholder="Due Date"
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="border-amber-950 p-3 rounded-lg w-full border-2"
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <Button disabled={loading} className={` bg-green-700 p-3 rounded-lg  text-white ${loading && 'bg-green-950'}  w-full border-2`} type="submit">{loading ? 'Adding....' : 'Add'}</Button>
                </form>




                <LatestTasks />
            </Layout>

        </div>
    );
};

export default Page;
