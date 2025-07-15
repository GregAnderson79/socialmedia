import React from 'react'
import LIKES from './likes.js'
import POSTFORM from './postform.js'
import COMMENTS from './comments.js'
import {useState,useContext} from 'react'
import {ContextLoggedInID} from "./index.js";
import {ContextUserData} from "./index.js"
import {ContextToast} from "./index.js"

// POST
export default function POST(props) {
  const [isEdit,setIsEdit] = useState(false)
  const loggedInID = useContext(ContextLoggedInID)
  const [userData] = useContext(ContextUserData) // context user data
  const [, setToast] = useContext(ContextToast) // context toast

  // author details
  let authorName, authorAvatar
  const authorUserData = userData.filter(user => (user.userID===props.authorID))
  if ((authorUserData.length > 0) && (typeof authorUserData[0]!=="undefined")) {
    authorName = authorUserData[0].name
    authorAvatar = authorUserData[0].avatar
  }

  let link_class
  if ((typeof props.link !== "undefined") && (props.link.length > 0)) {link_class="link_enabled"}

  let options_class="post_options"
  if (props.authorID===loggedInID) {options_class="post_options"} else {options_class="post_options options_hide"}

  // delete post
  function handle_DELETEPOST() {
    props.setPostData(props.postData.filter(post => !(post.postID===props.postID)))
    setToast({msg:"Post deleted!",class:"toast toast_green toast_open"})
  }

  // edit post
  function handle_EDITPOST() {
    setIsEdit(true)
  }

  // cancel edit
  function handle_CLOSEDITPOST() {
    setIsEdit(false)
  }

  let isImg=false
  if (props.img.length > 0) {isImg=true}
  
  let isLink=false
  if (props.link.length > 0) {isLink=true}

  return (
    <>
      {isEdit &&
        <>
          <div className="island">
            <div className="island_hdr">
              <span>Edit your post</span>
              <span className="island_close" onClick={()=> {window.confirm("Are you sure you want to discard your changes?") && handle_CLOSEDITPOST()}}>&#10005;</span>
            </div>
            <POSTFORM 
              postID={props.postID} 
              postData={props.postData} 
              setPostData={props.setPostData} 
              formAction="edit" 
              setIsEdit={setIsEdit}
              setToast={props.setToast}
            />
          </div>
          <div className="island_bg"></div>
        </>
      }
      <div className="post" key={props.postID}>
          <div className="post_author">
            <div className="post_avatar"><img src={authorAvatar} alt={authorName.charAt(0)} /></div>
            <div className="post_name">{authorName}</div>
            <div className="post_date">{props.date}</div>
          </div>
          <div className="post_fx">
            {isImg &&
              <div className="post_img">
                {isLink && 
                  <a className={link_class} href={props.link} target="_blank" rel="noreferrer">{props.link}</a>
                } 
                <img src={props.img} alt={props.title}></img>
              </div>
            }
            <div className="post_dtls">
              <div className="post_ttl">
                {isLink ? <a className={link_class} href={props.link} target="_blank" rel="noreferrer">{props.title}</a> : props.title}
              </div>
              <div className="post_txt">{props.text}</div>
            </div>
          </div>
          <div className="likes_fx">
            <LIKES postID={props.postID} />
            <div className={options_class}>
              <button className="orange_btn small_btn" onClick={handle_EDITPOST}>Edit post</button>
              <button className="grey_btn small_btn" onClick={()=> {window.confirm("Are you sure you want to delete your post?") && handle_DELETEPOST()}}>Delete post</button>
            </div>
          </div>
          <COMMENTS postID={props.postID} />
      </div>
      
    </>
  )
}