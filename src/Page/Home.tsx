import React from 'react';
import Post from '../Component/Post';
import Feed from '../Component/Feed';


function Home() {
  return (

    <div className="ml-12 pl-12">
      <div className='mt-10 ml-12'>
          <Post />
          <Feed />
      </div>
    </div>


  )
}

export default Home