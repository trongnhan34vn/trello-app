import { useTranslation } from "react-i18next"
import SignUpForm from "../../forms/auth/SignUpForm"

const SignUpPage = () => {
  const {t} = useTranslation();
  return (
    <div className="">
      <h3 className="text-white text-center font-bold text-2xl mb-5 mt-5 ">{t('auth:sign_up.title')}</h3>
      <SignUpForm />
    </div>
  )
}

export default SignUpPage