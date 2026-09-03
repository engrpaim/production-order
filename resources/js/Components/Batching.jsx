import { useState, useRef , useEffect } from "react"
import { router } from "@inertiajs/react";
import AILoader from "./AILoader";
import Confirm from "./Confirm";
import GeneratingLoader from "./GeneratingLoader";
import { checkIfRequired } from "../Utilities/UtilityFunctions";
export default function Batching({ all_model , generated_woid , message ,excess}) {
   console.log('Current Message:' ,all_model, message , excess);
    const [ProtoState, setProtoState] = useState(false);
    const [BatchData, setBatchData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [Details, setDetails] = useState(false);
    const [redIndex, setRedIndex] = useState(message);
    const [currentMessage , setCurrentMessage] = useState(message);

    useEffect(()=>{
        if(message && message.generation_status === false){
            setTimeout(()=>{
                console.log('UseEffect');
                setProtoState(false);
                setBatchData([]);
                setLoader(false);
                setDetails(false);
                setRedIndex(false);
                setCurrentMessage(false);
            },2000);
        }
        
        if(excess){
            console.log('Check Excess!',excess);
            setProtoState({ ...ProtoState, excess: excess })
        }

    },[message , excess]);

    function suffix(batchPlaceValue) {
        console.log(batchPlaceValue)
        if (batchPlaceValue) {
           return String(batchPlaceValue).padStart(5,'0')
        }
    }

    function turnOffLoader(time, set) {
        setTimeout(() => {
            set(false)
        }, time)
    }

    function turnOnLoader(data, set) {
        setTimeout(() => {
            set(data)
        }, 2000)
    }

    function turnOfLoader(set) {
        setTimeout(() => {
            set(false)
        }, 2000)
    }

    const handleBatching = async (data, e) => {
        const required = checkIfRequired(e)
        setRedIndex(required)
        console.log('Clicked!',required,data,all_model , required.count > 0);
        if (!data.find || required.count > 0) {
            turnOfLoader(setRedIndex)
            return
        }
        console.log(data);
        const find = Number(data.find)
        const excessData = data.excess;
        const currentModel = all_model[find]
        console.log('FINND: ', currentModel , data);
        if (!currentModel.Quantity || !data.quantity || !data.lot_number) return turnOffLoader(2000, setLoader)
        setLoader(true)
        console.log('CURRENT MODE: ', currentModel.quantity);
        const GeneratedBatch = [];
        const lotNumber = data.lot_number.replace(" ", "");
        const addExcess = excessData ? excessData.excess : 0;
        const lotQuantity = Number(data.quantity) + addExcess;
        const batchQuantity = currentModel.Quantity;
        const ModelCode = currentModel.Model_Code;
        const Model = currentModel.Model;
        console.log('Necessarry: ',batchQuantity, ModelCode);
        //Split Current lot
        const TotalBatches = lotQuantity / batchQuantity
        const excess = TotalBatches - Math.floor(TotalBatches)
        const TotalExcess = Math.round(excess * batchQuantity)
        const TotalBatchWithExcess = Math.floor(TotalBatches)

        const conditionLot = data.condition ?? null;
        const remarksLot = data.remarks ?? null;
        console.log('Total Batches: ', TotalBatches, excess, TotalExcess, TotalBatchWithExcess);

        //generate batch number
        let verify = 0
        Array.from({ length: TotalBatchWithExcess + 1 }, (_, index) => {
            const current = index + 1
            console.log(current);
            const batchPlaceValue = current;

            const setSuffix = suffix(batchPlaceValue)
            console.log(setSuffix);
            
            if (TotalBatchWithExcess !== current) {
                verify += batchQuantity
                GeneratedBatch.push({ batch: index + 1, quantity: batchQuantity, condition: conditionLot, batch_number: `${lotNumber}-${setSuffix}`, code: ModelCode, model: Model , remarks: remarksLot})
            } else {
                verify += TotalExcess
                excess > 0 ? GeneratedBatch.push({ batch: index + 1, quantity: TotalExcess, condition: conditionLot, batch_number: `${lotNumber}-${setSuffix}`, code: ModelCode, model: Model , remarks: remarksLot }) : null
            }

        })

        setBatchData(GeneratedBatch)
        setDetails({ excess: TotalExcess, total: excess > 0 ? TotalBatchWithExcess + 1 : TotalBatchWithExcess, quantity: batchQuantity, model: Model ,lot_number: lotNumber, lot_quantity:verify , hold_excess:excessData})
        console.log('Generated Batches: ', GeneratedBatch, verify)
    }
    
    const handleCheckExcess =async(e)=> {
        setProtoState({ ...ProtoState, find: e.target.value })
        console.log('Get Index! ', all_model[e.target.value]);
        const CurrentId = all_model[e.target.value] ?? null;
        if(!CurrentId) return;

        await router.post('/production-order/admin',
            {
                action: 'excess',
                data: {model:CurrentId.Model ?? null}, 
                database: 'excess'
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    console.log('checking excess is completed!');
                }
            });
    }

    

    console.log('Details: ', Details,currentMessage,ProtoState , excess);
    return (
        <div className="management-content">
            <h4>Batching</h4>
            <p>Create batching , enter the lot number and quantity.</p>
            {
                (!Details) && <div className="loader-column">
                    <div className="loader-row" style={{ display:'flex' ,justifyContent:'center', alignItems:'center',background: '#E6F6FF', padding: '0.7rem', borderRadius: '1rem', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px', }}>
                        <div className="loader-row">
                            <label>Lot&nbsp;Number:</label>
                            <input
                                className={redIndex && redIndex.index && redIndex.index.includes('lot_number') ? 'red-required' : redIndex && ProtoState && ProtoState.lot_number ? 'green-required' : ''}
                                idName='lot_number'
                                value={ProtoState.lot_number}
                                onChange={(e) => {
                                                    setProtoState({ ...ProtoState, lot_number: e.target.value })
                                                    }} type="text" placeholder="lot number" />
                        </div>
                        <div className="loader-row">
                            <label>Model:</label>
                            <select
                                idName='find'
                                className={redIndex && redIndex.index && redIndex.index.includes('find') ? 'red-required' : redIndex && ProtoState && ProtoState.lot_number ? 'green-required' : ''}

                                onChange={(e) =>handleCheckExcess(e) } placeholder="lot number">
                                <option></option>
                                {
                                    all_model && Object.entries(all_model).map(([key, values]) => {
                                        return (
                                            <option key={key} value={key}>{values.Model}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="loader-row">
                            <label>Quantity:</label>
                            <input
                                className={redIndex && redIndex.index && redIndex.index.includes('quantity') ? 'red-required' : redIndex && ProtoState && ProtoState.lot_number ? 'green-required' : ''}
                                idName='quantity'
                                value={ProtoState.quantity}
                                onChange={(e) => setProtoState({ ...ProtoState, quantity: e.target.value })} type="number" placeholder="quantity" />
                            
                        </div>
                        <div className="loader-row">
                            <label>Condition</label>
                            <input
                                className={redIndex && redIndex.index && redIndex.index.includes('condition') ? 'red-required' : redIndex && ProtoState && ProtoState.condition ? 'green-required' : ''}
                                idName='condition'
                                value={ProtoState.condition}
                                onChange={(e) => setProtoState({ ...ProtoState, condition: e.target.value })} type="text" placeholder="condition" />
                        </div>
                        <div className="loader-row">
                            <label>Remarks</label>
                            <input
                                className={redIndex && redIndex.index && redIndex.index.includes('remarks') ? 'red-required' : redIndex && ProtoState && ProtoState.remarks ? 'green-required' : ''}
                                idName='remarks'
                                value={ProtoState.remarks}
                                onChange={(e) => setProtoState({ ...ProtoState, remarks: e.target.value })} type="text" placeholder="remarks" />
                        </div>
                        
                        <button onClick={(e) => {
                            handleBatching(ProtoState, e)
                        }} className="manage-update" style={{ alignSelf:'flex-end' }} >Batch</button>
                    </div>
                    {/* disabled={(BatchData.length >0)} */}
                </div>
            }
            {loader && 
                <>
                    <GeneratingLoader BatchData={BatchData}  Details={Details} generated_woid={ BatchData || Details ? generated_woid:null} setBatchData={setBatchData} setDetails={setDetails} setLoader={setLoader} setProtoState={setProtoState} setRedIndex={setRedIndex}/>
                </>
                }

        </div>
    )
}