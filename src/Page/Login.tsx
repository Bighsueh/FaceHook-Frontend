import React from 'react';
import LoginAndRegister from '../Component/LoginAndRegister';


function Login() {

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className='flex justify-center items-center min-h-screen'>
        <div className='me-12 pe-12'>
          <div className='font-bold	text-6xl text-blue-600'>Facehook</div>
          <div className='text-lg font-bold mt-5'>Connect with friends and the</div>
          <div className='text-lg font-bold'>world around you on Facehook</div>
        </div>
        <div className='justify-center ml-12'>
          <LoginAndRegister />
        </div>

      </div>
    </div>
  )
}

export default Login;