import { useState, useEffect } from "react";
import { getMembers } from "../../api"
import { getWelfareMember } from "../../api";
import { getHouseholds } from "../../api";
import { updateMemberStatus } from "../../api";
import MemberModal from "../../components/modals/MemberModal";
import { useNavigate } from "react-router";
import CSVModal from "../../components/modals/CSVModal";
import AppDialog from "../../components/modals/AppDialog";
import { getUserIdFromToken } from "../../getUserIdFromToken";
import MemberDetail from "./MemberDetail";
import MessageDialog from "../../components/modals/MessageDialog";
import MessageModal from "../../components/modals/MessageModal";




const Members = () => {

    const navigate = useNavigate()

    const currentUser = getUserIdFromToken();

    
    const [prevLoading, setPrevLoading] = useState(false)
    const [nextLoading, setNextLoading] = useState(false)
    
    
    const [open, setOpen] = useState(false);
    const [mamberOpen, setMemberOpen] = useState(false); 
    const [detailOpen, setDetailOpen] = useState(false);
    const [members, setMembers] = useState([])

    const [messageOpen, setMessageOpen] = useState(false)
    const [message, setMessage] = useState("")
    const closeMessage = () => setMessageOpen(false)
    
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLimit, setDataLimit] = useState(10)
    const [welfareMembers, setWelfareMembers] = useState([])
    const [householdMembers, sethouseholdMembers] = useState([])
    const [totalMembers, setTotalMembers] = useState(0)
    
    
    //filter useState ---
    const [search, setSearch] = useState("")
    const [genderSearch, setGenderSearch] = useState("")
    const [householdSearch, setHouseholdSearch] = useState("")
    const [contentCount, setContentCount] = useState("")
    //filter useState ends ---
    
    
    // handle modal state 
    const closeModal = () => setMemberOpen(false);
    const closeDetailModal = () => setDetailOpen(false)
    

    

    // useEffect fetch household from the api
    useEffect(() => {
        async function fetchHousehold() {
            try {
                const data = await getHouseholds();
                sethouseholdMembers(data)
                
            } catch (err) {
                console.error(err)
            }
            
        }
        fetchHousehold();
    }, [])


    // useEffect fetch members from the api
    useEffect(() => {
        async function fetchMembers() {
            
            try {
                const data = await getMembers(dataLimit, page);
                setMembers(data.data)
                setTotalPages(data.totalPages)
                setTotalMembers(data.totalMembers)
                
            } catch (err) {
                console.error(err)
            }

        }
        fetchMembers();
    }, [page || dataLimit])


    // get welfare members from api      
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
    }, [])
 

    // handles row per page count 
    const handleCountChange = (event) => {

        setContentCount(event.target.value);

        setDataLimit(event.target.value)
    };


    
    // handles search by gender 
    const handleFilterByGender = (event) => {
        
        setGenderSearch(event.target.value);
    };

    // handles household filter 
    const handleHouseholdfilterChange = (event) => {
        
        setHouseholdSearch(event.target.value);
    };
    

    useEffect(() =>{

        //  handles member filter 
        const filteredMembers = members.filter(member => 
            (member.name?.first_name.toLowerCase().includes(search.toLowerCase()))
        );
    
        const genderFilter = members.filter(member =>
            (member.gender.toLowerCase() === genderSearch.toLowerCase())
             
        )
    
        const householdFilter = members.filter(member => 
            (member.household === householdSearch)
        )
    }, [])

    
    
    

    // Handle update member account status 
    const handleStatusChange = async (uuid, newStatus) => {
        
        try {
            await updateMemberStatus(uuid, { account_status: newStatus });

        } catch (err) {
        console.error(err);
        }
    };


    // handle setpage(prev and next button)

    const handlePrevBtn = () => {
        setPrevLoading(true)
        setPage(p => p - 1)
        setTimeout(() => {
            setPrevLoading(false)
        },2000)
    }

    const handleNextBtn = () => {
        setNextLoading(true)
        setPage(p => p + 1)
        setTimeout(() => {
            setNextLoading(false)
        },2000)
    }
    // handle setpage(prev and next button)


    const [editedMemberDetail, setEditedMemberDetail] = useState({})
    const handleEditDetail = (uuid) => {
        setDetailOpen(true)
        setEditedMemberDetail(uuid)
    }
    
    return (

        <div id="members-page" className="page p-6">
            <div className="mb-6 block justify-between items-center md:flex  ">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Church Members</h2>
                    <p className="text-gray-600">Manage and view all church members</p>
                </div>
                <div className="flex space-x-3">
                    <button id="upload-csv-btn" onClick={() => setOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                        <i className="fas fa-file-csv mr-2"></i> Upload Excel
                    </button>
                    <button id="add-member-btn" onClick={() => setMemberOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                        <i className="fas fa-plus mr-2"></i> Add Member
                    </button>
                </div>
            </div>

            {/* <!-- Filters Section --> */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" id="member-search" placeholder="Search members..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rows per page</label>
                        <select value={contentCount} onChange={handleCountChange}  id="rows-per-page" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select name="gender" value={genderSearch} onChange={handleFilterByGender} id="gender-filter" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Household</label>
                        <select id="household-filter" value={householdSearch} onChange={handleHouseholdfilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Households</option>
                            {
                                householdMembers.map((item) => {
                                    return(
                                        <option value={item.uuid} key={item.uuid}>{item.household?.first_name} {item.household?.last_name}  </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>

            {/* <!-- Members Table --> */}
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Household</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immigration Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doc Exp Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marital Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Welfare</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Updated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            
                        </thead>
                        <tbody id="members-table-body" className="bg-white divide-y divide-gray-200">
                           
                            {

                                search? 
                                    filteredMembers.map((member) => {
                                        
                                        return(
                                            
                                            <tr className="border-b border-gray-200  cursor-pointer hover:bg-blue-50" role="button" tabIndex={0} onClick={() => handleEditDetail(member.uuid)}    key={member._id}>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.name?.first_name} {member.name?.last_name}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.gender}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.dob?.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{householdMembers.map((householdItem) => {if(householdItem.uuid === member.household ){return(householdItem.household?.last_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.phone_number}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.email.toLowerCase()}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider"  >{(currentUser.role === "3")? member.immigration_status : "Resctricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{ (currentUser.role === "3")? member.doc_expiry?.slice(0, 10) : "Restricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.occupation}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.address}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.rank}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.marital_status}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{welfareMembers.map((welfareItem) => {if(welfareItem.uuid === member.assigned_welfare_member ){return(welfareItem.name?.first_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_created.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_updated.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >
                                                    <select  onChange={(e) => handleStatusChange(member.uuid,  e.target.value)} name="account_status"   id="account-status" className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                        <option value="">Choose Action</option>
                                                        <option value="Active">Activate</option>
                                                        <option value="Inactive">Deactivate</option>
                                                        <option value="Archived">Archive</option>
                                                    </select>
                                                </td>
                                                
                                            </tr>
                                            
                                        )
                                    })
                                :
                                    genderSearch?
                                        genderFilter.map((member) => {
                                        return(
                                            
                                            <tr className="border-b border-gray-200  cursor-pointer hover:bg-blue-50" role="button" tabIndex={0} onClick={() => handleEditDetail(member.uuid)}    key={member._id}>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.name?.first_name} {member.name?.last_name}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.gender}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.dob?.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{householdMembers.map((householdItem) => {if(householdItem.uuid === member.household ){return(householdItem.household?.last_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.phone_number}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.email.toLowerCase()}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider"  >{(currentUser.role === "3")? member.immigration_status : "Resctricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{ (currentUser.role === "3")? member.doc_expiry?.slice(0, 10) : "Restricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.occupation}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.address}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.rank}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.marital_status}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{welfareMembers.map((welfareItem) => {if(welfareItem.uuid === member.assigned_welfare_member ){return(welfareItem.name?.first_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_created.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_updated.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >
                                                    <select  onChange={(e) => handleStatusChange(member.uuid,  e.target.value)} name="account_status"   id="account-status" className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                        <option value="">Choose Action</option>
                                                        <option value="Active">Activate</option>
                                                        <option value="Inactive">Deactivate</option>
                                                        <option value="Archived">Archive</option>
                                                    </select>
                                                </td>
                                                
                                            </tr>
                                            
                                        )
                                    })
                                :
                                    householdSearch?
                                        householdFilter.map((member) => {
                                        return(
                                            
                                            <tr className="border-b border-gray-200  cursor-pointer hover:bg-blue-50" role="button" tabIndex={0} onClick={() => handleEditDetail(member.uuid)}    key={member._id}>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.name?.first_name} {member.name?.last_name}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.gender}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.dob?.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{householdMembers.map((householdItem) => {if(householdItem.uuid === member.household ){return(householdItem.household?.last_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.phone_number}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.email.toLowerCase()}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider"  >{(currentUser.role === "3")? member.immigration_status : "Resctricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{ (currentUser.role === "3")? member.doc_expiry?.slice(0, 10) : "Restricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.occupation}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.address}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.rank}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.marital_status}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{welfareMembers.map((welfareItem) => {if(welfareItem.uuid === member.assigned_welfare_member ){return(welfareItem.name?.first_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_created.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_updated.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >
                                                    <select  onChange={(e) => handleStatusChange(member.uuid,  e.target.value)} name="account_status"   id="account-status" className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                        <option value="">Choose Action</option>
                                                        <option value="Active">Activate</option>
                                                        <option value="Inactive">Deactivate</option>
                                                        <option value="Archived">Archive</option>
                                                    </select>
                                                </td>
                                                
                                            </tr>
                                            
                                        )
                                    })
                                : 

                                    filteredMembers.map((member) => {
                                        return(
                                            
                                            <tr className="border-b border-gray-200  cursor-pointer hover:bg-blue-50" role="button"  onClick={() => handleEditDetail(member.uuid)}    key={member._id}>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.name?.first_name} {member.name?.last_name}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.gender}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.dob?.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{householdMembers.map((householdItem) => {if(householdItem.uuid === member.household ){return(householdItem.household?.last_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.phone_number}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.email.toLowerCase()}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider"  >{(currentUser.role === "3")? member.immigration_status : "Resctricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{ (currentUser.role === "3")? member.doc_expiry?.slice(0, 10) : "Restricted"}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.occupation}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.address}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.rank}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.marital_status}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{welfareMembers.map((welfareItem) => {if(welfareItem.uuid === member.assigned_welfare_member ){return(welfareItem.name?.first_name)}  })}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_created?.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.date_updated?.slice(0, 10)}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >
                                                    <select  onChange={(e) => handleStatusChange(member.uuid,  e.target.value)} name="account_status"   id="account-status" className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                        <option value="">Choose Action</option>
                                                        <option value="Active">Activate</option>
                                                        <option value="Inactive">Deactivate</option>
                                                        <option value="Archived">Archive</option>
                                                    </select>
                                                </td>
                                                
                                            </tr>
                                            
                                        )
                                    })   
                                
                            }
                           
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Page <span className="font-medium" id="members-visible-count">{page}</span> of <span className="font-medium" id="members-total-count">{totalPages}</span> 
                            <div className="text-sm text-gray-700">
                                Members: <span className="font-medium" id="members-total-count">{totalMembers}</span>
                            </div>
                        </div>
                        
                        <div className="flex space-x-1" id="members-pagination">
                           
                            <button type="button" disabled={page === 1} onClick={ handlePrevBtn} className={ prevLoading? "btn-loading bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center": "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"}>
                                Prev
                            </button>
                            <button type="button" disabled={page === totalPages} onClick={ handleNextBtn} className={ nextLoading? "btn-loading bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center": "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            

            {/* <!-- Add Member Floating Button (Mobile) --> */}
            <button id="add-member-floating-btn" onClick={() => setMemberOpen(true)} className="floating-button md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center">
                <i className="fas fa-plus text-xl"></i>
            </button>
            <AppDialog
                isOpen={open}
                onClose={() => setOpen(false)}
            >

                <CSVModal
                    onClose={closeModal} 
                />
            </AppDialog>
            
            <AppDialog
                isOpen={mamberOpen}
                onClose={() => setMemberOpen(false)}
            >

                <MemberModal onClose={closeModal} />
            </AppDialog>
            <AppDialog
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
            >

                <MemberDetail 
                    onClose={closeDetailModal}
                    editedMember={editedMemberDetail}
                    openMessage={() => setMessageOpen(true)}
                    closeMessage={() => setMessageOpen(false)}
                    updateSeccessMessage={() => setMessage("Member data updated successfully")} 
                    updateError={() => setMessage("Update failed, please try again")}
                />
            </AppDialog>

            <MessageDialog
               isOpen={messageOpen}
               onClose={() => setMemberOpen(false)}
            >

                <MessageModal 
                    onClose={closeMessage}
                    message={message}  
                />

            </MessageDialog>
        </div>
    )
}

export default Members