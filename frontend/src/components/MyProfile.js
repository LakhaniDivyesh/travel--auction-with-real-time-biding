import React, { useEffect, useState } from 'react';
import { MdErrorOutline } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { getProfile, setProfile } from '../services/home.service';
import { useNavigate } from 'react-router-dom';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-js-loader";

export default function MyProfile() {
    const { handleSubmit, register, formState: { errors } } = useForm({ mode: "onChange" });

    const router = useNavigate();

    const [destination, setDestination] = useState([]);
    const [preference, setPreference] = useState([]);

    var user = JSON.parse(localStorage.getItem('user') || '[]');

    const [loader, setLoader] = useState(true);
    useEffect(() => {
        if (user[0].role !== 'travelers') {
            router('/login');
        }

        getProfile().then((r) => {
            setPreference(r.data[0][0].preferences.split(','))
            setDestination(r.data[1][0].destination.split(','))
            setLoader(false)

        })

    }, [])

    console.log(destination.includes('Goa'));
    const onSubmit = (value) => {
        let data = { destination: value.destination, preference: value.preference };

        setProfile(data).then((r) => {
            if (r.code === '1') {
                toast.success(r.message, {
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
                    router('/');
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
            {loader ?
                <div className='w-100 d-flex align-items-center justify-content-center' style={{ height: '300px' }}>
                    <Loader type="box-rectangular" bgColor={"#999999"} size={80} />
                </div>
                :
                <div className="col-md-12 px-5" style={{ height: '90vh', overflowY: 'auto' }}>


                    <div className="row my-0 mx-0 mt-3 mb-3 pt-3 p-0 d-flex justify-content-center">
                        <ToastContainer />
                        <div className='col-md-6 p-5 form-con'>
                            <div className="row m-0 row-con">
                                <h3 className='h3 text-center w-100 mb-5'>Profile</h3>
                                <form id="login-form" className="" onSubmit={handleSubmit(onSubmit)}>

                                    <div className="col-md-12 mb-3">
                                        <input
                                            type="text"
                                            className="form-control py-2 px-4"
                                            id="Name"
                                            value={user[0]?.name}
                                            placeholder="name"
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <input
                                            type="text"
                                            className="form-control py-2 px-4"
                                            id="email"
                                            value={user[0]?.email}
                                            placeholder="email"
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className='mb-1'>Select wishlist Destination</label><br></br>
                                        <input type='checkbox' className='me-1'
                                            value={'Goa'}
                                            {...register("destination", {
                                                required: "Please select destination."
                                            })}
                                            defaultChecked={destination.includes('Goa')}
                                        />
                                        <label className='me-1'>Goa</label>
                                        <input type='checkbox' className='me-1'
                                            value={'Jaipur'}
                                            {...register("destination", {
                                                required: "Please select destination."
                                            })}
                                            defaultChecked={destination.includes('Jaipur')}
                                        />
                                        <label className='me-1'>Jaipur</label>
                                        <input type='checkbox' className='me-1'
                                            value={'Agra'}
                                            {...register("destination", {
                                                required: "Please select destination."
                                            })}
                                            defaultChecked={destination.includes('Agra')}
                                        />
                                        <label className='me-1'>Agra</label>
                                        <input type='checkbox' className='me-1'
                                            value={'Manali'}
                                            {...register("destination", {
                                                required: "Please select destination."
                                            })}
                                            defaultChecked={destination.includes('Manali')}
                                        />
                                        <label className='me-1'>Manali</label>
                                        {errors.destination && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.destination.message}</p>}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label className='mb-1'>Select Your Trip Preference</label><br></br>
                                        <input type='checkbox' className='me-1'
                                            value={'wifi'}
                                            {...register("preference", {
                                                required: "Please select preference."
                                            })} 
                                            defaultChecked={preference.includes('wifi')}
                                            />
                                        <label className='me-1'>Wifi</label>
                                        <input type='checkbox' className='me-1'
                                            value={'bus'}
                                            {...register("preference", {
                                                required: "Please select preference."
                                            })} 
                                            defaultChecked={preference.includes('bus')}
                                            />
                                        <label className='me-1'>Bus</label>
                                        <input type='checkbox' className='me-1'
                                            value={'train'}
                                            {...register("preference", {
                                                required: "Please select preference."
                                            })} />
                                        <label className='me-1'>Train</label>
                                        <input type='checkbox' className='me-1'
                                            value={'food'}
                                            {...register("preference", {
                                                required: "Please select preference."
                                            })} 
                                            defaultChecked={preference.includes('food')}
                                            />
                                        <label className='me-1'>Food</label>
                                        <input type='checkbox' className='me-1'
                                            value={'ac hotel'}
                                            {...register("preference", {
                                                required: "Please select preference."
                                            })} 
                                            defaultChecked={preference.includes('ac hotel')}
                                            />
                                        <label className='me-1'>Ac Hotel</label>
                                        <input type='checkbox' className='me-1'
                                            value={'non ac hotel'}
                                            {...register("preference", {
                                                required: "Please select preference."
                                            })} 
                                            defaultChecked={preference.includes('non ac hotel')}
                                            />
                                        <label className='me-1'>Non Ac Hotel</label>
                                        {errors.preference && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.preference.message}</p>}
                                    </div>

                                    <div className="col-md-12">
                                        <button type="submit" className="w-100 py-2 btn btn-dark" id="login-btn">Set Profile</button>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            }
        </>
    )
}
