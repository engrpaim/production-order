import { useState } from "react"
import AILoader from "./AILoader";
export default function Batching({all_model}) {

    const [ProtoState, setProtoState] = useState(false);
    const [loader, setLoader] = useState(false);
   

    const handleBatching =(ProtoState)=>{
        if(!ProtoState.lot_quantity || !ProtoState.quantity || !ProtoState.lot_number) return;
        console.log(ProtoState);
        const lotQuantity = Number(ProtoState.lot_quantity);
        const batchQuantity = Number(ProtoState.quantity);
    }
    return (
        <div className="management-content"> 
            <h4>Batching</h4>
            <p>Create batching , enter the lot number and quantity.</p>
            <div className="loader-column">
                <div className="loader-row" style={{ background: '#E6F6FF', padding: '1.2rem 0.7rem', borderRadius: '1rem', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px', }}>
                    <div className="loader-row">
                        <label>Lot&nbsp;Number:</label>
                        <input onChange={(e) => setProtoState({ ...ProtoState, lot_number: e.target.value })} type="text" placeholder="lot number" />
                    </div>
                    <div className="loader-row">
                        <label>Model:</label>
                        <select onChange={(e) => setProtoState({ ...ProtoState, lot_quantity: e.target.value })} placeholder="lot number">
                            <option></option>
                            {
                                all_model && Object.entries(all_model).map(([key,values])=>{
                                    
                                    return(
                                      <option  key={key}value={values.Quantity ?? 0}>{values.Model}</option>
                                    )
                                    
                                })
                            }
                        </select>
                    </div>
                    <div className="loader-row">
                        <label>Quantity:</label>
                        <input onChange={(e) => setProtoState({ ...ProtoState, quantity: e.target.value })} type="number" placeholder="quantity" />
                    </div>
                    <button onClick={()=>{
                                            setProtoState({ ...ProtoState, submitted:true })
                                            handleBatching(ProtoState)
                                            }} className="manage-update">Batch</button>
                </div>
            </div>
            {ProtoState && ProtoState.submitted && <AILoader/>}
            {
                ProtoState && ProtoState.lot_number && ProtoState.quantity ?
                    <div className="loader-column" style={{ borderRadius: '1rem', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px'}}>
                         
                    </div> 
                    : null
            }

        </div>
    )
}