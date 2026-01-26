import { useState, useEffect } from "react";
import AddWelfareModal from "../../components/modals/AddWelfareModal"
import AppDialog from "../../components/modals/AppDialog";
import { getWelfareMember } from "../../api";
import MessageDialog from "../../components/modals/MessageDialog";
import MessageModal from "../../components/modals/MessageModal";





const Welfare = () => {

    const [welfareMembers, setWelfareMembers] = useState([]);
    const [messageOpen, setMessageOpen] = useState(false);
    const [message, setMessage] = useState("");
    const closeMessage = () => setMessageOpen(false)
    const [welfareOpen, setWelfareOpen] = useState(false);
    const closeModal = () => setWelfareOpen(false)

    const [welfareUpdated, setWelfareUpdated] = useState(false);
    const refreshWelfare = () => setWelfareUpdated(true);
    useEffect(() => {
        async function fetchWelfare() {
            try {
                const data = await getWelfareMember();
                setWelfareMembers(data)
                
            } catch (err) {
                console.error(err)
            }
            
        }
        fetchWelfare();
    }, [welfareUpdated])

       
    return (
        <div id="households-page" className="page p-6">
            <div className="mb-6 block justify-between items-center md:flex">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Welfare</h2>
                    <p className="text-gray-600">Manage church members</p>
                </div>
                <button id="add-household-btn" onClick={() => setWelfareOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                    <i className="fas fa-plus mr-2"></i> Add Welfare Member
                </button>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <input type="text" id="household-search" placeholder="Search households..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <i className="fas fa-search text-gray-400"></i>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firstname</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lastname</th>
                            
                        </tr>
                    </thead>
                    <tbody id="members-table-body" className="bg-white divide-y divide-gray-200">
                        
                        {
                            welfareMembers.map((member) => {
                                return(
                                    <tr className="border-b border-gray-200" key={member._id}>
                                        <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.name?.first_name}</td>
                                        <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.name?.last_name}</td>
                                    </tr>
                                )
                            })
                        }
                        
                    </tbody>
                </table>
            </div>

            {/* <!-- Pagination for Households --> */}
            <div className="mt-6 bg-white rounded-lg shadow px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium" id="households-visible-count">{welfareMembers.length}</span> of <span className="font-medium" id="households-total-count">0</span> welfare
                    </div>
                    <div className="flex space-x-1" id="households-pagination">
                        {/* <!-- Pagination will be generated here --> */}
                    </div>
                </div>
            </div>

            {/* <!-- Add Household Floating Button (Mobile) --> */}
            <button id="add-household-floating-btn" onClick={() => setWelfareOpen(true)} className="floating-button md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center">
                <i className="fas fa-plus text-xl"></i>
            </button>
            <MessageDialog
                isOpen={messageOpen}
                onClose={() => setMessageOpen(false)}
            >

                <MessageModal 
                    onClose={closeMessage}
                    message={message}  
                />

            </MessageDialog>

            <AppDialog
                isOpen={welfareOpen}
                onClose={() => setWelfareOpen(false)}
            >

                <AddWelfareModal
                    onClose={closeModal}
                    openMessage={() => setMessageOpen(true)}
                    closeMessage={() => setMessageOpen(false)}
                    successMessage={() => setMessage("Member added successfully")}
                    refreshWelfare={refreshWelfare} 
                />
            </AppDialog>
        </div>
    )
}

export default Welfare