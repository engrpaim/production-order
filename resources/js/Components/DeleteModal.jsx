export default function DeleModal({manageActions,handlePost,setManageActions}) {
    return (
        <div className="loader-container">
            <div className="loader-design">
                <div className="loader-content" >
                    <h4 style={{ marginBottom: '1rem' }}>Delete Model</h4>
                    <p style={{ marginBottom: '1rem' }}>Are you sure you want to delete <strong>{manageActions.model}</strong>?</p>
                    <div>
                        <button onClick={() => handlePost('delete', manageActions, manageActions.database ?? null)} className="manage-update">Confirm</button>
                        <button onClick={() => setManageActions(false)} className="manage-delete">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}