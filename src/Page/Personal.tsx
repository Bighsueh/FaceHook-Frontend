import React, { useEffect, useState,useContext } from 'react';
import { useParams,useNavigate,Link } from 'react-router-dom';
import { Context } from '../Contexts/Context'
import UserService from "../API/User";
import ProfileHeader from '../Component/profileHeader';
import Intro from '../Component/Intro';
import Feed from '../Component/Feed';
import Photos from '../Component/Photo';
import CreatePost from '../Component/createPost';

interface UserProfile {
  job?: string;
  school?: string;
  address?: string;
  single?: string;
  birthday?: string;
  user_id?:any;
}

function Personal() {

  const {userId}:any = useParams();
  const { currentUser, setCurrentUser } = useContext(Context)!;
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    UserService.getUserProfile(userId)
        .then((data) => {
          console.log(userId)
          console.log('123',data)
            setProfile(data.data);
        })
        .catch((e) => {
            console.log(e);
        });
}, [userId]);

  return (

    <>

        <ProfileHeader userId={userId} />
        <div className="px-12 pt-4 gap-4 bg-fFill z-0 pb-56 md:px-28 lg:px-40  lg:grid lg:grid-cols-12 xl:px-52">
          <div className=" col-start-1 row-start-1 space-y-4 mb-4 lg:col-span-5">
            <Intro userId={userId} />
            <Photos/>
          </div>
          <div className="flex-row row-start-1  col-start-6 space-y-4 lg:col-span-7">
            {profile !== null && (profile.user_id.id === currentUser.id) && (
              <CreatePost/>
            )}
            <Feed userId={userId}/>
          </div>
        </div>

    </>

  )
}

export default Personal