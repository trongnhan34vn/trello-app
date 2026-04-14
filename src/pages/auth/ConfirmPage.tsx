import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmForm from '../../forms/auth/ConfirmForm';
import { ROUTES } from '../../routes';

const ConfirmPage = () => {
  const navigate = useNavigate();
  const confirmEmail = localStorage.getItem('confirm_email');

  useEffect(() => {
    if (!confirmEmail || confirmEmail === '' || confirmEmail === 'null') {
      navigate(ROUTES.SIGN_IN);
    }
  }, [confirmEmail, navigate]);

  return (
    <div className="">
      <h3 className="text-white text-center font-bold text-2xl mb-5 mt-5 ">Confirm your email</h3>

      <div className="w-2/3 mx-auto mt-10">
        <p className="text-white text-sm text-center mb-1">Thank you for your signing up!</p>
        <p className="text-white text-sm text-center">A verification code has been sent to</p>
        <p className="text-white text-sm text-center font-bold mt-1 mb-4">{confirmEmail}</p>
        <p className="text-white text-sm text-center">Please check and enter the code below</p>
        <ConfirmForm />
      </div>
    </div>
  );
};

export default ConfirmPage;
