import React from 'react';
import {useState,useContext} from 'react'
import {ContextLoggedInID} from "./index.js"
import {ContextToast} from "./index.js"

// post form
export default function POSTFORM(props) {
    const loggedInID = useContext(ContextLoggedInID)
    const [, setToast] = useContext(ContextToast) // context toast

    // edit or add?
    let prevTitle=""
    let prevLink=""
    let prevText=""
    let prevImg=""
    let btnText="Add post"
    let btnBoolean
    // populate etc...
    if ((props.formAction==="edit") && (props.postID)) {
        const editPostData = props.postData.filter(post => (post.postID===props.postID))
        if ((editPostData.length > 0) && (typeof editPostData[0]!=="undefined")) {
            prevTitle=editPostData[0].title
            prevLink=editPostData[0].link
            prevText=editPostData[0].text
            prevImg=editPostData[0].img
            btnText="Update post"
        }

        btnBoolean=true
    } else {
        btnBoolean=false
    }
    const [btnState, setBtnState] = useState({title:btnBoolean,link:true,text:btnBoolean}) // btn states

    // state vars
    const [uplImg, setUplImg] = useState(prevImg) // upl img
    const [title, setTitle] = useState(prevTitle) // post title
    const [link, setLink] = useState(prevLink) // post link
    const [text, setText] = useState(prevText) // post content
    const [titleIpt, setTitleIpt] = useState("island_ipt") // title ipt
    const [linkIpt, setLinkIpt] = useState("island_ipt") // link ipt
    const [textIpt, setTextIpt] = useState("island_ipt") // text ipt
    

    // handle title
    function handle_POSTTITLE(e) {
        setTitle(e.target.value) // update value
        if (e.target.value.length > 0) { // title > 0 
            setTitleIpt("island_ipt") // hide tip
            setBtnState(prev => ({...prev,title:true})) // enable btn
        } else {
            setTitleIpt("island_ipt form_tip") // show tip
            setBtnState(prev => ({...prev,title:false})) // disable btn
        }
    }

    // handle link
    function handle_POSTLINK(e) {
        setLink(e.target.value) // update value
        if (e.target.value.length > 0) { // link > 0
            if (((e.target.value.indexOf("https://") >= 0) || (e.target.value.indexOf("http://") >= 0)) && (e.target.value.indexOf(".") >= 0) && (e.target.value.slice(-1)!==".")) { // validate email format
                setLinkIpt("island_ipt") // hide tip
                setBtnState(prev => ({...prev,link:true})) // enable btn
            } else {
                setLinkIpt("island_ipt form_tip") // show tip
                setBtnState(prev => ({...prev,link:false})) // disable btn
            }
        } else {
            setLinkIpt("island_ipt") // hide tip
            setBtnState(prev => ({...prev,link:true})) // enable btn
        }
    }

    // handle text
    function handle_POSTTEXT(e) {
        setText(e.target.value) // update value
        if (e.target.value.length > 0) { // text > 0
            setTextIpt("island_ipt") // hide tip
            setBtnState(prev => ({...prev,text:true})) // enable btn
        } else {
            setTextIpt("island_ipt form_tip") // show tip
            setBtnState(prev => ({...prev,text:false})) // disable btn
        }
    }

    // handle drag img
    function handle_DRAGIMG(e) {
        e.preventDefault()
        const getImg = e.dataTransfer.files[0];
        if (getImg) {
            const reader = new FileReader()
            reader.onload = (e) => {setUplImg(reader.result)}
            reader.readAsDataURL(getImg)
        }
    }

    // handle img
    function handle_CHANGEIMG(e) {
        const getImg = e.target.files[0]
        if (getImg) {
            const reader = new FileReader()
            reader.onload = (e) => {setUplImg(reader.result)}
            reader.readAsDataURL(getImg)
        }
    }

    // make image binary, save to state
    function handle_POSTIMG(e) {
        const uplImg = e.target.files[0]
        if (uplImg) {
            const reader = new FileReader()
            reader.onload = (e) => {setUplImg(reader.result)}
            reader.readAsDataURL(uplImg)
        }
    }

    // submit form
    function handle_SUBMITPOST(e) {
        e.preventDefault()
        // edit
        if (props.formAction==="edit") {
            const newPosts  = props.postData.map((post) => {
                if (parseInt(post.postID)===(props.postID)) {
                    return {...post,title:title,link:link,text:text,img:uplImg};
                } else {
                    return post
                }
            })
            props.setPostData(newPosts)
            props.setIsEdit(false)
            setToast({msg:"Post updated!",class:"toast toast_green toast_open"})

        // add
        } else {
            const date = new Date()
            let hours = date.getHours()
            if (hours < 10) {hours="0"+hours}
            let mins = date.getMinutes()
            if (mins < 10) {mins="0"+mins}
            let day = date.getDate()
            if (day < 10) {day="0"+day}
            let month = date.getMonth()+1
            if (month < 10) {month="0"+month}
            const postDate = hours+":"+mins+" - "+day+"/"+month+"/"+date.getFullYear()
    
            const newKey = Date.now()
            props.setPostData([
              ...props.postData,{
                key:newKey,
                postID:newKey,
                authorID:loggedInID,
                img:uplImg,
                title:title,
                link:link,
                text:text,
                date:postDate
              }
            ])

            props.setAddPost(false)
            setToast({msg:"Post added!",class:"toast toast_green toast_open"})
        }

        // reset form
        setTitle("")
        setLink("")
        setText("")
        setUplImg("")
    }

    // cancel post
    function handle_CANCELPOST(e) {
        e.preventDefault()
        const prompt=window.confirm("Are you sure you want to discard your changes?")
        if (prompt) {
            setTitle("")
            setLink("")
            setText("")
            setUplImg("")
            props.setIsEdit(false)
        }
    }

    // btn class
    let btnClass="btn_disabled"
    if ((btnState.title===true) && (btnState.text===true)) {btnClass=""}
    if (btnState.link===false) {btnClass="btn_disabled"}

    return (
        <>
            <form>
            <div className="island_fx">
                <div className="island_fi">
                    <div className="addpost_img">
                        <label htmlFor="addpost_img" onDragOver={(e) => e.preventDefault()} onDrop={handle_DRAGIMG}></label>
                        <input type="file" id="addpost_img" hidden accept=".png, .jpg, .jpeg .webp" onChange={handle_CHANGEIMG} />
                        <img src={uplImg || ""} alt={title} />
                        <span>Click to upload / drag image...</span>
                    </div>
                    <input type="file" hidden accept=".png, .jpg, .jpeg .webp" onChange={handle_POSTIMG} />
                </div>
                <div className="island_fi">
                    <div className={titleIpt}>
                        <input type="text" placeholder="Post title" value={title || ""} onChange={handle_POSTTITLE} />
                        <div><div className="form_tag">Hint - Give your post a short title</div></div>
                    </div>
                    <div className={linkIpt}>
                        <input type="text" placeholder="Post link" value={link || ""} onChange={handle_POSTLINK} />
                        <div><div className="form_tag">Hint - https://www.website.com</div></div>
                    </div>
                    <div className={textIpt}>
                        <textarea placeholder="Post content" value={text || ""} onChange={handle_POSTTEXT} />
                        <div><div className="form_tag">Hint - type your post content here</div></div>
                    </div>
                    <div className="island_btns_fx3">
                        <button className="grey_btn" onClick={handle_CANCELPOST}>Cancel</button>

                        <div className={btnClass}>
                            <button className="orange_btn" onClick={handle_SUBMITPOST}>{btnText}</button>
                        </div>
                    </div>

                </div>
            </div>
            </form>
        </>
    )
}