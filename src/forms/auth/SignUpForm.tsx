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
import { useSignUpMutation } from '../../services/auth.service';
import type { ErrorResponse, SuccessResponse } from '../../types/api.type';
import type { SignUpRequest } from '../../types/user.type';

const SignUpForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavSignIn = () => {
    navigate(ROUTES.SIGN_IN);
  };

  const buildFields = (password: string) => {
    const fields = [
      {
        name: 'fullName',
        label: t('auth:sign_up.field.name.label'),
        placeholder: t('auth:sign_up.field.name.placeholder'),
        rules: {
          required: t('auth:sign_up.field.name.required'),
        },
        type: 'text',
      },
      {
        name: 'email',
        label: t('auth:sign_up.field.email.label'),
        placeholder: t('auth:sign_up.field.email.placeholder'),
        rules: {
          required: t('auth:sign_up.field.email.required'),
          pattern: {
            value: Regex.EMAIL_REGEX,
            message: t('auth:sign_up.field.email.validate'),
          },
        },
        type: 'text',
      },
      {
        name: 'password',
        label: t('auth:sign_up.field.password.label'),
        placeholder: t('auth:sign_up.field.password.placeholder'),
        rules: {
          required: t('auth:sign_up.field.password.required'),
          pattern: {
            value: Regex.PASSWORD_REGEX,
            message: t('auth:sign_up.field.password.pattern'),
          },
        },
        type: 'password',
      },
      {
        name: 'confirmedPassword',
        label: t('auth:sign_up.field.confirm_password.label'),
        placeholder: t('auth:sign_up.field.confirm_password.placeholder'),
        rules: {
          required: t('auth:sign_up.field.confirm_password.required'),
          validate: (value: string) => {
            if (value !== password) {
              return t('auth:sign_up.field.confirm_password.validate');
            }
            return true;
          },
        },
        type: 'password',
      },
    ];
    return fields;
  };

  const defaultValues: SignUpRequest = {
    fullName: '',
    email: '',
    password: '',
    confirmedPassword: '',
  };

  const [signUp] = useSignUpMutation();
  const { handle } = useMutationHandler();

  const handleSuccessSignUp = (data: any) => {
    const res = data as SuccessResponse<any>;
    const message = res.message;
    toast.success(message || '');
    navigate(ROUTES.CONFIRM);
  };

  const handleErrorSignUp = (error: ErrorResponse) => {
    toast.error(error.message || '');
  };

  const handleSubmit = (data: SignUpRequest) => {
    localStorage.setItem(LOCAL_STORAGE_FIELDS.CONFIRM_EMAIL, data.email);
    handle(signUp(data), {
      onSuccess: handleSuccessSignUp,
      onError: handleErrorSignUp,
    });
  };

  return (
    <div className="w-2/3 mx-auto">
      <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
        {({ watch }) => {
          const password = watch('password');
          return (
            <>
              {buildFields(password).map((f) => (
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
                <Button className="w-full">Sign Up</Button>
                <div className="flex justify-end">
                  <Button
                    onClick={handleNavSignIn}
                    type="button"
                    className="font-medium! mt-8 text-text-muted hover:text-white hover:underline pr-0!"
                    variant="text"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
};

export default SignUpForm;
