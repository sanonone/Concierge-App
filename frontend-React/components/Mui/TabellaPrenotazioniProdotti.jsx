import React, { useState, useEffect, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Divider, FormControlLabel, Select, MenuItem, TextField, Switch } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

const TabellaPrenotazioniProdotti = (props) => {
    const prenotazioni = props.dynamicItemsCarN;
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const tableRef = useRef(null);

    const [totale, setTotale] = useState('');// stato totale

    // Stati per i filtri
    const [dateFilter, setDateFilter] = useState('');
    const [cameraFilter, setCameraFilter] = useState('');
    const [statoFilter, setStatoFilter] = useState('');
    const [nomePrenotanteFilter, setNomePrenotanteFilter] = useState('');
    const [showFutureReservations, setShowFutureReservations] = useState(false);

    // Stati per conservare le opzioni disponibili nei select
    const [availableCameras, setAvailableCameras] = useState([]);
    const [availablePrenotanti, setAvailablePrenotanti] = useState([]);
    const [availableStates, setAvailableStates] = useState([]);  // Nuovo stato per gli stati disponibili

    useEffect(() => {
        if (prenotazioni && prenotazioni.length > 0) {
            const sortedReservations = prenotazioni.sort((a, b) => a.dataGestione - b.dataGestione);
            const cameras = [...new Set(sortedReservations.map(reservation => reservation.camera))];
            const prenotanti = [...new Set(sortedReservations.map(reservation => reservation.anagrafica))];
            const states = [...new Set(sortedReservations.map(reservation => reservation.stato))]; // Estrai gli stati unici

            setAvailableCameras(cameras);
            setAvailablePrenotanti(prenotanti);
            setAvailableStates(states);  // Imposta gli stati disponibili

            // Applica il filtro iniziale
            handleFilterChange(sortedReservations);

            setLoading(false);
        }
    }, [prenotazioni]);

    useEffect(() => {
        handleFilterChange(prenotazioni);
    }, [dateFilter, cameraFilter, statoFilter, nomePrenotanteFilter, showFutureReservations]);

    useEffect(() => {
        //calcolaTotale(filteredReservations)
    }, [dateFilter, cameraFilter, statoFilter, nomePrenotanteFilter, showFutureReservations]);

    const calcolaTotale = (reservations) => {
        let tot = 0;
        console.log("CALCOLO")
        for (let ele of reservations) {
            console.log(`Nome: ${ele.anagrafica}`)
            for (let prodotto of ele.prodotti) {
                console.log(`articolo: ${prodotto.Descrizione} prezzo: ${prodotto.PrezzoListino}`)
                tot = tot + (prodotto.PrezzoListino * prodotto.nEle)
                console.log(`Il totale è: ${tot}`)
            }
        }
        setTotale(tot)
    }

    const handleFilterChange = (reservations) => {
        const currentDate = Date.now();
        const sixtyDaysAgo = new Date().setDate(new Date().getDate() - 60);

        const filtered = reservations.filter((reservation) => {
            const isFutureReservation = reservation.dataGestione >= currentDate;
            const isPastReservation = reservation.dataGestione >= sixtyDaysAgo && reservation.dataGestione <= currentDate;

            const dateMatches = dateFilter ? format(new Date(reservation.dataGestione), 'yyyy-MM-dd') === dateFilter : true;
            const cameraMatches = cameraFilter ? reservation.camera === cameraFilter : true;
            const statoMatches = statoFilter ? reservation.stato === statoFilter : true;
            const nomePrenotanteMatches = nomePrenotanteFilter ? reservation.anagrafica === nomePrenotanteFilter : true;

            const showReservation = showFutureReservations ? isFutureReservation : isPastReservation;

            return dateMatches && cameraMatches && statoMatches && nomePrenotanteMatches && showReservation;
        });

        setFilteredReservations(filtered);
        calcolaTotale(filtered)
    };

    const formatDate = (timestamp) => format(new Date(timestamp), 'dd/MM/yyyy HH:mm');

    const renderTableBody = () => {
        if (filteredReservations.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} align="center">Nessuna prenotazione trovata</TableCell>
                </TableRow>
            );
        }

        let lastDate = null;

        return filteredReservations.map((row, index) => {
            const currentDate = new Date(row.dataGestione).toLocaleDateString();
            const isNewDate = lastDate !== currentDate;
            lastDate = currentDate;

            return (
                <React.Fragment key={index}>
                    {isNewDate && (
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                                    <Divider sx={{
                                        width: '100%', borderBottomWidth: 2, borderColor: 'black',  // Colore del divisore
                                        borderWidth: 2,       // Spessore del divisore
                                        mb: 1,                // Margine sotto il divisore
                                        mt: 1                 // Margine sopra il divisore
                                    }} />
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell>{formatDate(row.dataGestione)}</TableCell>
                        <TableCell>{row.anagrafica}</TableCell>
                        <TableCell>{row.camera}</TableCell>
                        <TableCell>
                            {row.prodotti.map((prodotto, i) => (
                                <div key={i}>
                                    {prodotto.Descrizione} x {prodotto.nEle} = €{prodotto.PrezzoLordo * prodotto.nEle.toFixed(2)}, Iva:{prodotto.labelIva}, note:{prodotto.note || 'N/A'}
                                </div>
                            ))}
                        </TableCell>
                        <TableCell>{row.stato}</TableCell>
                        <TableCell>{row.messaggio || 'N/A'}</TableCell>
                    </TableRow>
                </React.Fragment>
            );
        });
    };

    const exportPDF = () => {
        if (!tableRef.current) {
            console.error("Table reference is not available.");
            return;
        }

        html2canvas(tableRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('prenotazioni_prodotti.pdf');
        }).catch((error) => {
            console.error("Error capturing table:", error);
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div ref={tableRef}>
            {/* Filtri */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {/*<FormControlLabel
                    control={
                        <Switch
                            checked={showFutureReservations}
                            onChange={(e) => setShowFutureReservations(e.target.checked)}
                            color="primary"
                        />
                    }
                    label={showFutureReservations ? "Mostra Prenotazioni Future" : "Mostra Prenotazioni Passate"}
                />*/}
                <TextField
                    label="Data"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
                <Select
                    value={cameraFilter}
                    onChange={(e) => setCameraFilter(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">
                        <em>Tutte le Camere</em>
                    </MenuItem>
                    {availableCameras.map((camera, index) => (
                        <MenuItem key={index} value={camera}>
                            {camera}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    value={nomePrenotanteFilter}
                    onChange={(e) => setNomePrenotanteFilter(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">
                        <em>Tutti i Prenotanti</em>
                    </MenuItem>
                    {availablePrenotanti.map((prenotante, index) => (
                        <MenuItem key={index} value={prenotante}>
                            {prenotante}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    value={statoFilter}
                    onChange={(e) => setStatoFilter(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">
                        <em>Tutti gli Stati</em>
                    </MenuItem>
                    {availableStates.map((stato, index) => ( // Usa gli stati disponibili
                        <MenuItem key={index} value={stato}>
                            {stato}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Bottone per esportare in PDF */}
            <Box sx={{ mt: 2, mb: 2 }}>
                <Button variant="contained" color="primary" onClick={exportPDF}>
                    Esporta PDF
                </Button>
            </Box>

            <h2 class="text-3xl font-bold text-blue-800 hover:text-blue-600 transition duration-300 ease-in-out my-6 ">
                Totale = €{totale}
            </h2>

            {/* Tabella */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Data Gestione</TableCell>
                            <TableCell>Prenotante</TableCell>
                            <TableCell>Camera</TableCell>
                            <TableCell>Prodotti</TableCell>
                            <TableCell>Stato</TableCell>
                            <TableCell>Risposta</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderTableBody()}
                    </TableBody>
                </Table>
            </TableContainer>


        </div>
    );
};

export default TabellaPrenotazioniProdotti;
