import React, { useState, useRef } from 'react';
import Card from '../Components/Card';

import image1 from '../assets/image1.png';
import image2 from '../assets/image2.jpg';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.jpeg';
import image7 from '../assets/image7.jpeg';
import { RiImageAddLine } from 'react-icons/ri';
import { userDataContext } from '../context/UserContext';
import { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';

function Customize (){
  const inputImage = useRef()
  const navigate = useNavigate();

  const {serverUrl,
    userData,
    setUserData, 
    backendImage, setBackendImage,
    frontendImage, setFrontendImage,
    selectedImage, setSelectedImage} = useContext(userDataContext);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file));
  } 

  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-start p-5'>
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'
          onClick={() => navigate("/")}/>
      <h1 className='text-white text-[24px] sm:text-[28px] md:text-[30px] text-center mb-6'>
        Select Your <span className='text-blue-200'>Assistant Image</span>
      </h1>

      <div className='w-full max-w-[1000px] flex flex-wrap justify-center items-center gap-4'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        
      <div className={`w-[60px] h-[120px] sm:w-[70px] sm:h-[140px] md:w-[90px] md:h-[180px] lg:w-[120px] lg:h-[200px] 
                      bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden 
                      hover:shadow-blue-950 hover:shadow-2xl hover:scale-105 
                      transition-all duration-300 ease-in-out hover:border-white 
                      flex items-center justify-center cursor-pointer ${selectedImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}onClick={() => {
                          inputImage.current.click()
                          setSelectedImage("input")
                        }}>

        {!frontendImage && <RiImageAddLine className='text-white w-[24px] h-[24px]'/>} 
         {frontendImage && <img src={frontendImage} className='h-full w-full object-cover'/>}
        </div>
        <input type = "file" accept='image/*'  ref = {inputImage} hidden onChange={handleImage}/>
      </div>
      {selectedImage && 
      <button onClick={() => navigate("/customize2")}
      className='mt-8 bg-blue-500 text-white py-2 px-5 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer'>
        Confirm Selection
      </button>
      }
      
    </div>
  );
};

export default Customize;
