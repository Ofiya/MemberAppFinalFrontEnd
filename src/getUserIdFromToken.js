import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";



export const getUserIdFromToken = () => {

    const token = sessionStorage.getItem("User");

    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.user
    } catch {
        return null;
    }
};