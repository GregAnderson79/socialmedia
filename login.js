import React from 'react'
import {useState,useContext} from 'react'
import {ContextUserData} from "./index.js"
import {ContextToast} from "./index.js"

// LOGIN
export default function LOGIN(props) {
    const [userData] = useContext(ContextUserData) // context user data
    const [, setToast] = useContext(ContextToast) // context toast
    const [email, setEmail] = useState() // user email
    const [password, setPassword] = useState() // user password
    const [formClasses, setFormClasses] = useState({email:"island_ipt",password:"island_ipt"}) // form classes
    const [btnClasses, setBtnClasses] = useState({email:"btn_disabled",password:"btn_disabled"}) // btn classes
    const [tglPwd, setTglPwd] = useState ({type:"password",class:"password_tgl"}) // toggle password / text view

    // EMAIL
    function handle_EMAIL(e) {
        RESETERRORS()
        setEmail(e.target.value)
        // email > 0
        if (e.target.value.length > 0) { 
            // validate...
            // correct email format? 
            if (e.target.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                // hide tip, enable btn
                setFormClasses(prev => ({email:"island_ipt",password:prev.password}))
                setBtnClasses(prev => ({email:"",password:prev.password}))
            } else {
                // show tip, disable btn
                setFormClasses(prev => ({email:"island_ipt form_tip",password:prev.password}))
                setBtnClasses(prev => ({email:"btn_disabled",password:prev.password}))
            }
        } else {
            // reset email state, disable btn
            setFormClasses(prev => ({email:"island_ipt",password:prev.password}))
            setBtnClasses(prev => ({email:"btn_disabled",password:prev.password}))
        }
    }

    // PASSWORD
    function handle_PASSWORD(e) {
        RESETERRORS()
        setPassword(e.target.value)
        // pwd > 0?
        if (e.target.value.length > 0) {
            // validate...      
            // pwd >= 8? 
            if (e.target.value.length >= 8) {
                // hide tip, enable btn
                setFormClasses(prev => ({email:prev.email,password:"island_ipt"}))
                setBtnClasses(prev => ({email:prev.email,password:""}))
            } else {
                // show tip, disable btn
                setFormClasses(prev => ({email:prev.email,password:"island_ipt form_tip"}))
                setBtnClasses(prev => ({email:prev.email,password:"btn_disabled"}))
            }
        } else {
            // reset pwd state, disable btn
            setFormClasses(prev => ({email:prev.email,password:"island_ipt"}))
            setBtnClasses(prev => ({email:prev.email,password:"btn_disabled"}))
        }
    }

    // LOGIN
    function handle_LOGIN(e) {
        e.preventDefault()

        // is email in the "database"?
        let validUser
        if (userData) {
            const validUserData = userData.filter(user => ((user.email===email) && (user.password===password)))
            if ((validUserData.length > 0) && (typeof validUserData[0]!=="undefined")) {
                localStorage.setItem('loggedInID',validUserData[0].userID) 
                validUser=true
            }
        }

        if (validUser===true) {
            props.setNav("wall")
        } else {
            // add form_error class to email
            setFormClasses(prev => ({email:prev.email + " form_error",password:prev.password + " form_error"}))
            setToast({msg:"Login not recognised!",class:"toast toast_red toast_open"})
        }
    }

    // RESET ERROR CLASS
    function RESETERRORS() {
        // remove form_error class from email
        if (formClasses.email.indexOf("form_error") >= 0) {
            setFormClasses(prev => ({email:prev.email.replace(" form_error",""),password:prev.password}))
        }

        if (formClasses.password.indexOf("form_error") >= 0) {
            setFormClasses(prev => ({email:prev.email,password:prev.password.replace(" form_error","")}))
        }
    }

    // Toggle password/text for password
    function handle_TGLPASSWORD() {
        if (tglPwd.type==="text") {
            setTglPwd({type:"password",class:"password_tgl"})
        } else {
            setTglPwd({type:"text",class:"password_tgl password_tgl_text"})
        }
    }

    // register
    function handle_REGISTER() {
        props.setNav("register")
    }

    return (
        <>
            <div className="island">
                <div className="island_hdr">Login</div>
                <form onSubmit={handle_LOGIN}>
                <div className="island_fx">
                    <div className="island_fi">
                        <div className={formClasses.email}>
                            <input type="text" placeholder="Email" value={email || ""} onChange={handle_EMAIL} />
                            <div><div className="form_tag">Hint - name@domain.com</div></div>
                        </div>
                    </div>
                    <div className="island_fi">
                        <div className={formClasses.password}>
                            <div className={tglPwd.class} onClick={handle_TGLPASSWORD}><span></span><span></span></div>
                            <input type={tglPwd.type} placeholder="Password" value={password || ""} onChange={handle_PASSWORD} />
                            <div><div className="form_tag">Hint - minimum 8 characters</div></div>
                        </div>
                        <div className="island_btns_fx2">
                            <span>Are you a new user? <span className="txt_link" onClick={handle_REGISTER}>Register</span></span>
                            <div className={btnClasses.email + " " + btnClasses.password}><button className="orange_btn">Login</button></div>
                        </div>
                    </div>
                </div>
                </form>
            </div>


 
            
            <div className="island_bg"></div>
        </>
    )
}