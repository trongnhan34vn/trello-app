import { Field } from '@headlessui/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { RotatingLines } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import Form from '..';
import Button from '../../components/Button';
import TextField from '../../components/form/TextField';
import { LOCAL_STORAGE_FIELDS } from '../../constants';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import { ROUTES } from '../../routes';
import { useConfirmMutation, useResendCodeMutation } from '../../services/auth.service';
import type { ErrorResponse, SuccessResponse } from '../../types/api.type';

type ResendState = {
  count: number;
  lastRequestTime: number;
  blockedUntil: number;
};

const getInitialState = (): ResendState => {
  const raw = localStorage.getItem(LOCAL_STORAGE_FIELDS.RESEND_STATE);
  if (!raw) {
    return { count: 0, lastRequestTime: 0, blockedUntil: 0 };
  }
  return JSON.parse(raw);
};

const ConfirmForm = () => {
  const { t } = useTranslation();
  const confirmationEmail = localStorage.getItem(LOCAL_STORAGE_FIELDS.CONFIRM_EMAIL);
  const navigate = useNavigate();
  const [resendState, setResendState] = useState<ResendState>(getInitialState());
  const [now, setNow] = useState(Date.now());

  // update time every second for UI countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FIELDS.RESEND_STATE, JSON.stringify(resendState));
  }, [resendState]);

  const isBlocked = now < resendState.blockedUntil;
  const remaining = Math.max(0, resendState.blockedUntil - now);

  const seconds = Math.ceil(remaining / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!confirmationEmail) {
      navigate(ROUTES.SIGN_IN, { replace: true });
      return;
    }
  }, [navigate]);

  const defaultValues = {
    username: confirmationEmail,
    confirmationCode: '',
  };

  const [resend, { isLoading }] = useResendCodeMutation();
  const [confirmEmail] = useConfirmMutation();
  const { handle } = useMutationHandler();

  const handleSuccessResendCode = (data: SuccessResponse<any>) => {
    toast.success(data.message);
  };

  const handleErrorResendCode = (error: ErrorResponse) => {
    toast.error(error.message);
  };

  const handleResendConfirmCode = () => {
    if (isBlocked) return;

    const newCount = resendState.count + 1;

    let cooldown = 5000; // 5s

    if (newCount >= 5) {
      cooldown = 60 * 60 * 1000; // 1 hour
    }

    const newState: ResendState = {
      count: newCount,
      lastRequestTime: now,
      blockedUntil: now + cooldown,
    };

    setResendState(newState);

    // call api
    const payload = {
      username: confirmationEmail,
    };
    handle(resend(payload), {
      hasLoading: false,
      onSuccess: handleSuccessResendCode,
      onError: handleErrorResendCode,
    });
  };

  const handleSuccessConfirm = (data: SuccessResponse<any>) => {
    toast.success(data.message);
    localStorage.removeItem(LOCAL_STORAGE_FIELDS.CONFIRM_EMAIL);
    navigate(ROUTES.SIGN_IN);
  };

  const handleErrorConfirm = (error: ErrorResponse) => {
    toast.error(error.message);
  };

  const handleConfirmEmail = (data: any) => {
    handle(confirmEmail(data), {
      onError: handleErrorConfirm,
      onSuccess: handleSuccessConfirm,
    });
  };

  return (
    <div className="mt-5">
      <Form defaultValues={defaultValues} onSubmit={handleConfirmEmail}>
        <Field className={`mb-5`}>
          {isLoading ? (
            <RotatingLines
              visible={true}
              height="18"
              width="18"
              color="green"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass="float-right"
            />
          ) : (
            <span
              onClick={handleResendConfirmCode}
              className="float-right text-sm text-center hover:underline hover:text-white transition-all duration-200 ease-in cursor-pointer text-text-muted"
            >
              Let's re-send code {seconds != 0 && <span>({seconds}s)</span>}
            </span>
          )}
          <TextField
            name="confirmationCode"
            label={t('auth:confirm.field.code.label')}
            placeholder={t('auth:confirm.field.code.placeholder')}
            rules={{ required: t('auth:confirm.field.code.required') }}
          />
        </Field>
        <Button className="w-full">Continue</Button>
      </Form>
    </div>
  );
};

export default ConfirmForm;
