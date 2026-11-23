import { useState } from "react";
import { router, Link } from "@inertiajs/react";

import DeleteModal from "./DeleteModal";
import AILoader from "./AILoader";
import { handleEnterNext, checkIfRequired } from '../Utilities/UtilityFunctions'
import '../../css/ai.css'
export default function UserAdmin({ user_manage }) {
    console.log('Current Location: ', user_manage);
    const [UserDetails, setUserDetails] = useState(false);
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
                    setUserDetails(false);
                }
            }
        )

    }
    const handleData = (action, values) => {
        if (!values || !action) return
        setModal(action)
        const ipSplit = values.ip_address ? values.ip_address.split('.') : null
        setUserDetails({
            id: values.id,
            username: values.username,
            email: values.email,
            permission: values.permission,
            status: values.status,

        });
    }
    console.log('Machine: ', UserDetails);
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
    console.log('User Manager: ', user_manage, UserDetails);
    return (
        <>
            <div className="management-content">
                <div className="loader-row">
                    <h3>User List</h3>
                </div>
                <div className="loader-row">
                    <p>User list</p>
                </div>
                <div className="justify-center">

                    <div className="view-table-2">

                        {
                            Modal &&
                            <div className="loader-container">
                                <div className="loader-design">
                                    <div className="loader-content" >
                                        {

                                            Modal === 'delete' ?
                                                <>
                                                    <h4>Delete item</h4>
                                                    <div className="loader-column">
                                                        <div className="loader-row">
                                                            <p>Are you sure you want to delete <strong>{UserDetails.username}?</strong></p>
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <button onClick={() => setModal(false)} className="manage-delete">Cancel</button>
                                                        <button className="manage-update" onClick={(e) => handlePost('delete', UserDetails, 'user', e)}>Confirm</button>
                                                    </div>
                                                </>
                                                : Modal === 'update' ?
                                                    <>
                                                        <h4>Update Machine</h4>
                                                        <div className="loader-column">
                                                            <div className="loader-row">
                                                                <div className="loader-data">
                                                                    <p>User Name: </p>
                                                                    <div className="loader-row" ><strong>{UserDetails.username}</strong></div>
                                                                </div>
                                                                <div className="loader-data">
                                                                    <p>E-mail:</p>
                                                                    <div className="loader-row" >
                                                                        <p>{UserDetails.email}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="loader-row">
                                                                <div className="loader-data">
                                                                    <p>Permission:</p>
                                                                    <select
                                                                        idName="permission"
                                                                        value={UserDetails.permission}
                                                                        className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('permission') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                        onChange={(e) => setUserDetails({ ...UserDetails, permission: e.target.value })}
                                                                        placeholder="permission">
                                                                        <option></option>
                                                                        <option value="admin">admin</option>
                                                                        <option value="batching">batching</option>
                                                                    </select>
                                                                </div>
                                                                <div className="loader-data">
                                                                    <p>Status:</p>
                                                                    <select
                                                                        idName="status"
                                                                        value={UserDetails.status}
                                                                        className={dataConfirmation && dataConfirmation.index && dataConfirmation.index.includes('status') ? 'red-required' : dataConfirmation ? 'green-required' : ''}
                                                                        onChange={(e) => setUserDetails({ ...UserDetails, status: e.target.value })}
                                                                        placeholder="permission">
                                                                        <option></option>
                                                                        <option value="approved">Approved</option>
                                                                        <option value="rejected">Rejected</option>
                                                                        <option value="inactive">Inactive</option>
                                                                    </select>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button onClick={() => setModal(false)} className="manage-delete">Cancel</button>
                                                            <button className="manage-update" onClick={(e) => handlePost('update', UserDetails, 'user', e)}>Confirm</button>
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
                                <p>Status:</p>
                                <select placeholder="status" onChange={(e) => setFilterManage({ ...filterManage, status: e.target.value, filter_manage: 'user_manage' })}>
                                    <option value=""></option>
                                    <option value="requesting">Requesting</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className='filter-data'>
                                <p>I.D Number:</p>
                                <input placeholder="id number" onChange={(e) => setFilterManage({ ...filterManage, id_number: e.target.value, filter_manage: 'user_manage' })} />
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
                                    <th>Username</th>
                                    <th>E-mail</th>
                                    <th>Permission</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    user_manage && user_manage.data ?
                                        Object.entries(user_manage.data).map(([key, values]) => {
                                            console.log('hello', values);
                                            return (
                                                <tr>
                                                    <td>{values.username}</td>
                                                    <td>{values.email}</td>
                                                    <td>{values.permission}</td>
                                                    <td>{values.status}</td>
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
                            user_manage && user_manage.links ?
                                user_manage.links.map((link, index) =>
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