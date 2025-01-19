import React, { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import Router from './Router';

const App = () => {
  const memoizedToaster = useMemo(() => <Toaster />, []);
  return (
    <>
      <Router />
      {memoizedToaster}
    </>
  );
};

export default App;
