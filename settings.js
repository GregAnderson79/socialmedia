import React from 'react'
import {useState,useContext} from 'react'
import {ContextLoggedInID} from "./index.js"
import {ContextUserData} from "./index.js"
import {ContextToast} from "./index.js"

// TIMELINE
export default function SETTINGS(props) {
    const loggedInID = useContext(ContextLoggedInID);
    const [userData,setUserData] = useContext(ContextUserData) // context user data 
    const [, setToast] = useContext(ContextToast) // context toast

    let dbUserEmail, dbUserPwd
    if (loggedInID) {
        const loggedInUserData = userData.filter(user => (user.userID===loggedInID))
        if ((loggedInUserData.length > 0) && (typeof loggedInUserData[0]!=="undefined")) {
            dbUserEmail=loggedInUserData[0].email
            dbUserPwd=loggedInUserData[0].password
        }
    }

    const DBuser = {email:dbUserEmail,pwd:dbUserPwd}
    const [email, setEmail] = useState({email:dbUserEmail,class:"island_ipt",btn:"btn_disabled"}) // user email
    const [pwds,setPwds] = useState([{key:0,pwd:"",class:"island_ipt",btn:false},{key:1,pwd:"",class:"island_ipt",btn:false},{key:2,pwd:"",class:"island_ipt",btn:false}]) // passwords
    const [pwdBtnClass,setPwdBtnClass] = useState("btn_disabled") // password btn class
    const [tglPwds, setTglPwds] = useState ([{key:0,type:"password",class:"password_tgl"},{key:1,type:"password",class:"password_tgl"},{key:2,type:"password",class:"password_tgl"}]) // toggle password / text views   
    
    // EMAIL
    function handle_EMAIL(e) {
        // remove form_error class from email
        if (email.class.indexOf("form_error") >= 0) {
            setEmail(prev => ({...prev,class:prev.class.replace(" form_error","")}))
        }

        setEmail(prev => ({...prev,email:e.target.value}))
        // email > 0
        if (e.target.value.length > 0) { 
            // validate...      
            // correct email format? 
            if (e.target.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                // hide tip, enable btn
                setEmail(prev => ({...prev,class:"island_ipt",btn:""}))
            } else {
                // show tip, disable btn
                setEmail(prev => ({...prev,class:"island_ipt form_tip",btn:"btn_disabled"}))
            }
        } else {
            // reset email state, disable btn
            setEmail(prev => ({...prev,class:"island_ipt",btn:"btn_disabled"}))
        }
    }

    // update email
    function handle_UPDATEEMAIL(e) {
        e.preventDefault()
        const new_users = userData.map((user) => {
            if (parseInt(user.userID)===(loggedInID)) {
                return {...user,email:email.email}
            } else {
                return user
            }
        })
        setUserData(new_users)
        setToast({msg:"Email address updated!",class:"toast toast_green toast_open"})
        setEmail(prev => ({...prev,btn:"btn_disabled"}))
    }

    // passwords
    function handle_PASSWORDS(key,e) {        
        // update password array
        const new_pwds = pwds.map((pwd) => {
            if (pwd.key===key) {  
                if (e.target.value.length > 0) {
                    // validate...
                    // pwd >= 8? 
                    if (e.target.value.length >= 8) {
                        return {...pwd,pwd:e.target.value,class:"island_ipt",btn:true}
                    } else {                       
                        return {...pwd,pwd:e.target.value,class:"island_ipt form_tip",btn:false} 
                    }
                } else {
                    return {...pwd,pwd:e.target.value,class:"island_ipt",btn:false}
                }
            } else {
                return {...pwd,class:pwd.class.replace(" form_error","")}
            }
        })
        setPwds(new_pwds)

        // get btn states
        let btnClass=""
        for (let i = 0; i < pwds.length; i++) {
            if (pwds[i].btn===false) {btnClass="btn_disabled"}
        }
        setPwdBtnClass(btnClass)
    }

    // update password
    function handle_UPDATEPWD(e) {
        e.preventDefault()
        // current password === saved password?
        if (JSON.stringify(pwds[0].pwd)===JSON.stringify(DBuser.pwd)) {
            // new pwd === conf pwd?
            if (pwds[1].pwd===pwds[2].pwd) {
                const new_users = userData.map((user) => {
                    if (parseInt(user.userID)===(loggedInID)) {
                        return {...user,password:pwds[2].pwd};
                    } else {
                        return user
                    }
                })
                setUserData(new_users)
                setToast({msg:"Password updated!",class:"toast toast_green toast_open"})

                // reset pwd array
                const new_pwds = pwds.map((pwd) => { 
                   return {...pwd,pwd:"",class:"island_ipt",btn:false}
                })
                setPwds(new_pwds)
                setPwdBtnClass("btn_disabled")
            } else {
                // form errors (new and confirm pwds)
                const new_pwds = pwds.map((pwd) => {
                    if ((pwd.key===1) || (pwd.key===2)) {
                        return {...pwd,class:pwd.class + " form_error"}
                    } else {
                        return pwd // other pwds
                    }
                })
                setPwds(new_pwds)
                setToast({msg:"New passwords do not match!",class:"toast toast_red toast_open"})
            }
        } else {
            // form error (current pwd)
            const new_pwds = pwds.map((pwd) => {
                if (pwd.key===0) {  
                    return {...pwd,class:pwd.class + " form_error"}
                } else {
                    return pwd // other pwds
                }
            })
            setPwds(new_pwds)
            setToast({msg:"Incorrect password!",class:"toast toast_red toast_open"})
        }
    }

    // Toggle password/text for passwords
    function handle_TGLPASSWORDS(num) {
        const new_rows = tglPwds.map((row) => {
            if (row.key===parseInt(num)) {
                if (row.type==="password") {
                    return {...row,type:"text",class:"password_tgl password_tgl_text"}
                } else {
                    return {...row,type:"password",class:"password_tgl"}
                }  
            } else {
                return row
            }
        })
        setTglPwds(new_rows)
    }

    // close
    function handle_CLOSE() {
        props.setNav("")
    }

    return (
        <>
            <div className="island">
                <div className="island_hdr">
                    <span>Settings</span>
                    <span className="island_close" onClick={handle_CLOSE}>&#10005;</span>    
                </div>
                <div className="island_fx">
                    <div className="island_fi">
                        <div className="island_label">Update your email address?</div>
                        <form onSubmit={handle_UPDATEEMAIL}>
                        <div className={email.class}>
                            <input type="text" placeholder="Email" value={email.email || ""} onChange={handle_EMAIL} />
                            <div><div className="form_tag">Hint - name@domain.com</div></div>
                        </div>
                        <div className={email.btn}>
                            <button className="orange_btn">Update email address</button>
                        </div>
                        </form>
                    </div>
                    <div className="island_fi">
                        <div className="island_label">Update your password?</div>
                        <form onSubmit={handle_UPDATEPWD}>
                        <div className={pwds[0].class}>
                            <div className={tglPwds[0].class} onClick={(e) => {handle_TGLPASSWORDS('0')}}><span></span><span></span></div>
                            <input key={pwds[0].key} type={tglPwds[0].type} placeholder="Current password" value={pwds[0].pwd || ""} onChange={(e) => {handle_PASSWORDS(0,e)}} />
                            <div><div className="form_tag">Hint - minimum 8 characters</div></div>
                        </div>
                        <div className={pwds[1].class}>
                            <div className={tglPwds[1].class} onClick={(e) => {handle_TGLPASSWORDS('1')}}><span></span><span></span></div>
                            <input key={pwds[1].key} type={tglPwds[1].type} placeholder="New password" value={pwds[1].pwd || ""} onChange={(e) => {handle_PASSWORDS(1,e)}} />
                            <div><div className="form_tag">Hint - minimum 8 characters</div></div>
                        </div>
                        <div className={pwds[2].class}>
                            <div className={tglPwds[2].class} onClick={(e) => {handle_TGLPASSWORDS('2')}}><span></span><span></span></div>
                            <input key={pwds[2].key} type={tglPwds[2].type} placeholder="Confirm new password" value={pwds[2].pwd || ""} onChange={(e) => {handle_PASSWORDS(2,e)}} />
                            <div><div className="form_tag">Hint - minimum 8 characters</div></div>
                        </div>
                        <div className={pwdBtnClass}>
                            <button className="orange_btn">Update password</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="island_bg"></div>
        </>
    )
}