import React from 'react'
import ReactDOM from 'react-dom'
import {StrictMode,useState,useEffect,createContext} from 'react'
import './styles.css';
import HEADER from './header.js'
import PROFILE from './profile.js'
import SETTINGS from './settings.js'
import WALL from './wall.js'
import LOGIN from './login.js'
import REGISTER from './register.js'
import TOAST from './toast.js'
import { createRoot } from 'react-dom/client';

export const ContextLoggedInID = createContext(null) // context login
export const ContextUserData = createContext(null) // context user data
export const ContextToast = createContext(null) // context toast

const root = createRoot(document.getElementById('root')); 
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)

function App() {
  const loggedInID = JSON.parse(localStorage.getItem("loggedInID")) // is someone logged in?
  const [nav,setNav] = useState("") // page nav

  // users data
  const BACKUP_USERS = [{key:"1234567890",userID:"1234567890",name:"Greg Anderson",email:"greg@greganderson.co.uk",password:"letmein123",avatar:"",intro:"Greg Anderson - author of the app"}]
  const SAVED_USERS = JSON.parse(localStorage.getItem("SAVED_USERS"))
  const [userData, setUserData] = useState(SAVED_USERS || BACKUP_USERS)
  // update data on change
  useEffect(() => {
      localStorage.setItem("SAVED_USERS", JSON.stringify(userData))
  }, [userData])

  // toast
  const [toast,setToast] = useState({msg:"",class:"toast"})

  return (
    <ContextLoggedInID.Provider value={loggedInID}>
      <ContextUserData.Provider value={[userData,setUserData]}>
        <ContextToast.Provider value={[toast,setToast]}>
          <HEADER setNav={setNav} />
          {loggedInID ? (
            <>
              {(() => {
                switch (nav) {
                  case "profile":
                    return <PROFILE setNav={setNav} />
                  case "settings":
                    return <SETTINGS setNav={setNav} />
                  case "logout":
                    localStorage.removeItem("loggedInID")
                    break
                  default:
                    return null
                }
              })()}
              <WALL />
            </>
          ) : (
            (() => {
              switch (nav) {
                case "register":
                  return <REGISTER setNav={setNav} />
                default:
                  return <LOGIN setNav={setNav} />
              }
            })()
          )} 
          <TOAST toast={toast} setToast={setToast} />
        </ContextToast.Provider>
      </ContextUserData.Provider>
    </ContextLoggedInID.Provider>
  )
}



