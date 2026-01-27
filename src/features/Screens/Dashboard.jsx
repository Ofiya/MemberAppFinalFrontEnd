import { useNavigate } from "react-router"
import { useState, useEffect, useRef } from "react"
import { getMembers } from "../../api"
import { getAttendance } from "../../api"
import { sendEmail } from "../../api"
import MessageDialog from "../../components/modals/MessageDialog"
import MessageModal from "../../components/modals/MessageModal"



import Chart from "chart.js/auto"



const Dashboard = () => {

    const navigate = useNavigate();

    const [messageOpen, setMessageOpen] = useState(false)
    const [message, setMessage] = useState("")
    const closeMessage = () => setMessageOpen(false)

    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const [members, setMembers] = useState([])
    const [attendances, setAttendances] = useState([])

    
    const dataLimit = ""
    const pages = ""
    
    // useEffect fetch members from the api
    useEffect(() => {
        async function fetchMembers() {
            const token = sessionStorage.getItem("User");
            if (!token) return;
            try {
                const data = await getMembers(dataLimit, pages);
                setMembers(data.allMembers)
            } catch (err) {
                
            }
                   
        }
        fetchMembers();
    }, [])

    // useEffect fetch attendance from the api
    useEffect(() => {

        async function fetchAttendance() {

            const data = await getAttendance();
            
            setAttendances(data)

        }
        fetchAttendance();
    }, [])

    


    // expiring documents

    const expiringMemDoc = [];

    const getExpiringMembers = (members) => {
        const today = new Date();
        members.filter((member) =>{
            const expiry = new Date(member.doc_expiry)
            today.setHours(0, 0, 0, 0);
            expiry.setHours(0, 0, 0, 0);
            let memberExp = Math.round((expiry - today) / 86400000)

            if(memberExp < 90){
                expiringMemDoc.push(member)
            }
            
        })
    };


    getExpiringMembers(members);

   

    // upcoming birthdays 

    const getUpcomingBirthdays = (members, days = 1) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return members.filter((member) => {
            if (!member.dob) return false;

            const birth = new Date(member.dob);
            // Birthday this year
            let nextBirthday = new Date(
                today.getFullYear(),
                birth.getMonth(),
                birth.getDate(),
            );

            // If already passed, move to next year
            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }

            const diffDays =
            (nextBirthday - today) / (1000 * 60 * 60 * 24);
            
            return diffDays >= 0 && diffDays <= days;
        });
    };
    const upcomingBirthdays = getUpcomingBirthdays(members, 8);

    


    // calculating attendance rate 
    const totalMembers = members.length;
    const totalDays = attendances.length;
    
    

    const totalPresents = attendances.reduce(
        (sum, a) =>
            sum +
            (a.present instanceof Map
            ? a.present.size
            : Object.keys(a.present || {}).length),
        0
    );

   

    const overallRate = totalMembers === 0 || totalDays === 0
        ? 0
        : ((totalPresents / (totalMembers * totalDays)) * 100).toFixed(2);






    useEffect(() => {
        if (!attendances || attendances.length === 0) return;

        // Destroy previous chart (VERY IMPORTANT)
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Prepare labels and data
        const labels = attendances.map(a => a.date);
        

        const dataPoints = attendances.map(a => {
            const presentCount =
                a.present instanceof Map
                ? a.present.size
                : Object.keys(a.present || {}).length;

            return totalMembers === 0
                ? 0
                : Math.round((presentCount / totalMembers) * 100);
        });
        
        

        chartRef.current = new Chart(canvasRef.current, {
            type: "line",
            borderColor: "#2196F3",
            fiil:false,
            data: {
                labels,
                datasets: [
                {
                    label: "Attendance Rate (%)",
                    data: dataPoints,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                legend: { position: "top" },
                },
                scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                    callback: value => value + "%",
                    },
                },
                },
            },
        });

        // Cleanup on unmount
        return () => {
            chartRef.current?.destroy();
        };
    }, [attendances, totalMembers]);






    // demography 

    const groupByJoinYear = (members) => {
        const result = {};

        if (!Array.isArray(members)) return result;
        
        members.forEach((member) => {
            if (!member.date_joined_church) return;

            const year = new Date(member.date_joined_church).getFullYear();
            result[year] = (result[year] || 0) + 1;
        });

        return result;
    };

    const grouped = groupByJoinYear(members)
    const labels = Object.keys(grouped).sort();     
    const dataPointstwo = labels.map(year => grouped[year]);




    const canvasReftwo = useRef(null);
    const chartReftwo = useRef(null);

    useEffect(() => {
        if (!members || members.length === 0) return;

        // Group data
        const grouped = groupByJoinYear(members);

        // Prepare chart data
        const labels = Object.keys(grouped).sort();      // years
        const dataPoints = labels.map(year => grouped[year]);

        // Destroy old chart
        if (chartReftwo.current) {
        chartReftwo.current.destroy();
        }

        chartReftwo.current = new Chart(canvasReftwo.current, {
        type: "line",
        borderColor: "#2196F3",
        fiil:false,
        data: {
            labels,
            datasets: [
            {
                label: "Member Joined",
                data: dataPointstwo,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76,175,80,0.2)",
                // fill: true,
                tension: 0.3,
                pointRadius: 5,
            },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0, // whole numbers only
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Year Joined",
                },
            },
            },
            plugins: {
            legend: {
                position: "top",
            },
            },
        },
        });

        return () => {
        chartReftwo.current?.destroy();
        };
    }, [members]);
    


    // last service date 
    const lastService = attendances.map(a => a.date)[0];
     


    // flagged members 
    const presentMap = {};

    attendances.forEach(att => {
        Object.keys(att.present || {}).forEach(uuid => {
            presentMap[uuid] = (presentMap[uuid] || 0) + 1;
        });
    });

    const flaggedMembers = members
        .map(member => {
        const presentCount = presentMap[member._id] || 0;
        const absentCount = totalDays - presentCount;

            return {
                uuid: member.uuid,
                first_name: member.first_name,
                last_name: member.last_name,
                absentCount
            };
        })
      .filter(m => m.absentCount >= 3);
    
    // flagged members 
    

    // email handler
    
    async function  handleEmail(uuid, name) {
       

        let emailContent = {

            to: " ",
            subject: "Happy Birthday",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Happy Birthday 🎉</h2>

                    <img 
                        src="https://res.cloudinary.com/dje56ynku/image/upload/v1769553809/BIRTHDAY4-2_quzvji.png" 
                        alt="Happy Birthday"
                        style="width: 300px; margin: 20px 0;"
                    />

                    <p>
                        Dear <strong>${name.first_name} ${name.last_name}</strong>,
                    </p>

                    <p>
                        CCC Redemption Parish wishes you a Happy Birthday!
                    </p>

                    <p>
                        May your day be filled with happiness and memorable moments.
                    </p>
                </div>
            
            `,
            uuid: uuid

        }

        await sendEmail(emailContent)
        setMessage(`Birthday wish has been sent to ${name.first_name} ${name.last_name}`)
        setMessageOpen(true)
        setTimeout(() => {
            setMessageOpen(false)
        }, 3000)

    }
    // email handler
    

    
    return (
        <div id="dashboard-page" className="page p-6">
            <div className="mb-6 ">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-gray-600">Overview of CCC Redemption Parish</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* <!-- Total Members Card --> */}
                <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/members')}>
                    <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <i className="fas fa-users text-blue-600"></i>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
                            <p className="text-2xl font-semibold text-gray-800" id="total-members">{members.length}</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Attendance Rate Card --> */}
                <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/attendance')}>
                    <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <i className="fas fa-chart-line text-green-600"></i>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Attendance Rate</h3>
                            <p className="text-2xl font-semibold text-gray-800" id="attendance-rate">{overallRate}%</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Flagged Members Card --> */}
                <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/members')}>
                    <div className="flex items-center">
                        <div className="rounded-full bg-red-100 p-3">
                            <i className="fas fa-flag text-red-600"></i>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Flagged Members</h3>
                            <p className="text-2xl font-semibold text-gray-800" id="flagged-members">{flaggedMembers.length}</p>
                        </div>
                    </div>
                </div>

                {/* <!-- Expiring Documents Card --> */}
                <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/members')}>
                    <div className="flex items-center">
                        <div className="rounded-full bg-yellow-100 p-3">
                            <i className="fas fa-exclamation-triangle text-yellow-600"></i>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Expiring Documents</h3>
                            <p className="text-2xl font-semibold text-gray-800" id="expiring-documents">{expiringMemDoc.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* <!-- Enhanced Attendance Chart --> */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Analytics</h3>
                    <div className="h-100">
                        <canvas id="attendance-chart" ref={canvasRef}/>
                    </div>
                </div>

                {/* <!-- Upcoming Birthdays --> */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Birthdays</h3>
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 text-left text-sm font-medium text-gray-500">Name</th>
                                    <th className="py-2 text-left text-sm font-medium text-gray-500">Date</th>
                                    <th className="py-2 text-left text-sm font-medium text-gray-500">Days</th>
                                    <th className="py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="birthdays-table-body">
                                {
                                upcomingBirthdays.map((member) => {
                                    
                                    return(
                                        
                                        <tr className="border-b border-gray-200" key={member._id}>
                                            <td className="py-2 text-left text-sm font-medium text-gray-500" >{member.name?.first_name} {member.name?.last_name}</td>
                                            <td className="py-2 text-left text-sm font-medium text-gray-500" >{member.dob.slice(5, 10)}</td>
                                            <td className="py-2 text-left text-sm font-medium text-gray-500" >{ new Date(member.dob).getDate() - new Date().getDate() }</td>
                                            <td className="py-2 text-left text-sm font-medium text-gray-500" > <button onClick={() => handleEmail(member.uuid, member.name)}  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"> Send Mail </button>  </td>
                                        </tr>
                                    )
                                })

                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* <!-- Welfare Dashboard --> */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Welfare Unit Dashboard</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-blue-600 font-semibold text-sm">Members Needing Follow-up</div>
                            <div className="text-2xl font-bold text-blue-800" id="follow-up-count">{flaggedMembers.length}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-green-600 font-semibold text-sm">Recent Follow-ups</div>
                            <div className="text-2xl font-bold text-green-800" id="recent-followups">0</div>
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-40">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 text-left text-sm font-medium text-gray-500">Member</th>
                                    <th className="py-2 text-left text-sm font-medium text-gray-500">Last Service</th>
                                    <th className="py-2 text-left text-sm font-medium text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody id="welfare-table-body">
                                
                                <tr className="border-b border-gray-200">
                                    <td className="py-2 text-left text-sm font-medium text-gray-500" >{members.length}</td>
                                    <td className="py-2 text-left text-sm font-medium text-gray-500" >{lastService}</td>
                                    <td className="py-2 text-left text-sm font-medium text-gray-500" ></td>
                                </tr>
                                   
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* <!-- Member Demographics --> */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Demographics</h3>
                    <div className="h-64">
                        <canvas id="demographics-chart" ref={canvasReftwo}/>
                    </div>
                </div>
            </div>

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
    )
}

export default Dashboard