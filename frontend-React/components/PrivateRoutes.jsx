import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { useState } from "react";

import { useNotification } from '../context/NotificationContext.jsx';

function PrivateRoutes() {
    const { url } = useNotification();
    console.log(url)
    const [isForbidden, setIsForbidden] = useState('');
    const token = useAuth()

    const Token = sessionStorage.getItem('token');
    const codStruttura = sessionStorage.getItem("codStruttura");
    // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
    const requestOptions = {
        headers: {
          'Authorization': `Bearer ${Token}`
        }
      };

      //const url = `${urlDev}ristoranti/${codStruttura}`;    
      fetch(`${url}visita/${codStruttura}`, requestOptions)
        .then((response) => {
            console.log(`la response è : ${response.status}`)
            if (response.status == 403) {
                setIsForbidden(true)
            }
            else{
                setIsForbidden(false)
            }
        });

    //const token=true
    if(isForbidden){
        return <Navigate to='/login' />
    }else{
        return token ? <Outlet /> : <Navigate to='/login' />
    }
    
}

export default PrivateRoutes