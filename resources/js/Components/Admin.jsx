import { useState } from "react"
import '../../css/management.css';
export default function Admin(){
    const [optionManagement , setOptionManagement] = useState(false);
    return(
        <div className="view-main">
            <div className="view-content">
                <div>
                    <h1>Admin Panel</h1>
                    <p>Manage model, machine and production order.</p>
                </div>
                <div>
                    <button onClick={()=>setOptionManagement('model')} className={`option-selector ${optionManagement === 'model' ? 'active' : ''}`}>Model</button>
                    <button onClick={()=>setOptionManagement('machine')} className={`option-selector ${optionManagement === 'machine' ? 'active' : ''}`}>Machine</button>
                    <button onClick={()=>setOptionManagement('order')} className={`option-selector ${optionManagement === 'order' ? 'active' : ''}`}>Production Order</button>
                </div>
                <div>
                    { optionManagement === 'model' && <div><h1>Model view</h1></div>}
                </div>
            </div>
        </div>
    )
}