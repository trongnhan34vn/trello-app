import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from ".";

interface IProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: IProps) => {
  const navigate = useNavigate();

  // const handleGetMeError = () => {
  //   console.error("Get Me Error");
  //   navigate(ROUTES.SIGN_IN);
  // };

  // const loading = useLoading();

  // const { mutate } = useMutation({
  //   thunkFn: userThunk.getMe,
  //   option: {
  //     onError: handleGetMeError,
  //   },
  // });

  // useGlobalLoading({ selector: getMeSelector, loadingPlugin: loading });

  // useEffect(() => {
  //   mutate();
  // }, []);

  return children;
};

export default ProtectedRoute;
