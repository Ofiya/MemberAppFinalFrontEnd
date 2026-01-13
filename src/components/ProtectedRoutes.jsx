import { Navigate } from "react-router";
import { isTokenExpired } from "../isTokenExpired";



const ProtectedRoute = ({children}) => {
    const token = sessionStorage.getItem("User")
    
    if(!token || isTokenExpired(token) ){

        sessionStorage.removeItem("User")

        return <Navigate to="/auth" replace />
    } 
        
    return children
    
}

export default ProtectedRoute