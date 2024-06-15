import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function ViewDetails() {

    const location = useLocation()
    const v = location.state

    var user = JSON.parse(localStorage.getItem('user') || '[]');

    const navigate = useNavigate()
    
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [expired, setExpired] = useState(false);

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

    return (
        <div>
            <div className="col-md-12 px-2" style={{ height: 'auto', overflowY: 'auto' }}>
                <div className="row my-0 mx-0 p-0 d-flex justify-content-center">
                    <div className='col-md-8 d-flex flex-row  align-items-center bg-white my-4 p-1'>
                        <div className="row m-0 w-100">
                            <div className="col-md-6 p-3 text-center">
                                <img src={v?.image} alt='book' className='product-img' style={{ width: "100%"  }} />
                            </div>
                            <div className="col-md-6 p-3">
                                <h2 className='h2 title mb-2'>{v?.name}</h2>
                                <p className='mb-0 text-secondary'>{v?.description}</p>
                                <p className='mb-0 text-secondary'>{v?.days} Days {v?.night} Night</p>
                                <p className='mb-0 text-secondary'><strong>{v.destination}</strong></p>
                                <p className='text-primary w-100 price mt-2 mb-0 '>Base Price : {v?.base_price}</p>
                                {expired ? (
                                    <h5 className="text-danger mt-2">Time Over!</h5>
                                ) : (
                                    <h5 className="text-danger mt-2">
                                        {days} days {hours} hours {minutes} minutes {seconds}{" "}
                                        seconds left
                                    </h5>
                                )}

                                {days === 0 && hours === 0 && minutes === 0 && seconds === 0 ?
                                <>
                                    <label className='text-secondary w-100 price mt-1 mb-0 bg-light py-2'>Max Bid : {v?.bid[0].winner_price}</label>
                                    <label className='text-secondary w-100 price mt-1 mb-0 bg-light py-2'>Winner : {v?.bid[0].winner_name}</label>
                                </>
                                :
                                <>
                                    <label className='text-secondary w-100 price mt-1 mb-0 bg-light py-2'>Max Bid : ₹{v?.bid[0].winner_price}</label>
                                    <label className='text-secondary w-100 price mt-1 mb-0 bg-light py-2'>Winner : </label>
                                    <button className='btn btn-primary mt-1' onClick={() => navigate('/auction', { state: v })}>{user[0]?.role === 'travelers' ? 'Join Auction' : 'View Auction'}</button>
                                    
                                </>
                                
                                }
                                {/* <label className='text-secondary w-100 price mt-1 mb-0 '><b>Auction Date :</b> {v?.auction_start_date} to {v?.auction_end_date}</label> */}
                                
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        </div>
    )
}

export default ViewDetails
