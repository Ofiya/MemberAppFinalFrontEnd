// import { useAxios } from "../../utils/hooks/useAxios";
import { useState } from "react";
import AppDialog from "../../components/modals/AppDialog"
import MessageDialog from "../../components/modals/MessageDialog";
import AddUserModal from "../../components/modals/AddUserModal"
import { getUserIdFromToken } from "../../getUserIdFromToken";
import MessageModal from "../../components/modals/MessageModal";

const Settings = () => {

    const currentUser = getUserIdFromToken()
    

    const [userOpen, setUserOpen] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false)
    const [message, setMessage] = useState("")
    const closeMessage = () => setMessageOpen(false)
    const closeModal = () => setUserOpen(false)
      
    return (
       <div id="settings-page" className="page p-6 admin-only-content">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <p className="text-gray-600">Manage system configuration and notifications</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* <!-- General Settings --> */}
            <form className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Church Name</label>
                  <input type="text" name="church_name" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value="CCC Redemption Parish" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="address" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value="123 Church Street, City, State, ZIP" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" name="phone" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value="555-123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value="info@cccredemptionparish.org" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sunday Service Time</label>
                  <input type="text" name="service_time" readOnly className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value="10:00 AM - 12:00 PM" />
                </div>
                <div className="flex justify-end">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                    Save Settings
                  </button>
                </div>
              </div>
            </form>

            {/* <!-- User Management --> */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Management</h3>
              <p className="text-sm text-gray-600 mb-4">Manage access levels and user permissions</p>
                {
                  currentUser.role === "3" || "Superuser"?
                    <button id="add-user-btn" onClick={() => setUserOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md mb-4">
                      Add New User
                    </button>
                  :
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md mb-4" disabled>Unauthorized Action</button>
                }
            
              <div className="space-y-3" id="users-list">
                {/* <!-- Will be populated dynamically --> */}
              </div>
            </div>

            
            <form className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h3>
              <p className="text-sm text-gray-500 mb-4">Configure email and SMS notifications for birthday wishes and follow-ups</p>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Email Provider</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <select name="send_grid" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option default>SendGrid</option>
                      <option>Mailgun</option>
                      <option>SMTP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <input type="password" readOnly name="api_key" placeholder="Enter API key" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <p className="text-xs text-gray-500 mt-1">This will be stored in .env as EMAIL_API_KEY</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" id="enable-birthday-emails" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="enable-birthday-emails" className="ml-2 block text-sm text-gray-700">Enable birthday email notifications</label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">SMS Provider</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <select name="provider" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option default>Twilio</option>
                      <option>Vonage (Nexmo)</option>
                      <option>AWS SNS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
                    <input type="text" readOnly name="account_sid" placeholder="Enter Account SID" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <p className="text-xs text-gray-500 mt-1">This will be stored in .env as SMS_ACCOUNT_SID</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                    <input name="auth_token" readOnly type="password" placeholder="Enter Auth Token" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <p className="text-xs text-gray-500 mt-1">This will be stored in .env as SMS_AUTH_TOKEN</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Number</label>
                    <input type="text" name="from_number" placeholder="+1234567890" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <p className="text-xs text-gray-500 mt-1">This will be stored in .env as SMS_FROM_NUMBER</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <input type="checkbox" name="bday_sms" id="enable-birthday-sms" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="enable-birthday-sms" className="ml-2 block text-sm text-gray-700">Enable birthday SMS notifications</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                  Save Notification Settings
                </button>
              </div>
            </form>

            
            <form className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Database Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Azure SQL Connection String</label>
                  <input type="password" readOnly value="Server=tcp:redemptionfe.database.windows.net,1433;Database=RedemptionDB;User ID=your-username;Password=your-password;Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <p className="text-xs text-gray-500 mt-1">Stored in .env as DB_CONNECTION_STRING</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                  <input type="text" readOnly value="RedemptionDB" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </form>
          </div>
          
          <MessageDialog
              isOpen={messageOpen}
              onClose={() => setMemberOpen(false)}
          >

              <MessageModal 
                  onClose={closeMessage}
                  message={message}  
              />

          </MessageDialog>

          <AppDialog
              isOpen={userOpen}
              onClose={() => setUserOpen(false)}
          >

              <AddUserModal 
                onClose={closeModal} 
                openMessage={() => setMessageOpen(true)}
                closeMessage={() => setMessageOpen(false)}
                passMatchMessage={() => setMessage("Passwords must match")} 
                emailTakenMessage={() => setMessage("Email is taken")}
                userAddedMessage={() => setMessage("User added successfully")}
              />
          </AppDialog>
        </div>
    )
}

export default Settings