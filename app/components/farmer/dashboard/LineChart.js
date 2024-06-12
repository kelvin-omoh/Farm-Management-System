// 'use client'
import React from 'react';
import { Line } from '@ant-design/charts';

const data = [
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

const config = {
    data: transformData(data),
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
    legend: {
        position: 'top',
    },
    lineStyle: {
        lineWidth: 2,
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

const LineChart = () => {


    return (
        <div className=' '>
            <div className="w-full border-none">
                <h3 className="font-medium">
                    Follower metrics
                </h3>
                <Line {...config} />

            </div>
        </div>
    );
};

export default LineChart;
