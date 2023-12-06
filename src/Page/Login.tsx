import React from 'react';
import LoginAndRegister from '../Component/LoginAndRegister';


function Login() {

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className='flex flex-wrap justify-center content-center items-center min-h-screen'>
        <div className='lg:me-12 lg:pe-12 sm:ml-10'>
          <div className='font-bold	text-6xl text-blue-600'>Facehook</div>
          <div className='text-lg font-bold mt-5 ml-2'>Connect with friends and the</div>
          <div className='text-lg font-bold'>world around you on Facehook</div>
        </div>
        <div className='justify-center ml-12 mt-6 lg:mb-6'>
          <LoginAndRegister />
        </div>

      </div>
    </div>
  )
}

export default Login;