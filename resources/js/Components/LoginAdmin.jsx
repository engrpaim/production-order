
import React from 'react';
import '../../css/login.css'
import { useState , useEffect} from 'react';
import { useForm } from '@inertiajs/react';
import LoginPicture from '../../assests/P2Plating.png';

export default function LoginAdmin({ children,loginError,loginSuccess , auth}) {
    const [isLogin , setIsLogin] = useState(false);
    const [LogInMode, setLogInMode] = useState('login');
    const [errorsState ,setErrorState] = useState(false);
    const [registerState ,setRegisterState] = useState(false);

    const {
        data: loginData,
        setData: setLoginData,
        post: loginPost,
        processing: loginProcessing,
        errors: loginErrors } = useForm({

            id_number: '',
            password: '',
            method: 'login',
        });

    const {

        data: registerUser,
        setData: setRegisterUser,
        post: registerPost,
        processing: registerProcessing,
        errors: registerErros,
        reset: resetRegisterUser,
    } = useForm({
        id_number: '',
        first_name: '',
        surname: '',
        department: '',
        email: '',
        password: '',
        line:'',
        confirm_password: '',
        method: 'register',
    });


    function isValidEamil(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function isConfirmPassword(password, confirm) {
        const passwordMatch = password === confirm ? true : false;
        return passwordMatch
    }

    function NotificationClass(id, design) {
        const idElements = id ?? null;
        console.log(id);
        if (!idElements) return

        idElements.forEach((items) => {
            const element = document.getElementById(items);
            console.log(items, design);
            if (element) {
                element.className = design; // Only runs if the element actually exists
            } else {
                console.warn(`Could not find element with id: ${items}`);
            }
        })
    }

    function NotificationTitle(data ,set){
            set(data)
            setTimeout(()=>{
                set(null)
            },3000)
    }
    
    //handle registration
    const handleRegister = (e) => {
        e.preventDefault();
        console.log('Register processing.......', registerUser);
        const checkEmail = isValidEamil(registerUser.email);
        
        const isMachPassword = isConfirmPassword(registerUser.password, registerUser.confirm_password);

        const redInput = [];
        let countEpmty = 0

        Object.entries(registerUser).map(([key, values]) => {
            if (values === '') {
                redInput.push(key)
                countEpmty += 1
            }
        })

        console.log('Email.....', checkEmail, 'Confirm Password......', isMachPassword, 'CountEmpty....', countEpmty, 'All red input.....', redInput);
        if (countEpmty > 1 || !isMachPassword || !checkEmail) {

            if(!checkEmail) redInput.push('email')
            if(!isMachPassword) redInput.push('password' , 'confirm_password')

            NotificationClass(redInput, "login-error")
            
            setTimeout(() => {
                NotificationClass(redInput, "")
            }, 2000);
            return;
        }

        registerPost('/production-order/login', {
            preserveScroll:true,
            onSuccess: (page) => {
                if (page.props.loginSuccess) {
                    setRegisterState(page.props.loginSuccess)
                    setTimeout(()=>{
                        setRegisterState(null);
                        setRegisterUser({
                                    id_number: '',
                                    first_name: '',
                                    surname: '',
                                    department: '',
                                    email: '',
                                    password: '',
                                    line:'',
                                    confirm_password: '',
                                    method: 'register',
                                });
                            },3000);

                    setTimeout(()=>{
                        window.location.href = "/production-order/login"
                    },4000);
                   
                }else if (page.props.loginError){
                     setErrorState(page.props.loginError)
                     setTimeout(()=>{
                        setErrorState(null);
                    },3000);
                 
                }
            },
            onError: () => {
                resetRegisterUser();
            }
        })

    }

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Log In processing.......', loginData);
        loginPost('/production-order/login', {
            onSuccess:(page)=>{
                if (page.props.loginError){
                     setErrorState(page.props.loginError)
                     setTimeout(()=>{
                        setErrorState(null);
                    },3000);
                 
                }
            }
            ,
            onError: () => {
                resetRegisterUser();
            }
        })
    }
    return (
        <>
            {
                auth && auth.user ? children :
                    <div className='login-container'>
                        <div className='login-left'>
                            <img src={LoginPicture} />
                        </div>
                        <div className='login-right'>
                            {
                                LogInMode === 'login' ?
                                    <form onSubmit={handleLogin}>
                                        <div>
                                            <label>I.D Number</label>
                                            <input

                                                idName='id_number'
                                                type="text"
                                                value={loginData.id_number}
                                                onChange={(e) => setLoginData('id_number', e.target.value)} />
                                        </div>
                                        <div>
                                            <label>Password</label>
                                            <input
                                                idName='password'
                                                type='password'
                                                value={loginData.password}
                                                onChange={(e) => setLoginData('password', e.target.value)} />
                                        </div>
                                        <div className={errorsState  ?'login-error2':'login-error3'}>
                                            <p>{errorsState ?errorsState:registerState?registerState :''}</p>
                                        </div>
                                        <button type='submit'>Login</button>

                                        <hr />
                                        <p>or</p>
                                        <button type='button' onClick={(e) => setLogInMode('register')}>Register User</button>
                                        <p>Forgot Password?<a>here</a></p>
                                    </form> :
                                    <form onSubmit={handleRegister}>
                                        <div id='id_number' >
                                            <label>I.D Number</label>
                                            <input

                                                type="number"
                                                value={registerUser.id_number}
                                                onChange={(e) => setRegisterUser('id_number', e.target.value)} />
                                        </div>

                                        <div id='first_name'>
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                value={registerUser.first_name}
                                                onChange={(e) => setRegisterUser('first_name', e.target.value)} />
                                        </div>
                                        <div  id='surname'>
                                            <label>Surname</label>
                                            <input
                                                idName='surname'
                                                type="text"
                                                value={registerUser.surname}
                                                onChange={(e) => setRegisterUser('surname', e.target.value)} />
                                        </div>

                                        <div id='department'>
                                            <label>Department</label>
                                            <input
                                                idName='department'
                                                type="text"
                                                value={registerUser.department}
                                                onChange={(e) => setRegisterUser('department', e.target.value)} />
                                        </div>
                                        <div id='email'>
                                            <label>E-mail</label>
                                            <input
                                                idName='email'
                                                type="text"
                                                value={registerUser.email}
                                                onChange={(e) => setRegisterUser('email', e.target.value)} />
                                            <p></p>
                                        </div>
                                        <div id='line'>
                                            <label>Line</label>
                                            <input
                                                idName='line'
                                                type="text"
                                                value={registerUser.line}
                                                onChange={(e) => setRegisterUser('line', e.target.value)} />
                                        
                                        </div>
                                        <div id='password'>
                                            <label>Password</label>
                                            <input
                                                idName='password'
                                                type='password'
                                                value={registerUser.password}
                                                onChange={(e) => setRegisterUser('password', e.target.value)} />
                                        </div>
                                        <div id='confirm_password'>
                                            <label>Confirm Password:</label>
                                            <input
                                                idName='confirm_password'
                                                type='password'
                                                value={registerUser.confirm_password}
                                                onChange={(e) => setRegisterUser('confirm_password', e.target.value)} />
                                            <p></p>
                                        </div>
                                        <div className={errorsState  ?'login-error2':'login-error3'}>
                                            <p>{errorsState ?errorsState:registerState?registerState :''}</p>
                                        </div>
                                        <button type='submit'>Register</button>

                                        <hr />
                                        <p>Already have account?</p>
                                        <button type='button' onClick={(e) => setLogInMode('login')}>Log In</button>
                                    </form>
                            }

                        </div>
                    </div>
            }
        </>
    )
}