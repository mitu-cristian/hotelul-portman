import {Navigate, Outlet} from "react-router-dom";
import {useAuthStatus} from "./useAuthStatus";
import {toast} from "react-toastify";

const PrivateRoute = () => {
    const {loggedIn, checkingStatus} = useAuthStatus();

    if(checkingStatus)
        return <div>Loading ...</div>

    return loggedIn ? <Outlet/> : <Navigate to="/login"/>
}

export default PrivateRoute;