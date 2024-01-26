import React, { useEffect, useState,useContext } from 'react';
import { useParams,Link } from 'react-router-dom';
import { Context } from '../Contexts/Context'
import UserService from "../API/User";
import ProfileHeader from '../Component/profileHeader';


interface UserProfile {
  job?: string;
  school?: string;
  address?: string;
  single?: string;
  birthday?: string;
  user_id?:any;
}


function Friend() {

  const {userId}:any = useParams();
  const { currentUser,ws } = useContext(Context)!;
  const [friend, setFriend] = useState<any[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [commonFriendsMap, setCommonFriendsMap] = useState<Record<number, any>>({});
  const [commonFriends, setCommonFriends] = useState<any[]>([]);

  useEffect(()=>{
   console.log(ws)
   if(ws){
    ws.on("onFriendUpdate",() =>{
      window.location.reload()
    })
   }
  },[ws])

  useEffect(() => {
    UserService.getUserProfile(userId)
        .then((data) => {
            setProfile(data.data);
        })
        .catch((e) => {
            console.log(e);
        });
  }, [userId]);
  
  useEffect(()=>{
    UserService.getCurrentFriends(userId)
        .then((data)=>{
            setFriend(data.data)
        })
        .catch((e)=>{
            console.log(e);
        })
  },[userId])

  useEffect(() => {
    friend.forEach((friendData) => {
      UserService.getCommonFriends(friendData.freiend_user_id.id)
        .then((commonFriendsData) => {
          console.log(commonFriendsData.data)
          setCommonFriendsMap((prevMap) => ({
            ...prevMap,
            [friendData.freiend_user_id.id]: commonFriendsData.data,
          }));
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }, [friend]);

  useEffect(() => {
    UserService.getCommonFriends(userId)
      .then((data) => {
        setCommonFriends(data.data.commonFriends)
      })
      .catch((e) => {
        console.log(e);
      });
  }, [userId]);


  return (

    <>
        <ProfileHeader userId={userId} />
        <div className='mt-6 ml-1 px-12 font-bold text-xl md:px-28 lg:px-40 xl:px-52'>所有朋友</div>
        <div className="mt-1 px-12 pt-4 gap-4 bg-fFill z-0 pb-16 md:px-28 lg:px-40 lg:grid lg:grid-cols-12 xl:px-52">

                { friend !== null && friend.map( (data) => {
                    const counts = commonFriendsMap[data.freiend_user_id.id]?.count || 0;
                    console.log("在這裡")
                    console.log(data)
                    return(
                        <div className='col-span-6 mb-2'>
                            <div className=" w-full shadow-fb rounded bg-white border border-gray-300 p-3">
                                <div className="flex space-x-2">
                                <img
                                    src="https://picsum.photos/id/1025/500"
                                    alt="img"
                                    className="h-10 w-10 rounded-full mt-4 ml-4"
                                />
                                <Link 
                                    to={`/personal/${data.freiend_user_id.id}`} 
                                    className="px-3 py-3 w-full"
                                >                                   
                                    {data.freiend_user_id.id === currentUser.id && (data.profile.school === "") && (
                                    <div className='h-2'></div>
                                    )}
                                    <b>{data.freiend_user_id.username}</b>
                                    {data.freiend_user_id.id !== currentUser.id && (
                                    <div className='text-sm'>{counts} 位共同朋友</div>
                                    )}
                                    {data.freiend_user_id.id === currentUser.id && (data.profile.school !== "") && (
                                    <div className='text-sm'>{data.profile.school}</div>
                                    )}
                                    {data.freiend_user_id.id === currentUser.id && (data.profile.school === "") && (
                                    <div className='h-3'></div>
                                    )}
                                </Link>
                                </div>
        
                            </div>
                        </div>
                    )
                })}

        </div>
        {Number(userId) !== currentUser.id && (
          <>
            <div className='mt-6 ml-1 px-12 font-bold text-xl md:px-28 lg:px-40 xl:px-52'>共同朋友</div>
            <div className="mt-1 px-12 pt-4 gap-4 bg-fFill z-0 pb-32 md:px-28 lg:px-40 lg:grid lg:grid-cols-12 xl:px-52">

                { commonFriends !== null && commonFriends.map( (data) => {

                    return(
                        <div className='col-span-6 mb-1'>
                            <div className=" w-full shadow-fb rounded bg-white border border-gray-300 p-3">
                                <div className="flex space-x-2">
                                <img
                                    src="https://picsum.photos/id/1025/500"
                                    alt="img"
                                    className="h-10 w-10 rounded-full mt-2 mb-2 ml-4"
                                />
                                <Link 
                                    to={`/personal/${data.freiend_user_id.id}`} 
                                    className="px-3 py-3 w-full"
                                >
                                    <b className=''>{data.freiend_user_id.username}</b>
                                </Link>
                                </div>

                            </div>
                        </div>
                    )
                })}

            {/* </div> */}

            </div>
          </>
        )} 
    </>

  )
}

export default Friend