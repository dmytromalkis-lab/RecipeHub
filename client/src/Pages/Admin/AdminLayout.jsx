import React from 'react';
import useUserStore from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/UI/Loading/Loading';

function AdminLayout() {
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate()
    const onLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <div style={{color: 'black', fontSize: "84px"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
                <button onClick={onLogout} type='submit' style={{width: "200px", height: "70px", fontSize: "36px", backgroundColor: "red", opacity: "0.7"}}>LogOut</button>
            </div>
            
            <div>Layout ADMIN PAGE!!!!!!!!!</div>

            <Loading ></Loading>
        </div>
    );
}

export default AdminLayout;