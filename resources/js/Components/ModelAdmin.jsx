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
import { useState, useRef } from "react"
import AILoader from "./AILoader";
import Notification from "./Notification";
import { handleEnterNext, checkIfRequired } from '../Utilities/UtilityFunctions'
import DeleteModal from "./DeleteModal";
import DocumentGenerator from "./DocumentGenerator";

export default function ModelAdmin({ model_manage, parameter_manage, selector_parameters }) {

    const [optionSelected, setOptionSelected] = useState('list');
    const [filterSearch, setFilterSearch] = useState(false);
    const [manageActions, setManageActions] = useState({});
    const [laoder, setLoader] = useState(false);
    const [NotificationState, setNotifcation] = useState(false);
    const [currentLine, setCurrentLine] = useState(false);
    const [updateModel, setUpdateModel] = useState(false);
    const [redIndex, setRedIndex] = useState(false);
    const [QueryParams, setQueryParams] = useState(false);

    //Parameter Management
    const [ParamManagement, setParamManagement] = useState({});
    const searchParams = new URLSearchParams(window.location.href);

    //Qr Generation
    const [qrGeneration, setQrGeneration] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    console.log('Model Management: ', model_manage, 'XXX', manageActions);
    console.log('Paramete Mnagement:', parameter_manage, parameter_manage.links, selector_parameters);

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
            setCurrentLine(false);
            setSubmitted(false);
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

    const handlePost = async (action, data, database, e) => {

        setSubmitted(true);
        setLoader(true);
        const required = checkIfRequired(e)
        setRedIndex(required.index);
        const IsNotSet = data && data.Allowed_Lines || data && data.Allowed_Lines && data.Allowed_Lines.length > 1 ? false : true


        console.log('Postting data: ', data, required.index, required.count, IsNotSet)

        switch (database) {
            case 'model':
                if (IsNotSet && action !== 'delete' || updateModel && !updateModel.Allowed_Lines || updateModel && updateModel.Allowed_Lines.length < 1) {
                    setLoader(false)
                    setNotifcation({ message: `All input is required!`, theme: 'error-notification' });
                    TurnOffNotification()
                    return
                }
                break;
            default:
                break;
        }
        //return if 
        if (required.count > 0) {
            setLoader(false)
            setNotifcation({ message: `All input is required!`, theme: 'error-notification' });
            TurnOffNotification()
            return
        }


        console.log('check data post!', action, data, database);

        if (!action || !data || !database) {

            setTimeout(() => {
                setLoader(false)
                setNotifcation({ message: `Data not found, cannot proceed ${action}`, theme: 'error-notification' });
                TurnOffNotification()
                return;
            }, 2000)

            return
        }


        setManageActions(false);

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
                        setUpdateModel(false);
                    }, 1000)
                    TurnOffNotification()
                }
            }
        )

    }



    const handleInputValues = (action, data, model, database) => {
        console.log('HELLOX', action, data, model);
        if (!data && !database) {
            setLoader(false)
            setNotifcation({ message: `Data not found!`, theme: 'error-notification' });
            TurnOffNotification()
            return
        }

        switch (database) {
            case 'model':
                const allowedLines = data && data.Allowed_Lines ? data.Allowed_Lines : null;
                data = { ...data, Allowed_Lines: allowedLines }
                break;
            case 'parameter':
                if (data) break;
                setManageActions({ action: action, data: null, model: model })
                return
                break;
            default:
                break;
        }



        setManageActions({ action: action, data: data, model: model })

        Object.entries(data).map(([key, values]) => {
            if (!key.includes('_at') && !key.includes('action')) setUpdateModel((prev) => ({ ...prev, [key]: values }))
        })

    }

    /**
     * 
     * handle update in allowed lines
     * @param {string} item
     * @param {string} action 
     *
     **/
    const handleRemoveLine = (item, action) => {
        console.log('Lines: ', item, action);
        if (!item) return
        switch (action) {
            case 'remove':
                const current = updateModel.Allowed_Lines;
                const updated = current.filter(data => data !== item)
                setUpdateModel({ ...updateModel, Allowed_Lines: updated })
                break;
            case 'add':
                updateModel.Allowed_Lines && !updateModel.Allowed_Lines.includes(item) && setUpdateModel({ ...updateModel, Allowed_Lines: [...updateModel.Allowed_Lines, item] });
                setCurrentLine(false);
                break;
            case 'create':
                updateModel && updateModel.Allowed_Lines && !updateModel.Allowed_Lines.includes(item) ? setUpdateModel({ ...updateModel, Allowed_Lines: [...updateModel.Allowed_Lines, item] })
                    : updateModel && !updateModel.Allowed_Lines ? setUpdateModel({ ...updateModel, Allowed_Lines: [item] })
                        : !updateModel ? setUpdateModel({ Allowed_Lines: [item] })
                            : null
                console.log('Create: ', updateModel);
                setCurrentLine(false);
                break;
            default:
                return;
                break;

        }
    }

    const handleQrGeneration = (parameters, type, action) => {
        console.log('Clicked!', parameters, type, qrGeneration);
        if (!parameters && !type && !action) return
        switch (action) {
            case 'all':
                parameters.map((items) => {

                    setQrGeneration((prev) => ({
                        ...prev,
                        qr: [
                            ...(prev.qr || []), { parameters: items, type: type }
                        ]
                    }));
                })
                break;
            case 'single':
                setQrGeneration((prev) => ({
                    ...prev,
                    qr: [
                        ...(prev.qr || []), { parameters: parameters, type: type }
                    ]
                }));
                break;
            case 'remove':
                console.log(qrGeneration.qr?.[type]);
                if (qrGeneration && qrGeneration.qr) {
                    const removedValues = qrGeneration.qr?.splice(type, 1)
                    console.log('type', type, qrGeneration)
                    setQrGeneration({ ...qrGeneration })
                }
                break;
            default:
                break;
        }

    }
    console.log('currentss:', qrGeneration);
    return (

        <div className="management-content">
            <div>
                <h3>Manage Model</h3>
                <p></p>
            </div>
            <div className="manage-content-header">
                {/* @nav Navigation inside Model management panel  */}
                <div className="management-button-container">
                    <button className={`management-option ${optionSelected === 'list' ? 'active' : ''}`}
                        onClick={() => {
                            setOptionSelected('list')
                            setUpdateModel(false)
                            setManageActions(false)
                            setQrGeneration(false)
                        }}>Model List</button>
                    <button className={`management-option ${optionSelected === 'parameters' ? 'active' : ''}`}
                        onClick={() => {
                            setOptionSelected('parameters')
                            setUpdateModel(false)
                            setManageActions(false)
                            setQrGeneration(false)
                        }}>Parameters</button>
                    <button className={`add-btn ${optionSelected === 'add' ? 'active' : ''}`}
                        onClick={() => {
                            setOptionSelected('add')
                            setUpdateModel(false)
                        }}>Add Model +</button>
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
                                <div className="view-table-2">
                                    {
                                        NotificationState && <Notification message={NotificationState.message ?? ''} theme={NotificationState.theme ?? ''} />
                                    }
                                    {
                                        laoder && <AILoader message={'Checking in data sources'} />
                                    }

                                    {
                                        manageActions && manageActions.action === 'delete' ?
                                            <DeleteModal manageActions={manageActions} handlePost={handlePost} setManageActions={setManageActions} />
                                            : manageActions && manageActions.action === 'update' ?
                                                <div className="loader-container">
                                                    <div className="loader-design">
                                                        <div className="loader-content" >
                                                            <h4 style={{ marginBottom: '1rem' }}>Update Model</h4>
                                                            <p>Model Name:&nbsp;<strong>{manageActions.data.Model}</strong>?</p>
                                                            <div className="loader-column">
                                                                <div className="loader-row">
                                                                    <div className="loader-data">
                                                                        <p>Model:</p>
                                                                        <input
                                                                            value={updateModel.Model}
                                                                            idName="Model"
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, Model: e.target.value })}
                                                                            onKeyDown={(e) => {

                                                                                handleEnterNext(e)
                                                                            }}
                                                                            className={submitted && redIndex.includes('Model') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="model" />
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Media size:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.Media_Size ? updateModel.Media_Size : ''}
                                                                            idName="Media_Size"
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, Media_Size: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            className={submitted && redIndex.includes('Media_Size') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="media size">
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Media Size'] &&
                                                                                selector_parameters?.['Media Size'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Pre-Treatment:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.Pre_Treatment ? updateModel.Pre_Treatment : ''}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, Pre_Treatment: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="Pre_Treatment"
                                                                            className={submitted && redIndex.includes('Pre_Treatment') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="pre-treatment" >
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Pre-treatment'] &&
                                                                                selector_parameters?.['Pre-treatment'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Container:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.container ? updateModel.container : ''}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, container: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="container"
                                                                            className={submitted && redIndex.includes('container') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="container" >
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Container'] &&
                                                                                selector_parameters?.['Container'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Poly Bag:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.poly_bag ? updateModel.poly_bag : ''}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, poly_bag: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="poly_bag"
                                                                            className={submitted && redIndex.includes('poly_bag') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="poly bag" >
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Poly Bag'] &&
                                                                                selector_parameters?.['Poly Bag'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Basket Number:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.basket_number ? updateModel.basket_number : ''}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, basket_number: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="basket_number"
                                                                            className={submitted && redIndex.includes('basket_number') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="basket number" >
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Basket Number'] &&
                                                                                selector_parameters?.['Basket Number'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="loader-row">

                                                                    <div className="loader-data">
                                                                        <p>Post-Treatment:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.Post_Treatment ? updateModel.Post_Treatment : ''}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, Post_Treatment: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="Post_Treatment"
                                                                            className={submitted && redIndex.includes('Post_Treatment') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="post-treatment" >
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Post-treatment'] &&
                                                                                selector_parameters?.['Post-treatment'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Allowed lines:</p>
                                                                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'row' }}>
                                                                            <select
                                                                                idName="Allowed_Lines"
                                                                                onChange={(e) => setCurrentLine(e.target.value)}
                                                                                className={updateModel && updateModel.Allowed_Lines && updateModel.Allowed_Lines.length < 1 && submitted ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            >
                                                                                <option value="" disabled selected={!currentLine ? true : false}>select line</option>
                                                                                <option value="Plating line 1" >Plating line 1</option>
                                                                                <option value="Plating line 2" >Plating line 2</option>
                                                                            </select>
                                                                            <button onClick={() => handleRemoveLine(currentLine, 'add')} className="add-btn">+</button>
                                                                        </div>

                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Quantity:</p>
                                                                        <input
                                                                            value={updateModel.Quantity}
                                                                            type="number"
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, Quantity: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="Quantity"
                                                                            className={submitted && redIndex.includes('Quantity') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="quantity" />
                                                                    </div>
                                                                </div>
                                                                <div className="loader-row">
                                                                    <div className="loader-data" style={{ width:'50rem' }}>
                                                                        <p>Endorsement:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.endorsement ? updateModel.endorsement : ''}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, endorsement: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="endorsement"
                                                                            className={submitted && redIndex.includes('endorsement') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="endorsement" >
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Endorsement'] &&
                                                                                selector_parameters?.['Endorsement'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Code:</p>
                                                                        <input
                                                                            value={updateModel.Model_Code}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, Model_Code: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="Model_Code"
                                                                            className={submitted && redIndex.includes('Model_Code') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="model code" />
                                                                    </div>
                                                                    <div className="loader-data">
                                                                        <p>Condition #:</p>
                                                                        <select
                                                                            value={updateModel && updateModel.Condition_Number ? updateModel.Condition_Number : ''}
                                                                            onChange={(e) => setUpdateModel({ ...updateModel, Condition_Number: e.target.value })}
                                                                            onKeyDown={(e) => handleEnterNext(e)}
                                                                            idName="Condition_Number"
                                                                            className={submitted && redIndex.includes('Condition_Number') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                            placeholder="condition number"  >
                                                                            <option value='' disabled></option>
                                                                            {
                                                                                selector_parameters && selector_parameters?.['Condition Number'] &&
                                                                                selector_parameters?.['Condition Number'].map((items) => (<option value={items}>{items}</option>))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>

                                                                <div className="loader-row">
                                                                    <div className="loader-data" style={{ width: '100%', height: '12vh', background: '#FFEDD4' }}>
                                                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', height: 'fit-content', flexWrap: 'wrap', background: '#FFEDD4', padding: '1rem', borderRadius: '1rem', width: '100%' }}>
                                                                            <p>Allowed Lines:&nbsp;</p>
                                                                            {
                                                                                updateModel && updateModel.Allowed_Lines && updateModel.Allowed_Lines.map((lines) =>
                                                                                    <span>
                                                                                        {lines}
                                                                                        <button onClick={() => handleRemoveLine(lines, 'remove')} className="close-btn">x</button>
                                                                                    </span>)
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button onClick={() => setManageActions(false)} className="manage-delete">Cancel</button>
                                                                <button onClick={(e) => handlePost('update', updateModel, 'model', e)} className="manage-update">Confirm</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                    }
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: '18rem' }}>Model</th>
                                                <th style={{ minWidth: '7rem' }}>Quantity</th>
                                                <th style={{ minWidth: '12rem' }}>Media size</th>
                                                <th style={{ minWidth: '12rem' }}>Pre-Treatment</th>
                                                <th style={{ minWidth: '10rem' }}>Post-Treatment</th>
                                                <th style={{ minWidth: '10rem' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                model_manage && model_manage.data && Object.keys(model_manage.data).length > 0 ?

                                                    Object.entries(model_manage.data).map(([key, value]) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td style={{ textAlign: 'start' }}>{value.Model}</td>
                                                                <td>{value.Quantity ?? '-'}</td>
                                                                <td>{value.Media_Size ?? '-'}</td>
                                                                <td>{value.Pre_Treatment ?? '-'}</td>
                                                                <td>{value.Post_Treatment ?? '-'}</td>
                                                                <td>
                                                                    <div>
                                                                        <button onClick={() => setManageActions({ action: 'delete', id: value.id ?? '-', model: value.Model ?? '-', database: 'model' })} className="manage-delete">Delete</button>
                                                                        <button onClick={() => handleInputValues('update', value ?? '-', value.Model ?? '-', 'model')} className="manage-update">Update</button>
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
                                                    link.url ? (<Link
                                                        preserveState
                                                        preserveScroll
                                                        href={link.url}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                        style={{ background: link.active ? '#B5E1FD' : '' }} />) :
                                                        (<span style={{ color: link.active ? '#B5E1FD' : 'white' }} className='page-link' dangerouslySetInnerHTML={{ __html: link.label }} />)
                                                }
                                            </span>

                                        ))
                                    }
                                </div>
                            </div>
                            : optionSelected === 'add' ?
                                <div className="justify-center">

                                    <div className="view-table-2">
                                        {
                                            NotificationState && <Notification message={NotificationState.message ?? ''} theme={NotificationState.theme ?? ''} />
                                        }
                                        {
                                            laoder && <AILoader message={'Checking in data sources'} />
                                        }
                                        <h4 style={{ marginBottom: '1rem' }}>Add Model</h4>
                                        <div className="loader-column">
                                            <div className="loader-row">
                                                <div className="loader-data">
                                                    <p>Model:</p>
                                                    <input
                                                        value={updateModel && updateModel.Model ? updateModel.Model : ''}
                                                        idName="Model"
                                                        onChange={(e) => setUpdateModel({ ...updateModel, Model: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            handleEnterNext(e)
                                                        }}
                                                        className={submitted && redIndex.includes('Model') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="model" />
                                                </div>
                                                <div className="loader-data">
                                                    <p>Media size:</p>
                                                    <select
                                                        value={updateModel && updateModel.Media_Size ? updateModel.Media_Size : ''}
                                                        idName="Media_Size"
                                                        onChange={(e) => setUpdateModel({ ...updateModel, Media_Size: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        className={submitted && redIndex.includes('Media_Size') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="media size">
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Media Size'] &&
                                                            selector_parameters?.['Media Size'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="loader-data">
                                                    <p>Pre-Treatment:</p>
                                                    <select
                                                        value={updateModel && updateModel.Pre_Treatment ? updateModel.Pre_Treatment : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, Pre_Treatment: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="Pre_Treatment"
                                                        className={submitted && redIndex.includes('Pre_Treatment') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="pre-treatment" >
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Pre-treatment'] &&
                                                            selector_parameters?.['Pre-treatment'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="loader-data">
                                                    <p>Post-Treatment:</p>
                                                    <select
                                                        value={updateModel && updateModel.Post_Treatment ? updateModel.Post_Treatment : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, Post_Treatment: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="Post_Treatment"
                                                        className={submitted && redIndex.includes('Post_Treatment') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="post-treatment" >
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Post-treatment'] &&
                                                            selector_parameters?.['Post-treatment'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="loader-data">
                                                    <p>Allowed lines:</p>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'row' }}>
                                                        <select

                                                            onChange={(e) => setCurrentLine(e.target.value)}
                                                            className={submitted && !updateModel.Allowed_Lines || submitted && updateModel.Allowed_Lines && updateModel.Allowed_Lines.length <= 0 ? 'red-required' : submitted && updateModel ? 'green-required' : ''}
                                                        >
                                                            <option value="" disabled selected={!currentLine ? true : false}>select line</option>
                                                            <option value="Plating line 1" >Plating line 1</option>
                                                            <option value="Plating line 2" >Plating line 2</option>
                                                        </select>
                                                        <button onClick={() => handleRemoveLine(currentLine, 'create')} className="add-btn">+</button>
                                                    </div>

                                                </div>
                                                <div className="loader-data">
                                                    <p>Quantity:</p>
                                                    <input
                                                        value={updateModel && updateModel.Quantity ? updateModel.Quantity : ''}
                                                        type="number"
                                                        onChange={(e) => setUpdateModel({ ...updateModel, Quantity: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="Quantity"
                                                        className={submitted && redIndex.includes('Quantity') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="quantity" />
                                                </div>
                                                <div className="loader-data">
                                                    <p>Container:</p>
                                                    <select
                                                        value={updateModel && updateModel.container ? updateModel.container : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, container: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="container"
                                                        className={submitted && redIndex.includes('container') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="container" >
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Container'] &&
                                                            selector_parameters?.['Container'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="loader-data">
                                                    <p>Poly Bag:</p>
                                                    <select
                                                        value={updateModel && updateModel.poly_bag ? updateModel.poly_bag : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, poly_bag: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="poly_bag"
                                                        className={submitted && redIndex.includes('poly_bag') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="poly bag" >
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Poly Bag'] &&
                                                            selector_parameters?.['Poly Bag'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="loader-data">
                                                    <p>Basket #:</p>
                                                    <select
                                                        value={updateModel && updateModel.basket_number ? updateModel.basket_number : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, basket_number: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="basket_number"
                                                        className={submitted && redIndex.includes('basket_number') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="basket number" >
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Basket Number'] &&
                                                            selector_parameters?.['Basket Number'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="loader-data">
                                                    <p>Endorsement:</p>
                                                    <select
                                                        value={updateModel && updateModel.endorsement ? updateModel.endorsement : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, endorsement: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="endorsement"
                                                        className={submitted && redIndex.includes('endorsement') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="endorsement" >
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Endorsement'] &&
                                                            selector_parameters?.['Endorsement'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                <div className="loader-data">
                                                    <p>Code:</p>
                                                    <input
                                                        value={updateModel && updateModel.Model_Code ? updateModel.Model_Code : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, Model_Code: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="Model_Code"
                                                        className={submitted && redIndex.includes('Model_Code') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="model code" />
                                                </div>
                                                <div className="loader-data">
                                                    <p>Condition #:</p>
                                                    <select
                                                        value={updateModel && updateModel.Condition_Number ? updateModel.Condition_Number : ''}
                                                        onChange={(e) => setUpdateModel({ ...updateModel, Condition_Number: e.target.value })}
                                                        onKeyDown={(e) => handleEnterNext(e)}
                                                        idName="Condition_Number"
                                                        className={submitted && redIndex.includes('Condition_Number') ? 'red-required' : submitted ? 'green-required' : ''}
                                                        placeholder="condition number"  >
                                                        <option value='' disabled></option>
                                                        {
                                                            selector_parameters && selector_parameters?.['Condition Number'] &&
                                                            selector_parameters?.['Condition Number'].map((items) => (<option value={items}>{items}</option>))
                                                        }
                                                    </select>
                                                </div>
                                                
                                                
                                            </div>

                                            <div className="loader-row">
                                                <div className="loader-data" style={{ width: '100%', height: '12vh', background: '#FFEDD4' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', height: 'fit-content', flexWrap: 'wrap', background: '#FFEDD4', padding: '1rem', borderRadius: '1rem', width: '100%' }}>
                                                        <p>Allowed Lines:&nbsp;</p>
                                                        {
                                                            updateModel && updateModel.Allowed_Lines && updateModel.Allowed_Lines.length > 0 && updateModel.Allowed_Lines.map((lines) =>
                                                                <span>
                                                                    {lines}
                                                                    <button onClick={() => handleRemoveLine(lines, 'remove')} className="close-btn">x</button>
                                                                </span>)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btn-group" >
                                            <button onClick={(e) => handlePost('create', updateModel, 'model', e)} className="manage-update">Add Model</button>
                                        </div>
                                    </div>
                                </div>
                                : optionSelected === 'parameters' ?

                                    <div className="justify-center">
                                        <div className="view-table-2">
                                            {
                                                NotificationState && <Notification message={NotificationState.message ?? ''} theme={NotificationState.theme ?? ''} />
                                            }
                                            {
                                                laoder && <AILoader message={'Checking in data sources'} />
                                            }
                                            {
                                                manageActions && manageActions.action === 'delete' ?
                                                    <DeleteModal manageActions={manageActions} handlePost={handlePost} setManageActions={setManageActions} />
                                                    : manageActions && manageActions.action === 'update' ?
                                                        <div className="loader-container">
                                                            <div className="loader-design">
                                                                <div className="loader-content" >
                                                                    <h4 style={{ marginBottom: '1rem' }}>Update Parameter</h4>
                                                                    <div className="loader-column">
                                                                        <div className="loader-data">
                                                                            <p>Parameter:</p>
                                                                            <input
                                                                                value={updateModel.parameter}
                                                                                idName="parameter"
                                                                                onChange={(e) => setUpdateModel({ ...updateModel, parameter: e.target.value })}
                                                                                onKeyDown={(e) => {

                                                                                    handleEnterNext(e)
                                                                                }}
                                                                                className={submitted && redIndex.includes('parameter') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                                placeholder="parameter" />
                                                                        </div>
                                                                        <div className="loader-data">
                                                                            <p>Type:</p>
                                                                            <select value={updateModel.type}
                                                                                idName="type"
                                                                                className={submitted && redIndex.includes('type') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                                onChange={(e) => setUpdateModel({ ...updateModel, type: e.target.value })}>
                                                                                <option value="" selected></option>
                                                                                <option value="Media Size">Media Size</option>
                                                                                <option value="Pre-treatment">Pre-treatment</option>
                                                                                <option value="Post-treatment">Post-treatment</option>
                                                                                <option value="Model Code">Model Code</option>
                                                                                <option value="Condition Number">Condition Number</option>
                                                                                <option value="Nickel 1">Nickel 1</option>
                                                                                <option value="Nickel 2">Nickel 2</option>
                                                                                <option value="Basket Number">Basket Number</option>
                                                                                <option value="Poly Bag">Poly Bag</option>
                                                                                <option value="Container">Container</option>
                                                                                <option value="Endorsement">Endorsement</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <button onClick={() => {
                                                                            setManageActions(false)
                                                                            setUpdateModel(false);
                                                                        }} className="manage-delete">Cancel</button>
                                                                        <button onClick={(e) => handlePost('update', updateModel, 'parameter', e)} className="manage-update">Confirm</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : manageActions && manageActions.action === 'add' ?
                                                            <div className="loader-container">
                                                                <div className="loader-design">
                                                                    <div className="loader-content" >
                                                                        <h4 style={{ marginBottom: '1rem' }}>Add Parameter</h4>
                                                                        <div className="loader-column">
                                                                            <div className="loader-data">
                                                                                <p>Parameter:</p>
                                                                                <input
                                                                                    value={updateModel.parameter}
                                                                                    idName="parameter"
                                                                                    onChange={(e) => setUpdateModel({ ...updateModel, parameter: e.target.value })}
                                                                                    onKeyDown={(e) => {

                                                                                        handleEnterNext(e)
                                                                                    }}
                                                                                    className={submitted && redIndex.includes('parameter') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                                    placeholder="parameter" />
                                                                            </div>
                                                                            <div className="loader-data">
                                                                                <p>Type:</p>
                                                                                <select
                                                                                    value={updateModel.type}
                                                                                    idName="type"
                                                                                    onChange={(e) => setUpdateModel({ ...updateModel, type: e.target.value })}
                                                                                    className={submitted && redIndex.includes('type') ? 'red-required' : submitted ? 'green-required' : ''}
                                                                                >
                                                                                    <option value=""></option>
                                                                                    <option value="Media Size">Media Size</option>
                                                                                    <option value="Pre-treatment">Pre-treatment</option>
                                                                                    <option value="Post-treatment">Post-treatment</option>
                                                                                    <option value="Condition Number">Condition Number</option>
                                                                                    <option value="Nickel 1">Nickel 1</option>
                                                                                    <option value="Nickel 2">Nickel 2</option>
                                                                                    <option value="Basket Number">Basket Number</option>
                                                                                    <option value="Poly Bag">Poly Bag</option>
                                                                                    <option value="Container">Container</option>
                                                                                    <option value="Endorsement">Endorsement</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <button onClick={() => {
                                                                                setManageActions(false)
                                                                                setUpdateModel(false);
                                                                            }} className="manage-delete">Cancel</button>
                                                                            <button onClick={(e) => handlePost('create', updateModel, 'parameter', e)} className="manage-update">Confirm</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : null
                                            }
                                            <h4 style={{ marginBottom: '1rem' }}>Parameter Setting</h4>
                                            <div style={{ display: 'flex', width: '90vw' }}>
                                                <div className="half-column">
                                                    <div className="loader-row">
                                                        <div className="loader-data" style={{ width: 'fit-content', gap: '0.2rem' }}>
                                                            <label>Parameter:</label>
                                                            <input onChange={(e) => setParamManagement({ ...ParamManagement, parameter_value: e.target.value, filter_manage: 'parameter_manage' })} placeholder="parameter" />
                                                        </div>
                                                        <div className="loader-data" style={{ width: 'fit-content', gap: '0.2rem' }}>
                                                            <label>Select Type:</label>
                                                            <select onChange={(e) => setParamManagement({ ...ParamManagement, parameter_type: e.target.value, filter_manage: 'parameter_manage' })}>
                                                                <option value="" selected></option>
                                                                <option value="Media Size">Media Size</option>
                                                                <option value="Pre-treatment">Pre-treatment</option>
                                                                <option value="Post-treatment">Post-treatment</option>
                                                                <option value="Model Code">Model Code</option>
                                                                <option value="Condition Number">Condition Number</option>
                                                                <option value="Nickel 1">Nickel 1</option>
                                                                <option value="Nickel 2">Nickel 2</option>
                                                                <option value="Basket Number">Basket Number</option>
                                                                <option value="Poly Bag">Poly Bag</option>
                                                                <option value="Container">Container</option>
                                                                <option value="Endorsement">Endorsement</option>
                                                            </select>
                                                        </div>
                                                        <button onClick={() => handleGetDetails(ParamManagement)} className="manage-update">Search</button>
                                                        <button onClick={() => handleInputValues('add', null, null, 'parameter')} className="add-btn">Add&nbsp;+</button>
                                                    </div>
                                                    <div className="view-table-2">
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Parameter</th>
                                                                    <th>Type</th>
                                                                    <th>Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                                {
                                                                    parameter_manage && parameter_manage.data && Object.entries(parameter_manage.data).length > 0 ?
                                                                        Object.entries(parameter_manage.data).map(([key, values]) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{values.parameter}</td>
                                                                                    <td>{values.type}</td>
                                                                                    <td>
                                                                                        <button onClick={() => setManageActions({ action: 'delete', id: values.id ?? '-', model: values.parameter ?? '-', database: 'parameter' })} className="manage-delete">Delete</button>
                                                                                        <button onClick={() => handleInputValues('update', values ?? '-', values.parameter ?? '-', 'parameter')} className="manage-update">Update</button>
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
                                                            parameter_manage && parameter_manage.links ?
                                                                parameter_manage.links.map((link, index) =>
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
                                                <div className="half-column">
                                                    <h4>QR Generatation</h4>
                                                    <div className="loader-row">
                                                        <div className="loader-data">
                                                            <label>Select type:</label>
                                                            <select
                                                                onChange={
                                                                    (e) => {
                                                                        setQrGeneration({ ...qrGeneration, type: e.target.value })
                                                                    }
                                                                }>
                                                                <option></option>
                                                                <option value="Basket Number">Basket Number</option>
                                                                <option value="Container">Container</option>
                                                                <option value="Endorsement">Endorsement</option>
                                                                <option value="Nickel 1">Nickel 1</option>
                                                                <option value="Nickel 2">Nickel 2</option>
                                                                <option value="Poly Bag">Poly Bag</option>
                                                            </select>
                                                        </div>
                                                        <button onClick={() => handleQrGeneration(selector_parameters?.[qrGeneration.type] ?? null, qrGeneration.type, 'all')} className="add-btn" disabled={!(qrGeneration && qrGeneration.type)}>All</button>
                                                    </div>
                                                    <div className="loader-row">
                                                        <div className="loader-data">
                                                            <label>Select Parameter:</label>
                                                            <select value={qrGeneration.single} onChange={(e) => setQrGeneration({ ...qrGeneration, single: e.target.value })}>
                                                                <option></option>
                                                                {
                                                                    selector_parameters && qrGeneration && qrGeneration.type && selector_parameters?.[qrGeneration.type].map((items) => (<option>{items}</option>))
                                                                }
                                                            </select>
                                                        </div>
                                                        <button onClick={() => handleQrGeneration(qrGeneration.single ?? null, qrGeneration.type, 'single')} disabled={!(qrGeneration && qrGeneration.single)} className="add-btn">+</button>
                                                    </div>
                                                    <div className="loader-column">
                                                        <p>Parameter List</p>
                                                        <DocumentGenerator qrGeneration={qrGeneration ?? null} />
                                                        <div className="qr-data">
                                                            {
                                                                qrGeneration && qrGeneration.qr && qrGeneration.qr.length > 0 ? qrGeneration.qr.map((codes, index) => (
                                                                    <span>{codes.type}:&nbsp;{codes.parameters}<button onClick={() => handleQrGeneration(codes.parameters, index, 'remove')} className="close-btn">x</button></span>
                                                                )) : <span>Please select parameter</span>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                    }
                </div>
            </div>
        </div>
    )
}