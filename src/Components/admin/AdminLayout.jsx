import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout } from "../../Context/authSlice";
import logo from "../../assets/images/logo.png";
import { FaHome, FaUser, FaClipboardList, FaNewspaper, FaRegEnvelope, FaMoneyCheckAlt, FaCog, FaPowerOff } from "react-icons/fa";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { IoIosMail } from "react-icons/io";
import { MdQuiz } from "react-icons/md";


const AdminLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        dispatch(logout());
        navigate("/admin");
        toast.success("Logged out successfully");
    };

    return (
        <div className="">
            <Toaster />
            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className="w-64 bg-[#e6e6e5] h-full flex flex-col">
                    <div className="flex items-center justify-center p-7 ">
                        <img src={logo} alt="Logo" className="h-12 w-12 hidden" />
                    </div>
                    <nav className="p-2">
                        <ul>
                            <li>
                                <Link
                                    to="/admin-dashboard/"
                                    className={`flex justify-start items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/") ? "bg-[#D6043C] text-white" : "text-black"
                                        }`}
                                >
                                    <FaHome className="mr-3" size={18} />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin-dashboard/users"
                                    className={`flex justify-start items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/users") ? "bg-[#D6043C] text-white" : "text-black"
                                        }`}
                                >
                                    <FaUser className="mr-3" size={18} />
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin-dashboard/quiz"
                                    className={`flex justify-start items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/quiz") ? "bg-[#D6043C] text-white" : "text-black"
                                        }`}
                                >
                                    <FaClipboardList className="mr-3" size={18} />
                                    Quiz
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin-dashboard/news"
                                    className={`flex justify-start items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/news") ? "bg-[#D6043C] text-white" : "text-black"
                                        }`}
                                >
                                    <FaNewspaper className="mr-3" size={18} />
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin-dashboard/subscription"
                                    className={`flex justify-start items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/subscription") ? "bg-[#D6043C] text-white" : "text-black"
                                        }`}
                                >
                                    <FaMoneyCheckAlt className="mr-3" size={18} />
                                    Subscription
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin-dashboard/contact"
                                    className={`flex justify-start items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/contact") ? "bg-[#D6043C] text-white" : "text-black"
                                        }`}
                                >
                                    <IoIosMail className="mr-3" size={21} />
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin-dashboard/edit-prompt"
                                    className={`flex justify-start items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/edit-prompt") ? "bg-[#D6043C] text-white" : "text-black"
                                        }`}
                                >
                                    <MdQuiz className="mr-3" size={20} />
                                    Quiz Prompt
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <hr className="h-[1px] bg-white mt-10 m-2" />
                    <Link
                        className={`flex items-center p-7 ml-4 pb-7 font-semibold border-t border-gray-400  mr-7 transition duration-200 cursor-default `}
                    >
                        Account
                    </Link>
                    <Link
                        to="/admin-dashboard/settings"
                        className={`flex items-center p-2 ml-6 mr-4 font-bold font-jost rounded transition duration-200 ${isActive("/admin-dashboard/settings")
                            ? "bg-gray-300 text-black"
                            : "text-black"
                            }`}
                    >
                        <FaCog className="mr-3" size={18} />
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-start ml-6 p-2 mt-1 mr-4 font-bold font-jost rounded transition duration-200"
                    >
                        <FaPowerOff className="mr-3" size={18} />
                        Logout
                    </button>
                </aside>

                {/* Content Area */}
                <div className="flex-1 flex flex-col">
                    <header className="flex flex-col justify-between items-center p-4 bg-gray-50 text-white border-b border-b-gray-300">
                        <h4 className="ml-[8rem] text-black font-kaushan">Your Voice, Your Power</h4>
                        <img src={logo} alt="" className="h-9" />
                    </header>

                    <main className="flex-1 overflow-y-auto">
                        <Outlet />
                        <ToastContainer />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
