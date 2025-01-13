// Reports.js
import React, { useEffect, useState } from 'react';
import Navbar from "../components/NavbarResponcive";
import Footer from "../components/Footer";
import TabellaPrenotazioniServizi from "../components/Mui/TabellaPrenotazioniServizi";
import TabellaPrenotazioniProdotti from '../components/Mui/TabellaPrenotazioniProdotti';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useNotification } from "../context/NotificationContext";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PrivateRoutes from "../components/PrivateRoutes";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../components/Mui/TabPanel';

function Reports() {
    const { datiTabellaServizi, datiTabellaProdotti, fetchDynamicItems } = useNotification();
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchDynamicItems();
            setLoading(false);
        };
        loadData();
    }, [tabIndex]);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <PrivateRoutes></PrivateRoutes>
                <Navbar tab="reports" />
                <main className="flex-grow">
                    <div className="h-auto mt-16 flex flex-row">
                        <h1 className="text-sky-900 text-4xl font-bold p-6">Reports</h1>
                    </div>
                    <Tabs value={tabIndex} onChange={handleTabChange} centered>
                        <Tab label="Prenotazioni Servizi" />
                        <Tab label="Prenotazioni Ordini" />
                       {/* <Tab label="Altro Report 2" />*/}
                    </Tabs>
                    <TabPanel value={tabIndex} index={0}>
                        <TabellaPrenotazioniServizi dynamicItemsN={datiTabellaServizi} />
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <TabellaPrenotazioniProdotti dynamicItemsCarN={datiTabellaProdotti} />
                    </TabPanel>
                    {/*<TabPanel value={tabIndex} index={2}>
                        <TabellaPrenotazioniServizi dynamicItemsN={dynamicItemsN} />
                    </TabPanel>*/}

                    {/*loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <Typography variant="h6">Caricamento dati in corso...</Typography>
                        </Box>
                    ) : (
                        <div className="flex flex-col bg-gray-200 border-y-2 border-gray-300 h-max justify-between ">
                            <div className=" m-4 mb-20 shadow-lg">
                                <TabellaPrenotazioniServizi dynamicItemsN={dynamicItemsN} />
                            </div>

                        </div>
                    )*/}
                    <ScrollToTopButton />
                </main>
                <Footer />
            </div>
        </>
    );
}

export default Reports;
