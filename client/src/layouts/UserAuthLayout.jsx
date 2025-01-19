import { Outlet } from 'react-router-dom';
import ParticlesBackground from '../components/base/ParticlesBackground';
import { Toaster } from 'react-hot-toast';

const UserAuthLayout = () => {
  const theme = '#36454F';

  return (
    <main
      className='
        bg-neutral-900
        text-text dark:text-text-subdued'
    >
      <section className='relative z-10 overflow-hidden'>
        <ParticlesBackground theme={theme} />
        <section className='flex items-center justify-center min-h-screen overflow-hidden'>
          <Outlet />
        </section>
        <Toaster />
      </section>
    </main>
  );
};

export default UserAuthLayout;
