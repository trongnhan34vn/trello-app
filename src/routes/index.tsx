import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import ConfirmPage from "../pages/auth/ConfirmPage"
import SignInPage from "../pages/auth/SignInPage"
import SignUpPage from "../pages/auth/SignUpPage"
import Dashboard from "../pages/dashboard/Dashboard"

export const DOMAIN_ROUTE = {
  DASHBOARD: "/dashboard",
  BOARD: "/board"
}

export const ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  CONFIRM: "/confirm",
  BOARD: `${DOMAIN_ROUTE.BOARD}`,
  DASHBOARD: `${DOMAIN_ROUTE.DASHBOARD}`
}

export const routes = [
  {
    path: ROUTES.SIGN_IN,
    component: SignInPage,
    layout: AuthLayout,
    isPrivate: false
  },
  {
    path: ROUTES.SIGN_UP,
    component: SignUpPage,
    layout: AuthLayout,
    isPrivate: false
  },
  {
    path: ROUTES.CONFIRM,
    component: ConfirmPage,
    layout: AuthLayout,
    isPrivate: false
  },
  {
    path: ROUTES.DASHBOARD,
    component: Dashboard,
    layout: MainLayout,
    isPrivate: true
  }
]