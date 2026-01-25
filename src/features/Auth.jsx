import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { verifyUser } from "../api";
import { Link } from "react-router";
import MessageDialog from "../components/modals/MessageDialog";
import MessageModal from "../components/modals/MessageModal";


const Auth = () => {
    const navigate = useNavigate();

    const [messageOpen, setMessageOpen] = useState(false)
    const [message, setMessage] = useState("")
    const closeMessage = () => setMessageOpen(false);

    const [showPassword, setShowPassword] = useState(false)

    const [user, setUser] = useState({
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    
    function handleChange(e) {
        setUser({
            ...user, [ e.target.name]: e.target.value,})
            
    }
   
    async function handleSubmit(e) {

        e.preventDefault()

        let res = await verifyUser(user)
        
        if(res){
            sessionStorage.setItem("User", res)
        
            navigate("/dashboard")
            
        } else {

            setMessage("Incorrect username or password");
            setMessageOpen(true);
            setTimeout(() => {
                setMessageOpen(false)
            }, 3000)

        }
    }

    

    return (
 
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit}  className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">CCC Redemption Parish</h1>
                    <p className="text-gray-600">Membership Management Platform</p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                    <input name="email" autoComplete="email" onChange={handleChange} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" required />
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                    <input name="password" autoComplete="password" onChange={handleChange} type={showPassword?"text":"password"} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password" required />
                </div>

                <div className="mb-6 flex flex-row align-baseline  ">
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="password">Show</label>
                    <input name="showpass"   type="checkbox" onClick={() => showPassword? setShowPassword(false): setShowPassword(true)} className=" px-3 py-2 mb-2 ml-4 size-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 " />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Login
                </button>
                <div className="flex justify-center align-center ">
                    <Link to="/forgot-password">
                        <div className="mt-4 text-center text-sm text-gray-600 mr-4">
                            <p href="#" className="text-indigo-600 hover:underline">Forgot password?</p>
                        </div>
                    </Link>
                    <Link to="/admin-registration">
                        <div className="mt-4 text-center text-sm text-gray-600">
                            <p href="#" className="text-indigo-600 hover:underline">Create Superuser</p>
                        </div>
                    </Link>
                </div>
            </form>
            <MessageDialog
                isOpen={messageOpen}
                onClose={() => setMessageOpen(false)}
            >
                    

                <MessageModal 
                    onClose={closeMessage}
                    message={message}  
                />
            </MessageDialog>
        </div>
    );
};

export default Auth