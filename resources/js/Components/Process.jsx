import React, { useState } from 'react';
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
export default function Process({ data, model, location, routing, order, error }) {

    console.log(location.permission);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    let isCorrectRoute = false;
    if (location && routing) {
       
        isCorrectRoute = routing.find(obj => obj.Description.toLowerCase() === location.location.toLowerCase()) ? location.location : false;
    }

    ;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const denpyoData = e.target.value;
            const extractedDenpyo = denpyoData.split(";");

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

    const checkIfOrderExist = order && Object.keys(order).length > 0 ? true : false;

    let DisplayStatus;
    if (checkIfOrderExist && order.Status) {
        DisplayStatus = order.Status.toUpperCase();
    }
    return (
        <>

            {/*Default Display*/
                !data &&
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
                                    <QrLogo />
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                )
            }


            {/*Scanned QR Code Display*/
                data &&
                (
                    <div className='scanned-view'>
                        {(!order && location.permission.toUpperCase() != 'ENCONDING') || (order && order.Status.toUpperCase() == 'LOADED' && location.permission.toUpperCase() == 'UNLOADING') ?
                            (
                                <>
                                    <ScannerTab routing={routing} model={model} data={data} order={order} location={location} workOrder={data && data.ID ? data.ID : ''} error={error} />
                                </>
                            ) : null
                        }
                        <div className='scanned-container'>
                            <Location location={location} />

                            <div className='scanned-details'>
                                <div className='scanned-header'>
                                    <div className='scanned-serial'>
                                        <h1>Serial&nbsp;Number:&nbsp;{data.ID.toUpperCase()}</h1>
                                    </div>
                                    <div className='scanned-status'>
                                        <h1>Status:&nbsp;{checkIfOrderExist ? DisplayStatus : 'ENCODING'}</h1>
                                    </div>
                                </div>
                                <div className='scanned-body'>
                                    <div>
                                        <div className='scanned-data'>
                                            <label>Model&nbsp;Name:</label>
                                            <input value={data && data.Model_Name ? data.Model_Name : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Quantity:&nbsp;</label>
                                            <input value={data && data.Quantity ? data.Quantity : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Route Code:&nbsp;</label>
                                            <input value={data && data.RoutingCode ? data.RoutingCode : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Lot/Batch&nbsp;No.:</label>
                                            <input value={data && data.RoutingCode ? data.RoutingCode : ''} disabled={true} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className='scanned-data'>
                                            <label>Media&nbsp;Size:</label>
                                            <input value={model && model.Media_Size ? model.Media_Size : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Condition&nbsp;Number:</label>
                                            <input value={model && model.Condition_Number ? model.Condition_Number : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Pre-treatment:</label>
                                            <input value={model && model.Pre_Treatment ? model.Pre_Treatment : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Post&nbsp;Treatment:</label>
                                            <input value={model && model.Post_Treatment ? model.Post_Treatment : ''} disabled={true} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className='scanned-data'>
                                            <label>Nickel&nbsp;1:&nbsp;</label>
                                            <input value={order && order.Nickel_1 ? order.Nickel_1 : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Nickel&nbsp;2:&nbsp;</label>
                                            <input value={order && order.Nickel_2 ? order.Nickel_2 : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Basket&nbsp;Number:</label>
                                            <input value={order && order.Basket_Number ? order.Basket_Number : ''} disabled={true} />
                                        </div>
                                        <div className='scanned-data'>
                                            <label>Operator:&nbsp;</label>
                                            <input value={order && order.Loader ? order.Loader : ''} disabled={true} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!order ?
                                (
                                    <div className='scanned-condition'>
                                        <h1>Requirements</h1>
                                        <Condition data={data} title={data ? "Serial Number is found in daily check file." : "Not found in daily check file."} />
                                        <Condition data={model} title={model ? "Model Order is Already Registered." : "Model Order Need to be registered."} />
                                        <Condition data={isCorrectRoute} title={isCorrectRoute ? `Currently at ${isCorrectRoute}` : "[Wrong Process Line!] STOP! CALL! WAIT! GO!"} />
                                    </div>
                                ) 
                                : checkIfOrderExist && (order.Status.toUpperCase() == 'LOADED' || order.Status.toUpperCase() == 'UNLOADED' )?
                                    (
                                        <>
                                            <div className='scanned-condition'>
                                                <div className='scanned-header'>
                                                    <div className='scanned-serial'>
                                                        <h1>UNLOADING</h1>
                                                    </div>
                                                </div>
                                                <div className='scanned-body'>
                                                    <div className='scanned-data'>
                                                        <label>Unloader</label>
                                                        <input value={order && order.Unloader ? order.Unloader : ''} onChange={''} disabled={true} />
                                                    </div>
                                                    <div className='scanned-data'>
                                                        <label>Container</label>
                                                        <input value={order && order.Container ? order.Container : ''}  onChange={''} disabled={true} />
                                                    </div>
                                                    <div className='scanned-data'>
                                                        <label>Poly&nbsp;Bag</label>
                                                        <input value={order && order.PolyBag ? order.PolyBag : ''} onChange={''} disabled={true} />
                                                    </div>
                                                    <div className='scanned-data'>
                                                        <label>Endorsed&nbsp;To</label>
                                                        <input value={order && order.Endorsed_To ? order.Endorsed_To : ''} onChange={''} disabled={true} />
                                                    </div>
                                                </div>

                                            </div>
                                        </>
                                    ) 
                                : null
                            }
                        </div>
                    </div>
                )
            }
        </>
    );
}
