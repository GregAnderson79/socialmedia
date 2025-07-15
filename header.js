import React from 'react'
import {useState,useContext} from 'react'
import {ContextLoggedInID} from "./index.js"
import {ContextUserData} from "./index.js"

// HEADER
export default function HEADER(props) {
    const loggedInID = useContext(ContextLoggedInID) // context logged in id
    const [userData] = useContext(ContextUserData) // context user data

    // user name, avatar
    let loggedInName=""
    let loggedInAvatar=""
    
    if (loggedInID) {
        for (let i = 0; i < userData.length; i++) {
            if (loggedInID===userData[i].userID) {
                loggedInName = userData[i].name
                loggedInAvatar = userData[i].avatar
            }
        }
    }

    // open/close pnl
    const [pnlState,setPnlState] = useState()
    function handle_PANEL() {
        setPnlState(!pnlState)
    }

    // log out
    function handle_LOGOUT() {
        props.setNav("logout")
        setPnlState(!pnlState)
    }

    // profile
    function handle_PROFILE() {
        props.setNav("profile")
        setPnlState(!pnlState)
    }

    // settings
    function handle_SETTINGS() {
        props.setNav("settings")
        setPnlState(!pnlState)
    }
      
    return (
        <div className="header">
            <div className="header_logo"><img src={"images/hdr_logo.png"} alt="SocialMedia.com" /></div>
            {loggedInID &&
                <div className={pnlState ? "header_user header_user_open" : "header_user"}>
                    <div className="header_user_bg">
                        <div className="header_user_pnl" onClick={handle_PANEL}>
                            <div className="header_name">{loggedInName}</div>
                            <div className="header_avatar"><img src={loggedInAvatar} alt={loggedInName.charAt(0)} /></div>
                        </div>
                    </div>
                    <div className="header_user_dd">
                        <ul>
                        <li><span className="txt_link" onClick={handle_PROFILE}>Profile</span></li>
                        <li><span className="txt_link" onClick={handle_SETTINGS}>Settings</span></li>
                        <li><span className="txt_link" onClick={handle_LOGOUT}>logout</span></li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    )
}