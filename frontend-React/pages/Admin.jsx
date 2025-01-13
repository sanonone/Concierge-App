import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import PrivateRoutes from "../components/PrivateRoutes";
import NavbarAdmin from "../components/NavbarAdminResponcive";
import AdminCard from "../components/AdminCard";
import ScrollToTopButton from '../components/ScrollToTopButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import NuovoUtente from '../components/Mui/NuovoUtenteDialog'
import NuovoUtenteAdmin from '../components/Mui/NuovoUtenteAdminDialog'

function Admin(props) {
    const url = props.url
    const [users, setUsers] = useState([]);


    const getAllUsers = async () => {
        try {
            const token = sessionStorage.getItem('token');

            // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
            const requestOptions = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            fetch(`${url}auth/getAllUsers`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    //const filterData = data.filter(doc => doc.admin == false)
                    console.log("fatto")
                    setUsers(data)
                    //console.log(filterData);
                });

        } catch (error) {
            console.log(`errore: ${error}`)
        }

    };

    useEffect(() => {

        try {
            const token = sessionStorage.getItem('token');

            // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
            const requestOptions = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            fetch(`${url}auth/getAllUsers`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    //const filterData = data.filter(doc => doc.admin == false)
                    console.log("fatto")
                    setUsers(data)
                    //console.log(filterData);
                });

        } catch (error) {
            console.log(`errore: ${error}`)
        }

    }, []);

    return (
        <>
            <PrivateRoutes></PrivateRoutes>
            {/*<Navbar tab="hotel"></Navbar>*/}
            <NavbarAdmin tab="admin"></NavbarAdmin>
            <div className=" h-auto mt-16 flex flex-row">
                <h1 className=" text-sky-900 text-4xl font-bold p-6">Pannello Admin</h1>

            </div>
            <NuovoUtente url={url} getAllUsers={getAllUsers}></NuovoUtente>
            <NuovoUtenteAdmin url={url} getAllUsers={getAllUsers}></NuovoUtenteAdmin>
            <div className=" flex sm:flex-row flex-col bg-gray-200 border-y-2 border-gray-300 h-max justify-between ">

                <div className="  gap-0 m-auto">

                    <div className=" grid grid-cols-1 gap-5 m-8 ">
                        {users.map((ser) => (
                            <AdminCard
                                key={ser.id}
                                id={ser.id}
                                username={ser.username}
                                codStruttura={ser.codStruttura}
                                DBname={ser.DBname}
                                IdAzienda={ser.IdAzienda}
                                ipStruttura={ser.ipStruttura}
                                dataAttivazione={ser.dataAttivazione}
                                attivo={ser.attivo}
                                admin={ser.admin}
                                app={ser.app}
                                web={ser.web}
                                idStripe={ser.idStripe}
                                tipoConfigurazione={ser.tipoConfigurazione}
                                getAllUsers={getAllUsers}
                                url={url}
                            ></AdminCard>
                        ))}
                    </div>
                </div>

            </div>
            <ScrollToTopButton></ScrollToTopButton>
            <Footer></Footer>
        </>
    );
}

export default Admin;
