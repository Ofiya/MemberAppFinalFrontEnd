import { useState } from "react"
import { createWelfareMember } from "../../api";
import AppDialog from "./AppDialog";


const AddWelfareModal = ({onClose, openMessage, closeMessage, successMessage}) => {

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");


    async function handleSubmit(e) {
        e.preventDefault()

        
        let memberObject = {
            first_name:firstname,
            last_name:lastname,
        }

        await createWelfareMember(memberObject)
        
        openMessage()
        successMessage()
        setTimeout(() => {
            closeMessage()
        }, 3000)
    }


    return (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-800">Add New Welfare Member</h3>
                <button id="close-household-modal" className="invisible text-gray-500 hover:text-gray-700">
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                        <input type="text" name="first_name" value={firstname} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Firstname" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                        <input type="text" name="last_name" value={lastname} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Lastname" />
                    </div>
                   
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={onClose} id="cancel-household" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" id="save-household" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Save Member
                    </button>
                </div>
            </form>
            <AppDialog
                onClose={() => setWelfareOpen(false)}
            >

                <AddWelfareModal />
            </AppDialog>
        </div>
    )
}

export default AddWelfareModal