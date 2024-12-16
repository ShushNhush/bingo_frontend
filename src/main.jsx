import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GameRoom from './components/GameRoom.jsx'
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider} from 'react-router-dom'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<App />}>

    </Route>
    <Route path='/rooms/:urlNumber' element={<GameRoom/>}/>
    
</>
  )
);


ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  //</React.StrictMode>
);

