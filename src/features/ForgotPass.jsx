import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { verifyUser } from "../api";
import axios from "axios";
import { getResetLink } from "../api";


const ForgotPass = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState({})

    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    
    
    
   
    async function handleSubmit(e) {

        e.preventDefault()

        const res = await getResetLink(email)
        console.log("from jsx",email)
        if(!res){
            setLoading(true)
        }else{
            setTimeout(() => {
                setLoading(false)
            }, 2000)
            alert("If the email exists, a reset link was sent.");
            return res
        }
    }

    

    return (
 
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit}  className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">CCC Redemption Parish</h1>
                    <p className="text-gray-600">Forgot Password</p>
                </div>
                

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email Address(registered email address)</label>
                    <input name="email" onChange={(e) => setEmail({email:e.target.value})} autoComplete="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" required />
                </div>

                <button type="submit" className={ loading? "btn-loading w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2": "w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}  >
                    Change Password
                </button>

                
            </form>
        </div>
    );
};

export default ForgotPass