import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { createAdmin } from "../api";
import MessageDialog from "../components/modals/MessageDialog";
import MessageModal from "../components/modals/MessageModal";


const AdminReg = () => {
    const navigate = useNavigate();

    const [messageOpen, setMessageOpen] = useState(false)
    const [message, setMessage] = useState("")
    const closeMessage = () => setMessageOpen(false)

    const [showPassword, setShowPassword] = useState(false)

    const [admin, setAdmin] = useState({
        fullname:"Admin",
        email: "",
        password: "",
        password2: "",
        role: "Superuser",
        view_members:"on",
        manage_attendance:"on",
        manage_users:"on",
        system_settings:"on",
        created_by: "Superuser",
    })
    
    const [loading, setLoading] = useState(false);
    
    
    function handleRegChange(e) {
        setAdmin({
            ...admin, [ e.target.name]: e.target.value,})
            
    }
   
    async function handleSubmit(e) {

        e.preventDefault()
        
        if(admin.password !== admin.password2){
            setLoading(true)
            setMessageOpen(true)
            setMessage("Passwords must match")
            setTimeout(()=> {
                setMessageOpen(false)
                setLoading(false)
            }, 3000)
            
        }else{

            let res = await createAdmin(admin)
            
            if(res.status !== 201){
                
                setLoading(true)
                setMessage("Email or Name or Superuser already exist")
                setMessageOpen(true)
                setTimeout(()=> {
                    setMessageOpen(false)
                    setLoading(false)
                }, 3000);

            
                
            }else{ 
                setLoading(true)
                setMessage("User account created successfully");
                setMessageOpen(true)
                setTimeout(()=> {
                    setLoading(false)
                    setMessageOpen(false)
                }, 3000)
                navigate("/admin-login")

            }
        }

        
    }

    

    return (
 
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit}  className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">Admin Portal</h1>
                    <p className="text-gray-600">CCC Redemption Parish Admin</p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                    <input name="email" autoComplete="email" onChange={handleRegChange} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" required />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-0" htmlFor="password">Password</label>
                    <div className="mt-0 text-left text-sm text-gray-300">
                        <p className="text-grey-600">Minimum of 8 characters*</p>
                    </div>
                    <input name="password" minLength={8} autoComplete="password"  onChange={handleRegChange} type={showPassword?"text":"password"} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password" required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-0" htmlFor="password">Password</label>
                    <div className="mt-0 text-left text-sm text-gray-300">
                        <p className="text-grey-600">Minimum of 8 characters*</p>
                    </div>
                    <input name="password2" minLength={8} autoComplete="password"  onChange={handleRegChange} type={showPassword?"text":"password"} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm your password" required />
                </div>
                <div className="mb-6 flex flex-row align-baseline  ">
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="showpass">Show</label>
                    <input name="showpass"   type="checkbox" onClick={() => showPassword? setShowPassword(false): setShowPassword(true)} className=" px-3 py-2 mb-2 ml-4 size-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 "  />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Sign up
                </button>
                <Link to="/admin-login">
                    <div className="mt-4 text-center text-sm text-gray-600">
                        <p href="#" className="text-indigo-600 hover:underline">Login</p>
                    </div>
                </Link>
                
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

export default AdminReg