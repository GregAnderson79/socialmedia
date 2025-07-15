import React from 'react'
import {useState,useContext} from 'react'
import {ContextLoggedInID} from "./index.js"
import {ContextUserData} from "./index.js"
import {ContextToast} from "./index.js"

// PROFILE
export default function PROFILE(props) {
    const loggedInID = useContext(ContextLoggedInID) // context logged in id
    const [userData,setUserData] = useContext(ContextUserData) // context user data 
    const [, setToast] = useContext(ContextToast) // context toast

    // populate
    let loggedInName, loggedInAvatar, loggedInIntro
    if (loggedInID) {
        const loggedInUserData = userData.filter(user => (user.userID===loggedInID))
        if ((loggedInUserData.length > 0) && (typeof loggedInUserData[0]!=="undefined")) {
            loggedInName = loggedInUserData[0].name
            loggedInAvatar = loggedInUserData[0].avatar
            loggedInIntro = loggedInUserData[0].intro
        }
    }

    const [name, setName] = useState(loggedInName) // state name
    const [avatar, setAvatar] = useState(loggedInAvatar) // state avatar
    const [intro, setIntro] = useState(loggedInIntro) // state intro
    const [formClasses, setFormClasses] = useState("island_ipt") // state form classes
    const [btnState, setBtnState] = useState("btn_disabled") // btn state

    // NAME
    function handle_NAME(e) {
        // name > 0?
        if (e.target.value.length > 0) {
            setName(e.target.value)
            setBtnState("")
            // validate...      
            // name includes a space and is >= 7 chars?
            if ((e.target.value.length >= 7) && (e.target.value.indexOf(" ") >= 0)) {
                // hide tip, enable btn
                setFormClasses("island_ipt") 
            } else {
                // show tip, disable btn
                setFormClasses("island_ipt form_tip")
            }
        } else {
            setFormClasses("island_ipt")
            setBtnState("btn_disabled")
        }
    }

    // INTRO
    function handle_INTRO(e) {
        setIntro(e.target.value)
        setBtnState("")
    }

    // change (drag) avatar
    function handle_DRAGAVATAR(e) {
        e.preventDefault()
        const uplAvatar = e.dataTransfer.files[0];
        if (uplAvatar) {
            const reader = new FileReader()
            reader.onload = (e) => {setAvatar(reader.result)}
            reader.readAsDataURL(uplAvatar)
            setBtnState("")
        }
    }

    // change avatar
    function handle_CHANGEAVATAR(e) {
        const uplAvatar = e.target.files[0]
        if (uplAvatar) {
            const reader = new FileReader()
            reader.onload = (e) => {setAvatar(reader.result)}
            reader.readAsDataURL(uplAvatar)
            setBtnState("")
        }
    }

    // update profile
    function handle_UPDATEPROFILE(e) {
        e.preventDefault()
        const new_users = userData.map((user) => {
            if (parseInt(user.userID)===(loggedInID)) {
                return {...user,name:name,avatar:avatar,intro:intro};
            } else {
                return user
            }
        })
        setUserData(new_users)
        setBtnState("btn_disabled")
        setToast({msg:"Profile updated!",class:"toast toast_green toast_open"})
    }

    // cancel edit
    function handle_CANCELEDIT() {
        if (btnState==="btn_disabled") {
            confirm_CANCELEDIT()
        } else {
            const prompt=window.confirm("Are you sure you want to discard your changes?")
            if (prompt) {
                confirm_CANCELEDIT()
            }
        }
    }

    // cancel functionality
    function confirm_CANCELEDIT() {
        setName(loggedInName)
        setAvatar(loggedInAvatar)
        setIntro(loggedInIntro)
        props.setNav("")
    }

    // close
    function handle_CLOSE() {
        props.setNav("")
    }

    return (
        <>
            <div className="island">
                <div className="island_hdr">
                    <span>Profile</span>
                    <span className="island_close" onClick={handle_CLOSE}>&#10005;</span>
                </div>
                <form onSubmit={handle_UPDATEPROFILE}>
                    <div className="island_fx">
                        <div className="island_fi">
                            <div className="island_label">Your identity</div>
                            <div className="profile_fx">
                                <div className="profile_avatar">
                                    <label htmlFor="profile_avatar" onDragOver={(e) => e.preventDefault()} onDrop={handle_DRAGAVATAR}></label>
                                    <input type="file" id="profile_avatar" hidden accept=".png, .jpg, .jpeg .webp" onChange={handle_CHANGEAVATAR} />
                                    <img src={avatar || ""} alt={name.charAt(0)} />
                                </div>
                                <div className={formClasses}>
                                    <input type="text" value={name ||""} onChange={handle_NAME} />
                                    <div><div className="form_tag">Hint - Forename Surname</div></div>
                                </div>
                            </div>
                        </div>
                        <div className="island_fi">
                            <div className="island_label">Your introduction</div>
                            <div className="island_ipt">
                                <textarea className="profile_textarea" placeholder="Introduction" value={intro || ""} onChange={handle_INTRO} />
                            </div>
                            <div className="island_btns_fx">
                                <div className={btnState}><button className="orange_btn">Update profile</button></div>
                                <span className="grey_btn" onClick={handle_CANCELEDIT}>Cancel</span>
                            </div>
                            
                        </div>
                    </div>
                </form>
            </div>
            <div className="island_bg"></div>
        </>
    ) 
}