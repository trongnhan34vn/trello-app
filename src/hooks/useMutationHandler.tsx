import { useLoading } from './useLoading';

export const useMutationHandler = () => {
  const { show, hide } = useLoading();
  const handle = async (promise: () => any, { onSuccess, onError, hasLoading = true }: any) => {
    try {
      if (hasLoading) {
        show();
      }

      const res = await promise().unwrap();
      onSuccess && onSuccess(res);
      return res;
    } catch (error: any) {
      const isConfirmEmailPage = window.location.pathname.includes('/confirm') || window.location.pathname.includes('/');

      if (error.status == 401 && !isConfirmEmailPage) {
        window.location.href = '/';
      }
      onError && onError(error.data);
      return null;
    } finally {
      hide();
    }
  };
  return { handle };
};
