import React from 'react';
import {useContext} from 'react'
import {ContextLoggedInID} from "./index.js";

// comment
export default function COMMENT(props) {
    const loggedInID = useContext(ContextLoggedInID);

    let isAuthor=false
    if (props.authorID===loggedInID) {isAuthor=true}

    return (
        <li key={props.commentID}>
            <span className="comment_flex">
                <span>
                    <span className="comment_author">
                        <span className="comment_avatar"><img src={props.authorAvatar} alt={props.authorName.charAt(0)} /></span>
                        <span>{props.authorName}</span>
                        <span className="comment_arrow"></span>
                    </span>
                </span>
                <span className="comment_comment">{props.comment}</span>
                <span>
                    <span className="comment_date">
                        <span className="comment_arrow"></span>
                        {props.date}
                        {isAuthor &&
                            <span className="comment_del">
                                <button className="del_btn" onClick={()=> {window.confirm("Are you sure you want to delete your comment?") && props.handle_DELETECOMMENT(props.commentID)}}>&#10005;</button>
                            </span>
                        }
                    </span>
                </span>
            </span>
        </li>
    )
}