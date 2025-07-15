import React from 'react'
import POST from './post.js'
import POSTFORM from './postform.js'
import {useState,useEffect} from 'react'

// TIMELINE
export default function WALL() {
  const [addPost,setAddPost] = useState(false)

  // posts
  const BACKUP_POSTS = [{key:"1234567890",postID:"1234567890",authorID:"1234567890",date:"00:00 - 01/01/2025",img:"",title:"Hello World!",text:"The first post...",link:""}]
  const SAVED_POSTS = JSON.parse(localStorage.getItem("SAVED_POSTS"))
  const [postData,setPostData] = useState(SAVED_POSTS || BACKUP_POSTS)
  // when posts data state is changed, update "database"
  useEffect(() => {
    localStorage.setItem("SAVED_POSTS", JSON.stringify(postData))
  }, [postData])

  // open form
  function handle_ADDPOST() {
    setAddPost(true)
  }

  // close form
  function handle_CLOSEADDPOST() {
    setAddPost(false)
  }

  return (
    <>
        {addPost &&
          <>
            <div className="island island_wide">
              <div className="island_hdr">
                <span>Add a post</span>
                <span className="island_close" onClick={handle_CLOSEADDPOST}>&#10005;</span>
              </div>
              <POSTFORM 
                setPostData={setPostData} 
                postData={postData}
                formAction="add" 
                setAddPost={setAddPost}
              />
            </div>
            <div className="island_bg"></div>
          </>
        }
        <div className="addpost">
          <button onClick={handle_ADDPOST}>
            <span>
              <span></span>
              <span></span>
            </span>
            <span>Add a post</span>
          </button>
        </div>
        <div className="posts">
          {postData.map((post) => {
            return <POST 
              key={post.key}
              postID={post.postID}
              authorID={post.authorID}
              date={post.date}
              img={post.img}
              title={post.title}
              link={post.link}
              text={post.text}
              postData={postData}
              setPostData={setPostData}
            />
          })}
        </div>
    </>
  )
}