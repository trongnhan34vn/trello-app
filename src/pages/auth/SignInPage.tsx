import { useTranslation } from 'react-i18next';
import SignInForm from '../../forms/auth/SignInForm';

const SignInPage = () => {
  const { t } = useTranslation();
  return (
    <div className="">
      <h3 className="text-white text-center font-bold text-2xl mb-5 mt-5 ">
        {t('auth:sign_in.title')}
      </h3>
      <SignInForm />
    </div>
  );
};

export default SignInPage;
