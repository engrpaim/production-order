import { useState } from "react";
import Batching from "./Batching";
import AILoader from "./AILoader";
export default function ProductionOrder({all_model, generated_woid}) {
    const [optionSelected, setOptionSelected] = useState('batching');
    const [loader ,setLoader] = useState(true)
    console.log('Batching Proto: ' , all_model);
    
    return (
        <div className="management-content">
            <div className="loader-row">
                <h3>Production Order</h3>
            </div>
            <div className="manage-content-header">
                {/* @nav Navigation inside Model management panel  */}
                <div className="management-button-container">
                    <button className={`management-option ${optionSelected === 'order' ? 'active' : ''}`}onClick={() => setOptionSelected('order')}>Order</button>
                    <button onClick={() => setOptionSelected('batching')} className={`management-option ${optionSelected === 'batching' ? 'active' : ''}`}>Batching</button>
                </div>
            </div>
            <div className="view-table-2">
                {
                optionSelected === 'batching' ?
                
                <Batching all_model={all_model} generated_woid={generated_woid}/>
                :null
            }
            </div>
            
        </div>
    );
}