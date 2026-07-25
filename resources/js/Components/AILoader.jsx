import { useState} from 'react';
import '../../css/ai.css'
export default function AILoader(){
    
  
    
    return(
        <>
            <div className="loader-container">
                <div className='loader-design'>
                    <div className='loader' ></div><p className='blinking'>Checking data sources!</p>
                </div>
            </div>
        </>
    );
}