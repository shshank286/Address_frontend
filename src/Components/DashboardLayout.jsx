import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
import { SiGoogleforms } from "react-icons/si";
import { RiAdminFill } from "react-icons/ri";
import { FaUniversity, FaBookOpen, FaBlogger } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FaWpforms } from "react-icons/fa";
import img1 from "../assets/images/fimage.png";
const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { profile } = useSelector((state) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };




    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.logout();
            if (response.status === 200 || response.status === 204) {
                dispatch(logout());
                localStorage.removeItem('token');
                toast.success('Logout Successful');
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);

            }
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };


    return (
        <div className="flex h-screen">
            <aside className={`h-full bg-gray-800 text-white p-4 transition-width duration-400 ${sidebarOpen ? 'w-64' : 'w-25 overflow-hidden '}`}>
                {sidebarOpen && <h2 className="text-lg font-bold mb-4 ml-5">CAREER INITIATIVE</h2>}
                <nav>
                    <ul>
                        <li>
                            <Link
                                to="/admin-dashboard"
                                className="flex items-center p-2 mt-10 text-white hover:bg-blue-500 rounded transition duration-200"
                            >
                                <MdDashboard size={sidebarOpen ? 30 : 40} className="mr-2" />
                                {sidebarOpen && <span className="ml-2">Dashboard</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/colleges"
                                className="flex items-center p-2 mt-5 text-white hover:bg-blue-500 rounded transition duration-200"
                            >
                                <FaUniversity size={sidebarOpen ? 30 : 40} className="mr-2" />
                                {sidebarOpen && <span className="ml-2">Colleges</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/counselling"
                                className="flex items-center p-2 mt-5 text-white hover:bg-blue-500 rounded transition duration-200"
                            >
                                <FaWpforms size={sidebarOpen ? 30 : 40} className="mr-2" />
                                {sidebarOpen && <span className="ml-2">Counselling</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/courses"
                                className="flex items-center p-2 mt-5 text-white hover:bg-blue-500 rounded transition duration-200"
                            >
                                <FaBookOpen size={sidebarOpen ? 30 : 40} className="mr-2" />
                                {sidebarOpen && <span className="ml-2">Courses</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/blogs"
                                className="flex items-center p-2 mt-5 text-white hover:bg-blue-500 rounded transition duration-200"
                            >
                                <FaBlogger size={sidebarOpen ? 30 : 40} className="mr-2" />
                                {sidebarOpen && <span className="ml-2">Blogs</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/counselling"
                                className="flex items-center p-2 mt-5 text-white hover:bg-blue-500 rounded transition duration-200"
                            >
                                <SiGoogleforms size={sidebarOpen ? 30 : 40} className="mr-2" />
                                {sidebarOpen && <span className="ml-2">Counselling</span>}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/admin-dashboard/counselling"
                                className="flex items-center p-2 mt-5 text-white hover:bg-blue-500 rounded transition duration-200"
                            >
                                <RiAdminFill size={sidebarOpen ? 30 : 40} className="mr-2" />
                                {sidebarOpen && <span className="ml-2">Users</span>}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
                    <div className="flex items-center">
                        <div
                            onClick={toggleSidebar}
                            className="cursor-pointer mr-2 transition-transform duration-300"
                        >
                            {sidebarOpen ? <FaArrowLeft size={20} /> : <GiHamburgerMenu size={20} />}
                        </div>
                        <h1 className={`text-lg transition-opacity duration-300`}>
                            Dashboard
                        </h1>
                    </div>
                    <Menu as="div" className="relative ml-3">
                        <div>
                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <img
                                    alt=""
                                    src={img1}
                                    className="h-8 w-8 rounded-full"
                                />
                            </MenuButton>
                        </div>
                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
                        >
                            <MenuItem>
                                <Link to="/admin-dashboard/profile"
                                    className="block px-4 py-2 text-sm text-gray-700">
                                    My Profile
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-sm text-gray-700">
                                    Logout
                                </Link>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </header>
                <main className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                    <ToastContainer />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;