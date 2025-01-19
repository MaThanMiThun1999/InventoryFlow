import { useNavigate } from 'react-router-dom';

const BackButton = ({
  classNames = 'p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  children = 'Back',
}) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <button className={classNames} type="button" onClick={goBack}>
        {children}
      </button>
    </>
  );
};

export default BackButton;
