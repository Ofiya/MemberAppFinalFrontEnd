import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { verifyUser } from "../api";
import axios from "axios";
import { changePassword } from "../api";


const ResetPassword = () => {


    const params = new URLSearchParams(window.location.search);
    const ptoken = params.get("token");

    
    const navigate = useNavigate();

    const [newPass, setNewPass] = useState({
        password: "",
        password2: "",
            
    })
    
    

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);
    
    function handleChange(e) {
        setNewPass({
            ...newPass, [ e.target.name]: e.target.value,})
            
    }
   
    async function handleSubmit(e) {

        e.preventDefault()
        
        if(newPass.password !== newPass.password2){
            alert("Passwords don't match")
            
        }else{
            const res = await changePassword({password:newPass.password, token:ptoken})
            if(res.status === 200){
                alert("Your password has been changed")
                navigate("/auth")
            }else{
                alert("Your reset token has expired")
            }


        }
        
    }

    

    return (
 
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit}  className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">CCC Redemption Parish</h1>
                    <p className="text-gray-600">Change Password</p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">New Password</label>
                    <input name="password" autoComplete="" minLength={8} onChange={handleChange} type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter new password" required />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Confirm New Password</label>
                    <input name="password2" autoComplete="" minLength={8} onChange={handleChange} type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="confirm new password" required />
                </div>

                <button type="submit" onClick={() => setLoading(true)} className={ loading? "btn-loading w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2": "w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}  >
                    Change Password
                </button>

                
            </form>
        </div>
    );
};

export default ResetPassword;