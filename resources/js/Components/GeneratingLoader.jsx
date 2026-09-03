import { useState } from "react"
import { router } from "@inertiajs/react";
import AILoader from "./AILoader";
import GeneratingStatus from "./GeneratingStatus";
import BrokenLine from "../SVG/BorkenLines";
import LotTravellerGenerator from "../Components/LotTravellerGenerator";
export default function GeneratingLoader({ BatchData, WoidData, Details, generated_woid, setBatchData, setDetails, setLoader, setProtoState, setRedIndex }) {
    const [Batch, setBatch] = useState(false);
    const [WorkOrderId, setWorkOrderId] = useState(false);
    const [ProductionOrder, setProductionOrder] = useState(false);
    const [nextProcess, setNextProcess] = useState('batch');
    const [initialized, setInitialized] = useState(true);
    const [generation, setGeneration] = useState(false);
    const [shelfState ,setShelf] = useState(false);
    const [generateTraveller, setGenerateTraveller] = useState(false);

    function turnOnLoader(data, set) {
        if (!data) return

        setTimeout(() => {
            setInitialized(false);
            set(data)
        }, 3000)
    }

    const handleData = () => {
        turnOnLoader(BatchData, setBatch)

        turnOnLoader(generated_woid, setWorkOrderId)
    }

    handleData()

    const handleGenerateWOID = async (action, lot_number, batch_generated, database, status) => {
        setGeneration(true)
        console.log(lot_number);
        if (!action || !lot_number || !batch_generated || !database) return
        const mergeData = { lot_number: lot_number, batch_generated: batch_generated, status: status , shelf:shelfState , details:Details}
        const allData = JSON.stringify(mergeData)
        await router.post('/production-order/admin',
            {
                action: action,
                data: allData, database
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {

                    setWorkOrderId(generated_woid);

                }
            });
    }
    const handleError = () => {
        setBatchData(false);
        setDetails(false);
        setLoader(false);
        setProtoState(false);
        setProductionOrder(false);
        setRedIndex(false);
        setGeneration(false);
        setGenerateTraveller(false);
        setInitialized(false);
        setWorkOrderId(false);
        setBatch(false);
    }
    console.log('Batch Generate:', Batch, WorkOrderId, generation, Details ,shelfState);
    return (
        <div className="generate-container">
            <div className="generate-header">
                <div className="generate-title">
                    <h4>Generate Proto Traveler</h4>
                </div>

                <div className="generate-details" >
                    {
                        initialized ? <GeneratingStatus message="Generating Batch Number" loading={initialized} /> : <GeneratingStatus message="Generated Batch Number" loading={initialized} status={false} />
                    }
                    {
                        !initialized && Batch.length > 0 ? <BrokenLine color={'#076E32'} /> : <BrokenLine color={'#B7C2D2'} />
                    }
                    {
                        !WorkOrderId && Batch.length > 0 || !generation && Batch.length > 0 ?
                            <div className="generate-data">
                                <GeneratingStatus message={generation ? "Generating Work Orde I.D" : "Generate Wordk Order I.D?"} loading={!(Batch.length > 0) || generation} status="generate" />
                                {!generation && !Details.excess || !generation && Details.excess > 0 && shelfState  ? <button onClick={() => handleGenerateWOID('generate', Details, Batch, 'generate', 'batching')} className="generate-button">Generate</button>:null}
                            </div>
                            : WorkOrderId && Batch.length > 0 ?
                                <div className="generate-done">
                                    <GeneratingStatus message="Generated Work Order I.D" loading={false} status="generate" />
                                </div>
                                : <GeneratingStatus message="Waiting for Batch Number" loading={WorkOrderId} status="waiting" />
                    }
                    {
                        WorkOrderId ? <BrokenLine color={'#076E32'} /> : <BrokenLine color={'#B7C2D2'} />
                    }
                    {
                        !WorkOrderId || !generation ?
                            <GeneratingStatus message="Waiting for Work Order I.D" loading={false} status="waiting" />
                            : WorkOrderId && WorkOrderId.length > 0 ?
                                <div className="generate-done">
                                    <GeneratingStatus message="Generated Traveller" loading={false} status="generate" />
                                </div>
                                : null
                    }

                </div>

                {
                    Batch.length > 0 && Details &&
                
                        
                        <div className="generate-details" style={{ alignSelf: 'start' }}>
                            <div className="generate-batch" style={{ background:'#FFE68A'}}>
                                <h4>Model</h4>
                                <p>{Details.model ? Details.model : '?'}</p>
                            </div>
                            {
                                Details.hold_excess && 
                                <div className="generate-batch" style={{ background:'#FFF9E6' ,color:'#FFF0B8', width:'fit-content'}}>
                                    <div style={{ display:'flex' , flexDirection:'row' ,gap:'1rem'  }}>
                                        <h4>Model Excess:</h4>
                                        <p>{Details.hold_excess.excess ? Details.hold_excess.excess : '?'}</p>
                                    </div>
                                    <div style={{ display:'flex' , flexDirection:'row' ,gap:'1rem' }}>
                                        <h4>Batch Number:</h4>
                                        <p>{Details.hold_excess.generated_lot_number ? Details.hold_excess.generated_lot_number : '?'}</p>
                                        <h4>Shelf:</h4>
                                        <p>{Details.hold_excess.shelf ? Details.hold_excess.shelf : '?'}</p>
                                    </div>
                                </div>
                            }
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
                            {
                                Details.excess > 0  && 
                                <div className="generate-batch" style={{ width:'22rem' }}>
                                    <div style={{ display:'flex' , flexDirection:'row' ,gap:'1rem'  }}>
                                        <h4>Excess</h4>
                                        <p>{Details.excess ? Details.excess : 'No excess'}</p>
                                    </div>
                                    <div style={{ display:'flex' , flexDirection:'row' ,gap:'1rem'  }}>
                                        <h4>Shelf Store:</h4>
                                        <input disabled={(WorkOrderId && WorkOrderId.length > 0)} onChange={(e)=>setShelf(e.target.value)} className="shelf-row"/>
                                    </div>
                                </div>
                            }
                        </div>
                   
                }
                <div>
                    {
                        WorkOrderId && WorkOrderId.length > 0 && generation  && 
                        <div className="generate-printing">
                            <h4>Print Lot traveller?</h4>
                            <LotTravellerGenerator qrGeneration={WorkOrderId} />
                            <button className="done-btn" onClick={() => handleError()}>Done</button>
                        </div>
                    }
                </div>

            </div>
        </div>

    )
}