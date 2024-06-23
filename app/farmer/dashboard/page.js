'use client'
import Layout from '@/app/components/farmer/Layout'
import LatestItems from '@/app/components/farmer/dashboard/LatestItems'
import LineChart from '@/app/components/farmer/dashboard/LineChart'
import auth, { db } from '@/app/firebase.config'
import axios from 'axios'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BsBookmark, BsBookmarkStar, BsCartPlus, BsCurrencyDollar, BsListCheck } from 'react-icons/bs'
import toast from 'react-hot-toast';
const Page = () => {
    const [weatherData, setWeatherdata] = useState(null)
    const [liveStocks, setLiveStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allOrders, setAllOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);


    const [user, error] = useAuthState(auth);
    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const orders = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setAllOrders(orders);
        }, (error) => {
            toast.error("Failed to fetch orders");
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        let newTotal = 0;
        for (const order of allOrders) {
            if (order.paid) {
                newTotal += order.amount;
            }
        }
        setTotalRevenue(newTotal);
    }, [allOrders]);


    const calculateTotalRevenue = (orders) => {
        const total = orders.reduce((sum, order) => {
            return sum + (order.paid ? order.amount : 0);
        }, 0);
        setTotalRevenue(total);

    };

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

            const newTasksData = tasksData.filter(task => task.by === user?.displayName)
            setTasks(newTasksData);
            setLoading(false);
        }, (error) => {
            toast.error("Failed to fetch products");
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);





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

    const topBar = useMemo(() => {

        return [

            {
                id: 1,
                icon: <h1 className=' text-[40px] leading-[1px]  '> ₦</h1>,
                text: ' Revenue',
                value: totalRevenue?.toFixed(2) || 0
            },
            {
                id: 2,
                icon: <BsCartPlus size={40} />,
                text: '  ₦ Purchases',
                value: 100
            },
            {
                id: 3,
                icon: <BsBookmarkStar size={40} />,
                text: 'livestock',
                value: liveStocks?.length || 0
            },
            {
                id: 4,
                icon: <BsListCheck size={40} />,
                text: 'Products',
                value: products.length || 0
            },
            {
                id: 4,
                icon: <BsBookmark size={40} />,
                text: 'Tasks',
                value: tasks?.length || 0
            },
        ]

    }, [products.length, totalRevenue, liveStocks.length, user]);

    const fecthWeatherApi = async () => {
        try {
            const data = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=ogun&appid=50a7aa80fa492fa92e874d23ad061374')
            setWeatherdata(data.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fecthWeatherApi()
    }, [])



    return (
        <div className=' w-full'>
            <Layout>
                <div className=' flex flex-col gap-5 w-full p-3 text-black'>
                    <div className=' w-[82vw]   flex  justify-between'>
                        {topBar.map((item) => (
                            <div key={item.id} className=' bg-[#f4fff1] justify-center gap-3 text-center flex items-center m-auto  text-[1.2rem rounded-lg text-[green] flex-col p-3 w-[14rem] h-[10rem]'>
                                <div> {item.icon}</div>
                                <h4 className=' text-[1.5rem]'> {item.text}</h4>
                                <h4 className=' text-[1.7rem]'> {item.value}</h4>



                            </div>


                        ))}


                    </div>

                    <div className=''>
                        <LineChart />
                        <div>
                            <LatestItems />
                        </div>


                    </div>


                </div>
            </Layout>
        </div>
    )
}

export default Page