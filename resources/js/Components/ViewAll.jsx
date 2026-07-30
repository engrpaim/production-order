import '../../css/view.css';
import { useState } from 'react';
import { Link ,router,useForm ,usePage} from '@inertiajs/react';
export default function ViewAll({ list, setLoader}) {
    console.log('View all: ', list.data, list);
    const searchParams = new URLSearchParams(window.location.search);
    const serial = searchParams.get('serial');
    const modelGet = searchParams.get('model');
    const startGet = searchParams.get('date_start');
    const endGet = searchParams.get('date_end');
    const  { data ,setData ,get, processing,errors} = useForm({
        model:modelGet ?? '',
        date_start:startGet ?? '',
        date_end: endGet ?? '',
        serial: serial ?? ''
    });
    
    
    const handleFilter  =async(e,details,action)=>{
        console.log('sadas',e);
        if(!details || action === 'clear') return window.location.href = '/production-order/view'
        const params = details
        await router.get('/production-order/view',details, {
            preserveState: true,
            preserveScroll: true,
            
        });
    }
    console.log('Current Data: ',data,list.data === null);
    return (
        <div className="view-main">
            <div className="view-content">
                <div>
                    <h1>Order List</h1>
                    <p>Show all Work Order I.D that has been processed in P2 Plating Process.</p>
                </div>
                <p style={{ alignSelf:'center' ,fontSize:'10px'}}>Production Order by Automation Engineering</p>
                <div className='view-filter'>
                    <div className='view-filter-options'>
                        <div>
                            <p>Filters</p>
                        </div>
                        <div className='filter-data'>
                            <p>Model</p>
                            <input onKeyDown={(e) => e.key === 'Enter' && handleFilter(e,data , 'search')} value={data.model} onChange={(e)=>setData('model',e.target.value)}/>
                        </div>
                        <div className='filter-data'>
                            <p>Serial</p>
                            <input  onKeyDown={(e) =>  e.key === 'Enter' && handleFilter(e,data , 'search')} value={data.serial} onChange={(e)=>setData('serial',e.target.value)}/>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                            <div className='filter-data'>
                                <p>Date Start</p>
                                <div>
                                    <input value={data.date_start}  onChange={(e)=>setData('date_start',e.target.value)}type='date' />
                                </div>
                            </div>
                            <div className='filter-data'>
                                <p>Date End</p>
                                <div>
                                    <input value={data.date_end}  onChange={(e)=>setData('date_end',e.target.value)}type='date' />
                                </div>
                            </div>
                        </div>
                        <div className='filter-data'>
                            <button 
                                    onClick={(e)=>handleFilter(e,data , 'search')} 
                                    className='filter-search'>
                                        Search
                            </button>
                        </div>
                        <div className='filter-data'>
                            <button onClick={(e)=>handleFilter(e,null, 'clear')} className='clear-search'>Clear</button>
                        </div>
                    </div>
                </div>
                {
                   
                    <div className="view-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Model Name</th>
                                    <th>Work Order I.D</th>
                                    <th>Lot/Batch Number</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Loading</th>
                                    <th>Unloading</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    list && list.data.length > 0 ? Object.entries(list.data).map(([key, value]) => {
                                        return (
                                            <tr>
                                                <td>{value.Model_Name ?? '-'}</td>
                                                <td><a
                                                    style={{ color: 'blue', textDecoration: 'underline' }}
                                                    href={`/production-order/encode?serial=${value.Work_Order || ''}`}
                                                >{value.Work_Order ?? '-'}
                                                </a></td>
                                                <td>{value.Daily_Check.Lot_No ?? '-'}</td>
                                                <td>{value.Daily_Check.Quantity ?? '-'}</td>
                                                <td>{value.Status ?? '-'}</td>
                                                <td>{value.CurrentLocation ?? '-'}</td>
                                                <td>{value.Loading_time ?? '-'}</td>
                                                <td>{value.Unloading_time ?? '-'}</td>
                                            </tr>
                                        )
                                    }): <tr><td colSpan={8} style={{ padding:'1rem' }}>No data found</td></tr>
                                }

                            </tbody>
                        </table>
                    </div>
                }
                <div className='page-container'>
                    {
                        list && list.links.map((link, index) => (
                            <span className='page-content'>
                                {
                                    link.url ? (<Link className='page-link'
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{ background:link.active?'#B5E1FD' :'' }} />) : (
                                        <span style={{ color:link.active?'#B5E1FD' :'white' }} className='page-link' dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                }
                            </span>
                        )
                        )
                    }
                </div>
            </div>
        </div>
    )
}