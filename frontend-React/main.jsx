import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Eventi from './pages/Eventi.jsx'
import Servizi from './pages/Servizi.jsx'
import Ristoranti from './pages/Ristoranti.jsx'
import Visita from './pages/Visita.jsx'
import Settings from './pages/Settings.jsx'
import Hotel from './pages/Hotel.jsx'
import Card from './pages/Card.jsx'
import Prodotti from './pages/Prodotti.jsx'
import Reports from './pages/Reports.jsx'
import LoginPage from './pages/LoginPages.jsx'
import Admin from './pages/Admin.jsx'
import Refresh from './pages/stripe/Refresh.jsx'
import Return from './pages/stripe/Return.jsx'
import Success from './pages/stripe/Success.jsx'
import Cancel from './pages/stripe/Cancel.jsx'
import PrenotazioneWeb from './pages/PrenotazioneWeb.jsx'
import CardsChildren from './pages/CardsChildren.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NotificationProvider } from './context/NotificationContext.jsx'

//const url="https://europe-west1-fir-autenticazione-d201f.cloudfunctions.net/api/"
const url = "http://localhost:3000/"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage url={url}></LoginPage>
  },
  {
    path: "/",
    element: <App url={url}></App>
  },
  {
    path: "/hotel",
    element: <Hotel url={url}></Hotel>,
  },
  {
    path: "/Eventi",
    element: <Eventi url={url}></Eventi>
  },

  {
    path: "/Servizi",
    element: <Servizi url={url}></Servizi>
  },

  {
    path: "/Ristoranti",
    element: <Ristoranti url={url}></Ristoranti>
  },
  {
    path: "/Visita",
    element: <Visita url={url}></Visita>
  },

  {
    path: "/Prodotti",
    element: <Prodotti url={url}></Prodotti>
  },

  {
    path: "/Reports",
    element: <Reports url={url}></Reports>
  },

  {
    path: "/Settings",
    element: <Settings url={url}></Settings>
  },

  {
    path: "/Admin",
    element: <Admin url={url}></Admin>
  },

  {
    path: "/PrenotazioneWeb/:codStruttura",
    element: <PrenotazioneWeb url={url}></PrenotazioneWeb>
  },

  {
    path: "/refresh/:connectedAccountId",
    element: <Refresh />,
  },
  
  {
    path: "/return/:connectedAccountId",
    element: <Return />,
  },

  {
    path: "/success",
    element: <Success />,
  },
  
  {
    path: "/cancel",
    element: <Cancel />,
  },


  {
    path: "/Cards-Children",
    element: <CardsChildren></CardsChildren>,
    children: [
      {
        path: "cardID",
        element: <Card></Card>
      }
    ]
  },
])

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*<App />*/}
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  </React.StrictMode>,
)
