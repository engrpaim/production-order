
import ExcelJS from 'exceljs';
const checkIfRequired = (e) => {
    const input = document.querySelectorAll('input');
    const arr = Array.from(input)


    const indexArray = [];
    console.log('Check array', arr);
    let countEmpty = 0;
    arr.map((items, index) => {
        console.log('Input Array: ', items.value);
        if (!items.value && items.getAttribute("idName")) {
            countEmpty += 1;
            console.log('values:', items.getAttribute("idName"), items, index)
            indexArray.push(items.getAttribute("idName"))
        }
    })


    const select = document.querySelectorAll('select');
    const arrSelect = Array.from(select);

    arrSelect.map((items, index) => {
        console.log('Select Array:', items.value);
        const value = items.value ? items.value.trim() : false;
        if (!value && items.getAttribute("idName") && items.getAttribute("idName") !== 'Allowed_Lines') {
            countEmpty += 1;
            console.log('values:', items.getAttribute("idName"), items, index)
            indexArray.push(items.getAttribute("idName"))
        }
    });
    console.log('index array', indexArray, countEmpty);

    return { count: countEmpty, index: indexArray }

}
const handleEnterNext = (e) => {
    if (e.key !== 'Enter') return
    const inputs = document.querySelectorAll('input');
    const arr = Array.from(inputs);
    const index = arr.indexOf(e.target)
    const next = index + 1
    console.log('List of inputs: ', inputs, arr, e.target, index);
    if (arr[next]) {
        arr[next].focus();
    }
}

const handleDownload = async (data, title) => {
    
    if (!data) return;
    const excelDate = JSON.parse(data);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    console.log(excelDate);
    worksheet.columns = [
        { header: 'Model', key: 'Model_Name', width: 20 },
        { header: 'Work Order ID', key: 'Work_Order', width: 20 },
        { header: 'Quantity', key: 'Quantity', width: 20 },
        { header: 'Loader', key: 'Loader', width: 20 },
        { header: 'Loading Time', key: 'Loading_time', width: 20 },
        { header: 'Nickel 1', key: 'Nickel_1', width: 20 },
        { header: 'Nickel 2', key: 'Nickel_2', width: 20 },
        { header: 'Container', key: 'Container', width: 20 },
        { header: 'Poly Bag', key: 'PolyBag', width: 20 },
        { header: 'Route', key: 'Route_Code', width: 20 },
        { header: 'Unloader', key: 'Unloader', width: 20 },
        { header: 'Unloading Time', key: 'Unloading_time', width: 20 },
        { header: 'Endorsed To', key: 'Endorsed_To', width: 30 },
        { header: 'Location', key: 'CurrentLocation', width: 20 }
    ];


    worksheet.addRows(excelDate);

    // 4. Generate buffer and trigger browser download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
}

export { handleEnterNext, checkIfRequired, handleDownload }