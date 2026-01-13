
import  Auth from "./features/Auth";
import ForgotPass from "./features/ForgotPass";
import ResetPassword from "./features/ResetPassword";
import { useEffect } from "react";
import axios from "axios";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Index from "./features/Screens/Index";
import { homeRoutes } from "./routes/homeRoutes";
import AdminReg from "./features/AdminReg";
import AdminLogin from "./features/AdminLogin";



function App() {


  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPass />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "//admin-registration",
      element: <AdminReg />,
    },
    {
      path: "//admin-login",
      element: <AdminLogin />,
    },
    {
      path: "/",
      element: <Index />,
      children: [...homeRoutes]
    },
  ]);

  

  useEffect(() => {
    let token = sessionStorage.getItem("User")
  
    if(token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } 
  }, [])



  return (
    <>
      <RouterProvider router={router} />,
    </>
  )

}

export default App;
