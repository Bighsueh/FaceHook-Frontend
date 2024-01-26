import Feed from '../Component/Feed';
import CreatePost from '../Component/createPost';
import ChatRoom from '../Component/ChatRoom';
import Sidebox from '../Component/Sidebox';


function Home() {

  return (
    <div className='absolute top-16 left-5 right-5 md:left-16 md:right-16 lg:left-64 lg:right-64'>
        <div className='grid grid-cols-12 mt-10'>
          <div className='flex-row row-start-1 col-start-1 col-span-12 space-y-4 lg:col-span-8 lg:col-start-3'>
            <CreatePost/>
            <Feed />
            <ChatRoom />
          </div>
        </div>

        <Sidebox/>

    </div>
  )
}

export default Home