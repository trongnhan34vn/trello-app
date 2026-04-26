import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Form from '..';
import '../../App.css';
import Button from '../../components/Button';
import TextField from '../../components/form/TextField';
import { LOCAL_STORAGE_FIELDS, Regex } from '../../constants';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import { ROUTES } from '../../routes';
import { useSignInMutation } from '../../services/auth.service';
import type { ErrorResponse, SuccessResponse } from '../../types/api.type';
import type { SignInReqest } from '../../types/user.type';
import { useMeQuery } from '../../services/user.service';

const SignInForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavSignUp = () => {
    navigate(ROUTES.SIGN_UP);
  };

  const fields = [
    {
      name: 'email',
      label: t('auth:sign_in.field.email.label'),
      placeholder: t('auth:sign_in.field.email.placeholder'),
      rules: {
        required: t('auth:sign_in.field.email.required'),
        pattern: {
          value: Regex.EMAIL_REGEX,
          message: t('auth:sign_in.field.email.validate'),
        },
      },
      type: 'text',
    },
    {
      name: 'password',
      label: t('auth:sign_in.field.password.label'),
      placeholder: t('auth:sign_in.field.password.placeholder'),
      rules: {
        required: t('auth:sign_in.field.password.required'),
        pattern: {
          value: Regex.PASSWORD_REGEX,
          message: t('auth:sign_in.field.password.pattern'),
        },
      },
      type: 'password',
    },
  ];

  const defaultValues: SignInReqest = {
    email: '',
    password: '',
  };

  const [signIn] = useSignInMutation();
  const { handle } = useMutationHandler();

  const handleSignInSuccess = async (data: SuccessResponse<any>) => {
    localStorage.removeItem(LOCAL_STORAGE_FIELDS.CONFIRM_EMAIL);
    toast.success(data.message);
    await new Promise(resolve => setTimeout(resolve, 0));
    navigate(ROUTES.DASHBOARD)
  };

  const handleSignInError = (error: ErrorResponse) => {
    toast.error(error.message || '');
    if (error.code == 'MSG_ERR_003') {
      navigate(ROUTES.CONFIRM);
    }
  };

  const handleSubmit = (data: SignInReqest) => {
    localStorage.setItem(LOCAL_STORAGE_FIELDS.CONFIRM_EMAIL, data.email);
    handle(() => signIn(data), {
      onSuccess: handleSignInSuccess,
      onError: handleSignInError,
    });
  };

  return (
    <div className="w-2/3 mx-auto">
      <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
        {fields.map((f) => (
          <TextField
            key={f.name}
            name={f.name}
            label={f.label}
            placeholder={f.placeholder}
            type={f.type}
            rules={f.rules}
          />
        ))}
        <div className="mt-10">
          <Button className="w-full">{t('auth:sign_in.submit.label')}</Button>
          <div className="flex justify-end">
            <Button
              onClick={handleNavSignUp}
              type="button"
              className="font-medium! mt-5 text-text-muted hover:text-white hover:underline pr-0!"
              variant="text"
            >
              {t('auth:sign_in.nav_register.label')}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SignInForm;
