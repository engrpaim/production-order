import React from 'react';
import '../../css/location.css';

export default function Location({location}) {
    if(location){
        console.log('Location :'+ location.ip_address);
    }
    return(
        <>
            {location ?
                (
                    <div className='location-container'>
                        <div className='location-contents'>
                            <div className='location-left'>
                                <h1><strong>I.P Address:&nbsp;</strong>{location.ip_address ? location.ip_address : 'Unknown'}</h1>
                                <h1><strong>Location:&nbsp;</strong>{location.location ? location.location : 'Unknown'}</h1>
                            </div>
                             {
                                location.permission &&
                                (
                                    <div className='location-permission'>
                                        <h1><strong>Permission:&nbsp;</strong>{location.permission ? location.permission.toUpperCase() : 'Unknown'}</h1>
                                    </div>
                                )
                            }
                            {
                                location.user && location.id_number &&
                                (
                                    <div className='location-middle'>
                                        <h1><strong>User:&nbsp;</strong>{location.user ? location.user : 'Unknown'}</h1>
                                        <h1><strong>I.D Number:&nbsp;</strong>{location.id_number ? location.id_number : 'Unknown'}</h1>
                                    </div>
                                )
                            }
                            <div className='location-right'>
                                <svg  version="1.1" id="Capa_1" viewBox="0 0 20.234 20.234">
                                    <g>
                                        <path fill="currentColor" d="M6.776,4.72h1.549v6.827H6.776V4.72z M11.751,4.669c-0.942,0-1.61,0.061-2.087,0.143v6.735h1.53   V9.106c0.143,0.02,0.324,0.031,0.527,0.031c0.911,0,1.691-0.224,2.218-0.721c0.405-0.386,0.628-0.952,0.628-1.621   c0-0.668-0.295-1.234-0.729-1.579C13.382,4.851,12.702,4.669,11.751,4.669z M11.709,7.95c-0.222,0-0.385-0.01-0.516-0.041V5.895   c0.111-0.03,0.324-0.061,0.639-0.061c0.769,0,1.205,0.375,1.205,1.002C13.037,7.535,12.53,7.95,11.709,7.95z M10.117,0   C5.523,0,1.8,3.723,1.8,8.316s8.317,11.918,8.317,11.918s8.317-7.324,8.317-11.917S14.711,0,10.117,0z M10.138,13.373   c-3.05,0-5.522-2.473-5.522-5.524c0-3.05,2.473-5.522,5.522-5.522c3.051,0,5.522,2.473,5.522,5.522   C15.66,10.899,13.188,13.373,10.138,13.373z"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                )
            : (
                    <div className='error-location-container'>
                        <div className='error-location-contents'>
                            <div className='error-location-left'>
                                <h1><i>I.P Address is not registered. Stop! Call! Wait! Go!</i></h1>
                            </div>
                            <div className='error-location-right'>
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 28 28" fill="none">
                                <path d="M22.7399 6.32717C24.3781 8.48282 24.2132 11.571 22.2453 13.5389L20.3007 15.4835C20.0078 15.7764 19.533 15.7764 19.2401 15.4835L12.5226 8.76595C12.2297 8.47306 12.2297 7.99818 12.5226 7.70529L14.4671 5.76075C16.4352 3.79268 19.5237 3.62792 21.6793 5.26646L24.7238 2.22166C25.0167 1.92875 25.4916 1.92873 25.7845 2.22161C26.0774 2.51449 26.0774 2.98936 25.7845 3.28227L22.7399 6.32717Z" fill="currentColor"/>
                                <path d="M12.7778 12.2757C13.0707 11.9828 13.0707 11.5079 12.7778 11.215C12.485 10.9221 12.0101 10.9221 11.7172 11.215L9.59085 13.3413L8.76851 12.5189C8.47561 12.226 8.00074 12.226 7.70785 12.5189L5.7633 14.4635C3.79537 16.4314 3.6305 19.5196 5.26867 21.6752L2.22404 24.7202C1.93116 25.0131 1.93118 25.488 2.22409 25.7808C2.517 26.0737 2.99187 26.0737 3.28475 25.7808L6.32928 22.736C8.48495 24.3745 11.5734 24.2097 13.5415 22.2416L15.486 20.2971C15.7789 20.0042 15.7789 19.5293 15.486 19.2364L14.6589 18.4093L16.7842 16.284C17.0771 15.9912 17.0771 15.5163 16.7842 15.2234C16.4913 14.9305 16.0164 14.9305 15.7235 15.2234L13.5982 17.3486L10.6515 14.4019L12.7778 12.2757Z" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
};
