import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DialogPrenotazioneWeb from './DialogPrenotazioneWeb';
import { loadStripe } from '@stripe/stripe-js';
export default function CardPrenotazioneWeb(props) {
    const { nome, id, descrizione, immagine, servizio, labelButton, prodotti, codStruttura, Token, url, TokenNotify, idStripe } = props;
    const [expanded, setExpanded] = React.useState(false);


    const ExpandMore = styled((props) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
    })(({ theme }) => ({
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        variants: [
            {
                props: ({ expand }) => !expand,
                style: {
                    transform: 'rotate(0deg)',
                },
            },
            {
                props: ({ expand }) => !!expand,
                style: {
                    transform: 'rotate(180deg)',
                },
            },
        ],
    }));

    // Limite massimo di righe da mostrare di default
    const maxLines = 5;

    const handleExpandClick = () => {

        setExpanded(!expanded);
    };

    const prenota = () => {

        console.log(`prenoto: ${nome}`);
    };

    
    return (
        <Card sx={{ maxWidth: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            elevation={5}>
            <CardHeader title={nome} />
            <CardMedia
                component="img"
                //height="194"
                image={immagine}
                alt={nome}
                sx={{
                    //width: '100%',           // Occupa tutta la larghezza della card
                    //height: '200px',          // Altezza fissa per tutte le immagini
                    //objectFit: 'cover',       // Mantiene il rapporto d'aspetto e ritaglia l'immagine se necessario
                    //objectPosition: 'center'  // Centra l'immagine se viene ritagliata
                }}
            />
            <CardContent>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        display: '-webkit-box',
                        WebkitLineClamp: expanded ? 'none' : maxLines,  // Limita le righe solo se non è espanso
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {descrizione}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                {descrizione.length > 120 && (
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                )}
            </CardActions>
            <CardActions disableSpacing>
                
                <DialogPrenotazioneWeb prodotti={prodotti} servizi={servizio} labelButton={labelButton} codStruttura={codStruttura} Token={Token} url={url} TokenNotify={TokenNotify} idStripe={idStripe} />

            </CardActions>
        </Card>
    );
}
