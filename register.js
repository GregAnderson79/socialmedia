import React from 'react'
import {useState,useContext} from 'react'
import {ContextUserData} from "./index.js"
import {ContextToast} from "./index.js"

// REGISTER
export default function REGISTER(props) {
    const [userData,setUserData] = useContext(ContextUserData) // context user data
    const [, setToast] = useContext(ContextToast) // context toast
    const [name, setName] = useState() // user name
    const [email, setEmail] = useState() // user email
    const [password, setPassword] = useState() // user password
    const [intro, setIntro] = useState() // user intro
    const [formClasses, setFormClasses] = useState({name:"island_ipt",email:"island_ipt",password:"island_ipt"}) // form classes
    const [btnClasses, setBtnClasses] = useState({name:"btn_disabled",email:"btn_disabled",password:"btn_disabled"}) // btn classes
    const [tglPwd, setTglPwd] = useState ({type:"password",class:"password_tgl"}) // toggle password / text view

    // NAME
    function handle_NAME(e) {
        // name > 0?
        setName(e.target.value)
        if (e.target.value.length > 0) {
            // validate...      
            // name includes a space and is >= 7 chars?
            if ((e.target.value.length >= 7) && (e.target.value.indexOf(" ") >= 0)) {
                // hide tip, enable btn
                setFormClasses(prev => ({name:"island_ipt",email:prev.email,password:prev.password}))
                setBtnClasses(prev => ({name:"",email:prev.email,password:prev.password}))
            } else {
                // show tip, disable btn
                setFormClasses(prev => ({name:"island_ipt form_tip",email:prev.email,password:prev.password}))
                setBtnClasses(prev => ({name:"btn_disabled",email:prev.email,password:prev.password}))
            }
        } else {
            // reset name state, disable btn
            setFormClasses(prev => ({name:"island_ipt",email:prev.email,password:prev.password}))
            setBtnClasses(prev => ({name:"btn_disabled",email:prev.email,password:prev.password}))
        }
    }

    // EMAIL
    function handle_EMAIL(e) {
        RESETERRORS()
        // email > 0
        setEmail(e.target.value)
        if (e.target.value.length > 0) { 
            // validate...      
            // correct email format? 
            if (e.target.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                // hide tip, enable btn
                setFormClasses(prev => ({name:prev.name,email:"island_ipt",password:prev.password}))
                setBtnClasses(prev => ({name:prev.name,email:"",password:prev.password}))
            } else {
                // show tip, disable btn
                setFormClasses(prev => ({name:prev.name,email:"island_ipt form_tip",password:prev.password}))
                setBtnClasses(prev => ({name:prev.name,email:"btn_disabled",password:prev.password}))
            }
        } else {
            // reset email state, disable btn
            setFormClasses(prev => ({name:prev.name,email:"island_ipt",password:prev.password}))
            setBtnClasses(prev => ({name:prev.name,email:"btn_disabled",password:prev.password}))
        }
    }

    // PASSWORD
    function handle_PASSWORD(e) {
        setPassword(e.target.value)
        // pwd > 0?
        if (e.target.value.length > 0) {
            // validate...      
            // pwd >= 8? 
            if (e.target.value.length >= 8) {
                // hide tip, enable btn
                setFormClasses(prev => ({name:prev.name,email:prev.email,password:"island_ipt"}))
                setBtnClasses(prev => ({name:prev.name,email:prev.email,password:""}))
            } else {
                // show tip, disable btn
                setFormClasses(prev => ({name:prev.name,email:prev.email,password:"island_ipt form_tip"}))
                setBtnClasses(prev => ({name:prev.name,email:prev.email,password:"btn_disabled"}))
            }
        } else {
            // reset pwd state, disable btn
            setFormClasses(prev => ({name:prev.name,email:prev.email,password:"island_ipt"}))
            setBtnClasses(prev => ({name:prev.name,email:prev.email,password:"btn_disabled"}))
        }
    }

    // INTRO
    function handle_INTRO(e) {
        setIntro(e.target.value)
    }

    // RESET ERROR CLASS
    function RESETERRORS() {
        // remove form_error class from email
        if (formClasses.email.indexOf("form_error") >= 0) {
            setFormClasses(prev => ({name:prev.name,email:prev.email.replace(" form_error",""),password:prev.password}))
        }
    }

    // REGISTER
    function handle_REGISTER(e) {
        e.preventDefault(e)

        // check for existing user
        let existingUser
        if (userData) {
            const existingUserData = userData.filter(user => (user.email===email))
            if ((existingUserData.length > 0) && (typeof existingUserData[0]!=="undefined")) {
                existingUser=true 
            }
        }

        if (existingUser===true) {
            // add form_error class to email
            setFormClasses(prev => ({name:prev.name,email:prev.email + " form_error",password:prev.password}))
            setToast({msg:"Email address already registered!",class:"toast toast_red toast_open"})
        } else {
            // add new registree to the "database"
            const newKey = Date.now()
            if (userData) {
                setUserData([
                    ...userData,{
                        key:newKey,
                        userID:newKey,
                        name:name,
                        email:email,
                        password:password,
                        avatar:"",
                        intro:intro
                    }
                ])

                // log in
                localStorage.setItem('loggedInID',newKey);
                props.setNav("profile")
            }
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

    // login
    function handle_LOGIN() {
        props.setNav("")
    }

    return (
        <>
            <div className="island">
                <div className="island_hdr">Register</div>
                <form onSubmit={handle_REGISTER}>
                <div className="island_fx">
                    <div className="island_fi">
                        <div className={formClasses.name}>
                            <input type="text" placeholder="Name" value={name || ""} onChange={handle_NAME} />
                            <div><div className="form_tag">Hint - Forename Surname</div></div>
                        </div>
                        <div className={formClasses.email}>
                            <input type="text" placeholder="Email" value={email || ""} onChange={handle_EMAIL} />
                            <div><div className="form_tag">Hint - name@domain.com</div></div>
                        </div>
                        <div className={formClasses.password}>
                            <div className={tglPwd.class} onClick={handle_TGLPASSWORD}><span></span><span></span></div>
                            <input type={tglPwd.type} placeholder="Password" value={password || ""} onChange={handle_PASSWORD} />
                            <div><div className="form_tag">Hint - minimum 8 characters</div></div>
                        </div>
                    </div>
                    <div className="island_fi">
                        <div className="island_ipt">
                            <textarea placeholder="Introduction" value={intro || ""} onChange={handle_INTRO} />
                            <div><div className="form_tag">Hint - just say hello...</div></div>
                        </div>
                        <div className="island_btns_fx2">
                        <span>Are you an existing user? <span className="txt_link" onClick={handle_LOGIN}>Login</span></span>
                            <div className={btnClasses.name + " " + btnClasses.email + " " + btnClasses.password}><button className="orange_btn">Register</button></div>
                        </div>  
                    </div>
                </div>
                </form>
            </div>
            <div className="island_bg"></div>
        </>
    )
}