import React from 'react';
import {useEffect,useCallback} from 'react'

// toast
export default function TOAST(props) {

    // reset toast
    const handle_RESETTOAST = useCallback(() => {
        props.setToast({msg:props.toast.msg,class:props.toast.class.replace("toast_open","")})
    }, [props]);

    // hide toast after 5 seconds
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handle_RESETTOAST();
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, [handle_RESETTOAST]);

    return (
        <div className={props.toast.class} onClick={handle_RESETTOAST}>{props.toast.msg}</div>
    )
}