import { redirect } from 'next/navigation';
import AuthPage from '@/components/AuthPage';
import { getCurrentUser } from '@/lib/currentUser';

export default async function AuthorizationPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return <AuthPage />;
}
