import { deleteMember } from "../../api"

const DeleteMemberModal = ({firstName, lastName, closeDelMember, memberId}) => {

    
    
    const handleDelete = async (e) =>{
        
        const res = await deleteMember(memberId)
        
    }
    
    const handleClose = () => {
        closeDelMember()
    }
    return (
        <form onSubmit={handleDelete}  className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h3 className="text-xl font-semibold text-red-600">Delete Member</h3>
                <button id="close-user-modal" className="invisible text-gray-500 hover:text-gray-700">
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    
                    <p className="text-gray-600">Member will be permanently remove from DB</p>
                    
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={handleClose}  id="cancel-user" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Cancel
                    </button>
                    
                    <button type="submit"   id="save-user"  className={ "px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700"}>
                        Delete  {firstName} {lastName}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default DeleteMemberModal;