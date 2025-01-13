import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LogoConcierge from "../assets/LogoConcierge.png";
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MapIcon from '@mui/icons-material/Map';

function NavbarAdmin(props) {
    const tab = props.tab;
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const name = sessionStorage.getItem('Username');

    const handleButtonEsci = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('codStruttura');
        navigateToLogin();
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <nav className="bg-sky-900 text-white fixed w-full top-0 p-3 z-10">
            <div className="flex justify-between items-center">
                <div className=' flex flex-row gap-2'>
                    <Link to="/Admin" className="font-bold text-xl">
                        <img
                            src={LogoConcierge}
                            alt="Logo"
                            width={65}
                            height={65}
                            className="  rounded-lg"
                        />
                    </Link>
                    <h3 className="flex flex-row font-medium text-white hover:text-white text-base">{name}</h3>
                </div>
                <div className="flex items-center md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="focus:outline-none text-white"
                    >
                        <svg
                            className="w-7 h-7 p-1 bg-blue-500 rounded-full"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                <ul
                    className={`${isMenuOpen ? 'block' : 'hidden'
                        } md:flex flex-col md:flex-row md:gap-4 md:items-center`}
                >

                    <li className={tab === "admin" ? " border-b-4 border-sky-600 p-0 " : ""}>
                        <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
                            <Link
                                className="flex flex-row font-bold text-white hover:text-white "
                                to={`/Admin`}
                            >
                                <SupervisorAccountIcon></SupervisorAccountIcon>
                                Admin
                            </Link>
                        </div>
                    </li>

                </ul>


                <div className="flex flex-row hover:scale-110 bg-red-600 hover:bg-red-800 p-1 rounded-lg transition-all font-semibold">

                    <button className=' flex flex-row' onClick={handleButtonEsci}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                            />
                        </svg>

                        Logout</button>
                </div>
            </div>
        </nav>
    );
}

export default NavbarAdmin;
