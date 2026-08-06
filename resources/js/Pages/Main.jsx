import React ,{ useState ,useEffect }from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import '../../css/footer.css'
import AELogo from "../../assests/AE2.png";
import Process from '../Components/Process';
import Home from '../Components/Home';
import HomePicture from '../../assests/P2Plating.png'
import AILoader from '../Components/AILoader';
import Notification from '../Components/Notification';
import ViewAll from '../Components/ViewAll';
import Admin from '../Components/Admin';

export default function Main() {
    //Get last segment
        const currentUrl = window.location.pathname.split('/').filter(Boolean).pop() || 'Home';

        const capitalizedFirstLetter = currentUrl.charAt(0).toUpperCase()+currentUrl.slice(1);

        const { appName, serial ,data ,model , routing ,location, order,error,loading,message , orderList , filter_serial , model_manage,parameter_manage,selector_parameters} = usePage().props;
      
        const [ handleData , setData ] = useState(data);
        const [ handleModel,setModelOrder] = useState(model);
        const [ handleOrder,setOrder] = useState(order);
        const [ handleError,setError] = useState(error);
        const [ loader, setLoader] = useState(false);
        const [ messageData ,setMessageData] = useState(false);
        
        function setAll(){
             setData(data);
            setModelOrder(model);
            setOrder(order);
            setError(error);
            setLoader(loading);
        }

        function notification(){
            setTimeout(()=>{
                setMessageData(false)
            },2000)
        }
        useEffect(() => {
            setTimeout(()=>{
               setMessageData(message);
               setAll()
               notification();
            },1000)
        }, [data,model,order,error,loader,message]);
        
          console.log('Production Order: ' , data, model ,order , ' State: ' , handleData , handleModel,handleOrder,handleError );
          console.log('View List: ' , orderList,capitalizedFirstLetter);
    return (
        <>
           <Head title={capitalizedFirstLetter} />
           { loader && (<AILoader/>)}
       
           <main  className="main-layout" style={{ background: capitalizedFirstLetter.toLowerCase() == 'home'  ?  `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0,0.6)), url(${HomePicture}) no-repeat center center fixed` :null 
                                                    }}>
                { messageData && <Notification theme={messageData.theme ?? ''} message={messageData.message ?? ''} /> }
                <MainLayout>
                    
                    <div className='children-container'>

                        {
                            capitalizedFirstLetter.toLowerCase() == 'encode' ?
                                <Process  data={handleData} model={handleModel} location={location} routing={routing} order={handleOrder} error={handleError} loader={loader} setLoader={setLoader}/>
                            :capitalizedFirstLetter.toLowerCase() == 'view' ?
                                <ViewAll list={orderList} setLoader={setLoader} filter_serial={filter_serial}/>
                            :capitalizedFirstLetter.toLowerCase() == 'home' ? 
                                <Home/>
                            :capitalizedFirstLetter.toLowerCase() == 'admin' ?
                                <Admin model_manage={model_manage} parameter_manage={parameter_manage} selector_parameters={selector_parameters}/>
                            :null
                        }
                    </div>
                </MainLayout>
            </main>
            <footer className='footer'>
                <div className='main-footer'>
                    <div className='upper-footer'>
                        <div className='footer-col'>
                           <img src={AELogo} alt="Company Logo" className="logo" style={{ width:"5rem", height:"5rem" , alignSelf:"center" }}/>
                           <h4 style={{ alignSelf:"center" }} >Automation Engineering</h4>
                        </div>
                        <div className='footer-col'>
                            <h4>Automation Engineer - Software Team</h4>
                            <span><strong>Jose</strong></span>
                            <span>Edz</span>
                            <span>Joshua</span>
                        </div>
                        <div className='footer-col'>
                            <h4>Contact Us!</h4>
                            <h4>Have questions? Reach out anytime.</h4>
                            <a style={{  textDecoration:'underline' , color:"blue"}} href="mailto:ae@smp.com.ph?cc=automation@smp.com.ph;automation2@smp.com.ph;automation3@smp.com.ph;edzel@smp.com.ph;myke@smp.com.ph&subject=Support:%20Production%20Order%20Website">ae@smp.com.ph</a>
                        </div>
                    </div>
                    <div className='lower-footer'>
                        <p>&copy;2026 Shin-Etsu Magnetics Philippines, Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            
        </>
    );
}
