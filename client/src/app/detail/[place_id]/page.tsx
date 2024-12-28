import DetailPage from '@/modules/detail/[place_id]';
import { cookies } from 'next/headers';

export default async function Detail() {

  const cookieStore = await cookies();
  const token = cookieStore.get('Token')?.value;

  return (
    <DetailPage token={token} />
  );
}
