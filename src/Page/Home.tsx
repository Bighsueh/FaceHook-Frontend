import React from 'react';
import Feed from '../Component/Feed';
import CreatePost from '../Component/createPost';

function Home() {
  return (

    <div className='grid grid-cols-12 mt-10 ml-12'>
      <div className="flex-row row-start-1 col-span-7 col-start-2 space-y-4">
        <CreatePost/>
        <Feed />
      </div>
    </div>

  )
}

export default Home