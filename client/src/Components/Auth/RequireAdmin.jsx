import React from 'react';
import useUserStore from '../../stores/userStore';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAdmin({children}) {
    const isAuthenticated = useUserStore(state => state.isAuthenticated);
    const location = useLocation();
    const { isAdmin } = useUserStore();

    if(!isAuthenticated) {
        return <Navigate to={"/login"} state={{from: location}} replace />
    }

    if(!isAdmin()) {
        return <Navigate to = {"/403"} state={{from: location}} replace/>
    }

    return ( children );
};

export default RequireAdmin;