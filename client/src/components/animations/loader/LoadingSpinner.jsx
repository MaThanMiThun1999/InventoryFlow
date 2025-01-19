import React, { useMemo } from 'react';
import LOADINGIMG from '../../../assets/img/loading.png';

const LoadingSpinner = () => {
  return (
    <div className='flex justify-center items-center flex-col w-full h-screen bg-gray-700 overflow-hidden text-white'>
      <div className='relative flex justify-center items-center'>
        <div className='absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500'></div>
        <img
          src={LOADINGIMG}
          className='size-20'
          alt='Loading'
        />
      </div>
        <h2 className='text-2xl font-bold mt-8'>
          Loading, Please Wait...!
        </h2>
    </div>
  );
};

export default React.memo(LoadingSpinner);