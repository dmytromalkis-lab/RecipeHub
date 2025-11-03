import React from 'react';
import useUserStore from '../../stores/userStore';
import { useNavigate, Outlet} from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar/Sidebar';

function AdminLayout() {
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate()
    const onLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <div style={{display: "flex"}}>
            <Sidebar onLogout={ onLogout }></Sidebar>
            <main style={{flex: 1, padding: "20px"}}>
                <Outlet></Outlet>
            </main>
        </div>
    );
}

export default AdminLayout;
