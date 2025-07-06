import React  , {useContext} from 'react';
import { userDataContext } from '../context/UserContext';

function Card({ image }) {
  const {serverUrl,
    userData,
    setUserData, 
    backendImage, setBackendImage,
    frontendImage, setFrontendImage,
    selectedImage, setSelectedImage} = useContext(userDataContext);

  return (
    <div className={`w-[60px] h-[120px] sm:w-[70px] sm:h-[140px] md:w-[90px] md:h-[180px] lg:w-[120px] lg:h-[200px] 
                    bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden 
                    hover:shadow-blue-950 hover:shadow-2xl hover:scale-105 
                    transition-all duration-300 ease-in-out hover:border-white 
                    flex items-center justify-center cursor-pointer
                    ${selectedImage == image ? 'border-white hover:shadow-2xl' : null}`} 
                    onClick={() => 
                      {
                        setSelectedImage(image)
                        setBackendImage(null)
                        setFrontendImage(null)
                      }}
                    >
      <img src={image} className='h-full w-full object-cover' />
    </div>
  );
}

export default Card;
