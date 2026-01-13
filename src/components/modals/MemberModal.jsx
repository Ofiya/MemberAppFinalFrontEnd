import { useState, useEffect } from "react"
import { createMember } from "../../api"
import { getWelfareMember } from "../../api";
import { getHouseholds } from "../../api";
import AppDialog from "./AppDialog";



const MemberModal = ({onClose}) => {

    const [loading, setLoading] = useState(false);
    
    
    // get all welfare data
    const [welfareMembers, setWelfareMembers] = useState([])
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
    },[])

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


    const [member, setMember] = useState({

        first_name: "",
        last_name: "",
        dob: "",
        gender: "",
        phone_number: "",
        email: "",
        immigration_status: "",
        doc_expiry: "",
        marital_status: "",
        occupation: "",
        address: "",
        household: "",
        rank: "",
        date_joined_church: "",
        assigned_welfare_member: "",
        note: "",
        account_status: "Active",

    })

    // states for member data 
    

    function handleChange(e) {
        setMember({
            ...member, [ e.target.name]: e.target.value,})
    }
    
    

    // // handle submit function for member data 
    // async function handleSubmit(e) {

    //     e.preventDefault();
            
    //     const res = await createMember(member)

    //     if(res === null){
    //         alert("Email has been taken")
    //     }else{
            
    //     }
              
    // }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await createMember(member);

            if (res.status === 201) {
            alert("Member Added Successfully");
            }

        } catch (error) {
            
            if (error.response?.status === 409) {
            alert("Email already exists");
            } else {
            alert("Something went wrong");
            }
        }
    }


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

    

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-800">Add New Member</h3>
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
                            <input  required name="first_name" onChange={handleChange} type="text" id="first-name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter first name" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                            <input  required name="last_name" onChange={handleChange} type="text" id="last-name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter last name" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                            <input name="fullname" value={member.first_name + " " + member.last_name}  type="text" id="full-name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"  placeholder="Auto-populated" readOnly />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender*</label>
                            <select  required name="gender" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                            <input  name="dob" required onChange={handleChange} type="date" id="dob" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Select date" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                            <input  required name="occupation" onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Occupation" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                            <select  required name="marital_status" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                            <input  required name="phone_number" onChange={handleChange} type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter phone number" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input required name="email" onChange={handleChange} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter email address" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input required name="address" onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter address" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Household</label>
                            <select name="household" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
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
                                <select name="rank" id="" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select Rank</option>
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
                            <select required name="immigration_status" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select status</option>
                                <option value="Citizen">Citizen</option>
                                <option value="Permanent Resident">Permanent Resident</option>
                                <option value="Work Permit">Work Permit</option>
                                <option value="Study Permit">Study Permit</option>
                                <option value="Visitor">Visitor</option>
                                <option value="Refugee">Refugee</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Immigration Document Expiry</label>
                            <input  required name="doc_expiry" onChange={handleChange} type="date" id="document-expiry" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Select date" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
                            <input required name="date_joined_church" onChange={handleChange} type="date" id="date-joined" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Select date" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Welfare Member</label>
                            <select required name="assigned_welfare_member" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="not selected" >Select Welfare Member</option>
                                {
                                    welfareMembers.map((member) => {
                                        return(
                                            <option value={member.uuid} key={member._id}>{member.name.first_name} {member.name.last_name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                            <textarea name="note" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="Enter any additional information..."></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" id="cancel-member" onClick={onClose}  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" id="save-member"  className={loading? "btn-loading px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" : "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"}>
                            Save Member
                        </button>
                    </div>
                </div>
                
            </form>
            
        </>
    )
}

export default MemberModal