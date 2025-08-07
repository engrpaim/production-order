import React ,{ useState ,useEffect }from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

import Process from '../Components/Process';

export default function Main() {
    //Get last segment
        const currentUrl = window.location.pathname.split('/').filter(Boolean).pop() || 'Home';

        // Capitalize the first letter for title
        const capitalizedFirstLetter = currentUrl.charAt(0).toUpperCase()+currentUrl.slice(1);

         // Access appName prop from Inertia page props (not used here)
        const { appName, serial ,data ,model , routing ,location, order} = usePage().props;
        const [ handleData , setData ] = useState(data);
        const [ handleModel,setModelOrder] = useState(model);
        const [ handleOrder,setOrder] = useState(order);

        useEffect(() => {
            setData(data);
        }, [data]);

        useEffect(() => {
            console.log(model);
            setModelOrder(model);
        }, [model]);

        useEffect(() => {
            console.log(order);
            setOrder(order);
        }, [order]);

        //Output Checker (developement phase)
        console.log(capitalizedFirstLetter.toLowerCase() == 'encode');

        let content;

        if(capitalizedFirstLetter.toLowerCase() == 'encode'){
            content = <Process data={handleData} model={handleModel} location={location} routing={routing} order={order}/>
        }

    return (
        <>
            <Head title={capitalizedFirstLetter} />

            <MainLayout>
                <div className='children-container'>
                     {content}
               </div>
            </MainLayout>
        </>
    );
}
