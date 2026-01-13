import { useState, useEffect } from "react";



const MessageModal = ({message}) => {

    return(
        <div className="bg-indigo-500 h-12 w-200 z-50 flex items-center rounded-lg justify-center">
            <h4 className="text-white font-medium text-lg rounded-md">{message}</h4>
        </div>
    );

};


export default MessageModal;