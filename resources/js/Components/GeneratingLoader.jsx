import { useState } from "react"
import { router } from "@inertiajs/react";
import AILoader from "./AILoader";
import GeneratingStatus from "./GeneratingStatus";
import BrokenLine from "../SVG/BorkenLines";
export default function GeneratingLoader({ BatchData, WoidData, Details,generated_woid }) {
    const [Batch, setBatch] = useState(false);
    const [WorkOrderId, setWorkOrderId] = useState(false);
    const [ProductionOrder, setProductionOrder] = useState(false);
    const [loader, setLoader] = useState(false);
    const [nextProcess, setNextProcess] = useState('batch');
    const [initialized, setInitialized] = useState(true);
    const [generation,setGeneration] = useState(false);
    function turnOnLoader(data, set) {
        if (!data) return

        setTimeout(() => {
            setInitialized(false);
            set(data)
        }, 3000)
    }

    const handleData = () => {
        turnOnLoader(BatchData, setBatch)
        turnOnLoader(WoidData, setBatch)
    }

    handleData()

    const handleGenerateWOID = async(action,lot_number , batch_generated,database,status)=>{
        setGeneration(true)
        console.log(lot_number);
        if(!action || !lot_number || !batch_generated || !database) return
        const mergeData  ={ lot_number:lot_number , batch_generated:batch_generated , status:status}
        const allData = JSON.stringify(mergeData)
        await router.post('/production-order/admin',
            { 
                action:action, 
                data:allData ,database
            },
            {
                preserveScroll:true,
                preserveState:true,
                onSuccess:()=>{
                    setWorkOrderId(generated_woid);
                }
            });
    }
    console.log('Batch Generate:', Batch,generated_woid);
    return (
        <div className="generate-container">
            <div className="generate-header">
                <div className="generate-title">
                    <h4>Generate Proto Traveler</h4>
                </div>

                <div className="generate-details" >
                    {
                        initialized  ? <GeneratingStatus message="Generating Batch Number" loading={initialized} /> : <GeneratingStatus message="Generated Batch Number" loading={initialized} status={false} />
                    }
                    {
                        !initialized && Batch.length > 0 ? <BrokenLine color={'#076E32'}/> : <BrokenLine color={'#B7C2D2'} />
                    }
                    {
                        !generated_woid && Batch.length > 0 ?
                            <div className="generate-data">
                                <GeneratingStatus message={generation ?"Generating Work Orde I.D":"Generate Wordk Order I.D?"} loading={!(Batch.length > 0) || generation} status="generate"/>
                                {!generation && <button onClick={()=>handleGenerateWOID('generate' , Details,Batch,'generate','batching')} className="generate-button">Generate</button>}
                            </div>
                        :generated_woid  && Batch.length > 0 ?
                            <div className="generate-done">
                                <GeneratingStatus message="Generated Work Order I.D" loading={false} status="generate"/>
                            </div>
                        :<GeneratingStatus message="Waiting for Batch Number" loading={WorkOrderId} status="waiting"/>
                    }
                    {
                        WorkOrderId ?  <BrokenLine color={'#076E32'} />:<BrokenLine color={'#B7C2D2'}/> 
                    }
                    {
                        generated_woid && !ProductionOrder ?
                        <div className="generate-loading">
                            
                            <GeneratingStatus message="Creating Traveller!" loading={generated_woid} status="waiting"/>
                        </div>
                        :ProductionOrder ? 
                            <div className="generate-done">
                                <GeneratingStatus message="Generated Work Order I.D" loading={false} status="generate"/>
                            </div>
                        :<GeneratingStatus message="Waiting for Work Order I.D" loading={ProductionOrder} status="waiting"/>
                    }

                </div>

                {
                    Batch.length > 0 && Details &&
                    <div className="generate-details">
                        <div className="generate-batch">
                            <h4>Model</h4>
                            <p>{Details.model ? Details.model : '?'}</p>
                        </div>
                        <div className="generate-batch">
                            <h4>Lot Number</h4>
                            <p>{Details.lot_number ? Details.lot_number : 'No excess'}</p>
                        </div>
                        <div className="generate-batch">
                            <h4>Lot Quantity</h4>
                            <p>{Details.lot_quantity ? Details.lot_quantity.toLocaleString() : '?'}</p>
                        </div>
                        <div className="generate-batch">
                            <h4>Total Batches</h4>
                            <p>{Details.total ? Details.total.toLocaleString() : '?'}</p>
                        </div>
                        <div className="generate-batch">
                            <h4>Quantity Per Batch</h4>
                            <p>{Details.quantity ? Details.quantity.toLocaleString() : '?'}</p>
                        </div>
                        <div className="generate-batch">
                            <h4>Excess</h4>
                            <p>{Details.excess ? Details.excess : 'No excess'}</p>
                        </div>
                    </div>
                }
                <div>
                    {/* <div className="generate-table">

                                {
                                    Batch.length > 0 &&
                                    <>
                                        <div className="generate-title">
                                            <p>Generated Batch</p>
                                        </div>
                                        <table>
                                            <thead>
                                                <tr>

                                                    <th>Model Code</th>
                                                    <th>Model Name</th>
                                                    <th>Qty/Lot</th>
                                                    <th>Batch Number</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    Batch.map((items) => {
                                                        return (
                                                            <tr >
                                                                <td>{items.code}</td>
                                                                <td>{items.model}</td>
                                                                <td>{items.quantity}</td>
                                                                <td>{items.batch_number}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </>

                                }
                            </div> */}
                </div>

            </div>
        </div>

    )
}