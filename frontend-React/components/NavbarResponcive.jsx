import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LogoConcierge from "../assets/LogoConcierge.png";
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Badge from '@mui/material/Badge';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useNotification } from '../context/NotificationContext.jsx'
import StorefrontIcon from '@mui/icons-material/Storefront';
import RestaurantIcon from '@mui/icons-material/Restaurant';

function Navbar(props) {
  const tab = props.tab;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const name = sessionStorage.getItem('Username');
  const { noMostraBadge, vediBadge } = useNotification();
  console.log("vediBadge value: ", vediBadge); // Add this line for debugging
  const config = sessionStorage.getItem('tipoConfigurazione');

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
        <div className=' flex flex-row gap-1'>
          <Link to="/" className="font-bold text-xl">
            <img
              src={LogoConcierge}
              alt="Logo"
              width={65}
              height={65}
              className=" rounded-lg"
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
            } md:flex flex-col md:flex-row md:gap-1 md:items-center`}
        >
          <li className={tab === "home" ? "border-b-4 border-sky-600 p-0" : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/`}
              >
                {vediBadge ?
                  (
                    <Badge badgeContent={"New"} color="error">
                      <HomeOutlinedIcon></HomeOutlinedIcon>
                    </Badge>
                  ) : <HomeOutlinedIcon></HomeOutlinedIcon>
                }
                Home
              </Link>
            </div>
          </li>
          <li className={tab === "hotel" ? " border-b-4 border-sky-600 p-0 " : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white "
                to={`/hotel`}
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                Hotel
              </Link>
            </div>
          </li>
          <li className={tab === "eventi" ? " border-b-4 border-sky-600 p-0 " : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/eventi`}
              >
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                Eventi
              </Link>
            </div>
          </li>
          <li className={tab === "servizi" ? "border-b-4 border-sky-600 p-0" : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/servizi`}
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                  />
                </svg>
                Servizi
              </Link>
            </div>
          </li>
          <li className={tab === "ristoranti" ? "border-b-4 border-sky-600 p-0" : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/ristoranti`}
              >
                
                <RestaurantIcon></RestaurantIcon>
                Ristoranti
              </Link>
            </div>
          </li>

          <li className={tab === "visita" ? "border-b-4 border-sky-600 p-0" : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/visita`}
              >
                <MapIcon></MapIcon>
                Da Visitare
              </Link>
            </div>
          </li>

          { config=="Standard" ? <li className={tab === "prodotti" ? "border-b-4 border-sky-600 p-0" : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/prodotti`}
              >
                <StorefrontIcon></StorefrontIcon>
                Prodotti
              </Link>
            </div>
          </li>
           : config=="Suite" ? null : 
           null
           }

          <li className={tab === "reports" ? "border-b-4 border-sky-600 p-0" : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/reports`}
              >
                <AssessmentIcon></AssessmentIcon>
                Reports
              </Link>
            </div>
          </li>

          <li className={tab === "settings" ? "border-b-4 border-sky-600 p-0" : ""}>
            <div className="flex hover:scale-110 hover:bg-sky-600 p-1 rounded-lg transition-all">
              <Link
                className="flex flex-row font-bold text-white hover:text-white"
                to={`/settings`}
              >
                <SettingsIcon></SettingsIcon>
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

export default Navbar;
