import '../../css/notification.css';
export default function Notification({theme, message}){
    return(
        <div className="notification-container">
            <div className={theme}>
                <p>{message}</p>
            </div>
        </div>
    )
}