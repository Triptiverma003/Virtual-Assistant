import React from 'react'
import { userDataContext } from '../context/UserContext';
import { useContext, useState} from 'react';
import axios from 'axios';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function Customize2() {
    // const navigate = useNavigate();

    const {userData , backendImage , selectedImage , serverUrl , setUserData} = useContext(userDataContext)
    const [assistantName , setAssistantName] = useState(userData?.assistantName || "");
    const[loading , setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
    let formData = new FormData();
    formData.append("assistantName", assistantName);

    if (backendImage instanceof File) {
      // Only append the file if it's a real uploaded file
      console.log("📤 Sending file to backend:", backendImage);
      formData.append("assistantImage", backendImage);
    } else if (selectedImage) {
      // Append the selected image URL for predefined image
      setLoading(false);
      console.log("📤 Sending image URL:", selectedImage);
      formData.append("imageUrl", selectedImage);
    }

    const result = await axios.post(`${serverUrl}/api/auth/user/update`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    setLoading(false);
    console.log(result.data);
    setUserData(result.data);
    navigate("/");

  } catch (error) {
    console.error("Error updating assistant:", error);
  }
};



  return (
 <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col items-center justify-center p-5'>
    <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer'
    onClick={() => navigate("/customize")}/>
  <h1 className='text-white text-[30px] text-center mb-6'>
    Confirm Your <span className='text-blue-200'>Assistant Name</span>
  </h1>

  <input
    type='text'
    placeholder='eg: shifra'
    className='w-full max-w-[600px] h-[60px] outline-none border-2 bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
    required
    onChange={(e) => setAssistantName(e.target.value)}
    value={assistantName}
  />
  {assistantName && 
       <button className='mt-8 bg-blue-500 text-white py-2 px-5 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer'
       disabled={loading}
       onClick={
        () => {
          handleUpdateAssistant();
        }
       }>
    {loading ? "Creating Assistant..." : "Create Assistant"}
  </button>
  }
 
</div>

  )
}

export default Customize2