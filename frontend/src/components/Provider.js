import React, { useContext, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-js-loader";
import { useNavigate, Link } from 'react-router-dom';
import { listingPackage } from '../services/home.service';

function Provider() {

    var user = JSON.parse(localStorage.getItem('user') || '[]');
    const navigate = useNavigate();
    const [packageData, setPackageData] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        if (user[0].role !== 'travel service provider') {
            navigate('/login');
        }

        listingPackage(true).then((r) => {
            setLoader(false)
            setPackageData(r.data)
        })
    }, [])

    return (
        <div>
            <div className='w-100 mt-2'>
                <Link to={'/add-package'} className='btn btn-primary py-2 px-4 float-end me-3'>Add New Package</Link>
            </div>

            <div className={`container py-2 px-3 `}>
                <div className="flex-container mt-5">
                    {loader ?
                        <div className='w-100 d-flex align-items-center justify-content-center' style={{ height: '300px' }}>
                            <Loader type="box-rectangular" bgColor={"#999999"} size={80} />
                        </div>
                        :
                        packageData?.length > 0 ? (
                            packageData?.map((v, i) => (
                                <div className="card m-2" style={{width: '18rem'}}>
                                    <img className='card-img-top' src={v.image} alt="Card cap" style={{height:'170px'}}/>
                                        <div className="card-body">
                                            <h5 className="card-title">{v.name}</h5>
                                            <p className="card-text">{v.description}</p>
                                        </div>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item "><strong>₹{v.base_price}</strong></li>
                                            <li className="list-group-item">{v.days} Days and {v.night} Night</li>
                                            <li className="list-group-item">{v.destination}</li>
                                        </ul>
                                        <div className="card-body">
                                            {/* <a href="#" className="card-link">View Details</a> */}
                                            <button className='btn btn-primary' onClick={()=>navigate('/view-details',{state:v})}>View Details</button>
                                            {/* <a href="#" className="card-link">Join Auction</a> */}
                                        </div>
                                </div>
                            ))
                        )
                            :
                            (
                                <div className='w-100 d-flex align-items-center justify-content-center'>
                                    <h3 className='h3 text-secondary'>package not found!</h3>
                                </div>
                            )

                    }

                </div>
            </div >

        </div>
    )
}

export default Provider
