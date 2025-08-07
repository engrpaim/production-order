import React from 'react';
import CheckSvg from '../SVG/check';
import WrongSvg from '../SVG/wrong';
import '../../css/condition.css';

export default function Condition({ data , title}) {
    return(
        <>
            <div className='condition-data'>
                {data ? <CheckSvg /> : <WrongSvg />}
                    <h2>{title}</h2>
            </div>
        </>
    );
}
