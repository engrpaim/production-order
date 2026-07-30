{
    /**
     * 
     *  @return details of model   -> handleGetDetails
     *  @request dynamic post      -> handlePost
     *  @nav model management internal navigation
     *  @return state notification -> TurnOffNotification
     * 
    */
}



import { Link, router } from "@inertiajs/react";
import { useState } from "react"
import AILoader from "./AILoader";
import Notification from "./Notification";
export default function ModelAdmin({ model_manage }) {

    const [optionSelected, setOptionSelected] = useState('list');
    const [filterSearch, setFilterSearch] = useState(false);
    const [manageActions, setManageActions] = useState(false);
    const [laoder, setLoader] = useState(false);
    const [NotificationState, setNotifcation] = useState(false);
    const [currentLine , setCurrentLine] = useState(false);

    const [QueryParams, setQueryParams] = useState(false)
    const searchParams = new URLSearchParams(window.location.href);
    console.log('Model Management: ', model_manage,manageActions);

    /**
     * 
     * return details of model management
     * @param {data}
     * 
     */

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

    //Notification for state checking
    function TurnOffNotification() {
        setTimeout(() => {
            setNotifcation(false);
            setFilterSearch(null);
        }, 2000)
    }

    /**
     *
     * Dyanmic posting
     * request post based on @param action and table based on @param database
     * @param {string} action 
     * @param {array} data 
     * @param {string} database
     * 
     */

    const handlePost = async (action, data, database) => {
        
        
        setLoader(true);
        setManageActions(false);

        if (!action || !data || !database) setTimeout(() => {
            setLoader(false)
            setNotifcation({ message: `Data not found, cannot proceed ${action}`, theme: 'error-notification' });
            TurnOffNotification()
        }, 2000)

        

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
                    }, 1000)
                    TurnOffNotification()
                }
            }
        )

    }





    return (

        <div className="management-content">
            <div>
                <h3>Manage Model</h3>
                <p></p>
            </div>
            <div className="manage-content-header">
                {/* @nav Navigation inside Model management panel  */}
                <div className="management-button-container">
                    <button className={`management-option ${optionSelected === 'list' ? 'active' : ''}`} onClick={() => setOptionSelected('list')}>Model List</button>
                    <button className={`management-option ${optionSelected === 'add' ? 'active' : ''}`} onClick={() => setOptionSelected('add')}>Model</button>
                    <button className={`management-option ${optionSelected === 'parameters' ? 'active' : ''}`} onClick={() => setOptionSelected('parameters')}>Parameters</button>
                </div>
                {
                    optionSelected === 'list' ?
                        <div className="management-filter-container">
                            <div >
                                <p>Filters</p>
                            </div>
                            <div className='filter-data'>
                                <p>Model:</p>
                                <input value={filterSearch && filterSearch.model_manage ? filterSearch.model_manage : ''} onKeyDown={(e) => e.key === 'Enter' && handleGetDetails({ filter_manage: 'model_manage', model_manage: e.target.value })} onChange={(e) => setFilterSearch({ filter_manage: 'model_manage', model_manage: e.target.value })} />
                            </div>
                            <div>
                                <button
                                    className='filter-search'
                                    onClick={() => handleGetDetails(filterSearch)}>
                                    Search
                                </button>
                            </div>
                            <div>
                                <button className='clear-search' onClick={() => handleGetDetails(null)}>Clear</button>
                            </div>
                        </div> : null
                }
            </div>
            <div>
                <div>
                    {
                        optionSelected === 'list' ?
                            <div className="justify-center">
                                <div className="view-table">
                                    {
                                        NotificationState && <Notification message={NotificationState.message ?? ''} theme={NotificationState.theme ?? ''} />
                                    }
                                    {
                                        laoder && <AILoader message={'Deleting in data sources'} />
                                    }
                                    
                                    {
                                        manageActions && manageActions.action === 'delete' ?
                                            <div className="loader-container">
                                                <div className="loader-design">
                                                    <div className="loader-content" >
                                                        <h4 style={{ marginBottom:'1rem' }}>Delete Model</h4>
                                                        <p  style={{ marginBottom:'1rem' }}>Are you sure you want to delete <strong>{manageActions.model}</strong>?</p>
                                                        <div>
                                                            <button onClick={() => handlePost('delete', manageActions, 'model')} className="manage-update">Confirm</button>
                                                            <button onClick={() => setManageActions(false)} className="manage-delete">Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        :manageActions && manageActions.action === 'update' ?
                                            <div className="loader-container">
                                                <div className="loader-design">
                                                    <div className="loader-content" >
                                                        <h4 style={{ marginBottom:'1rem' }}>Update Model</h4>
                                                        <p>Model Name:&nbsp;<strong>{manageActions.data.Model}</strong>?</p>
                                                        <div className="loader-column">
                                                            <div className="loader-row">
                                                                <div className="loader-data">
                                                                    <p>Model:</p>
                                                                    <input placeholder="model"/>
                                                                </div>
                                                                <div className="loader-data">
                                                                    <p>Media size:</p>
                                                                    <input placeholder="media size"/>
                                                                </div>
                                                                <div className="loader-data">
                                                                    <p>Pre-Treatment:</p>
                                                                    <input placeholder="pre-treatment"/>
                                                                </div>
                                                            </div>
                                                            <div className="loader-row">
                                                                <div className="loader-data">
                                                                    <p>Post-Treatment:</p>
                                                                    <input placeholder="post-treatment"/>
                                                                </div>
                                                                <div className="loader-data">
                                                                    <p>Allowed lines:</p>
                                                                    <input placeholder="Allowed Lines"/>
                                                                </div>
                                                            </div>
                                                            <div className="loader-row">
                                                                <div className="loader-data" style={{ width:'fit-content' }}>
                                                                        <p>Current Allowed Lines</p>
                                                                        {
                                                                            manageActions.data && manageActions.data.Allowed_Lines && 
                                                                            Object.entries(JSON.parse(manageActions.data.Allowed_Lines)).map((([key,items])=>
                                                                                    <>
                                                                                        <span>
                                                                                            {items}
                                                                                        </span>
                                                                                    </>
                                                                                ))
                                                                        }
                                                                </div>
                                                            </div>
                                                            <div className="loader-row">
                                                                <div className="loader-data" style={{ width:'fit-content' }}>
                                                                        <p>New Allowed Lines</p>
                                                                        {
                                                                            manageActions.data && manageActions.data.Allowed_Lines && 
                                                                            Object.entries(JSON.parse(manageActions.data.Allowed_Lines)).map((([key,items])=>
                                                                                    <>
                                                                                        <span>
                                                                                            {items}
                                                                                        </span>
                                                                                    </>
                                                                                ))
                                                                        }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <button onClick={() => setManageActions(false)} className="manage-delete">Cancel</button>
                                                            <button onClick={() => handlePost('update', manageActions, 'model')} className="manage-update">Confirm</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>  
                                        : null
                                    }
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '18rem' }}>Model</th>
                                                <th style={{ width: '12rem' }}>Media size</th>
                                                <th style={{ width: '12rem' }}>Pre-Treatment</th>
                                                <th style={{ width: '10rem' }}>Post-Treatment</th>
                                                <th>Condition #</th>
                                                <th style={{ width: '5rem' }}>Allowed lines</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                model_manage && model_manage.data && Object.keys(model_manage.data).length > 0 ?

                                                    Object.entries(model_manage.data).map(([key, value]) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td style={{ textAlign: 'start' }}>{value.Model}</td>
                                                                <td>{value.Media_Size ?? '-'}</td>
                                                                <td>{value.Pre_Treatment ?? '-'}</td>
                                                                <td>{value.Post_Treatment ?? '-'}</td>
                                                                <td>{value.Condition_Number ?? '-'}</td>
                                                                <td style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>

                                                                    {/* {
                                                                        value.Allowed_Lines ?
                                                                            JSON.parse(value.Allowed_Lines).map((items) => <p style={{ padding: '0.2rem 1rem', background: '#FEF9C2', borderRadius: '1rem' }}>{items}</p>) : '-'
                                                                    } */}

                                                                    <a>check</a>

                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <button onClick={() => setManageActions({ action: 'delete', id: value.id ?? '-', model: value.Model ?? '-' })} className="manage-delete">Delete</button>
                                                                        <button onClick={() => setManageActions({ action: 'update', data: value ?? '-', model: value.Model ?? '-' })} className="manage-update">Update</button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }) : <tr>
                                                        <td colSpan={7}>
                                                            <p>No data Found</p>
                                                        </td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="page-container">
                                    {
                                        model_manage && model_manage.links.map((link, index) => (

                                            <span className='page-content'>
                                                {
                                                    link.url ? (<Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} style={{ background: link.active ? '#B5E1FD' : '' }} />) :
                                                        (<span style={{ color: link.active ? '#B5E1FD' : 'white' }} className='page-link' dangerouslySetInnerHTML={{ __html: link.label }} />)
                                                }
                                            </span>

                                        ))
                                    }
                                </div>
                            </div>
                            : optionSelected === 'add' ?
                                <div>
                                    <p>add view</p>
                                </div>
                                : null
                    }
                </div>
            </div>
        </div>
    )
}