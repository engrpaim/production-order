import React from 'react';
import '../../css/compiled.css';
export default function ErrorComponent({message}) {
    return (
        <>
           {message&& <div className="error-message">
                {message? message: null}
            </div>}
        </>
    );
}
