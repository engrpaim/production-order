import React from 'react';
import Close from '../SVG/close';
import '../../css/process.css';
export default function ScannedItems({itemName ,itemValue , onRemove}) {
    return(
        <>
            <div className='scanned-per-items'>
                <p><strong>{itemName}:</strong>&nbsp; {itemValue}</p>
                <Close itemName={itemName} onRemove={onRemove}/>
            </div>
        </>
    );
}
