import React from 'react'
import {useState,useEffect,useContext} from 'react'
import {ContextLoggedInID} from "./index.js";

// LIKES
export default function LIKES(props) {
    const [likes,setLikes] = useState(0)
    const [likeClasses,setLikeClasses] = useState("post_likes")
    const loggedInID = useContext(ContextLoggedInID)

    // likes data
    const BACKUP_LIKES = [{key:"1234567890",likeID:"1234567890",postID:"1234567890",userID:"1234567890"}]
    const SAVED_LIKES = JSON.parse(localStorage.getItem("SAVED_LIKES"))
    const [likeData,setLikeData] = useState(SAVED_LIKES || BACKUP_LIKES)
    // when likes data state is changed, update "database"
    useEffect(() => {
        localStorage.setItem("SAVED_LIKES", JSON.stringify(likeData))
    }, [likeData])

    // monitor stored like data for
    // existing likes
    // changes to likes
    // if user has liked
    useEffect(() => {
        let dbLikes=0
        let dbLikeClasses="post_likes"
        const postLikeData = likeData.filter(like => (like.postID===props.postID))
        dbLikes=postLikeData.length

        const userLikeData = postLikeData.filter(like => (like.userID===loggedInID))
        if ((userLikeData.length > 0) && (typeof userLikeData[0]!=="undefined")) {
            dbLikeClasses="post_likes already_liked"
        }

        setLikes(dbLikes)
        setLikeClasses(dbLikeClasses)
    }, [likeData, props.postID, loggedInID])

    // add like
    function handle_ADDLIKE(e) {
        e.preventDefault()
        const newKey = Date.now()
        setLikeData([
            ...likeData,{
                key:newKey,
                likeID:newKey,
                postID:props.postID,
                userID:loggedInID
            }
        ])
    }

    // remove like
    function handle_UNLIKE(e) {
        e.preventDefault()
        setLikeData(likeData.filter(like => !((like.userID===loggedInID) && (like.postID===props.postID))))
    }

    return (
        <div className={likeClasses}>
            <button className="orange_btn small_btn like_btn" onClick={handle_ADDLIKE}>Like</button>
            <button className="grey_btn small_btn unlike_btn" onClick={handle_UNLIKE}>Unlike</button>
            <span>{likes}</span>
        </div>
    )
}
