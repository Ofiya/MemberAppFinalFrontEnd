import Sidebar from './Sidebar'
import NavBar from './Navbar'
import { useNavigate } from 'react-router'
import { Outlet } from "react-router-dom"
import { useEffect } from 'react'


const Layout = () => {

    return (
        <div id="app" className="h-screen flex flex-col">
            
            <NavBar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                
                <main className="content-area flex-1 overflow-y-scroll">
                    <Outlet/>
                </main>
                
            </div>
        </div>
    )
}




// const Layout = ({ children }) => { 


//     return (
//         <div id="app" className="h-screen flex flex-col">
            
//             <NavBar />
//             <div className="flex flex-1 overflow-hidden">
//                 <Sidebar />
                
//                 <main className="content-area flex-1 overflow-y-scroll">
//                     {children}
//                 </main>
                
//             </div>
//         </div>
//     )
// }

export default Layout
