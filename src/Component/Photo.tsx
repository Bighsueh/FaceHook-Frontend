import React from 'react';


function Photos() {
    return (
      <div className="w-full shadow-fb bg-white rounded border border-gray-300 p-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-fBlack">Photos</div>
          <button className="focus:outline-none text-fBlue">
            See All Photos
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-4">
          <img
            src="https://picsum.photos/id/1018/3000"
            className="rounded-tl"
            alt="img"
          />
          <img src="https://picsum.photos/id/1018/3000" alt="img" />
          <img
            src="https://picsum.photos/id/1018/3000"
            className="rounded-tr"
            alt="img"
          />
          <img src="https://picsum.photos/id/1018/3000" alt="img" />
          <img src="https://picsum.photos/id/1018/3000" alt="img" />
          <img src="https://picsum.photos/id/1018/3000" alt="img" />
          <img
            src="https://picsum.photos/id/1018/3000"
            className="rounded-bl"
            alt="img"
          />
          <img src="https://picsum.photos/id/1018/3000" alt="img" />
          <img
            src="https://picsum.photos/id/1018/3000"
            className="rounded-br"
            alt="img"
          />
        </div>
      </div>
    );
  }

  export default Photos