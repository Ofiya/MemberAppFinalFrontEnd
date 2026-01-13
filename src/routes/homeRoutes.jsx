import Dashboard from "../features/Screens/Dashboard";
import Members from "../features/Screens/Members";
import Household from "../features/Screens/Household";
import Welfare from "../features/Screens/Welfare"
import Attendance from "../features/Screens/Attendance";
import Reports from "../features/Screens/Reports";
import Settings from "../features/Screens/Settings";
import MemberDetail from "../features/Screens/MemberDetail";
import { Navigate } from "react-router";
import ProtectedRoute from "../components/ProtectedRoutes";




// use protected routes later
export const homeRoutes = [
    { path: "/", element: <Navigate to="/auth" /> },
    { path: "/admin-login", element: <Navigate to="/admin-login" /> },
    { path: "/forgot-password", element: <Navigate to="/forgot-password" /> },
    { path: "/reset-password", element: <Navigate to="/reset-password" /> },
    { path: "/admin-registration", element: <Navigate to="//admin-registration" /> },
    { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute>  },
    { path: "/members", element: <ProtectedRoute><Members /></ProtectedRoute> },
    { path: "/household", element:  <ProtectedRoute><Household /></ProtectedRoute> },
    { path: "/welfare", element:  <ProtectedRoute><Welfare /></ProtectedRoute> },
    { path: "/attendance", element:<ProtectedRoute><Attendance /></ProtectedRoute> },
    { path: "/settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
    { path: "/reports", element: <ProtectedRoute><Reports /></ProtectedRoute> },
    { path: "/detail/:uuid", element: <ProtectedRoute><MemberDetail /></ProtectedRoute> },

]




