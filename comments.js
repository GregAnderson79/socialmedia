import React from 'react';
import {useState,useContext,useEffect} from 'react'
import COMMENT from './comment.js'
import {ContextLoggedInID} from "./index.js";
import {ContextUserData} from "./index.js"

// comments
export default function COMMENTS(props) {
    const [userData] = useContext(ContextUserData) // context user data 
    const [commentField,setCommentField] = useState(false) // open/close comment form
    const [comment, setComment] = useState({comment:"",btn:"btn_disabled"}) // comment
    const [openBtn, setOpenBtn] = useState() // open btn state
    const loggedInID = useContext(ContextLoggedInID);

    // comments data
    const BACKUP_COMMENTS = [{key:"",commentID:"",replyTo:"",postID:"",authorID:"",date:"",comment:""}]
    const SAVED_COMMENTS = JSON.parse(localStorage.getItem("SAVED_COMMENTS"))
    const [commentData,setCommentData] = useState(SAVED_COMMENTS || BACKUP_COMMENTS)
    // when comments data state is changed, update "database"
    useEffect(() => {
        localStorage.setItem("SAVED_COMMENTS", JSON.stringify(commentData))
    }, [commentData])

    // open comment field
    function handle_OPENCOMMENT() {
        setCommentField(true)
        setOpenBtn("btn_disabled")
    }

    // cancel comment
    function handle_CANCELCOMMENT() {
        setCommentField(false)
        setComment({comment:"",btn:"btn_disabled"})
        setOpenBtn("")
    }

    // comment state, validation
    function handle_COMMENT(e) {
        e.preventDefault()
        setComment(prev => ({...prev,comment:e.target.value}))
        if (e.target.value.length > 0) { 
            setComment(prev => ({...prev,btn:""}))
        } else {
            setComment(prev => ({...prev,btn:"btn_disabled"}))
        }
    }

    // submit comment
    function handle_SUBMITCOMMENT(e) {
        e.preventDefault()
        const date = new Date()
        let hours = date.getHours()
        if (hours < 10) {hours="0"+hours}
        let mins = date.getMinutes()
        if (mins < 10) {mins="0"+mins}
        let day = date.getDate()
        if (day < 10) {day="0"+day}
        let month = date.getMonth()+1
        if (month < 10) {month="0"+month}
        const commentDate = hours+":"+mins+" - "+day+"/"+month+"/"+date.getFullYear()

        const newKey = Date.now()
        setCommentData([
            ...commentData,{
                key:newKey,
                commentID:newKey,
                replyTo:"",
                postID:props.postID,
                authorID:loggedInID,
                date:commentDate,
                comment:comment.comment
            }
        ])

        setCommentField(false)
        setComment({comment:"",btn:"btn_disabled"})
        setOpenBtn("")
    }

    // delete comment
    function handle_DELETECOMMENT(commentID) {
        setCommentData(commentData.filter(comment => !(comment.commentID===commentID)))
    }

    // comments for this post
    const postComments = commentData.filter(comment => (comment.postID===props.postID))
    return (
        <div className="comments">
            <ul>

            {postComments.map((comment) => {
                // author details
                let authorName, authorAvatar
                const authorUserData = userData.filter(user => (user.userID===comment.authorID))
                if ((authorUserData.length > 0) && (typeof authorUserData[0]!=="undefined")) {
                    authorName = authorUserData[0].name
                    authorAvatar = authorUserData[0].avatar
                }

                return <COMMENT
                    key={comment.key}
                    commentID={comment.commentID}
                    comment={comment.comment}
                    date={comment.date}
                    authorID={comment.authorID}
                    authorName={authorName}
                    authorAvatar={authorAvatar}
                    handle_DELETECOMMENT={handle_DELETECOMMENT}
                />
            })}

            </ul>
            <div className="comments_add">
                <div className={openBtn}><button className="orange_btn small_btn" onClick={handle_OPENCOMMENT}>Add comment</button></div>
                {commentField &&
                    <form onSubmit={handle_SUBMITCOMMENT}>
                    <div className="comments_field">
                        <textarea placeholder="Comment" value={comment.comment || ""} onChange={(e) => {handle_COMMENT(e)}}></textarea>
                        <div>
                            <button className="grey_btn small_btn" onClick={()=> {window.confirm("Are you sure you want to discard your comment?") && handle_CANCELCOMMENT()}}>Cancel</button>
                            <div className={comment.btn}><button className="orange_btn small_btn">Post comment</button></div>
                        </div>
                    </div>
                    </form>
                }
            </div>
        </div>
    )
}