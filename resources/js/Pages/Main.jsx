import React ,{ useState ,useEffect }from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

import Process from '../Components/Process';

export default function Main() {
    //Get last segment
        const currentUrl = window.location.pathname.split('/').filter(Boolean).pop() || 'Home';

        const capitalizedFirstLetter = currentUrl.charAt(0).toUpperCase()+currentUrl.slice(1);

        const { appName, serial ,data ,model , routing ,location, order,error} = usePage().props;
      
        const [ handleData , setData ] = useState(data);
        const [ handleModel,setModelOrder] = useState(model);
        const [ handleOrder,setOrder] = useState(order);
        const [ handleError,setError] = useState(error);
        useEffect(() => {

            setData(data);
            setModelOrder(model);
            setOrder(order);
            setError(error);
        
        }, [data,model,order,error]);
        
          console.log('Production Order: ' , data, model ,order , ' State: ' , handleData , handleModel,handleOrder,handleError);
    return (
        <>
            <Head title={capitalizedFirstLetter} />
            <div>
                <MainLayout>
                    <div className='children-container'>
                        {
                            capitalizedFirstLetter.toLowerCase() == 'encode' ?
                                <Process data={handleData} model={handleModel} location={location} routing={routing} order={handleOrder} error={handleError}/>
                            :null
                        }
                    </div>
                </MainLayout>
            </div>
        </>
    );
}
