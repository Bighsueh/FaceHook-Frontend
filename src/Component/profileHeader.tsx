import { Context } from '../Contexts/Context';
import React, { useState,useContext,useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import UserService from '../API/User';

interface UserProfile {
  job?: string;
  school?: string;
  address?: string;
  single?: string;
  birthday?: string;
  user_id?:any;
}

export default function ProfileHeader({userId}:any) {

  const location = useLocation();

  const { currentUser, setCurrentUser } = useContext(Context)!;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friend,setFriend] = useState(false);
  const [friendInvitation,setFriendInvitation] = useState(true);
  const [answerInvitation,setAnswerInvitation] = useState(true);
  const [friendCount,setFriendCount] = useState("");

  const currentTab = location.pathname.endsWith('/friend') ? 'friend' : 'personal';

  useEffect(() => {
    const fetchUserProfileInfo = async () => {
      try {
        const response = await UserService.getUserProfile(userId);
        const profile = response.data;
        console.log("個人檔案:", profile);
        setProfile(profile);
      } catch (error) {
        console.error('無法獲取使用者個人檔案', error);
      }
    };

    if (userId) {
      fetchUserProfileInfo();
    }
  }, [userId]);

  useEffect(()=>{
    UserService.getFriendInvitations(userId)
    .then((data)=>{
      data.data.forEach((friends:any) => {
        if (friends.user_id.id === currentUser.id) {
          setFriendInvitation(false)
        }
      });
    })
    .catch((e)=>{
      console.log(e)
    })
  },[userId,currentUser.id])

  useEffect(()=>{
    UserService.getFriendInvitations(currentUser.id)
    .then((data)=>{
      data.data.forEach((friends:any) => {
        if (friends.user_id.id === parseInt(userId)) {
          setAnswerInvitation(false)
        }
      });
    })
    .catch((e)=>{
      console.log(e)
    })
  },[userId,currentUser.id])

  const handleAddFriendInvite = () => {
    UserService.addFriendInvite(userId)
    .then((data) => {
      console.log(data.data.message)
      if (data.data.message === "成功發出好友邀請"){
        setFriendInvitation(false)
      } else if(data.data.message === "取消交友邀請"){
        setFriendInvitation(true)
      }
    })
    .catch((e) => {
        console.log(e);
    });
  };

  useEffect(()=>{
    UserService.getCurrentFriends(userId)
    .then((data) => {
      console.log("目前的好友有:",data.data.length)
      setFriendCount(data.data.length)
      console.log(data.data)
      data.data.forEach((friends:any) => {
        if (friends.freiend_user_id.id === currentUser.id) {
          setFriend(true);
          console.log("已為好友:", friends);
        }
      });
    })
    .catch((e) => {
        console.log(e);
    });
  },[userId, currentUser.id,friendInvitation,friend])


  const handleDeleteFriend = () => {
    UserService.removeFriend(userId)
    .then((data) => {
      console.log(data.data)
      console.log("成功刪除好友")
      setFriend(false)
    })
    .catch((e) => {
        console.log(e);
    });
  };

  const handleAddFriend = (userId:any) => {
    UserService.confirmFriend(userId)
    .then((data) => {
      console.log('成功成為好友')
      setFriend(true)
      setAnswerInvitation(true)
    })
    .catch((e) => {
        console.log(e);
    });
  };

  const handleDelFriendInvitation = (friendId:any) => {
    UserService.removeFriendInvite(friendId)
    .then((data) => {
      console.log('成功刪除好友邀請')
      setAnswerInvitation(true);
    })
    .catch((e) => {
        console.log(e);
    });
  };

  return (
    <>
    {profile !== null && (
      <div className="px-44 shadow">
        <div className="relative h-96 rounded-b flex justify-center">
          <img
            src="https://picsum.photos/id/1018/3000"
            className="object-cover w-full h-full rounded-b"
            alt="cover"
          />
          <div className="absolute -bottom-6">
            <img
              src="https://picsum.photos/id/1025/500"
              className="object-cover border-4 border-white w-40 h-40 rounded-full"
              alt="cover"
            />
          </div>
        </div>
        <div className="text-center mt-6 text-3xl font-bold text-fBlack">
          {profile.user_id.username}
        </div>
        <div className="border border-gray-300 mt-6 border-opacity-75" />
        <div className="flex justify-between px-8">
          <div className="flex items-center">
            <Link to={`/personal/${userId}`} className={`px-4 py-5 text-fBlue ${currentTab === 'personal' ? 'border-b-4 border-fBlue' : ''}`}>
              Posts
            </Link>       
            <Link to={`/personal/${userId}/friend`} className={`px-4 py-5 text-fGrey ${currentTab === 'friend' ? 'border-b-4 border-fBlue' : ''}`}>
              Friends <span className="text-sm ml-1">{friendCount}</span>
            </Link>

            <div className="px-4 py-5 text-fGrey">Photos</div>
            <div className="px-4 py-5 text-fGrey">Videos</div>
          </div>
          {profile.user_id.id !== currentUser.id && (
            <div className="flex items-center space-x-2">
              {!friend && (
                <>
                  {(friendInvitation) ? (
                    <>
                      {(answerInvitation)?(
                        <button className='btn bg-friendblue border-friendblue text-facebookblue'onClick={handleAddFriendInvite}>加朋友</button>
                      ):(
                        <div className="dropdown dropdown-bottom dropdown-end flex">
                          <button tabIndex={0} className='btn bg-friendblue border-friendblue text-facebookblue'>回覆交友邀請</button>
                          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                              <li><button onClick={()=>{handleAddFriend(userId)}}>確認邀請</button></li>
                              <li><button onClick={()=>{handleDelFriendInvitation(userId)}}>刪除邀請</button></li>
                          </ul>
                        </div>
                      )}
                    </>
                    ):(
                    <button className='btn' onClick={handleAddFriendInvite} >取消交友邀請</button>
                  )}
                </>
              )}
              {friend && (
              <div className="dropdown dropdown-bottom dropdown-end flex">
                <button tabIndex={0} className='btn'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16.151" height="16"><g transform="translate(-1148 -632)"><ellipse cx="3" cy="3.5" rx="3" ry="3.5" transform="translate(1152 632)" fill="#1d1f23"/><path d="M1153.333 640h3.334a5.333 5.333 0 015.333 5.333 2.667 2.667 0 01-2.667 2.667h-8.666a2.667 2.667 0 01-2.667-2.667 5.333 5.333 0 015.333-5.333z" fill="#1d1f23"/><path d="M1159 636.506l1.528 1.528 2.92-2.92" fill="none" stroke="#1d1f23" stroke-linecap="square"/></g></svg>
                  朋友
                </button>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                    <li><button onClick={handleDeleteFriend}>解除好友關係</button></li>
                </ul>
              </div>
              )}             
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}