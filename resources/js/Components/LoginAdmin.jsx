
import React from 'react';
export default function LoginAdmin({children}){
    const isLogin = true
    return(
        <>
            {
                isLogin ? children:
                <div>
                    <h1>asdas</h1>
                </div>    
            }
        </>
    )
}