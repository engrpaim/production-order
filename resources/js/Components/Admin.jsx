import { useState } from "react"
import ModelAdmin from "./ModelAdmin";
import MachineAdmin from "./MachineAdmin";
import '../../css/management.css';
export default function Admin({model_manage , parameter_manage,selector_parameters}) {
    const [optionManagement, setOptionManagement] = useState('model');
    return (
        <div className="view-main">
            <div className="manage-content">
                <div>
                    <h1>Admin Panel</h1>
                    <p>Manage model, machine and production order.</p>
                </div>
                <div>
                    <div>
                        <button onClick={() => setOptionManagement('model')} className={`option-selector ${optionManagement === 'model' ? 'active' : ''}`}>Model</button>
                        <button onClick={() => setOptionManagement('machine')} className={`option-selector ${optionManagement === 'machine' ? 'active' : ''}`}>Machine</button>
                        <button onClick={() => setOptionManagement('order')} className={`option-selector ${optionManagement === 'order' ? 'active' : ''}`}>Production Order</button>
                    </div>
                    <div className="management-view">
                        {
                             optionManagement === 'model' ? <ModelAdmin model_manage={model_manage} parameter_manage={parameter_manage} selector_parameters={selector_parameters}/>
                            :optionManagement === 'machine' ? <MachineAdmin/>
                            :null}
                    </div>
                </div>
                 <p style={{ fontSize:'10px' , fontWeight:'bold', alignSelf:'center' }}>Production Order by Automation Engineering</p>
            </div>
        </div>
    )
}