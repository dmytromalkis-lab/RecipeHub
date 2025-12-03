import React, { useEffect, useRef } from 'react';
import Chart from "chart.js/auto";
import './Statistics.css';

export default function StatisticsPage({ userCount, recipeStatus, recipeMonthly, downloadReport }) {
    
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!recipeMonthly || recipeMonthly.length === 0) return;

        const ctx = chartRef.current.getContext("2d");

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ],
                datasets: [
                    {
                        label: "New Recipes Per Month",
                        data: recipeMonthly,
                        borderColor: "#2196F3",
                        backgroundColor: "rgba(33, 150, 243, 0.2)",
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [recipeMonthly]);

    const donutChartRef = useRef(null);

    const donutInstance = useRef(null);

    useEffect(() => {
        if (!recipeStatus) return;

        const ctx = donutChartRef.current.getContext("2d");

        if (donutInstance.current) donutInstance.current.destroy();
        
        donutInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Pending", "Fulfilled", "Rejected"],
                datasets: [{
                    data: [
                        recipeStatus.pending,
                        recipeStatus.fulfill,
                        recipeStatus.reject
                    ],
                    backgroundColor: [
                        "#00bcd4", 
                        "#4caf50",
                        "#f44336"
                    ],
                    hoverOffset: 12,
                    borderWidth: 2,
                    borderColor: "#fff"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 20,
                            generateLabels: function(chart) {
                                const data = chart.data;
                                const dataset = data.datasets[0];
        
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${dataset.data[i]}`,
                                    fillStyle: dataset.backgroundColor[i],
                                    strokeStyle: "#fff",
                                    lineWidth: 2,
                                    hidden: false,
                                    index: i
                                }));
                            }
                        }
                    }
                }
            }
        });
    }, [recipeStatus]);

    return (
        <div className="admin-statistics">
            <h2>Admin Dashboard</h2>

            <div className="cards-container">
                <div className="admin-card">
                    <h3>Registered Users</h3>
                    <p className="count">{userCount}</p>
                    <button 
                        className="btn users-btn" 
                        onClick={() => downloadReport('users')}
                    >
                        Download Users Report
                    </button>
                </div>

                <div className="admin-card">
                    <h3>Recipes Status</h3>

                    <div className="donut-wrapper">
                        <canvas ref={donutChartRef}></canvas>
                    </div>

                    <button 
                        className="btn recipes-btn" 
                        onClick={() => downloadReport('recipes')}
                    >
                        Download Recipes Report
                    </button>
                </div>
            </div>

            <div className="chart-card">
                <h3>New Recipes Added This Year</h3>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}
