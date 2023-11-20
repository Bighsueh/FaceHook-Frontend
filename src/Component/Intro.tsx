import React, { useState,useContext,useEffect } from 'react';
import UserService from '../API/User';
import { Context } from '../Contexts/Context'

interface UserProfile {
  job?: string;
  school?: string;
  address?: string;
  single?: string;
  birthday?: string;
  user_id?:any;
}

export default function Intro({userId}:any) {

  const { currentUser, setCurrentUser } = useContext(Context)!;

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [city,setCity] = useState("");
  const [isCityButtonClicked, setIsCityButtonClicked] = useState(false);
  const [isCityValueVisible, setIsCityValueVisible] = useState(false);

  const [school, setSchool] = useState("")
  const [isSchoolButtonClicked, setIsSchoolButtonClicked] = useState(false);
  const [isSchoolValueVisible, setIsSchoolValueVisible] = useState(false);

  const [work, setWork] = useState("")
  const [isWorkButtonClicked, setIsWorkButtonClicked] = useState(false);
  const [isWorkValueVisible, setIsWorkValueVisible] = useState(false);

  const [relation, setRelation] = useState("")
  const [isRelationButtonClicked, setIsRelationButtonClicked] = useState(false);
  const [isRelationValueVisible, setIsRelationValueVisible] = useState(false);

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [isBirthdayButtonClicked, setIsBirthdayButtonClicked] = useState(false);
  const [isBirthdayValueVisible, setIsBirthdayValueVisible] = useState(false);


  useEffect(() => {
    const fetchUserProfileInfo = async () => {
      try {
        const response = await UserService.getUserProfile(userId);
        const profile = response.data;
        // console.log("個人檔案:", profile);
        setProfile(profile);
      } catch (error) {
        console.error('無法獲取使用者個人檔案', error);
      }
    };

    if (userId) {
      fetchUserProfileInfo();
    }
  }, [userId,city,school,work,relation,year,month,day,isBirthdayButtonClicked,isCityValueVisible,isSchoolButtonClicked,isCityButtonClicked,isWorkButtonClicked,isRelationButtonClicked,isBirthdayValueVisible,isRelationValueVisible,isWorkValueVisible,isSchoolValueVisible,currentUser.id]);


  const handleBirthdaySave = () => {
    if(year||month||day){
      const updatedBirthday = `${year}年${month}月${day}日`; 
      const profileData = { birthday: updatedBirthday };

      UserService.updateProfile(profileData)
        .then((response) => {
          console.log('生日已成功更新:', response.data);
          setIsBirthdayButtonClicked(false);
          setIsBirthdayValueVisible(true);
        })
        .catch((error) => {
          console.error('更新生日失敗:', error);
        });
    }
  };
  const handleCitySave = () => {
    // setIsCityButtonClicked(false);
    // setIsCityValueVisible(true);
    if(city){
      const updatedCity = city; 
      const profileData = { address: updatedCity };

      UserService.updateProfile(profileData)
        .then((response) => {
          console.log('城市已成功更新:', response.data);
          setIsCityButtonClicked(false);
          setIsCityValueVisible(true);
        })
        .catch((error) => {
          console.error('更新城市失敗:', error);
        });
    }
  };
  const handleSchoolSave = () => {
    if(school){
      const updatedSchool = school; 
      const profileData = { school: updatedSchool };

      UserService.updateProfile(profileData)
        .then((response) => {
          console.log('學校已成功更新:', response.data);
          setIsSchoolButtonClicked(false);
          setIsSchoolValueVisible(true);
        })
        .catch((error) => {
          console.error('更新學校失敗:', error);
        });
    }
  };
  const handleWorkSave = () => {
    if(work){
      const updatedWork = work; 
      const profileData = { job: updatedWork };

      UserService.updateProfile(profileData)
        .then((response) => {
          console.log('工作已成功更新:', response.data);
          setIsWorkButtonClicked(false);
          setIsWorkValueVisible(true);
        })
        .catch((error) => {
          console.error('更新工作失敗:', error);
        });
    }
  };
  const handleWRelationSave = () => {
    if(relation){
      const updatedRelation = relation; 
      const profileData = { single: updatedRelation };

      UserService.updateProfile(profileData)
        .then((response) => {
          console.log('感情狀態已成功更新:', response.data);
          setIsRelationButtonClicked(false);
          setIsRelationValueVisible(true);
        })
        .catch((error) => {
          console.error('更新感情狀態失敗:', error);
        });
    }
  };
  

  return (
    <>
    {profile !== null && (((profile.job || profile.school || profile.address || profile.single || profile.birthday ) && profile.user_id.id !== currentUser.id) || profile.user_id.id === currentUser.id) && (
      <div className="shadow-fb rounded w-full bg-white border border-gray-300 p-4">

        <div className="text-xl font-bold text-fBlack">Intro</div>
        
        {profile.job && (
        <div className="mt-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20" height="20"><image width="20" height="20" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAABZLkSWAAAC4ElEQVRYCe2Yv2sUQRiGc0a010bU2GmjVgkEuwiK2og2oo2l2FhZpBAFRQQxFiJYCDaCFjYpgqhEUIiFgkIgf4G/I4i1XtTzefZulvFcyOyu4bbIC8/N5NtvvnkzO7t3u62pm3eGSmiY3LNwDHbDOkhRm6QFeADX4RckaW1SVjdJc7Owt8SYkOo/MtrjIO1+SDK5hsRUuXJVzPXXt4a1klTGoKc16Byd9dBKxFzHBMW1QqywLWPQPRc0Rcd9lSpzHRMU1wqxwraMwfiCKGMuTByPiWuF44VtbHAPGdPwAToFEMpVdDwllhegU5Tv3HrQS6Zg0E07B0dgS3ZkMB/OrQe9ZBeSBsfhKngbaYr0oqdxDU5Ck8xhJ5OeJjU41v27kZ9jGhxppLWuqRENNlqrBuuentUVXF3BuitQd7x7cKlukRUcv6TBxf8wwRw1DsNm8AvfvrG6WtTgfM0qVxg/ATPwGT71+hO0HqujeQ36+6uqXKXz8LuggDGP1VnJaQ3eh7dQRdcYFMwdov++h33lsfinfhZM/NDTPQ3+gNMQJqKbrNdR5m36W3vYD4pzQmy5Vi96amtQPYYzUNakey5Ic0Fx3z1ZRnrQi56GgkH7t8Crz9M0KDm3HvSSqf/NwkOiO+AkHAUfDzfBMKyEfLvgbW4BvFjvwnfI1W/QAya4h+J9ZLyOfMCvpPgUb6fCzkpVuoN8ZAyK+yGW2upBL5niFXxJZAO43C71K3gHH+EnLKdTJIRVt58i5/ebZxv4dOnWclt9g40wFBvUnDLB+1uKnpLkmyr1CIqeb2aJ7zOhhIKXv67idokCIdWJL4Y/CtpLxMqas0zuJd6DntoqusAg71mupKdF7D8Bv+qqKPcSn+IXVBqtUo0xB3pUHP7PML1kilfwMpEvvfggGz3oJVNs8CuREzBIk859HPSSKTZo4BnsghvwBvLNSn+l5BzO5ZzO/RxytTodX9M1V/0r2DinfwB35ZR4zohSsgAAAABJRU5ErkJggg=="/></svg>
          <span className="ml-2"><b>{profile.job}</b>{' '}員工</span>
        </div>
        )}
        {profile.school && (
        <div className="mt-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20" height="20"><image width="20" height="20" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAABZLkSWAAAEjElEQVRYCc2Ze4gWVRiHXd2ggoQ0KYPALlbYxdoMLLW2wi6i/pUWXYhMAoOKtgtJYGokVGZpbgS1iWiIWhCkkUU3gySyC9piW2xBmUT1T3YzsrbnWeds55udb7/ZmQn2B4/n9p73/PbMmTMf2NTT0zNsKGv4UDant+bHVz9fhcdjSLIQZsMo2AiL4CcopbI72MTq86AL2uAU0OAC+BwcM6awyhg8g1W3QwdoKq3RdDhmjLGFVMTgEay0DD6BqTlWNcZY5zh3UBqswRlk7wTP22GDWMlY5zjXHLmV1+DxZNwMW+HE3Nn7BzrXHOYyZ0M1MjiCDHeAB/7qhtnyB5jLnOZ2jboayOAkZn0AK+GouhmKD5jT3K7hWpnKMjiSyFXgxPMyZ1Xb6Rqu5ZquXaO0wTmM7oHbIT1WM7Hihmu5pmvroU/BxDh6XoVNkOvwEvd/yLX1oJdxMKwZvP23w1gYKroKIztgmju4Aqowt5s8PqKqdByJVmhwSsmMXzN/NpwNftLWQFWaosHugtkOMG8JTIBXkhz+uAz1pKtU0a3B9gIptjDH3VoMGg3yk3ZnaFRQtmtwLdwKv+VIGB7nLGK/SsVPpu19dnGqv0hTL3paq0H1LJwOvuJZynqcIW4MFX9WvQ/nhs4Spd9pveip5jLeS/sauAzcqaBfqVwEiyF+nP5xt0EXzIMmKCNvANeeC3rpVdjB0LZ8CzqjjjbqH0Ztqz7OndAOR0MZuQH3wkRw7Ro117QONVooLoz6X4/qmlkON0PZHTPtBrgH9tnIUryDJxCgmY9gVBTsWXBMrYYqHudn5GmF66CuOcb6zuCR1N+E6XamZJ9jxrwM+6GonNsGvkzvJkmOpXwaliXtmiLs4AP0jk9G/qTsSLCuHDPGN+w0WA+DlXOc+wQcBI+Xd+YXsADuh34KBq+IRm6gPj/BelCI+Z6OG8E3e1cYHKA0xljnOFfZ/hiehJGgMs90MOhfFvRaqFBui+pxjN3vQQu4Cz9DWvY5Zoyxaiy4kz7es6ChgsGuKPLKqB52za44JoT8TWUVnAruRnfCyqTPMWN8nG1gjusht5yotoE/vZV/YTAZP2JjgjxHU+E+eBt+gLsSKGp0CS3f/gk1vf0bB/t38dyXP9Vhv2/opxBeFPtifUnjHPgdvKR3QNBGKr5A7l6sk2k8DH6d8mgXQRPTgWEHXdjPjG6np4LeoH0LGKOWHCr6/tXAHHgHvN/UmdAK4QhRHVA9jD6UFREMOvYtXA6+ad5NyjMYf0m8q4xJSyOXJqTHGrX97nvFvJgVGBt0vBWCuf3UY3M30V4IVcjz9hI8B35//4FMBYPXMqqB1ihqTVS3ugnGgH/taCgij8kz4Fv+TZ4Ewwlyx14A39zDQX0Hj/bW/vvnD6r+UDgJlsIByCuvGs/3eLgbcpkjrvcQ/0L5o41EOyknw77QkSp99A9CC/jDopF2EzAJ5kO9nHVzuINuu1fITPB2Px/2QiPtIeAC8O3LusPctcfAfF5hhRTOoG/u1gIZ/mLOIlgHnk13agT4nX0EOqGUmob6f0P8C37b37vYuoptAAAAAElFTkSuQmCC"/></svg>
          <span className="ml-2">就讀 <b>{profile.school}</b></span>
        </div>
        )}
        {profile.address && (
        <div className="mt-4 flex items-center">
          {/* <HomeAlt /> */}
          <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#8C939D" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
          </svg>
          <span className="ml-2">
            現居 <b>{profile.address}</b>{' '}
          </span>
        </div>
        )}
        {profile.single && (
        <div className="mt-4 flex items-center">
          {/* <Pin /> */}
          <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#8C939D" viewBox="0 0 20 18">
            <path d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z"/>
          </svg>
          <span className="ml-2">{profile.single}</span>
        </div>
        )}
        {profile.birthday && (
        <div className="mt-4 flex items-center">
          {/* <Pin /> */}
          <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#8C939D" viewBox="0 0 20 20">
            <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z"/>
          </svg>
          <span className="ml-2">{profile.birthday}</span>
        </div>
        )}

        {profile.user_id.id === currentUser.id && (
          <button 
            className='btn border flex items-center w-[100%] p-2 mt-6 mb-2'
            onClick={() => {
              const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
              modal.showModal();
            }}
          >編輯個人資料</button>
        )}
        
        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button 
                      id="close"
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
                      onClick={()=>{
                        setIsCityButtonClicked(false)
                        setIsSchoolButtonClicked(false)
                        setIsWorkButtonClicked(false)
                        setIsBirthdayButtonClicked(false)
                        setIsRelationButtonClicked(false)
                      }}
                    >✕</button>
                </form>
                <div className='grid justify-items-center'>
                  <div className="font-semibold text-lg flex">編輯個人資料</div>
                </div>

                <div className="divider m-0 mb-3"></div>

                <div className="px-2 py-1">
                    <h5 className='font-bold'>生日</h5>
                    {!profile.birthday && !isBirthdayValueVisible && (
                    <div className='flex'>
                      <button className="inline-flex items-center justify-center w-8 h-8 mt-2 text-indigo-100 transition-colors duration-150 bg-blue-200 rounded-full focus:shadow-outline hover:bg-indigo-800" onClick={() => {setIsBirthdayButtonClicked(!isBirthdayButtonClicked)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g transform="translate(-1252 -20)" fill="white"><rect width="16" height="2" rx="1" transform="translate(1252 27)"/><rect width="16" height="2" rx="1" transform="rotate(90 620.5 640.5)"/></g></svg>                    
                      </button>
                      <p className='pt-3.5 pl-3'>編輯生日</p>
                    </div>
                    )}
                    {!isBirthdayButtonClicked && (profile.birthday || isBirthdayValueVisible) && (
                    <div id='birthdayvalue' className='mt-2 flex justify-between'>
                      <div>{year && month && day ? `${year}年${month}月${day}日` : profile.birthday}</div>
                      <button className='btn btn-sm' onClick={()=>{setIsBirthdayButtonClicked(true)}}>編輯</button>
                    </div>
                    )}
                    {isBirthdayButtonClicked && (
                    <div id='8' className='flex'>
                      <input 
                        type="text" 
                        placeholder="yyyy" 
                        className="input input-md input-bordered w-full mt-3 mb-2 me-3"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="mm" 
                        className="input input-md input-bordered w-full mt-3 mb-2 me-3"
                        value={month}
                        onChange={(event) => setMonth(event.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="dd" 
                        className="input input-md input-bordered w-full mt-3 mb-2 me-3"
                        value={day}
                        onChange={(event) => setDay(event.target.value)}
                      />
                      <button 
                        type="submit" 
                        className="ms-auto items-center px-4 py-3.5 mt-3.5 my-3 text-xs font-medium text-center text-white bg-mistblue rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                        onClick={handleBirthdaySave}
                      >
                          Save
                      </button>
                    </div>
                    )}
                </div>

                <div className="px-2 py-1 mt-1">
                  <h5 className='font-bold'>工作經歷</h5>
                  {!profile.job && !isWorkValueVisible && (
                  <div className='flex'>
                    <button id='5' className="inline-flex items-center justify-center w-8 h-8 mt-2 text-indigo-100 transition-colors duration-150 bg-blue-200 rounded-full focus:shadow-outline hover:bg-indigo-800" onClick={() => {setIsWorkButtonClicked(!isWorkButtonClicked)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g transform="translate(-1252 -20)" fill="white"><rect width="16" height="2" rx="1" transform="translate(1252 27)"/><rect width="16" height="2" rx="1" transform="rotate(90 620.5 640.5)"/></g></svg>                    
                    </button>
                    <p className='pt-3.5 pl-3'>新增任職公司</p>
                  </div>
                  )}
                  {!isWorkButtonClicked && (profile.job || isWorkValueVisible) && (
                  <div id='cityvalue' className='mt-2 flex justify-between'>
                    <div><b>{work !== "" ? work : profile.job}</b>{' '}員工</div>
                    <button className='btn btn-sm' onClick={()=>{setIsWorkButtonClicked(true)}}>編輯</button>
                  </div>
                  )}
                  {isWorkButtonClicked && (
                  <div id='6' className="flex">
                    <input 
                      type="text" 
                      placeholder="任職公司" 
                      className="input input-md input-bordered w-full mt-3 mb-2 me-3"
                      value={work}
                      onChange={(event) => setWork(event.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="ms-auto items-center px-4 py-3.5 mt-3.5 my-3 text-xs font-medium text-center text-white bg-mistblue rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                      onClick={handleWorkSave}
                    >
                        Save
                    </button>
                  </div>
                  )}
                </div>

                <div className="px-2 py-1 mt-1">
                  <h5 className='font-bold'>學歷</h5>
                  
                  {!profile.school && !isSchoolValueVisible && (
                  <div className='flex'>
                    <button id='3' className="inline-flex items-center justify-center w-8 h-8 mt-2 text-indigo-100 transition-colors duration-150 bg-blue-200 rounded-full focus:shadow-outline hover:bg-indigo-800" onClick={() => {setIsSchoolButtonClicked(!isSchoolButtonClicked)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g transform="translate(-1252 -20)" fill="white"><rect width="16" height="2" rx="1" transform="translate(1252 27)"/><rect width="16" height="2" rx="1" transform="rotate(90 620.5 640.5)"/></g></svg>                    
                    </button>
                    <p className='pt-3.5 pl-3'>新增學校</p>
                  </div>
                  )}
                  {!isSchoolButtonClicked && (profile.school || (isSchoolValueVisible)) && (
                  <div id='cityvalue' className='mt-2 flex justify-between'>
                    <div>就讀於 <b>{school !== "" ? school : profile.school}</b>{' '}</div>
                    <button className='btn btn-sm' onClick={()=>{setIsSchoolButtonClicked(true)}}>編輯</button>
                  </div>
                  )}
                  {isSchoolButtonClicked && (
                  <div id='4' className='flex'>
                    <input 
                      type="text" 
                      placeholder="School" 
                      className="input input-md input-bordered w-full mt-3 mb-2 me-3"
                      value={school}
                      onChange={(event) => setSchool(event.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="ms-auto items-center px-4 py-3.5 mt-3.5 my-3 text-xs font-medium text-center text-white bg-mistblue rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                      onClick={handleSchoolSave}
                    >
                        Save
                    </button>
                  </div>
                  )}
                </div>

                <div className="px-2 py-1 mt-1">
                  <h5 className='font-bold'>現居城市</h5>
                  { !profile.address && !isCityValueVisible && (
                    <div id='citydescription' className='flex'>
                      <button id='1' className="inline-flex items-center justify-center w-8 h-8 mt-2 text-indigo-100 transition-colors duration-150 bg-blue-200 rounded-full focus:shadow-outline hover:bg-indigo-800" onClick={() => {setIsCityButtonClicked(!isCityButtonClicked)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g transform="translate(-1252 -20)" fill="white"><rect width="16" height="2" rx="1" transform="translate(1252 27)"/><rect width="16" height="2" rx="1" transform="rotate(90 620.5 640.5)"/></g></svg>                    
                      </button>
                      <p className='pt-3.5 pl-3'>新增城市</p>
                    </div>
                  )}
                  { !isCityButtonClicked && (profile.address||(isCityValueVisible)) && (
                  <div id='cityvalue' className='mt-2 flex justify-between'>
                    <div>現居 <b>{city !== "" ? city : profile.address}</b>{' '}</div>
                    <button className='btn btn-sm' onClick={()=>{setIsCityButtonClicked(true)}}>編輯</button>
                  </div>
                  )}
                  {isCityButtonClicked && (
                  <div id='2' className='flex'>
                    <input 
                      id="city"
                      type="text" 
                      placeholder="居住城市" 
                      className="input input-md input-bordered w-full mt-3 mb-2 me-3"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="ms-auto items-center px-4 py-3.5 mt-3.5 my-3 text-xs font-medium text-center text-white bg-mistblue rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                      onClick={handleCitySave}
                    >
                        Save
                    </button>
                  </div>
                  )}
                </div>

                <div className="px-2 py-1 mt-1 mb-4">
                  <h5 className='font-bold'>感情狀況</h5>
                  {!profile.single && !isRelationValueVisible && (
                  <div className='flex'>
                    <button className="inline-flex items-center justify-center w-8 h-8 mt-2 text-indigo-100 transition-colors duration-150 bg-blue-200 rounded-full focus:shadow-outline hover:bg-indigo-800" onClick={() => {setIsRelationButtonClicked(!isRelationButtonClicked)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g transform="translate(-1252 -20)" fill="white"><rect width="16" height="2" rx="1" transform="translate(1252 27)"/><rect width="16" height="2" rx="1" transform="rotate(90 620.5 640.5)"/></g></svg>                    
                    </button>
                    <p className='pt-3.5 pl-3'>新增感情狀況</p>
                  </div>
                  )}
                  {!isRelationButtonClicked && (profile.single || isRelationValueVisible) && (
                  <div id='cityvalue' className='mt-2 flex justify-between'>
                    <div>{relation !== "" ? relation : profile.single}</div>
                    <button className='btn btn-sm' onClick={()=>{setIsRelationButtonClicked(true)}}>編輯</button>
                  </div>
                  )}
                  {isRelationButtonClicked && (
                  <div id='7' className='flex'>
                    <select className="select select-bordered w-full mt-3 mb-2 me-3" onChange={(event) => setRelation(event.target.value)}>
                      <option disabled selected>感情狀況</option>
                      <option>單身</option>
                      <option>穩定交往中</option>
                      <option>已婚</option>
                      <option>一言難盡</option>
                      <option>離婚</option>
                    </select>
                    <button 
                      type="submit" 
                      className="ms-auto items-center px-4 py-3.5 mt-3.5 my-3 text-xs font-medium text-center text-white bg-mistblue rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
                      onClick={handleWRelationSave}
                    >
                        Save
                    </button>
                  </div>
                  )}
                </div>
                
            </div>
        </dialog>

      </div>
    )}
    </>
  );
}