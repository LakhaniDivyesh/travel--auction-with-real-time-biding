import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdErrorOutline } from "react-icons/md";
import { useForm } from 'react-hook-form';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { listingBids, placeBid } from '../services/home.service';
import moment from 'moment';



function Auction({ socket }) {

    const location = useLocation()
    const v = location.state

    var user = JSON.parse(localStorage.getItem('user') || '[]');

    const navigate = useNavigate()

    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [expired, setExpired] = useState(false);


    const [bidData, setBidData] = useState([]);

    const calculateTimeLeft = () => {
        const difference = new Date(v?.auction_end_date) - new Date();

        if (difference <= 0) {
            setExpired(true);
        } else {
            setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
            setHours(Math.floor((difference / (1000 * 60 * 60)) % 24));
            setMinutes(Math.floor((difference / 1000 / 60) % 60));
            setSeconds(Math.floor((difference / 1000) % 60));
        }
    };

    useEffect(() => {
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);

    });

    // useEffect(()=>{
    //     socket.emit('join_room', {room:v?.id})
    // },[])

    useEffect(() => {
        listingBids(v?.id).then((r) => {
            setBidData(r.data)
        })

        socket.on('message', (data) => {
            if (data.package_id === v?.id) {
                setBidData((prev) => [data, ...prev])
            }

        })
    }, [socket])
    



    const { handleSubmit, register, formState: { errors }, setValue } = useForm({ mode: "onChange" });

    const onSubmit = (value) => {
        let data = { price: value.price, package_id: v?.id };

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            toast.error('time is over! you can not place bid.', {
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
        } else if (value.price < v?.base_price) {
            toast.error('Your amount is less then base price.', {
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
        } else {
            placeBid(data).then((r) => {
                if (r.code === '1') {
                    setValue('price', '')
                    socket.emit('message', {
                        package_id: v?.id,
                        name: user[0].name,
                        price: value.price,
                        created_at : `${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`,
                        socketID: socket.id,
                    });
                    setBidData((data) => [{ name: user[0].name, price: value.price,created_at: `${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}`}, ...data])

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


    }

    return (
        <>
            <ToastContainer />

            <div>
                <div className="col-md-12 px-2" style={{ height: 'auto', overflowY: 'auto' }}>
                    <div className="row my-0 mx-0 p-0 d-flex justify-content-center">
                        <div className='col-md-8 d-flex flex-row  align-items-center bg-white my-4 p-1'>
                            <div className="row m-0 w-100">
                                <div className="col-md-3 p-3 text-center">
                                    <img src={v?.image} alt='book' className='product-img' style={{ width: "100%" }} />
                                </div>
                                <div className="col-md-6 p-3">
                                    <h2 className='h2 title mb-2'>{v?.name}</h2>
                                    <p className='mb-0 text-secondary'><strong>{v.destination}</strong></p>
                                    <p className='text-primary w-100 price mt-2 mb-0 '>Base Price : {v?.base_price}</p>
                                </div>

                                <div className="col-md-3 p-3 d-flex bg-light justify-content-center">
                                    {expired ? (
                                        <h5 className="text-danger mt-2">Time Over!</h5>
                                    ) : (
                                        <h5 className="text-danger mt-2">
                                            {days} days {hours} hours {minutes} minutes {seconds}{" "}
                                            seconds left
                                        </h5>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="col-md-8 mx-auto mt-1">
                        <div class="card text-center my-2">
                            <div class="card-header text-start text-primary">
                                <span className='text-secondary'>As travelers </span>{user[0]?.name}
                            </div>
                            <div class="card-body d-flex align-items-center bg-light flex-column" style={{ height: '450px', overflowY: 'auto' }}>
                                {bidData?.length > 0 ? (
                                    bidData?.map((v, i) => (
                                        <div className={`w-100 m-2 py-2 px-3 h-auto text-start bid ${v.name === user[0]?.name ? 'mybid' : 'bid'}`} style={{ maxHeight: '90px' }}>
                                            <div className='d-flex align-items-center w-100 mb-2'>
                                                <h5 className='h5 m-0 me-2'>{v.name}</h5>
                                                <label className='status text-secondary  p-0 m-0'>{moment(v?.created_at).fromNow()}</label>
                                            </div>
                                            <label className='status accept px-4'>₹{v.price}</label>
                                        </div>
                                    ))
                                )
                                    :
                                    (
                                        <div className='bg-white w-100 m-2 py-2 px-3 h-auto text-start' style={{ maxHeight: '90px' }}>
                                            <label className='status accept px-4'>Base Price is ₹{v?.base_price} ! Start bid to more price</label>
                                        </div>
                                    )
                                }

                            </div>

                            <div class="card-footer text-muted w-100">
                                {user[0]?.role === 'travelers' ?
                                    <>
                                        {errors.price && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.price.message}</p>}
                                        <form id="form" className="w-100 d-flex align-items-center justify-content-between" onSubmit={handleSubmit(onSubmit)}>
                                            <input
                                                type="text"
                                                className="form-control py-2 px-4 me-2"
                                                id="price"
                                                placeholder="Enter Bid Price.."
                                                {...register("price", {
                                                    required: "Please enter bid price.",
                                                    pattern: {
                                                        value: /^\d+(.\d{1,2})?$/i,
                                                        message: "Please enter valid bid price."
                                                    }
                                                })}
                                                style={{ background: errors.price ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                            />
                                            <button className='btn btn-success px-3 w-25 py-2' type='submit'>Place Bid</button>
                                        </form>
                                    </>
                                    :
                                    <p className='p-0 m-0'>You can not place bid!</p>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Auction
