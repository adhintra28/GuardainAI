import { redirect } from 'next/navigation';
import ComplianceDashboard from '@/components/ComplianceDashboard';
import { getCurrentUser } from '@/lib/currentUser';

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth');
  }

  return <ComplianceDashboard authUser={user} />;
}
