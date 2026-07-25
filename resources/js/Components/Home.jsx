
import React from 'react';
import '../../css/app.css';

export default function Home() {
  
    const handleRedirect =(route)=>{
        if(!route) return

        window.location.href = route
    }


    return (
        <div className='home-container'>
            <div className='home-tile'>
                <div className='' style={{ display:'flex', gap:'1rem' }}>
                    <h1>Production</h1><h1 style={{ color:'#90CFF9' }}>Order</h1>
                </div>
                <span>by Automation Engineering department</span>
                
                <button className='home-link' onClick={()=>handleRedirect('/production-order/encode')}>ENCODE NOW!</button>
                   
            </div>
        </div>
    )
}