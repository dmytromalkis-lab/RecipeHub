import React, { useEffect, useState } from "react";
import useUserStore from "../../stores/userStore";
import Loading from "../../components/UI/Loading/Loading";
import ErrorMessage from "../../components/UI/ErrorMessage/ErrorMessage";
import api from "../../api/axios";
import UserContainer from "../../Components/Admin/UserList/UserContainer";

export default function Users() {
    const token = useUserStore((state) => state.token);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const config = {};
            if (token) config.headers = { Authorization: `Bearer ${token}` };
            const res = await api.get("/user/all", config);
            setUsers(res.data.users || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, [token]);

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error.message || "Something went wrong"} />;

    return (
        <div className="users-list-page" style={{ padding: "20px", marginLeft: "260px" }}>
            <h2 style={{ color: "black", marginBottom: "20px" }}>Users</h2>
            
            {users.length === 0 ? (
                <div style={{ color: "#000" }}>No users found</div>
            ) : (
                <div 
                    style={{ 
                        display: "flex", 
                        flexWrap: "wrap", 
                        gap: "20px",
                        justifyContent: "flex-start"
                    }}
                >
                    {users.map((user) => (
                        <UserContainer key={user.user_id} user={user} onAction={fetchUsers} />
                    ))}
                </div>
            )}
        </div>
    );
}