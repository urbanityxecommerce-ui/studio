import LoginClient from '@/components/auth/login-client';

export default function SignupPage() {
  // Redirecting to login page as there is no separate signup flow for anonymous auth
  return <LoginClient />;
}
