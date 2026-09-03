import { useState } from "react";
import { Link, router } from "@inertiajs/react";
export default function ExcessView({ excess_all_data }) {
    const [filterSearch, setFilterSearch] = useState(false);
    console.log('Excess View: ', excess_all_data);

    const handleGetDetails = async (data,action) => {
        console.log('Get details: ', data);
        
        if(action ==='clear'){
            
            router.get('/production-order/admin', 
            { 
                preserveScroll: true, 
              
                onSuccess:()=>{
                    setFilterSearch(false)
                }
            });
            
        }
        const allData = {...data , filter_manage: 'excess' }
        await router.get('/production-order/admin', allData, 
            { 
                preserveScroll: true, 
                preserveState: true 
            });
    }
    return (
        <div>
            <div>
                <div className="management-filter-container">
                    <div>
                        <p>Filter:</p>
                    </div>
                    <div className='filter-data'>
                        <input value={filterSearch.model} placeholder="model" onChange={(e) => setFilterSearch({ ...filterSearch, model: e.target.value })}></input>
                    </div>
                    <div className='filter-data'>
                        <input value={filterSearch.lot_number} placeholder="lot number" onChange={(e) => setFilterSearch({ ...filterSearch, lot_number: e.target.value })}></input>
                    </div>
                    <div className='filter-data'>
                        <select value={filterSearch.status} onChange={(e) => setFilterSearch({ ...filterSearch, status: e.target.value })}>
                            <option selected></option>
                            <option value="hold">Hold</option>
                            <option value="merge">Merge</option>
                            <option value="reject">Reject</option>
                            <option value="disposed">Disposed</option>
                        </select>
                    </div>
                    <div>
                        <button
                            className='filter-search'
                            onClick={() => handleGetDetails(filterSearch,'get')}>
                            Search
                        </button>
                    </div>
                    <div>
                        <button className='clear-search' onClick={() => handleGetDetails(null,'clear')}>Clear</button>
                    </div>
                </div>
            </div>
            <div className="view-table-2">
                <table>
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Excess</th>
                            <th>Shelf</th>
                            <th>Lot Number</th>
                            <th>Batch Number</th>
                            <th>Merge to</th>
                            <th>Start Date</th>
                            <th>Retention</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            excess_all_data && excess_all_data.data && Object.keys(excess_all_data.data).length >0 ? Object.entries(excess_all_data.data).map(([key, values]) => {
                                return (
                                    <tr>
                                        <td>{values.model}</td>
                                        <td>{values.excess}</td>
                                        <td>{values.shelf}</td>
                                        <td>{values.lot_number}</td>
                                        <td>{values.generated_lot_number}</td>
                                        <td>{values.merge_to ?? '-'}</td>
                                        <td>{values.start_date}</td>
                                        <td>{values.model}</td>
                                        <td>{values.status.toUpperCase()}</td>
                                    </tr>
                                )
                            }) : <tr><td colSpan={9}>Data not found!</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className='page-container' style={{ alignSelf: 'self-center', width: '100%' }}>
                {
                    excess_all_data && excess_all_data.links ?
                        excess_all_data.links.map((link, index) =>
                            <span className='page-content'>
                                {
                                    link.url ? (
                                        <Link
                                            preserveState
                                            preserveScroll
                                            className='page-link'
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            style={{ background: link.active ? '#B5E1FD' : '' }} 
                                        />
                                    ) : null
                                }
                            </span>
                        ) : null
                }
            </div>
        </div>

    )
}