import { useState } from "react"
import { router } from "@inertiajs/react";
import ModelAdmin from "./ModelAdmin";
import MachineAdmin from "./MachineAdmin";
import '../../css/management.css';
import ProductionOrder from "./ProductionOrder";
export default function Admin({model_manage , parameter_manage,selector_parameters,machine_manage,all_model,generated_woid,message,excess,excess_all_data,proto_all_data}) {
    const [optionManagement, setOptionManagement] = useState('order');
    console.log('generated woid: ' , generated_woid);
     const handleChange =(changes)=>{
            setOptionManagement(changes)
            router.get('/production-order/admin',{},{ preserveState: true,preserveScroll: true});
        }
    return (
        <div className="view-main">
            <div className="manage-content">
                <div>
                    <h1>Admin Panel</h1>
                    <p>Manage model, machine and production order.</p>
                </div>
                <div>
                    <div>
                        <button onClick={() => handleChange('order')} className={`option-selector ${optionManagement === 'order' ? 'active' : ''}`}>Production Order</button>
                        <button onClick={() => handleChange('model')} className={`option-selector ${optionManagement === 'model' ? 'active' : ''}`}>Model</button>
                        <button onClick={() => handleChange('machine')} className={`option-selector ${optionManagement === 'machine' ? 'active' : ''}`}>Machine</button>
                    </div>
                    <div className="management-view">
                        {
                             optionManagement === 'model' ? <ModelAdmin model_manage={model_manage} parameter_manage={parameter_manage} selector_parameters={selector_parameters}/>
                            :optionManagement === 'machine' ? <MachineAdmin machine_manage={machine_manage}/>
                            :optionManagement === 'order' ? <ProductionOrder all_model={all_model} generated_woid={generated_woid} message={message} excess={excess} excess_all_data={excess_all_data} proto_all_data={proto_all_data}/>
                            :null}
                    </div>
                </div>
                 <p style={{ fontSize:'10px' , fontWeight:'bold', alignSelf:'center' }}>Production Order by Automation Engineering</p>
            </div>
        </div>
    )
}