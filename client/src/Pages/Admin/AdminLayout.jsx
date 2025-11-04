import React, { useState } from 'react';
import useUserStore from '../../stores/userStore';
import { useNavigate, Outlet} from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar/Sidebar';

function AdminLayout() {
    const [isOpen, setIsOpen] = useState(true);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate()
    const onLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <div>
            <Sidebar onLogout={ onLogout } isOpen={ isOpen } setIsOpen={ setIsOpen }></Sidebar>
            <main style={{ transition: "margin-left 0.3s ease",
                marginLeft: isOpen ? "120px" : "30px", 
                padding: "20px",}}>
                <Outlet></Outlet>
            </main>
        </div>
    );
}

export default AdminLayout;
