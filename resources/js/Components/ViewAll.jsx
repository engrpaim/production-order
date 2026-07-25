import '../../css/view.css';
export default function ViewAll({ list }) {
    console.log('View all: ', list.data);
    return (
        <div className="view-main">
            <div>
                <div>
                    <h1>Order List</h1>
                </div>
                {
                    list && list.data &&
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Work Order I.D</th>
                                    <th>Model Name</th>
                                    <th>Daily Check</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Loading</th>
                                    <th>Unloading</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.entries(list.data).map(([key, value]) => {
                                        return (
                                            <tr>
                                                <td>{value.Work_Order ?? '-' }</td>
                                                <td>{value.Model_Name ?? '-' }</td>
                                                <td>{value.Daily_Check.Daily_Check_File ?? '-' }</td>
                                                <td>{value.Status ?? '-' }</td>
                                                <td>{value.CurrentLocation ?? '-' }</td>
                                                <td>{value.Loading_time ?? '-'}</td>
                                                <td>{value.Unloading_time ?? '-'}</td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    )
}