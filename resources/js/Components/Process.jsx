import React , { useState , useEffect}from 'react';
import { router } from '@inertiajs/react';
import '../../css/app.css';
import '../../css/process.css';
import Location from '../Components/Location';
import Condition from '../Components/Condition';
import QrLogo from '../SVG/qrLogo';
import ScannedItems from '../Components/scannedItems';
import ErrorComponent from '../Components/ErrorComponent';
import UnloadSvg from '../SVG/unload';
import ScannerTab from './ScannerTab';
export default function Process({data,model,location,routing , order}) {
    //Track State
    //Get From Inventory Database
    const [workOrder, setWorkOrder] = useState(false);
    const [Model, setModel] = useState(false);
    const [Quantity , setQuantity] = useState(false);
    const [RouteCode , setRouteCode] = useState(false);
    const [lotBatch , setlotBatch] = useState(false);

    //Get From Laravel Host DB
    const [MediaSize , setMediaSize] = useState(false);
    const [PreTreatment , setPreTreatment] =useState(false);
    const [PostTreatment ,setPostTreatment] = useState(false);
    const [ConditionNumber ,setConditionNumber] = useState(false);
    // const [ErrorCheck , setErrorCheck] = useState(false);
    // const [Message , setMessage] = useState(false);
    // const [scannedItems, setScannedItems] = useState({});


    /*Work Order Scanning*/

    const [PermissionLevel , setPermissionLevel] = useState(location.permission);
    useEffect(() => {
        if(data){
            setWorkOrder(data.ID);
            setModel(data.Model_Name);
            setQuantity(data.Quantity);
            setlotBatch(data.Lot_No);
            setRouteCode(data.RoutingCode);
        }
    },[data]);

    useEffect(() => {
        if(location){

            setPermissionLevel(location.permission);

        }
    },[location]);
    console.log(PermissionLevel);
    useEffect(() => {
        if(model){
            setMediaSize(model.Media_Size);
            setPreTreatment(model.Pre_Treatment);
            setPostTreatment(model.Post_Treatment);
            setConditionNumber(model.Condition_Number);
        }
    },[model]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    let isCorrectRoute = false;
    if(location && routing){
         isCorrectRoute = routing.find(obj => obj.Description.toLowerCase() === location.location.toLowerCase()) ?location.location: false ;
    }

  ;

    const handleKeyDown = (e) =>{
        if(e.key === 'Enter'){
            e.preventDefault();
            const denpyoData = e.target.value;
            console.log(denpyoData);
            const extractedDenpyo = denpyoData.split(";");
            //Set State after scanned
            setWorkOrder(extractedDenpyo[0]);
            extractedDenpyo[1] ? setModel(extractedDenpyo[1]) : setModel(false) ;
            setQuantity(extractedDenpyo[3]);
            setRouteCode(extractedDenpyo[4]);



            router.visit(`/production-order/encode?serial=${extractedDenpyo[0]}`, {
                method: 'get',
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {

                    console.log('Sucessfull scanned');

                },
                onError: (errors) => {
                    console.error('Erro scanned:', errors);
                }
            });
        }
    };



    // /*Scan Details functions */
    // const [scanInputValue, setScanInputValue] = useState('');
    // const [scannedItems, setScannedItems] = useState({});

    // const handleRemove = (itemName) => {
    //         setScannedItems(prev => {
    //         const updated = { ...prev };
    //         delete updated[itemName];
    //         return updated;
    //         });
    //     };

    // const handleAddDetails= (e) => {
    //     if(e.includes('?')){

    //         const itemName = e.split("?")[0].trim();
    //         const itemValue = e.split("?")[1].trim();
    //         setScannedItems(prev => ({
    //             ...prev,
    //             [itemName]: itemValue
    //         }));
    //         console.log('Item Added:', itemName, itemValue);
    //         setScanInputValue('');

    //     }else if(e.includes('00;') || e.includes('01;')){

    //         console.log(scannedItems);
    //         const Find = ["Nickel 1", "Nickel 2", "Basket Number"];
    //         const hasValidKey = Find.every(key => key in scannedItems);

    //         if(hasValidKey){

    //             let IdCode = e.split(';')[0].trim();

    //             if(IdCode == '00'){
    //                 IdCode = 'Operator';
    //             }else{
    //                 IdCode = 'PIC';
    //             }

    //             const IdName = e.split(';')[2].trim();

    //             setScannedItems(any =>({
    //                 ...any,
    //                 [IdCode]: IdName
    //             }));
    //             console.error('Updated Items:', scannedItems);

    //             setErrorCheck(false);
    //             setScanInputValue('');

    //             router.visit('/production-order/encode', {
    //                 method: 'post',
    //                 data:
    //                 {
    //                     'scanned_data': scannedItems,
    //                     'location'  : location,
    //                     'model_order' : model,
    //                     'workOrder': workOrder,
    //                     'IdName' : IdName,
    //                     'IdCode' : IdCode,
    //                     'daily_check_file' : data,
    //                 },

    //                  onSuccess: (page) => {
    //                     console.log('Saving Loading!');
    //                 },
    //                 onError: (errors) => {
    //                     console.error('Error scanned:', errors);
    //                 }
    //             });

    //         }else{
    //             setMessage( 'Please scan all details first!');
    //             setErrorCheck(true);
    //             setScanInputValue('');
    //         }

    //     }else{
    //        setErrorCheck(true);
    //        setMessage( 'QR Code is not valid!');
    //        setScanInputValue('');
    //     }

    // };

    // const handleScanDetails = (e) => {
    //     if(e.key === 'Enter') {
    //         e.preventDefault();
    //         handleAddDetails(scanInputValue);
    //     }
    // };

    // //Ouput Data
    // console.log('Routing Code:', routing);
    // console.log('location Process:', location);
    // console.log('Model:', model);



    // /*Requirements Check*/
    // const checkIfRouteIsCorrect = isCorrectRoute !=  '' ? true:false ;
    // const checkIfModelExist = model && Object.keys(model).length > 0 ? true:false ;
    // const checkIfDataExist = data && Object.keys(data).length > 0 ? true:false ;
    const checkIfOrderExist = order && Object.keys(order).length > 0 ? true : false;
    // const IsAllowedScan = [checkIfRouteIsCorrect,checkIfModelExist,checkIfDataExist];
    // const isAllowed = IsAllowedScan.some(value => value === false ? true : false);
    // console.log(order);
    // let DisplayStatus;
    // if(checkIfOrderExist && order.Status){
    //    DisplayStatus = order.Status.toUpperCase();
    // }
    let DisplayStatus;
    if(checkIfOrderExist && order.Status){
        DisplayStatus = order.Status.toUpperCase();
    }
    return(
        <>

            {/*Default Display*/
                !workOrder &&
                (
                    <div className='process-main'>
                        <div className='process-container'>
                        <Location location={location} />
                           {location && <div className='compile-process'>
                                <div className='process-title'>
                                    <h2>Input&nbsp;Order</h2>
                                </div>
                                <div className='process-scan-container'>
                                    <label>Scan&nbsp;Work&nbsp;I.D:&nbsp;</label>
                                    <input
                                        className='process-scanner'
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        />
                                    <QrLogo/>
                                </div>
                            </div>
                           }
                        </div>
                    </div>
                )
            }


            {/*Scanned QR Code Display*/
                workOrder &&
                (
                     <div className='scanned-view'>
                        {(!checkIfOrderExist  && !checkIfOrderExist && location.permission.toUpperCase() != 'UNLOADING') || (checkIfOrderExist && order.Status.toUpperCase() == 'LOADED' && location.permission.toUpperCase() == 'UNLOADING' ) ?
                            (
                                <>
                                    <ScannerTab routing={routing} model={model} data={data} location={location} workOrder={workOrder}/>
                                </>
                            ):null
                        }
                        <div className='scanned-container'>
                            <Location location={location} />

                                    <div className='scanned-details'>
                                        <div className='scanned-header'>
                                            <div className='scanned-serial'>
                                                <h1>Serial&nbsp;Number:&nbsp;{workOrder.toUpperCase()}</h1>
                                            </div>
                                            <div className='scanned-status'>
                                                <h1>Status:&nbsp;{checkIfOrderExist ? DisplayStatus : 'ENCODING'}</h1>
                                            </div>
                                        </div>
                                        <div className='scanned-body'>
                                            <div>
                                                <div className='scanned-data'>
                                                    <label>Model&nbsp;Name:</label>
                                                    <input value={Model ? Model:''}  disabled={true}/>
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Quantity:&nbsp;</label>
                                                    <input value={Quantity ? Quantity:''}  disabled={true}/>
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Route Code:&nbsp;</label>
                                                    <input value={RouteCode ? RouteCode:''}  disabled={true}/>
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Lot/Batch&nbsp;No.:</label>
                                                    <input value={lotBatch ? lotBatch: ''} disabled={true} />
                                                </div>
                                            </div>
                                            <div>
                                            <div className='scanned-data'>
                                                    <label>Media&nbsp;Size:</label>
                                                    <input value={MediaSize ? MediaSize:''}  disabled={true}/>
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Condition&nbsp;Number:</label>
                                                    <input value={ConditionNumber ? ConditionNumber:''}  disabled={true}/>
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Pre-treatment:</label>
                                                    <input value={PreTreatment ? PreTreatment:''}  disabled={true}/>
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Post&nbsp;Treatment:</label>
                                                    <input value={PostTreatment ? PostTreatment:''}  disabled={true}/>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='scanned-data'>
                                                    <label>Nickel&nbsp;1:&nbsp;</label>
                                                    <input value={checkIfOrderExist && order.Nickel_1 ? order.Nickel_1 : '' } disabled={true} />
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Nickel&nbsp;2:&nbsp;</label>
                                                    <input value={checkIfOrderExist && order.Nickel_2 ? order.Nickel_2 : '' } disabled={true}  />
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Basket&nbsp;Number:</label>
                                                    <input value={checkIfOrderExist && order.Basket_Number ? order.Basket_Number : '' } disabled={true}/>
                                                </div>
                                                <div className='scanned-data'>
                                                    <label>Operator:&nbsp;</label>
                                                    <input value={checkIfOrderExist && order.Loader ? order.Loader : '' }  disabled={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                            {!checkIfOrderExist  ?
                                (
                                    <div className='scanned-condition'>
                                        <h1>Requirements</h1>
                                        <Condition data={data} title={data ? "Serial Number is found in daily check file.":"Not found in daily check file."} />
                                        <Condition data={model} title={model ? "Model Order is Already Registered.":"Model Order Need to be registered."} />
                                        <Condition data={isCorrectRoute} title={isCorrectRoute? `Currently at ${isCorrectRoute}`:"[Wrong Process Line!] STOP! CALL! WAIT! GO!"} />
                                    </div>
                                ): checkIfOrderExist && order.Status.toUpperCase() == 'LOADED' ?
                                (
                                    <>

                                   <div className='scanned-condition'>
                                        <div className='scanned-header'>
                                    <div className='scanned-serial'>
                                        <h1>Serial&nbsp;Number:&nbsp;{workOrder.toUpperCase()}</h1>
                                    </div>
                                    <div className='scanned-status'>
                                        <h1>Status:&nbsp;{checkIfOrderExist ? DisplayStatus : 'ENCODING'}</h1>
                                    </div>
                                </div>
                                         <div className='scanned-body'>
                                            <div className='scanned-data'>
                                                <label>Unloader</label>
                                                <input value={''} onChange={''} disabled={true}/>
                                            </div>
                                            <div className='scanned-data'>
                                                <label>Container</label>
                                                <input value={''} onChange={''} disabled={true}/>
                                            </div>
                                            <div className='scanned-data'>
                                                <label>Poly&nbsp;Bag</label>
                                                <input value={''} onChange={''} disabled={true}/>
                                            </div>
                                            <div className='scanned-data'>
                                                <label>Endorsed&nbsp;To</label>
                                                <input value={''} onChange={''} disabled={true}/>
                                            </div>
                                        </div>

                                   </div>
                                   </>
                                ):
                                (
                                   <div className='scanned-condition'>
                                        <div className = 'scanned-unload'>
                                            <div className="unload-header">
                                                <h1>Please Unload to <strong>{location.location}</strong></h1>
                                                <h4>Your Machine {location.ip_address} is not permitted to Unload!</h4>
                                            </div>
                                            <div className="unload-logo">
                                                <UnloadSvg/>
                                            </div>
                                        </div>
                                   </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </>
    );
}
