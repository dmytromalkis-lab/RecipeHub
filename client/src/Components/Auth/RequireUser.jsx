import React from 'react';
import useUserStore from '../../stores/userStore';
import { Navigate, useLocation } from 'react-router-dom';

function RequireUser({children}) {
    const isAuthenticated = useUserStore(state => state.isAuthenticated);
    const location = useLocation();
    const { isUser } = useUserStore();

    if(!isAuthenticated) {
        return <Navigate to={"/login"} state={{from: location}} replace />
    }

    if(!isUser()) {
        return <Navigate to = {"/403"} state={{from: location}} replace/>
    }

    return ( children );
};

export default RequireUser;