import "/src/styles/attendance.css"
import { useState, useEffect } from "react"
import { getMembers } from "../../api"
import { submitAttendees } from "../../api"
import { getAttendance } from "../../api"
import MessageDialog from "../../components/modals/MessageDialog"
import MessageModal from "../../components/modals/MessageModal"

const Attendance = () => {

    const thisDay = new Date().toLocaleDateString("en-CA")
    
    const [messageOpen, setMessageOpen] = useState(false)
    const [message, setMessage] = useState("")
    const closeMessage = () => setMessageOpen(false)

    const [members, setMembers] = useState([]);
    const [attendance, setAttendance] = useState({})

    const [prevLoading, setPrevLoading] = useState(false)
    const [nextLoading, setNextLoading] = useState(false)


    const [search, setSearch] = useState("");
    const [contentCount, setContentCount] = useState("")

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const [totalMembers, setTotalMembers] = useState(0)



    const [markAll, setMarkAll] = useState(false)

    const handleMarkAll = () => {
        if(!markAll){
            setMarkAll(true)
        }
        if(markAll){
            setMarkAll(false)
        }
    }

    
    const [submitted, setSubmitted] = useState(false)
    
    const submitAttendance = async (e) => {
        e.preventDefault();
        const presentMembers = Object.entries(attendance)
        .filter(([_, present]) => present)
        .map(([uuid]) => uuid);
        
        await submitAttendees({
            date: new Date().toLocaleDateString("en-CA"),
            presentMembers
        })
        setSubmitted(true)
        setMessageOpen(true)
        setMessage("Attendance has been updated")
        setTimeout(() => {
            setSubmitted(false);
        }, 2000);
        console.log(message)
    };

    
   
    
        // useEffect fetch members from the api
    useEffect(() => {
        async function fetchMembers() {
           try {
                const data = await getMembers(dataLimit, page);
                setMembers(data.data);
                setTotalPages(data.totalPages);
                setTotalMembers(data.totalMembers);
           } catch (error) {
                
           }

        }
        fetchMembers();
    }, [page, dataLimit])


    //  handles filtered members 
    const filteredMembers = members.filter(member => {
        
        if(member.name?.first_name.toLowerCase().includes(search)){
            return true
        }
        
    })



    const [attendances, setAttendances] = useState([])

    // useEffect fetch attendance from the api
    useEffect(() => {

        async function fetchAttendance() {

            const data = await getAttendance();
            
            setAttendances(data)

        }
        fetchAttendance();
    }, [])
    


    // flagged members  and attendance count
    const totalDays = attendances.length;
    const presentMap = {};

    attendances.forEach((att, index) => {
        Object.keys(att.present || {}).forEach(uuid => {
            presentMap[uuid] = (presentMap[uuid] || 0) + 1;
        });
    });

    
    
    const flaggedMembers = members
        .map(member => {
        const presentCount = presentMap[member._id] || 0;
        const absentCount = totalDays - presentCount;

            return { 
                presentCount:presentCount,
                uuid:member.uuid,
                absentCount:absentCount,
            };
        })
    // flagged members  and attendance count end
    

    // handles row per page count 
    const handleCountChange = (event) => {
        let rowCount = Number(event.target.value)
        setContentCount(rowCount);

        setDataLimit(rowCount)
        setPage(1)
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

        
    return (
        <>
            <form id="attendance-page" className="page p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Attendance Tracking</h2>
                    <p className="text-gray-600">Record and manage Sunday service attendance</p>
                </div>

                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-4 flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                            <input id="service-date" value={thisDay} readOnly type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"  />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Members</label>
                            <div className="relative">
                                <input onChange={(e) => setSearch(e.target.value)} value={search} type="text" id="attendance-search" placeholder="Search by name..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <i className="fas fa-search text-gray-400"></i>
                                    </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rows per page</label>
                            <select id="attendance-rows-per-page" value={contentCount} onChange={handleCountChange}  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="10" >10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap items-center space-x-4 ">
                            <button type="button" id="bulk-select-btn" className="bg-blue-600 mb-4 md:mb-0 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                                <i className="fas fa-check-square mr-2"></i> Bulk Select
                            </button>
                            <button id="mark-all-present" type="button" onClick={handleMarkAll} className="bg-indigo-600 mb-4 md:mb-0 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                                <i className="fas fa-check-double mr-2"></i> Mark All Present
                            </button>
                            <button id="save-attendance" onClick={submitAttendance} className="bg-green-600 mb-4 md:mb-0 hover:bg-green-400 text-white font-medium py-2 px-4 rounded-md flex items-center">
                                <i className="fas fa-save mr-2"></i> Save All
                            </button>

                            <div className="flex items-center space-x-2">
                                {
                                    submitted? 
                                        <div id="autosave-indicator" className="autosave-indicator text-sm flex items-center">
                                            <i className="fas fa-check-circle text-green-500 mr-1"></i>
                                            <span>Saved</span>
                                        </div>

                                    :
                                        ""
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input type="checkbox" id="select-all-attendance" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" disabled />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flagged for Follow-up</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                </tr>
                            </thead>
                            
                            <tbody id="attendance-table-body" className="bg-white divide-y divide-gray-200">
                            {
                                    filteredMembers.map((member) => {
                                        const flagged = flaggedMembers.filter(item => item.uuid === member.uuid )
                                        
                                        return(
                                            <tr key={member._id} className="border-b border-gray-200">
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >
                                                    <input 

                                                        checked={markAll ? (attendance[member._id] || true) : (attendance[member._id] || false)} 
                                                        type="checkbox" 
                                                        onChange={(e) =>
                                                        setAttendance((prev) => ({
                                                                ...prev,
                                                                [member._id]: e.target.checked
                                                            }))
                                                        }
                                                        name="attended_service" id="select-all-attendance" 
                                                        className="rounded border-gray-300 accent-green-600 text-indigo-600 ring-indigo-500" 
                                                    />
                                                    
                                                </td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.name?.first_name} {member.name?.last_name}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.gender}</td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.phone_number}</td>
                                                <td className="px-6 py-3 text-center text-sm font-normal text-gray-500 capitalize tracking-wider" >{flagged[0].presentCount}</td>
                                                <td className="px-6 py-3 flex items-center justify-center text-sm font-normal text-gray-500 capitalize tracking-wider" ><div className={flagged[0].absentCount >= 3? "followup_flag": ""}></div></td>
                                                <td className="px-6 py-3 text-left text-sm font-normal text-gray-500 capitalize tracking-wider" >{member.note}</td> 
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
                            <div className="flex space-x-1" id="attendance-pagination">
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
        </>
    )
}

export default Attendance