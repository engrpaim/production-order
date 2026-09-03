import { useState } from "react";
import { router } from "@inertiajs/react" 
import Batching from "./Batching";
import AILoader from "./AILoader";
import ExcessView from "./ExcessView";
import OrderProtoView from "./OrderProtoView";
export default function ProductionOrder({all_model, generated_woid,message,excess,excess_all_data,proto_all_data}) {
    const [optionSelected, setOptionSelected] = useState('order');
    const [loader ,setLoader] = useState(true)
    console.log('Batching Proto: ' , all_model , excess_all_data);
    
    const handleChange =(changes)=>{
        setOptionSelected(changes)
        router.get('/production-order/admin',{},{ preserveState: true,preserveScroll: true});
    }
    return (
        <div className="management-content">
            <div className="loader-row">
                <h3>Production Order</h3>
            </div>
            <div className="manage-content-header">
                {/* @nav Navigation inside Model management panel  */}
                <div className="management-button-container">
                    <button onClick={() => handleChange('order')} className={`management-option ${optionSelected === 'order' ? 'active' : ''}`}>Order</button>
                    <button onClick={() => handleChange('batching')} className={`management-option ${optionSelected === 'batching' ? 'active' : ''}`}>Batching</button>
                    <button onClick={() => handleChange('excess')} className={`management-option ${optionSelected === 'excess' ? 'active' : ''}`}>Excess</button>
                </div>
            </div>
            <div className="view-table-2">
                {   
                    optionSelected === 'order' ?
                        <OrderProtoView proto_all_data={proto_all_data}/>
                    :optionSelected === 'batching' ?
                        <Batching all_model={all_model} generated_woid={generated_woid} message={message} excess={excess}/>
                    :optionSelected === 'excess' ?
                        <ExcessView excess_all_data={excess_all_data}/>
                    :null
            }
            </div>
            
        </div>
    );
}