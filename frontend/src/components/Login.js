import { Link, useNavigate } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { FaRegEye } from 'react-icons/fa6';
import { MdErrorOutline } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { userLogin } from '../services/home.service';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {


    const { handleSubmit, register, formState: { errors } } = useForm({ mode: "onChange" });

    const [setPassword] = useState("");
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(<FaRegEyeSlash size={25} />);

    const router = useNavigate();


    var user = JSON.parse(localStorage.getItem('user') || '[]');

    useEffect(() => {
        if (user.length > 0) {
            if (user[0].role === 'travelers') {
                router('/')
            } else {
                router('/provider')
            }
        }
    },[])

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(<FaRegEye size={25} />);
            setType('text')
        } else {
            setIcon(<FaRegEyeSlash size={25} />)
            setType('password')
        }
    }

    const onSubmit = (value) => {
        let data = { email: value.email, password: value.password };
        userLogin(data).then((r) => {
            if (r.data.length > 0 && r.code === '1') {
                localStorage.setItem('user', JSON.stringify(r.data));
                toast.success(`Welcome back! ${r.data[0].name}`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                setTimeout(() => {
                    if (r.data[0].role === 'travelers') {
                        router('/')
                    } else {
                        router('/provider')
                    }
                }, 1400);

            } else {
                toast.error(r.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        })

    }

    return (
        <>
            <ToastContainer />
            <div className="row m-0 p-0 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className='col-md-5 bg-white p-5 form-con d-flex align-items-center'>
                    {/* <img src="/assets/images/login" alt="" style={{height:'auto',width:'350px'}} /> */}
                    <div className="row m-0 row-con">
                        <h3 className='h3 text-center w-100 mb-5'>Login</h3>
                        <form id="login-form" className="" onSubmit={handleSubmit(onSubmit)}>
                            <div className="col-md-12 mb-3 position-relative">
                                <input
                                    className="form-control py-2 px-4"
                                    id="exampleInputEmail1"
                                    aria-describedby="emailHelp"
                                    placeholder="Email"
                                    type="text"
                                    {...register("email", {
                                        required: "Please enter email.",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter valid email."
                                        }
                                    })}
                                    style={{ background: errors.email ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                />
                                {errors.email && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.email.message}</p>}
                            </div>

                            <div className="col-md-12 mb-3">
                                <div className='position-relative'>
                                    <input
                                        name="password"
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        id="exampleInputPassword1"
                                        className="form-control py-2 px-4"
                                        type={type}
                                        {...register("password", {
                                            required: "Please enter password.",
                                            pattern: {
                                                value: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                                                message: "Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol."
                                            }
                                        })}
                                        style={{ background: errors.password ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    />
                                    <span className="position-absolute bi btn" onClick={handleToggle}>
                                        {icon}
                                    </span>
                                </div>
                                {errors.password && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.password.message}</p>}
                            </div>

                            <div className="col-md-12 mb-4">
                                <button type="submit" className="w-100 btn btn-dark py-2" id="login-btn">Login</button>
                            </div>
                            <div className='col-md-12 mx-auto text-center'>
                                <Link to="/signup" className="text-secondary-emphasis" id="signup-link">
                                    Don't have an account? Let's get you set up.</Link>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default Login
