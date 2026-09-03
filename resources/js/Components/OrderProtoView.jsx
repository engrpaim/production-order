import { useState } from "react";
import { Link, router } from "@inertiajs/react";
export default function OrderProtoView({ proto_all_data }) {
    const [filterSearch, setFilterSearch] = useState(false);

    const handleGetDetails = async(data, action) => {
        console.log('Get details: ', data);

        if (action === 'clear') {

            router.get('/production-order/admin',
                {
                    preserveScroll: true,

                    onSuccess: () => {
                        setFilterSearch(false)
                    }
                });

        }
        const allData = { ...data, filter_manage: 'proto_order' }
        await router.get('/production-order/admin', allData,
            {
                preserveScroll: true,
                preserveState: true
            });
    }
    console.log('Proto Order:', proto_all_data);
    return (
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
                    <input value={filterSearch.work_order_id} placeholder="work order" onChange={(e) => setFilterSearch({ ...filterSearch, work_order_id: e.target.value })}></input>
                </div>
                <div>
                    <button
                        className='filter-search'
                        onClick={() => handleGetDetails(filterSearch, 'get')}>
                        Search
                    </button>
                </div>
                <div>
                    <button className='clear-search' onClick={() => handleGetDetails(null, 'clear')}>Clear</button>
                </div>
            </div>
            <div className="view-table-2">
                <table>
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Work Order</th>
                            <th>Lot Number</th>
                            <th>Batch Number</th>
                            <th>Quantity</th>
                            <th>Condition</th>
                            <th>Remarks</th>
                            <th>Created Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            proto_all_data && proto_all_data.data ? Object.entries(proto_all_data.data).map(([key, values]) => {
                                return (
                                    <tr>
                                        <td>{values.model}</td>
                                        <td>
                                            <a
                                                style={{ textDecoration: 'underline', color: 'blue' }}
                                                href={`http://172.17.2.236/inventory/single_scan.php?barcode=${values.work_order_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer">{values.work_order_id}</a>
                                        </td>
                                        <td style={{ width: '15rem' }}>{values.data_lot_number}</td>
                                        <td style={{ width: '25rem' }}>{values.generated_batch_number}</td>
                                        <td style={{ width: '7rem' }}>{values.quantity}</td>
                                        <td style={{ width: '10rem' }}>{values.condition}</td>
                                        <td style={{ width: '10rem' }}>{values.remarks}</td>
                                        <td style={{ width: '10rem' }}>{values.created_at.split("T")[0].toUpperCase()}</td>
                                        <td style={{ width: '7rem' }}>{values.status.toUpperCase()}</td>
                                    </tr>
                                )
                            }) : <tr><td colSpan={9}>Data not found!</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className='page-container' style={{ alignSelf: 'self-center', width: '100%' }}>
                {
                    proto_all_data && proto_all_data.links ?
                        proto_all_data.links.map((link, index) =>
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