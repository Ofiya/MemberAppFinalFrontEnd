import { createUser, getUsers } from "../../api"
import { useState, useEffect } from "react"
import { getUserIdFromToken } from "../../getUserIdFromToken"




const AddUserModal = ({onClose, openMessage, closeMessage, passMatchMessage, emailTakenMessage, userAddedMessage}) => {
    
    
    const currentUser = getUserIdFromToken()
    

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        fullname:"",
        email: "",
        password: "",
        password2: "",
        role: "",
        view_members:"",
        manage_attendance:"",
        manage_users:"",
        system_settings:"",
        created_by: currentUser.fullname,
    })

    function handleChange(e) {
        setUser({
            ...user, [ e.target.name]: e.target.value,})
    }
        

    async function handleSubmit(e) {

        e.preventDefault()

        if(user.password !== user.password2){
            setLoading(true)
            openMessage()
            passMatchMessage()
            setTimeout(()=> {
                closeMessage()
                setLoading(false)
            }, 3000)
            
        }else{

            let res = await createUser(user)
            
            if(res.status !== 201){ 
                setLoading(true)
                openMessage()
                emailTakenMessage()
                setTimeout(()=> {
                    setLoading(false)
                    closeMessage()
                }, 3000)
                
                
            }else { 
                
                userAddedMessage()
                openMessage()
                setTimeout(()=> {
                    setLoading(false)
                    closeMessage()
                }, 3000)

            }
        }
    
    }
    return (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-800">Add New User</h3>
                    <button id="close-user-modal" className="invisible text-gray-500 hover:text-gray-700">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <input type="text" hidden value={currentUser.fullname} readOnly name="created_by" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                            <input onChange={handleChange} name="fullname" required type="text" id="user-name-input"  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter full name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                            <input onChange={handleChange} name="email" autoComplete="email" required type="email" id="user-email-input" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter email" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                            <input onChange={handleChange} name="password" autoComplete="current-password" required  minLength="8" type="password" id="user-password-input" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter password" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
                            <input onChange={handleChange}  name="password2" autoComplete="current-password" required  minLength="8" type="password" id="user-confirm-password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Confirm password" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                            <select onChange={handleChange} value={user.role} name="role" required id="user-role-select" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Assign Level</option>
                                <option value="1">View Only (Level 1)</option>
                                <option value="2">Attendance Taker (Level 2)</option>
                                <option value="3">Administrator (Level 3)</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                            <div className="space-y-2">
                                <label className="inline-flex items-center">
                                    <input onChange={handleChange} checked={user.view_members} name="view_members" type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                                        <span className="ml-2 text-sm text-gray-700">View Members</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input onChange={handleChange} checked={user.manage_attendance} name="manage_attendance"  type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                                        <span className="ml-2 text-sm text-gray-700">Manage Attendance</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input onChange={handleChange} checked={user.manage_users} name="manage_users"  type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                                        <span className="ml-2 text-sm text-gray-700">Manage Users</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input onChange={handleChange} checked={user.system_settings} name="system_settings"  type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                                        <span className="ml-2 text-sm text-gray-700">System Settings</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} id="cancel-user" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Cancel
                        </button>
                        
                        <button type="submit"  id="save-user"  className={ "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"}>
                            Save User
                        </button>
                    </div>
                </div>
            </form>
    )
}

export default AddUserModal