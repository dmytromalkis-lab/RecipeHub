import React, { useEffect, useState } from 'react';
import useUserStore from "../../stores/userStore";
import Loading from "../../Components/UI/Loading/Loading";
import ErrorMessage from "../../Components/UI/ErrorMessage/ErrorMessage";
import api from "../../api/axios";
import StatisticsPage from "../../Components/Admin/Statistics/Statistics";

export default function Statistics() {
    const token = useUserStore((state) => state.token);

    const [userCount, setUserCount] = useState(null);
    const [recipeStatus, setRecipeStatus] = useState(null);
    const [recipeMonthly, setRecipeMonthly] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const year = new Date().getFullYear();

    const fetchStatistics = async () => {
        setLoading(true);
        setError(null);

        try {
            const config = {};
            if (token) {
                config.headers = { Authorization: `Bearer ${token}` };
            }

            const [userCountRes, recipeStatusRes, recipeMonthlyRes] = await Promise.all([
                api.get("/moderation/users/count", config),
                api.get("/moderation/recipes/count", config),
                api.get(`/moderation/recipes/stats/${year}`, config)
            ]);

            setUserCount(userCountRes.data.count);
            setRecipeStatus(recipeStatusRes.data);
            setRecipeMonthly(recipeMonthlyRes.data.monthlyCounts);
            console.log(recipeMonthly);
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (type) => {
        try {
            const config = { responseType: 'blob' };
            if (token) {
                config.headers = { Authorization: `Bearer ${token}` };
            }

            const res = await api.get(`/moderation/users/report/${year}`, config);
            if (type === 'recipes') {
                res.data = await api.get(`/moderation/recipes/report/${year}`, config).then(r => r.data);
            }

            // Create a blob URL to download the file
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-report-${year}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (err) {
            console.error("Failed to download report:", err);
        }
    };

    useEffect(() => {
        fetchStatistics();
        // eslint-disable-next-line
    }, [token]);

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error.message || "Something went wrong"} />;

    return (
        <StatisticsPage 
            userCount={userCount} 
            recipeStatus={recipeStatus} 
            recipeMonthly={recipeMonthly}
            downloadReport={downloadReport}
        />
    );
}
