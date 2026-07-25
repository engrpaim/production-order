import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import QrLogo from '../SVG/qrLogo';
import ScannedItems from '../Components/scannedItems';
import ErrorComponent from '../Components/ErrorComponent';
import '../../css/process.css';
import Notification from './Notification';
export default function ScannerTab({ routing, order, location, model, data, workOrder, error }) {
    const [ErrorCheck, setErrorCheck] = useState(false);
    const [Message, setMessage] = useState(error);
    console.log('Scanner tabss: ', routing, order, location, model, data, workOrder);
    let isCorrectRoute = false;
    if (location && routing) {
        isCorrectRoute = routing.find(obj => obj.Description.toLowerCase() === location.location.toLowerCase()) ? location.location : false;
    }
    const [scanInputValue, setScanInputValue] = useState('');
    const [scannedItems, setScannedItems] = useState({});

    const handleRemove = (itemName) => {
        setScannedItems(prev => {
            const updated = { ...prev };
            delete updated[itemName];
            return updated;
        });
    };
    const handleNotfiError=(messageText)=>{
        setMessage(messageText)
        setTimeout(()=>{
            setMessage(false)
        },3000)
    }
    const handleAddDetails = (e) => {
        if (e.includes('?')) {

            const itemName = e.split("?")[0].trim();
            const itemValue = e.split("?")[1].trim();
            if (!itemName || !itemValue) return
            setScannedItems(prev => ({
                ...prev,
                [itemName]: itemValue
            }));
            console.log('Item Added:', itemName, itemValue);
            setScanInputValue('');

        } else if (e.includes('00;') || e.includes('01;')) {

            console.log('asdasdas', scannedItems);
            const FindLoading = location.permission.toUpperCase() == 'LOADING' ? ["Nickel 1", "Nickel 2", "Basket Number"] : ["Container", "Poly Bag", "Endorsed To"];
            const hasValidKey = FindLoading.every(key => key in scannedItems);
            const IdName = e.split(';')[2].trim();
            let IdCode = e.split(';')[0].trim();

            if (IdCode == '00') {
                IdCode = 'Operator';
            } else {
                IdCode = 'PIC';
            }
            console.log('POSTING: ', hasValidKey, location.permission.toUpperCase());
            if (hasValidKey && location.permission.toUpperCase() == 'LOADING') {



                console.error('Updated Items:', scannedItems);

                setErrorCheck(false);
                setScanInputValue('');

                router.visit('/production-order/encode', {
                    method: 'post',
                    data:
                    {
                        'scanned_data': scannedItems,
                        'location': location,
                        'model_order': model,
                        'workOrder': data && data.ID ? data.ID : '',
                        'IdName': IdName,
                        'IdCode': IdCode,
                        'daily_check_file': data,
                        'current': location && location.permission ? location.permission : false
                    },

                    onSuccess: (page) => {
                        console.log('Saving Loading!');
                    },
                    onError: (errors) => {
                        console.error('Error scanned:', errors);
                    }
                });

            } else if (hasValidKey && location.permission.toUpperCase() == 'UNLOADING') {

                console.log('VALID KEYS!', hasValidKey);
                setErrorCheck(false);
                setScanInputValue('');
                const IdName = e.split(';')[2].trim();
                router.visit('/production-order/encode', {
                    method: 'post',
                    data:
                    {
                        'scanned_data': scannedItems,
                        'location': location,
                        'model_order': model,
                        'workOrder': data && data.ID ? data.ID : '',
                        'IdName': IdName,
                        'IdCode': IdCode,
                        'daily_check_file': data,
                        'current': location && location.permission ? location.permission : false
                    },

                    onSuccess: (page) => {
                        console.log('Saving Loading!');
                    },
                    onError: (errors) => {
                        console.error('Error scanned:', errors);
                    }
                });
            } else {
                console.log('SCANNEDD ITEM: ', scannedItems);
                const messageDetails = hasValidKey && location.permission.toUpperCase() ? 'Scan all details':'Invalid Permission!'
                handleNotfiError(messageDetails);
                setErrorCheck(true);
                setScanInputValue('');
            }

        } else {
            setErrorCheck(true);
            handleNotfiError('QR Code is not valid!');
            setScanInputValue('');
        }

    };

    const handleScanDetails = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddDetails(scanInputValue);
        }
    };

    //Ouput Data
    console.log('Routing Code:', routing);
    console.log('location Process:', location);
    console.log('Model:', model);



    /*Requirements Check*/
    const checkIfRouteIsCorrect = isCorrectRoute != '' ? true : false;
    const checkIfModelExist = model && Object.keys(model).length > 0 ? true : false;
    const checkIfDataExist = data && Object.keys(data).length > 0 ? true : false;
    const checkIfOrderExist = order && Object.keys(order).length > 0 ? true : false;
    const IsAllowedScan = [checkIfRouteIsCorrect, checkIfModelExist, checkIfDataExist];
    const isAllowed = IsAllowedScan.some(value => value === false ? true : false);
    console.log('Scanned :', data, order, routing);


    return (
        <>
            <div className='scanner-processor'>
                <div className='scanner-processor-title'>
                    <h1>Scan&nbsp;Details</h1>
                </div>
                <div className='scanner-processor-input'>
                    <input value={scanInputValue} onChange={(e) => setScanInputValue(e.target.value)} onKeyDown={handleScanDetails} disabled={isAllowed} />
                    <QrLogo />
                </div>
                <div className='scanned-items'>
                    <h1>Order List</h1>
                    {
                        scannedItems && Object.entries(scannedItems).map(([key, value]) => (
                            <ScannedItems key={key} itemName={key} itemValue={value} onRemove={handleRemove} />
                        ))
                    }
                   
                    {
                        Message ?
                            <div className='error-message'>
                                {Message}
                            </div> : null
                    }
                   
                </div>
            </div>
        </>
    );
}
