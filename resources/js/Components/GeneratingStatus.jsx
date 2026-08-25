export default function GeneratingStatus({ message ,loading ,status}) {
    return (
        <div className={message && loading ? 'generate-loading':status === "waiting"? 'generate-waiting':status === "generate"?'generate-tab':'generate-done'}>
            {loading && <div className="loader2" />}
            <p>{message}</p>
        </div>
    )
}