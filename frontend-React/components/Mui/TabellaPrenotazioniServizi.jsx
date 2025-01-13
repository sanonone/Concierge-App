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
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { format, eachDayOfInterval } from 'date-fns';
import { Divider, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TabellaPrenotazioniServizi = (props) => {
    const dynamicItemsN = props.dynamicItemsN;
    const [expandedReservations, setExpandedReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [showFutureReservations, setShowFutureReservations] = useState(true);

    const [totale, setTotale] = useState('');// stato totale

    // Stati per i filtri
    const [dateFilter, setDateFilter] = useState('');
    const [cameraFilter, setCameraFilter] = useState('');
    const [servizioFilter, setServizioFilter] = useState('');
    const [nomePrenotanteFilter, setNomePrenotanteFilter] = useState('');
    const [statoFilter, setStatoFilter] = useState('');
    const [ivaFilter, setIvaFilter] = useState('');

    // Stati per conservare le opzioni disponibili nei select
    const [availableCameras, setAvailableCameras] = useState([]);
    const [availableServices, setAvailableServices] = useState([]);
    const [availablePrenotanti, setAvailablePrenotanti] = useState([]);

    const [loading, setLoading] = useState(true);
    const tableRef = useRef(null);


    const calcolaTotale = (reservations) => {
        let tot = 0;
        reservations
            .filter(reservation => reservation.isOriginal)  // Considera solo le prenotazioni originali
            .forEach((reservation) => {
                tot += reservation.totale;
            });
        setTotale(tot);
    }



    useEffect(() => {
        if (dynamicItemsN && dynamicItemsN.length > 0) {
            const expanded = dynamicItemsN.flatMap((reservation) => {
                const interval = eachDayOfInterval({
                    start: new Date(reservation.dataIni),
                    end: new Date(reservation.dataFin)
                });

                return interval.map((date, index) => ({
                    ...reservation,
                    dataIni: date.getTime(),
                    isOriginal: index === 0 // Il primo giorno è la prenotazione originale
                    //dataIni: reservation.dataIni,
                }));
            });

            // Ordina le prenotazioni per data (dataIni)
            const sorted = expanded.sort((a, b) => a.dataIni - b.dataIni);

            setExpandedReservations(sorted);

            const cameras = [...new Set(sorted.map(reservation => reservation.camera))];
            const services = [...new Set(sorted.map(reservation => reservation.nomeServizio))];
            const prenotanti = [...new Set(sorted.map(reservation => `${reservation.nomePrenotante} ${reservation.cognomePrenotante}`))];

            setAvailableCameras(cameras);
            setAvailableServices(services);
            setAvailablePrenotanti(prenotanti);

            // Applica il filtro iniziale
            handleFilterChange(sorted);

            setLoading(false);
        }
    }, [dynamicItemsN]);

    useEffect(() => {
        handleFilterChange(expandedReservations);
    }, [showFutureReservations, dateFilter, cameraFilter, servizioFilter, nomePrenotanteFilter, statoFilter, ivaFilter]);

    const formatDate = (timestamp) => format(new Date(timestamp), 'dd/MM/yyyy');

    const handleFilterChange = (reservations) => {
        const currentDate = Date.now();
        const sixtyDaysAgo = new Date().setDate(new Date().getDate() - 60);

        const filtered = reservations.filter((reservation) => {
            const isFutureReservation = reservation.dataIni >= currentDate;
            const isPastReservation = reservation.dataIni >= sixtyDaysAgo && reservation.dataIni < currentDate;

            const dateMatches = dateFilter ? formatDate(reservation.dataIni) === format(new Date(dateFilter), 'dd/MM/yyyy') : true;
            const cameraMatches = cameraFilter ? reservation.camera === cameraFilter : true;
            const servizioMatches = servizioFilter ? reservation.nomeServizio === servizioFilter : true;
            const nomePrenotanteMatches = nomePrenotanteFilter
                ? `${reservation.nomePrenotante} ${reservation.cognomePrenotante}` === nomePrenotanteFilter
                : true;
            const statoMatches = statoFilter ? reservation.stato === statoFilter : true;
            const ivaMatches = ivaFilter ? reservation.prodotto.ivaValue == ivaFilter : true

            const showReservation = showFutureReservations ? isFutureReservation : isPastReservation;

            return dateMatches && cameraMatches && servizioMatches && nomePrenotanteMatches && statoMatches && showReservation && ivaMatches;
        });

        setFilteredReservations(filtered);

        calcolaTotale(filtered)
    };

    const renderTableBody = () => {
        if (filteredReservations.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={9} align="center">Nessuna prenotazione trovata</TableCell>
                </TableRow>
            );
        }

        let lastDate = null;

        return filteredReservations.map((row, index) => {
            const currentDate = new Date(row.dataIni).toLocaleDateString();
            const isNewDate = lastDate !== currentDate;
            lastDate = currentDate;

            return (
                <React.Fragment key={index}>
                    {isNewDate && (
                        <TableRow>
                            <TableCell colSpan={13}>
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
                        <TableCell>{formatDate(row.dataIni)}</TableCell>
                        <TableCell>{row.nomePrenotante} {row.cognomePrenotante}</TableCell>
                        <TableCell>{row.mail}<br />{row.telefono}</TableCell>
                        <TableCell>{row.camera}</TableCell>
                        <TableCell>{row.nomeServizio}</TableCell>
                        <TableCell>{row.prodotto.label} = €{row.totale}</TableCell>
                        <TableCell>{row.prodotto.ivaLabel}</TableCell>
                        <TableCell>{row.quantita}</TableCell>
                        <TableCell>{row.stato}</TableCell>
                        <TableCell>{row.ora.label}</TableCell>
                        <TableCell>{formatDate(row.dataIni)} - {formatDate(row.dataFin)}</TableCell>
                        <TableCell>{row.richieste || 'N/A'}</TableCell>
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

            pdf.save('prenotazioni.pdf');
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
        <div className='flex-auto' ref={tableRef}>
            {/* Filtri */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={showFutureReservations}
                            onChange={(e) => setShowFutureReservations(e.target.checked)}
                            color="primary"
                        />
                    }
                    //label="Mostra Prenotazioni Future"
                    label={showFutureReservations ? "Mostra Prenotazioni Future" : "Mostra Prenotazioni Passate"}
                />
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
                    value={servizioFilter}
                    onChange={(e) => setServizioFilter(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">
                        <em>Tutti i Servizi</em>
                    </MenuItem>
                    {availableServices.map((service, index) => (
                        <MenuItem key={index} value={service}>
                            {service}
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
                    <MenuItem value="attesa">Attesa</MenuItem>
                    <MenuItem value="confermata">Confermata</MenuItem>
                    <MenuItem value="rifiutata">Rifiutata</MenuItem>
                    <MenuItem value="paga Stripe">pagato Stripe</MenuItem>
                    <MenuItem value="acconto Stripe">acconto Stripe</MenuItem>
                </Select>

                <Select
                    value={ivaFilter}
                    onChange={(e) => setIvaFilter(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">
                        <em>Ogni Iva</em>
                    </MenuItem>
                    <MenuItem value="4">4%</MenuItem>
                    <MenuItem value="10">10%</MenuItem>
                    <MenuItem value="22">22%</MenuItem>
                    <MenuItem value="esente">Esente</MenuItem>
                </Select>
            </Box>

            {/* Bottone per esportare in PDF */}
            <Button variant="contained" color="primary" onClick={exportPDF} sx={{ mb: 2 }}>
                Esporta in PDF
            </Button>

            <h2 class="text-3xl font-bold text-blue-800 hover:text-blue-600 transition duration-300 ease-in-out my-6 ">
                Totale = €{totale}
            </h2>
            {/* Contenitore della tabella */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell>Nome Prenotante</TableCell>
                            <TableCell>Contatti</TableCell>
                            <TableCell>Camera</TableCell>
                            <TableCell>Servizio</TableCell>
                            <TableCell>Prodotto</TableCell>
                            <TableCell>Iva</TableCell>
                            <TableCell>Quantità</TableCell>
                            <TableCell>Stato</TableCell>
                            <TableCell>Orario</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Richiesta</TableCell>
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

export default TabellaPrenotazioniServizi;
