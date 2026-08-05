
const checkIfRequired =(e)=>{
    const input = document.querySelectorAll('input');
    const arr = Array.from(input)
    const indexArray = [];
    console.log('Check array' , arr);
    let countEmpty = 0;
    arr.map((items,index)=>{
        console.log(items.value);
        if(!items.value){
            countEmpty += 1;
            console.log('values:',items.getAttribute("idName") , items,index)
            indexArray.push(items.getAttribute("idName"))
        }
    })
    console.log('index array',indexArray,countEmpty );

    return { count:countEmpty , index:indexArray}
   
}
const handleEnterNext =(e)=>{
    if(e.key !== 'Enter') return
    const inputs = document.querySelectorAll('input');
    const arr = Array.from(inputs);
    const index = arr.indexOf(e.target)
    const next = index + 1
    console.log('List of inputs: ' , inputs,arr,e.target,index);
    if (arr[next]) {
            arr[next].focus();
        }
}



export { handleEnterNext , checkIfRequired }