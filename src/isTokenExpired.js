import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
    try {
        const { exp } = jwtDecode(token);
        if (!exp) return true;
        return exp < Date.now() / 1000;
    } catch {
        return true;
    }
};