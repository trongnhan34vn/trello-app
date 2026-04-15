import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import ConfirmPage from "../pages/auth/ConfirmPage"
import SignInPage from "../pages/auth/SignInPage"
import SignUpPage from "../pages/auth/SignUpPage"
import Dashboard from "../pages/dashboard/Dashboard"
import WorkspaceBoardPage from "../pages/workspace/WorkspaceBoardPage"
import WorkspaceMemberPage from "../pages/workspace/WorkspaceMemberPage"

export const DOMAIN_ROUTE = {
  DASHBOARD: "/dashboard",
  BOARD: "/board",
  WORKSPACE: "/workspace"
}

export const ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  CONFIRM: "/confirm",
  BOARD: `${DOMAIN_ROUTE.BOARD}`,
  DASHBOARD: `${DOMAIN_ROUTE.DASHBOARD}`,
  WORKSPACE_BOARDS: `${DOMAIN_ROUTE.WORKSPACE}/:id/boards`,
  WORKSPACE_MEMBERS: `${DOMAIN_ROUTE.WORKSPACE}/:id/members`
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
  },
  {
    path: ROUTES.WORKSPACE_BOARDS,
    component: WorkspaceBoardPage,
    layout: MainLayout,
    isPrivate: true
  },
  {
    path: ROUTES.WORKSPACE_MEMBERS,
    component: WorkspaceMemberPage,
    layout: MainLayout,
    isPrivate: true
  },
]