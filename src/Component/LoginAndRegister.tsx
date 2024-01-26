import React, { useState,useEffect ,useContext} from 'react';
import UserService from '../API/User';
import AuthService from '../API/Auth';
import { Context } from '../Contexts/Context';
import { Link, useNavigate } from 'react-router-dom';


interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error';
}

function LoginAndRegister() {

  const navigate = useNavigate();
  
  const { currentUser,setCurrentUser } = useContext(Context)!;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);


  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (toastMessages.length > 0) {
      const timer = setTimeout(() => {
        setToastMessages((prevMessages) => prevMessages.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessages]);

  const showToastMessage = (message: string, type: 'success' | 'warning' | 'error') => {
    // 为每个Toast消息生成唯一的ID
    const id = new Date().getTime();
    setToastMessages((prevMessages) => [
      ...prevMessages,
      { id, message, type },
    ]);
  };
  const handleLogin = async () => {
    try {
      const response = await AuthService.login(email, password);
      if (response) {
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log(response.data)
        const currentUserData = await UserService.getCurrentUser(); 
        setCurrentUser(currentUserData.data);
        navigate("/")
        window.location.reload()
      } else {
        showToastMessage('帳號或密碼錯誤', 'error');
        console.log('登入失敗');
      }
    } catch (e) {
      console.error(e);
      showToastMessage('帳號或密碼錯誤', 'error');
    }
  };
  const handleRegister = async () => {
    try {
      AuthService.register(username,email, password)
      .then(()=>{
        showToastMessage('註冊成功', 'success');
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        modal.close();
      })
      .catch((e) => {
        console.log(e.response.data);
        if(e.response.data.message === "該信箱已被註冊"){
          showToastMessage("該信箱已被註冊", 'error');
        }else if(e.response.data.message === "請輸入使用者姓名"){
          showToastMessage("請輸入使用者姓名", 'error');
        }else if(e.response.data.message === "請輸入有效的電子郵件地址"){
          showToastMessage("請輸入有效的電子郵件地址", 'error');
        }else if(e.response.data.message === "你的密碼最少需要 6 個字元。請嘗試使用其他密碼。"){
          showToastMessage("你的密碼最少需要 6 個字元。請嘗試使用其他密碼。", 'error');
        }
      });
    } catch (e) {
      console.error(e);
      showToastMessage('註冊失敗', 'error');
    }
  };


  return(
    <>

      {toastMessages.map((toast) => (
        <div key={toast.id} className="toast toast-top toast-center">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )}
            <span key={toast.message}>{toast.message}</span>
          </div>
        </div>
      ))}

      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body items-center text-center">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input 
              type="text" 
              placeholder="Type here" 
              className="input input-bordered w-full max-w-xs"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input 
              type="password" 
              placeholder="Type here" 
              className="input input-bordered w-full max-w-xs" 
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="card-actions">
            <button className="btn text-white bg-blue-600 mt-5" onClick={handleLogin}>Log in</button>
          </div>
          <div className="divider">OR</div>
          <div className="card-actions">
            <button 
              className="btn bg-green-500 text-white" 
              onClick={() => {
                setEmail("")
                setPassword("")
                const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                modal.showModal();
              }}          
            >Create new account</button>
          </div>
        </div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box w-96 max-w-3xl p-10">
            <div className='grid justify-items-center'>
              <div className="font-semibold text-2xl flex mb-3">Sign Up</div>
            </div>
            <div className="form-control w-full max-w-lg items-center">
              <div className='w-11/12'>
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Type here" 
                  className="input input-bordered w-full max-w-lg"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </div>
            </div>
            <div className="form-control w-full max-w-lg items-center">
              <div className='w-11/12'>
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Type here" 
                  className="input input-bordered w-full max-w-lg"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
            <div className="form-control w-full max-w-lg items-center">
              <div className='w-11/12'>
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <input 
                  type="password" 
                  placeholder="Type here" 
                  className="input input-bordered w-full max-w-lg"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
            <div className='grid justify-items-center'>
              <button className=" items-center btn bg-green-500 text-white mt-7 mb-2" onClick={handleRegister}>Sign Up</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </>
  )

}

export default LoginAndRegister;