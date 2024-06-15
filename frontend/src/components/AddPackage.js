import React, { useEffect, useState } from 'react';
import { MdErrorOutline } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { addVacationPackage } from '../services/home.service';
import { useNavigate } from 'react-router-dom';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { IoMdArrowRoundBack } from 'react-icons/io';


function AddPackage() {

    const { handleSubmit, register, formState: { errors } } = useForm({ mode: "onChange" });

    const [previewImage, setPreviewImage] = useState('');
    const [imageData, setImageData] = useState("");

    const [today] = useState(new Date().toISOString().split('T')[0]);
    // const [destination] = useState(['Jaipur','Goa','Agra','Manali','Mumbai','Kashmir']);


    const router = useNavigate();

    var user = JSON.parse(localStorage.getItem('user') || '[]');
    useEffect(() => {
        if (user[0].role !== 'travel service provider') {
            router('/login');
        }

    },[])


    const handleFileChange = (e) => {
        const imageFile = e?.target?.files[0]
        if (imageFile?.type === "image/jpeg" || imageFile?.type === "image/png" || imageFile?.type === "image/jpg") {
            delete errors?.image
        } else if (imageFile === undefined) {
            errors.image = {
                message: "Please select image.",
                type: "required"
            }
        } else {
            errors.image = {
                message: "Only JPG, JPEG, or PNG images are allowed.",
                type: "validImage"
            }
        }


        setImageData(imageFile);

        if (imageFile?.type === "image/jpeg" || imageFile?.type === "image/png" || imageFile?.type === "image/jpg") {
            setPreviewImage(URL.createObjectURL(imageFile));
        }

    }

    const onSubmit = (value) => {
        let formData = new FormData();
        formData.append("name", value.name);
        formData.append("description", value.description.trim());
        formData.append("image", value.image[0]);
        formData.append("days", value.days);
        formData.append("night", value.night);
        formData.append("destination", value.destination);
        formData.append("base_price", value.base_price);
        formData.append("auction_start_date", value.auction_start_date);
        formData.append("auction_end_date", value.auction_end_date);
        addVacationPackage(formData).then((r) => {
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
                    router('/provider');
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
            <div className="col-md-12 px-5" style={{ height: '90vh', overflowY: 'auto' }}>
                {/* <div className="d-flex align-items-center justify-content-between mt-3 order-box mx-auto">
                    <Link to={'/admin-panel'} className='btn btn-outline-secondary'><IoMdArrowRoundBack className='me-1' size={20} />Back</Link>
                </div> */}
                <div className="row my-0 mx-0 mt-3 mb-3 pt-3 p-0 d-flex justify-content-center">
                    <ToastContainer />
                    <div className='col-md-6 p-5 form-con'>
                        <div className="row m-0 row-con">
                            <h3 className='h3 text-center w-100 mb-5'>Add new vacation package</h3>
                            <form id="login-form" className="" onSubmit={handleSubmit(onSubmit)}>

                                <div className="col-md-12 mb-3">
                                    <input
                                        type="text"
                                        className="form-control py-2 px-4"
                                        id="Name"
                                        placeholder="name"
                                        {...register("name", {
                                            required: "Please enter name.",
                                            pattern: {
                                                value: /^(?=.{1,100}$)[a-zA-Z0-9\s,'-]*[a-zA-Z0-9']$/,
                                                message: "Please enter valid package name"
                                            }

                                        })}
                                        style={{ background: errors.name ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    />
                                    {errors.name && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.name.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                    <textarea
                                        type="text"
                                        className="form-control py-2 px-4"
                                        id="description"
                                        role='3'
                                        placeholder="Write description"
                                        {...register("description", {
                                            required: "Please enter description.",
                                            // pattern: {
                                            //     // value: /^[a-zA-Z]{3,}(?: [a-zA-Z]+){0,1}$/i,
                                            //     value: /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/,
                                            //     message: "Please enter valid formate description."
                                            // }
                                        })}
                                        style={{ background: errors.description ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    ></textarea>
                                    {errors.description && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.description.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                    <input
                                        type="text"
                                        className="form-control py-2 px-4"
                                        id="days"
                                        placeholder="Trip total days"
                                        {...register("days", {
                                            required: "Please enter total days.",
                                            pattern: {
                                                value: /^[0-9]+$/i,
                                                message: "Please enter valid total days."
                                            }
                                        })}
                                        style={{ background: errors.days ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    />
                                    {errors.days && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.days.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                    <input
                                        type="text"
                                        className="form-control py-2 px-4"
                                        id="night"
                                        placeholder="Trip total night"
                                        {...register("night", {
                                            required: "Please enter total night.",
                                            pattern: {
                                                value: /^[0-9]+$/i,
                                                message: "Please enter valid total night."
                                            }
                                        })}
                                        style={{ background: errors.night ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    />
                                    {errors.night && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.night.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                <label className='mb-1'>Select Destination</label><br></br>
                                    <input type='checkbox' className='me-1' 
                                    value={'Goa'} 
                                    {...register("destination", {
                                            required: "Please select destination."
                                        })}/>
                                    <label className='me-1'>Goa</label>
                                    <input type='checkbox' className='me-1'
                                    value={'Jaipur'} 
                                    {...register("destination", {
                                            required: "Please select destination."
                                        })}/>
                                    <label className='me-1'>Jaipur</label>
                                    <input type='checkbox' className='me-1'
                                    value={'Agra'} 
                                    {...register("destination", {
                                            required: "Please select destination."
                                        })}/>
                                    <label className='me-1'>Agra</label>
                                    <input type='checkbox' className='me-1'
                                    value={'Manali'} 
                                    {...register("destination", {
                                            required: "Please select destination."
                                        })}/>
                                    <label className='me-1'>Manali</label>
                                    {errors.destination && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.destination.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                    <input
                                        type="text"
                                        className="form-control py-2 px-4"
                                        id="base_price"
                                        placeholder="Package Base Price"
                                        {...register("base_price", {
                                            required: "Please enter base price.",
                                            pattern: {
                                                value: /^\d+(.\d{1,2})?$/i,
                                                message: "Please enter valid base price."
                                            }
                                        })}
                                        style={{ background: errors.base_price ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    />
                                    {errors.base_price && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.base_price.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                <label className='mb-1'>Auction Start Date</label>
                                    <input
                                        type='date'
                                        className="form-control py-2 px-4"
                                        id="start_date"
                                        min={today}
                                        // placeholder="Write description"
                                        {...register("auction_start_date", {
                                            required: "Please select  auction start date.",
                                        })}
                                        style={{ background: errors.auction_start_date ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    ></input>
                                    {errors.auction_start_date && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.auction_start_date.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                <label className='mb-1'>Auction End Date</label>
                                    <input
                                        type='date'
                                        className="form-control py-2 px-4"
                                        id="end_date"
                                        min={today}
                                        // placeholder="Write description"
                                        {...register("auction_end_date", {
                                            required: "Please select  auction end date.",
                                        })}
                                        style={{ background: errors.auction_end_date ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                    ></input>
                                    {errors.auction_end_date && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.auction_end_date.message}</p>}
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className='mb-1'>Package Image</label>
                                    <div className="position-relative">
                                        <input
                                            className="form-control py-2 px-3"
                                            aria-describedby="emailHelp"
                                            placeholder="Profile Image"
                                            type="file"
                                            accept='.jpg,.png,.jpeg'
                                            multiple
                                            {...register("image", {
                                                required: "Please select image.",
                                                validate: {
                                                    validImage: (value) => {
                                                        const fileTypes = [
                                                            "image/jpeg",
                                                            "image/png",
                                                            "image/jpg",
                                                        ];
                                                        const validFileType = fileTypes.includes(value[0]?.type);
                                                        return (
                                                            validFileType ||
                                                            "Only JPG, JPEG, or PNG images are allowed."
                                                        );
                                                    },
                                                },
                                            })}
                                            onChange={(e) => handleFileChange(e)}
                                            style={{ background: errors.image ? 'rgba(228, 26, 26, 0.196)' : 'white' }}
                                        />
                                        <span className="position-absolute bi btn">
                                            <img src={previewImage} alt="" className='profile-preview' />
                                        </span>
                                    </div>
                                    {errors.image && <p className="error"><MdErrorOutline size={16} className='icon' />{errors.image.message}</p>}
                                </div>
                                <div className="col-md-12">
                                    <button type="submit" className="w-100 py-2 btn btn-dark" id="login-btn">Add New Package</button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AddPackage
