import { useState } from "react";
import { router , Link } from "@inertiajs/react";

import DeleteModal from "./DeleteModal";
import AILoader from "./AILoader";
import { handleEnterNext, checkIfRequired } from '../Utilities/UtilityFunctions'
import '../../css/ai.css'
export default function MachineAdmin({ machine_manage }) {
    console.log('Current Location: ', machine_manage);
    const [MachineDetails, setMachineDetails] = useState(false);
    const [NotificationState, setNotificationState] = useState(false);
    const [Modal, setModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [dataConfirmation, setDataConfirmation] = useState(false);
    const [filterManage, setFilterManage] = useState();
    const handlePost = async (action, data, database, e) => {
        const required = checkIfRequired(e)
        console.log('count required', required);
        setDataConfirmation({ count: required.count ?? 0, index: required.index ?? null });
        if (!data || required.count > 0) {
            setTimeout(() => {
                setDataConfirmation(false);
            }, 2000);
            return
        }
        setLoader(true);
        await router.post('/production-order/admin',
            {
                action: action,
                data: data,
                database: database
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setTimeout(() => {
                        setLoader(false);
                    }, 2000);
                    setModal(false);
                    setDataConfirmation(false);
                    setMachineDetails(false);
                }
            }
        )

    }
    const handleData = (action, values) => {
        if (!values || !action) return
        setModal(action)
        const ipSplit = values.ip_address ? values.ip_address.split('.') : null
        setMachineDetails({
            id: values.id,
            ip_address: values.ip_address,
            user: values.user,
            id_number: values.id_number,
            permission: values.permission,
            location: values.location,
            ip1: ipSplit[0] ?? null,
            ip2: ipSplit[1] ?? null,
            ip3: ipSplit[2] ?? null,
            ip4: ipSplit[3] ?? null,
        });
    }
    console.log('Machine: ', MachineDetails);
    const handleGetDetails = async (data) => {
        setLoader(true);

        if (!data) setTimeout(() => {
            setLoader(false);
            window.location.href = '/production-order/admin'
        }, 2000);

        await router.get('/production-order/admin', data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setTimeout(() => {
                    setLoader(false);
                }, 2000)
            },
        })
    }

    return (
        <>
            <div className="management-content">
                <div className="loader-row">
                    <h3>Manage Machine</h3>
                </div>
                <div className="loader-row">
                    <p>Machine list</p>
                    <button onClick={() => setModal('add')} className="add-btn">Add Machine +</button>
                </div>
                <div className="justify-center">

                    <div className="view-table-2">

                        {
                            Modal &&
                            <div className="loader-container">
                                <div className="loader-design">
                                    <div className="loader-content" >
                                        {
                                            Modal === 'add' ?
                                                <>
                                                    <h4>Add Machine</h4>
                                                    <div className="loader-column">
                                                        <div className="loader-row">
                                                            <div className="loader-data">
                                                                <p>Location:</p>
                                                                <select
                                                                    idName="location"
                                                                    className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('location') ? 'red-required' : dataConfirmation ? 'green-required' : ''}

                                                                    onChange={(e) => setMachineDetails({ ...MachineDetails, location: e.target.value })}
                                                                    placeholder="location">
                                                                    <option></option>
                                                                    <option value="Plating line 1">Plating line 1</option>
                                                                    <option value="Plating line 2">Plating line 2</option>
                                                                </select>
                                                            </div>
                                                            <div className="loader-data" style={{ width: '35rem' }}>
                                                                <p>I.P&nbsp;Adress:</p>
                                                                <div className="loader-row" >
                                                                    <input
                                                                        className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip1') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                        idName="ip1" onKeyDown={(e) => {

                                                                            handleEnterNext(e)
                                                                        }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip1: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />.
                                                                    <input
                                                                        className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip2') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                        idName="ip2" onKeyDown={(e) => {

                                                                            handleEnterNext(e)
                                                                        }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip2: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />.
                                                                    <input
                                                                        className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip3') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                        idName="ip3" onKeyDown={(e) => {

                                                                            handleEnterNext(e)
                                                                        }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip3: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />.
                                                                    <input
                                                                        className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip4') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                        idName="ip4" onKeyDown={(e) => {
                                                                            handleEnterNext(e)
                                                                        }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip4: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="loader-row">
                                                            <div className="loader-data">
                                                                <p>User:</p>
                                                                <input className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('user') ? 'red-required' : dataConfirmation ? 'green-required' : ''} idName="user" onKeyDown={(e) => {

                                                                    handleEnterNext(e)
                                                                }}
                                                                    onChange={(e) => setMachineDetails({ ...MachineDetails, user: e.target.value })}
                                                                    placeholder="user" />
                                                            </div>
                                                            <div className="loader-data">
                                                                <p>I.D Number:</p>
                                                                <input className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('id_number') ? 'red-required' : dataConfirmation ? 'green-required' : ''} idName="id_number" onKeyDown={(e) => {

                                                                    handleEnterNext(e)
                                                                }}
                                                                    onChange={(e) => setMachineDetails({ ...MachineDetails, id_number: e.target.value })}
                                                                    placeholder="i.d number" />
                                                            </div>
                                                            <div className="loader-data">
                                                                <p>Permission:</p>
                                                                <select
                                                                    className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('permission') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                    idName="permission"
                                                                    onChange={(e) => setMachineDetails({ ...MachineDetails, permission: e.target.value })}
                                                                    placeholder="permission">
                                                                    <option></option>
                                                                    <option value="admin">Admin</option>
                                                                    <option value="loading">Load</option>
                                                                    <option value="unloading">Unloading</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button onClick={() => setModal(false)} className="manage-delete">Cancel</button>
                                                        <button className="manage-update" onClick={(e) => handlePost('create', MachineDetails, 'machine', e)}>Confirm</button>
                                                    </div>
                                                </>
                                                : Modal === 'delete' ?
                                                    <>
                                                        <h4>Delete item</h4>
                                                        <div className="loader-column">
                                                            <div className="loader-row">
                                                                <p>Are you sure you want to delete <strong>{MachineDetails.ip_address}?</strong></p>
                                                            </div>
                                                        </div>
                                                        <div >
                                                            <button onClick={() => setModal(false)} className="manage-delete">Cancel</button>
                                                            <button className="manage-update" onClick={(e) => handlePost('delete', MachineDetails, 'machine', e)}>Confirm</button>
                                                        </div>
                                                    </>
                                                    : Modal === 'update' ?
                                                        <>
                                                            <h4>Update Machine</h4>
                                                            <div className="loader-column">
                                                                <div className="loader-row">
                                                                    <div className="loader-data">
                                                                        <p>Location:</p>
                                                                        <select
                                                                            idName="location"
                                                                            className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('location') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                            value={MachineDetails.location}
                                                                            onChange={(e) => setMachineDetails({ ...MachineDetails, location: e.target.value })}
                                                                            placeholder="location">
                                                                            <option value=""></option>
                                                                            <option value="Plating line 1">Plating line 1</option>
                                                                            <option value="Plating line 2">Plating line 2</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="loader-data" style={{ width: '35rem' }}>
                                                                        <p>I.P&nbsp;Adress:</p>
                                                                        <div className="loader-row" >
                                                                            <input
                                                                                value={MachineDetails.ip1}
                                                                                className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip1') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                                idName="ip1" onKeyDown={(e) => {

                                                                                    handleEnterNext(e)
                                                                                }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip1: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />.
                                                                            <input
                                                                                value={MachineDetails.ip2}
                                                                                className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip2') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                                idName="ip2" onKeyDown={(e) => {

                                                                                    handleEnterNext(e)
                                                                                }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip2: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />.
                                                                            <input
                                                                                value={MachineDetails.ip3}
                                                                                className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip3') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                                idName="ip3" onKeyDown={(e) => {

                                                                                    handleEnterNext(e)
                                                                                }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip3: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />.
                                                                            <input
                                                                                value={MachineDetails.ip4}
                                                                                className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('ip4') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                                idName="ip4" onKeyDown={(e) => {

                                                                                    handleEnterNext(e)
                                                                                }} onChange={(e) => setMachineDetails({ ...MachineDetails, ip4: e.target.value })} type='number' min="0" max="255" placeholder="255" style={{ width: '5rem' }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="loader-row">
                                                                    <div className="loader-data">
                                                                        <p>User:</p>
                                                                        <input onKeyDown={(e) => {

                                                                            handleEnterNext(e)
                                                                        }}
                                                                            className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('user') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                            value={MachineDetails.user}
                                                                            idName="user"
                                                                            onChange={(e) => setMachineDetails({ ...MachineDetails, user: e.target.value })}
                                                                            placeholder="user" />
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>I.D Number:</p>
                                                                        <input onKeyDown={(e) => {

                                                                            handleEnterNext(e)
                                                                        }}
                                                                            idName="id_number"
                                                                            value={MachineDetails.id_number}
                                                                            className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('id_number') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                            onChange={(e) => setMachineDetails({ ...MachineDetails, id_number: e.target.value })}
                                                                            placeholder="i.d number" />
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Permission:</p>
                                                                        <select
                                                                            idName="permission"
                                                                            value={MachineDetails.permission}
                                                                            className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('permission') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                            onChange={(e) => setMachineDetails({ ...MachineDetails, permission: e.target.value })}
                                                                            placeholder="permission">
                                                                            <option></option>
                                                                            <option value="admin">Admin</option>
                                                                            <option value="loading">Load</option>
                                                                            <option value="unloading">Unloading</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button onClick={() => setModal(false)} className="manage-delete">Cancel</button>
                                                                <button className="manage-update" onClick={(e) => handlePost('update', MachineDetails, 'machine', e)}>Confirm</button>
                                                            </div>
                                                        </>
                                                        : null
                                        }
                                    </div>
                                </div>
                            </div>

                        }
                        {loader && <AILoader />}
                        <div className="management-filter-container" style={{ justifyContent: 'end' }}>
                            <div >
                                <p>Filters</p>
                            </div>
                            <div className='filter-data'>
                                <p>Location</p>
                                <select placeholder="location" onChange={(e) => setFilterManage({ ...filterManage, location: e.target.value, filter_manage: 'machine_manage' })}>
                                    <option value=""></option>
                                    <option value="Plating line 1">Plating line 1</option>
                                    <option value="Plating line 2">Plating line 2</option>
                                </select>
                            </div>
                            <div className='filter-data'>
                                <p>I.P Address:</p>
                                <input placeholder="i.p address" onChange={(e) => setFilterManage({ ...filterManage, ip_address: e.target.value, filter_manage: 'machine_manage' })} />
                            </div>
                            <div>
                                <button
                                    className='filter-search'
                                    onClick={() => handleGetDetails(filterManage)}
                                >
                                    Search
                                </button>
                            </div>
                            <div>

                                <button onClick={() => handleGetDetails(null)} className='clear-search' >Clear</button>
                            </div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Location</th>
                                    <th>I.P Address</th>
                                    <th>User</th>
                                    <th>I.D number</th>
                                    <th>Permission</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    machine_manage && machine_manage.data ?
                                        Object.entries(machine_manage.data).map(([key, values]) => {
                                            console.log('hello', values);
                                            return (
                                                <tr>
                                                    <td>{values.location}</td>
                                                    <td>{values.ip_address}</td>
                                                    <td>{values.user}</td>
                                                    <td>{values.id_number}</td>
                                                    <td>{values.permission}</td>
                                                    <td>
                                                        <div>
                                                            <button onClick={() => handleData('delete', values)} className="manage-delete">Delete</button>
                                                            <button onClick={() => handleData('update', values)} className="manage-update">Update</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }) : null
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='page-container' style={{ alignSelf: 'self-center', width: '100%' }}>
                        {
                            machine_manage && machine_manage.links ?
                                machine_manage.links.map((link, index) =>
                                    <span className='page-content'>
                                        {
                                            link.url ? (
                                                <Link
                                                    preserveState
                                                    preserveScroll
                                                    className='page-link'
                                                    href={link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    style={{ background: link.active ? '#B5E1FD' : '' }} />
                                            ) : null
                                        }
                                    </span>
                                ) : null
                        }
                    </div>
                </div>
            </div>
        </>

    )
}