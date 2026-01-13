import "/src/styles/detail.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getUserIdFromToken } from "../../getUserIdFromToken";
import { getMemberDetail } from "../../api";
import { getHouseholds } from "../../api";
import { updateMemberInfo } from "../../api";




const MemberDetail = ({editedMember, onClose, openMessage, closeMessage, updateSeccessMessage, updateError}) => {

    const currentUser = getUserIdFromToken();
    
    const uuid  = editedMember;
    

    // get all household data
    const [householdMembers, setHouseholdMembers] = useState([])
    useEffect(() => {
        async function fetchHousehold() {
            try {
                const data = await getHouseholds();
                setHouseholdMembers(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchHousehold();
        
    },[])
    
    const [formData, setFormData] = useState({
        name: {
            first_name: "",
            last_name: "",
        },
        email: "",
        dob: "",
        gender: "",
        marital_status: "",
        household: "",
        occupation: "",
        phone_number: "",
        address: "",
        immigration_status: "",
        doc_expiry: "",
        rank: "",
        date_joined_church: "",
        note: "",
        assigned_welfare_member: "",
        account_status:"",
        
    });
    const toInputDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().slice(0, 10);
    };

    useEffect(() => {
        
        if(!uuid) return;
        
        const fetchMember = async () => {
            try {
                const res = await getMemberDetail(uuid)
                
                const m = res.data;

                setFormData({

                    name: {
                        first_name: m?.name?.first_name || "",
                        last_name: m?.name?.last_name || "",
                    },
                    email: m?.email || "",
                    dob: toInputDate(m?.dob),
                    gender: m?.gender || "",
                    marital_status: m?.marital_status || "",
                    household: m?.household || "",
                    occupation: m?.occupation || "",
                    phone_number: m?.phone_number || "",
                    address: m?.address || "",
                    immigration_status: m?.immigration_status || "",
                    doc_expiry: toInputDate(m?.doc_expiry),
                    rank: m?.rank || "",
                    date_joined_church: toInputDate(m?.date_joined_church),
                    note: m?.note || "",
                    assigned_welfare_member: m?.assigned_welfare_member || "",
                    account_status: m?.account_status || "Active",
                });

               
            } catch (err) {
                if (err.response?.status === 401){

                    console.error("Failed to load member");
                }
            }
        };
        
        fetchMember();

       
    }, [uuid]);

    

    const handleNameChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            name: {
                ...prev.name,
                [e.target.name]: e.target.value,
            },
        }));
    };
   
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const rankData = [
        "Brother",
        "Elder Brother",
        "Cape Elder Brother",
        "Full Elder Brother",
        "Senior Elder Brother",
        "Superior Senior Elder Brother",
        "Assistant Leader",
        "Leader",
        "Senior Leader",
        "Superior Senior Leader",
        "Honorary Assistant Evangelist",
        "Assistant Evangelist",
        "Honorary Evangelist",
        "Evangelist",
        "Honorary Senoir Evangelist",
        "Senior Evangelist",
        "Special Most Senoir Evangelist",
        "Most Senoir Evangelist",
        "Special Venerable  Most Senoir Evangelist",
        "Venerable Most Senoir Evangelist",
        "Assistant Superior Evangelist",
        "Superior Evangelist",
        "Assistant Venerable Superior Evangelist",
        "Venerable Superior Evangelist",
        "Assistant Most Superior Evangelist",
        "Most Superior Evangelist",
        "Supreme Evangelist",
        "Pastor (Reverd)",
        "Lace Superior Senior Elder Sister",
        "Lace Superior Senior Prohetess",
        "Superior Senior Elder Sister",
        "Superior Senior Prophetess",
        "Senior Elder Sister",
        "Senior Prophetess",
        "Cape Elder Sister",
        "Wolima",
        "Prophetess",
        "Sister",
        "Mother in Celestial",
        "Elder Sister",
        "Assistant Mother Celestial",

    ]
    


   
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await updateMemberInfo(uuid, formData)
            if (!res) {
                throw new Error("No response");
            }

            updateSeccessMessage();
            openMessage();
            setTimeout(() => {
                closeMessage()
            },3000)
           
        } catch (err) {
            updateError();
            openMessage();
            setTimeout(() => {
                closeMessage()
            },3000)
        }
    };

   

    return (

        <div id="members-page" className="page p-6">
            
            <div className="mb-6 justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{formData.name?.first_name} {formData.name?.last_name}</h2>
                    <p className="text-gray-600">View or edit {formData.name?.first_name}'s information</p>
                </div>

                <form onSubmit={handleSubmit}  className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                        <h3 className="text-xl font-semibold text-gray-800">Edit Member Info</h3>
                        <button id="close-member-modal" className="invisible text-gray-500 hover:text-gray-700">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div> 
                    <div  className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex items-center space-x-4">
                                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center relative">
                                    <i className="fas fa-user text-gray-400 text-4xl"></i>
                                    <input type="file" id="profile-photo" className="hidden" />
                                        <label htmlFor="profile-photo" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer">
                                            <i className="fas fa-camera"></i>
                                        </label>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Upload a profile photo</p>
                                    <p className="text-xs text-gray-500">JPG or PNG format, max 5MB</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                                <input   required name="first_name" value={formData.name?.first_name} onChange={handleNameChange} type="text" id="first-name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={"First name"} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                                <input  required  name="last_name" value={formData.name?.last_name} onChange={handleNameChange} type="text" id="last-name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={"last name"} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                                <input name="fullname"value={`${formData.name?.first_name}  ${formData.name?.last_name}`}   type="text" id="full-name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"  placeholder="Auto-populated" readOnly />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                                <select value={formData.gender} required name="gender" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                                <input  name="dob" value={formData.dob} required onChange={handleChange} type="date" id="dob" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Select date" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                <input value={formData.occupation} required name="occupation" onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Occupation" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select value={formData.marital_status} required name="marital_status" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                                <input value={formData.phone_number} required name="phone_number" onChange={handleChange} type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter phone number" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input value={formData.email} required name="email" onChange={handleChange} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter email address" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input value={formData.address} required name="address" onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter address" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Household</label>
                                <select value={formData.household} name="household" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select household</option>
                                    <option value="new">Create New Household</option>
                                    {
                                        householdMembers.map((member) => {
                                            return(
                                                <option value={member.uuid} key={member._id}>{member.household.last_name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className="rank-input-wrapper">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rank in Church</label>

                                <div className="rank_search_table">
                                    <select name="rank" id="" value={formData.rank} onChange={handleChange}  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        {
                                            rankData.map((item, index) => {
                                                return(
                                                    <option key={index} value={item}>{item}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    
                                    
                                </div>
                                
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Immigration Status</label>
                                <select value={formData.immigration_status} required name="immigration_status" onChange={handleChange} className="max-h-48 overflow-y-auto border rounded-md bg-white shadow w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select status</option>
                                    <option value="Citizen">Citizen</option>
                                    <option value="Permanent Resident">Permanent Resident</option>
                                    <option value="Work Permit">Work Permit</option>
                                    <option value="Study Permit">Study Permit</option>
                                    <option value="Visitor">Visitor</option>
                                    <option value="Refugee">Refugee</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Immigration Document Expiry</label>
                                <input  required name="doc_expiry" value={formData.doc_expiry} onChange={handleChange} type="date" id="document-expiry" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Select date" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
                                <input value={formData.date_joined_church}  required name="date_joined_church"  onChange={handleChange} type="date" id="date-joined" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="YYYY-MM-DD" />
                            </div>

                            

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                <textarea value={formData.note} name="note" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Enter any additional information..."></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button id="cancel-member" type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" id="save-member"  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                Save Member
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            

            {/* <!-- Add Member Floating Button (Mobile) --> */}
            <button id="add-member-floating-btn" className="floating-button md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center">
                <i className="fas fa-plus text-xl"></i>
            </button>
            
        </div>
    )
}

export default MemberDetail