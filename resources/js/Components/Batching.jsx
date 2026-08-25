import { useState, useRef } from "react"
import { router } from "@inertiajs/react";
import AILoader from "./AILoader";
import Confirm from "./Confirm";
import GeneratingLoader from "./GeneratingLoader";
import { checkIfRequired } from "../Utilities/UtilityFunctions";
export default function Batching({ all_model , generated_woid}) {

    const [ProtoState, setProtoState] = useState(false);
    const [BatchData, setBatchData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [Details, setDetails] = useState(false);
    const [redIndex, setRedIndex] = useState(false);
    function suffix(batchPlaceValue) {
        if (batchPlaceValue >= 1) {
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
        console.log(required);
        if (!data.find) {
            turnOfLoader(setRedIndex)
            return
        }
        const find = Number(data.find)
        const currentModel = all_model[find]
        console.log('FINND: ', currentModel);
        if (!currentModel.Quantity || !data.quantity || !data.lot_number) return turnOffLoader(2000, setLoader)
        setLoader(true)
        console.log('CURRENT MODE: ', currentModel.quantity);
        const GeneratedBatch = [];
        const lotNumber = data.lot_number.replace(" ", "");
        const lotQuantity = Number(data.quantity);
        const batchQuantity = currentModel.Quantity;
        const ModelCode = currentModel.Model_Code;
        const Model = currentModel.Model;

        //Split Current lot
        const TotalBatches = lotQuantity / batchQuantity
        const excess = TotalBatches - Math.floor(TotalBatches)
        const TotalExcess = Math.round(excess * batchQuantity)
        const TotalBatchWithExcess = Math.floor(TotalBatches)
        console.log('Total Batches: ', TotalBatches, excess, TotalExcess, TotalBatchWithExcess);

        //generate batch number
        let verify = 0
        Array.from({ length: TotalBatchWithExcess + 1 }, (_, index) => {
            const current = index
            const batchPlaceValue = current.toString().length;

            const setSuffix = suffix(batchPlaceValue)

            if (TotalBatchWithExcess !== current) {
                verify += batchQuantity
                GeneratedBatch.push({ batch: index + 1, quantity: batchQuantity, condition: 'exact', batch_number: `${lotNumber}-${setSuffix}${current + 1}`, code: ModelCode, model: Model })
            } else {
                verify += TotalExcess
                excess > 0 ? GeneratedBatch.push({ batch: index + 1, quantity: TotalExcess, condition: 'excess', batch_number: `${lotNumber}-${setSuffix}${current + 1}`, code: ModelCode, model: Model }) : null
            }

        })

        setBatchData(GeneratedBatch)
        setDetails({ excess: TotalExcess, total: excess > 0 ? TotalBatchWithExcess + 1 : TotalBatchWithExcess, quantity: batchQuantity, model: Model ,lot_number: lotNumber, lot_quantity:verify})
        console.log('Generated Batches: ', GeneratedBatch, verify)
    }
    
    console.log('Details: ', Details);
    return (
        <div className="management-content">
            <h4>Batching</h4>
            <p>Create batching , enter the lot number and quantity.</p>
            {
                (!Details) && <div className="loader-column">
                    <div className="loader-row" style={{ background: '#E6F6FF', padding: '1.2rem 0.7rem', borderRadius: '1rem', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px', }}>
                        <div className="loader-row">
                            <label>Lot&nbsp;Number:</label>
                            <input
                                className={redIndex && redIndex.index.includes('lot_number') ? 'red-required' : redIndex && ProtoState && ProtoState.lot_number ? 'green-required' : ''}
                                idName='lot_number'
                                value={ProtoState.lot_number}
                                onChange={(e) => setProtoState({ ...ProtoState, lot_number: e.target.value })} type="text" placeholder="lot number" />
                        </div>
                        <div className="loader-row">
                            <label>Model:</label>
                            <select
                                idName='find'
                                className={redIndex && redIndex.index.includes('find') ? 'red-required' : redIndex && ProtoState && ProtoState.lot_number ? 'green-required' : ''}

                                onChange={(e) => setProtoState({ ...ProtoState, find: e.target.value })} placeholder="lot number">
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
                                className={redIndex && redIndex.index.includes('quantity') ? 'red-required' : redIndex && ProtoState && ProtoState.lot_number ? 'green-required' : ''}
                                idName='quantity'
                                value={ProtoState.quantity}
                                onChange={(e) => setProtoState({ ...ProtoState, quantity: e.target.value })} type="number" placeholder="quantity" />
                        </div>
                        <button onClick={(e) => {
                            handleBatching(ProtoState, e)
                        }} className="manage-update" >Batch</button>
                    </div>
                    {/* disabled={(BatchData.length >0)} */}
                </div>
            }
            {loader && <GeneratingLoader BatchData={BatchData} Details={Details} generated_woid={generated_woid}/>}

        </div>
    )
}