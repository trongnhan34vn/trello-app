export const Regex = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_REGEX:   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
}

export const BASE_URL = import.meta.env.VITE_API_URL;

export const LOCAL_STORAGE_FIELDS = {
  CONFIRM_EMAIL: 'confirm_email',
  RESEND_STATE: 'resend_state'
}