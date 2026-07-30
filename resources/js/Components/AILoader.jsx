import { useState} from 'react';
import '../../css/ai.css'
export default function AILoader({message = false}){
    
  
    
    return(
        <>
            <div className="loader-container">
                <div className='loader-design'>
                    <div className='loader' ></div><p className='blinking'>{message? message : 'Checking data sources!'}</p>
                </div>
            </div>
        </>
    );
}