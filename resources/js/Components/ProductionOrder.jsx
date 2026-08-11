import { useState } from "react";
import Batching from "./Batching";
export default function ProductionOrder({all_model}) {
    const [optionSelected, setOptionSelected] = useState(false);

    console.log('Batching Proto: ' , all_model);
    return (
        <div className="management-content">
            <div className="loader-row">
                <h3>Production Order</h3>
            </div>
            <div className="manage-content-header">
                {/* @nav Navigation inside Model management panel  */}
                <div className="management-button-container">
                    <button onClick={() => setOptionSelected('batching')} className={`management-option ${optionSelected === 'batching' ? 'active' : ''}`}>Batching</button>
                    <button className={`management-option ${optionSelected === 'order' ? 'active' : ''}`}onClick={() => setOptionSelected('order')}>Order</button>
                </div>
            </div>
            <div className="view-table-2">
                {
                optionSelected === 'batching' ?
                <Batching all_model={all_model}/>
                :null
            }
            </div>
            
        </div>
    );
}