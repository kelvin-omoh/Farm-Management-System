'use client'
import React, { useEffect, useState } from 'react';
// import { Line } from '@ant-design/charts';
import dynamic from 'next/dynamic';
import auth, { db } from '@/app/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Chart } from 'react-chartjs-2';
const Line = dynamic(() => import('@ant-design/charts').then(({ Line }) => Line),
    { ssr: false }
);
const Pie = dynamic(() => import('@ant-design/plots').then(({ Pie }) => Pie),
    { ssr: false }
);




const staticData = [
    { date: 'Jan 23', inventory: 232, task: 42, liveStock: 49 },
    { date: 'Feb 23', inventory: 241, task: 42, liveStock: 61 },
    { date: 'Mar 23', inventory: 291, task: 42, liveStock: 55 },
    { date: 'Apr 23', inventory: 101, task: 42, liveStock: 21 },
    { date: 'May 23', inventory: 318, task: 42, liveStock: 66 },
    { date: 'Jun 23', inventory: 205, task: 42, liveStock: 69 },
    { date: 'Jul 23', inventory: 372, task: 42, liveStock: 55 },
    { date: 'Aug 23', inventory: 341, task: 42, liveStock: 74 },
    { date: 'Sep 23', inventory: 387, task: 120, liveStock: 190 },
    { date: 'Oct 23', inventory: 220, task: 42, liveStock: 89 },
    { date: 'Nov 23', inventory: 372, task: 342, liveStock: 44 },
];

const transformData = (data) => {
    return data.flatMap(item => [
        { date: item.date, value: item.inventory, category: 'Inventory' },
        { date: item.date, value: item.task, category: 'Task' },
        { date: item.date, value: item.liveStock, category: 'LiveStock' },
    ]);
};

const LineChart = () => {

    const [data, setData] = useState([]);
    const [user] = useAuthState(auth);
    const [products, setProducts] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [liveStocks, setLiveStocks] = useState([]);
    const [loading, setLoading] = useState(false);


    const transformDate = (dateString) => {
        if (!dateString) return 'Invalid Date';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return 'Invalid Date';

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
    };

    const ChartData = []







    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),

            }));
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch products");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);



    useEffect(() => {
        const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),

            }));
            setTasks(tasksData);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch products");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);





    useEffect(() => {
        const q = query(
            collection(db, "livestocks"),
            orderBy("createdAt", "desc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const liveStocksData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),

            }));
            console.log(liveStocksData);

            setLiveStocks(liveStocksData);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch livestock");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    for (let item of products) {
        console.log(products);
        ChartData.push({
            date: transformDate(item.lastUpdated),
            task: 0,
            liveStocks: 0,
            inventory: Number(item.quantity) || 0
        })
    }
    for (let item of tasks) {
        console.log(tasks);
        ChartData.push({
            date: transformDate(item.assignedDate),
            task: tasks.length || 0,
            liveStocks: 0,
            inventory: 0
        })
    }
    for (let item of liveStocks) {
        console.log(liveStocks);
        ChartData.push({
            date: transformDate(item.lastChecked),
            task: 0,
            liveStocks: Number(item.quantity) || 0,
            inventory: 0
        })
    }



    useEffect(() => {
        // Simulate fetching data (client-side operation)
        setData(ChartData);
        console.log(ChartData);


    }, [products, liveStocks, tasks]);



    const aggregatedData = {};

    for (let entry of ChartData) {
        const { date, task, liveStocks, inventory } = entry;

        if (!aggregatedData[date]) {
            aggregatedData[date] = { date, task, liveStocks, inventory };
        } else {
            aggregatedData[date].task += task;
            aggregatedData[date].liveStocks += liveStocks;
            aggregatedData[date].inventory += inventory;
        }
    }

    const finalChartData = Object.values(aggregatedData).map(({ date, task, liveStocks, inventory }) => ({
        date,
        task,
        liveStock: liveStocks, // Adjusted to match the naming in staticData
        inventory
    }));
    console.log(finalChartData)

    const getDateValue = (dateString) => {
        const [month, day] = dateString.split(' ');
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
        return monthIndex * 100 + parseInt(day);
    };


    const sortByDate = (data) => {
        return data.sort((a, b) => {
            const dateA = getDateValue(a.date);
            const dateB = getDateValue(b.date);
            return dateA - dateB;
        });
    };


    const config = {
        data: transformData(sortByDate(finalChartData)),
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
        yAxis: {
            label: {
                formatter: (v) => `${v}`,
            },
        },
        interactions: [
            {
                type: 'tooltip',
                enable: true,
            },
        ],
        point: {
            shape: 'circle',
            size: 4,
        },
        annotations: [
            {
                type: 'text',
                style: {
                    // text: 'Quantity',
                    x: '20%',
                    y: '0%',
                    textAlign: 'center',
                    fontSize: 10,
                    // fontStyle: '',
                },
            },
        ],
        legend: {
            color: {
                title: true,
                position: 'left',
                rowPadding: 15,
            },


        },

        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
        colorField: 'category',
        color: ['#FF5733', '#33FF57', '#3357FF'], // Red, Green, Blue
    };




    const pieConfig = {
        data: [
            { type: 'inventory', value: products.length },
            { type: 'task', value: tasks.length },
            { type: 'livestock', value: liveStocks.length },
        ],
        angleField: 'value',
        colorField: 'type',
        paddingRight: 90,
        innerRadius: 0.6,
        label: {
            text: (d) => `${d.type}\n ${d.value}`,
            position: 'spider',
        },
        legend: {
            color: {
                title: false,
                position: 'left',
                rowPadding: 5,
            },
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: 'total',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 40,
                    fontStyle: 'bold',
                },
            },
        ],
    };


    return (
        <div className=' w-full'>
            <div className="w-full border-none">
                <h1 className="text-[18px] my-5 font-bold underline">Metrics on quantity variable </h1>
                <div className=' flex w-full px-[4rem] mb-[4rem]  justify-between items-center gap-2'>
                    <Line {...config} />
                    <Pie  {...pieConfig} />

                </div>

            </div>



        </div >
    );
};

export default LineChart;
