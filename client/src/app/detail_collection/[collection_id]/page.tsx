import { DetailCollectionPage } from '@/modules/detail_collection/[collection_id]';
import { cookies } from 'next/headers';

export default async function DetailCollection() {

  const cookieStore = await cookies();
  const token = cookieStore.get('Token')?.value;

  return (
    <DetailCollectionPage token={token} />
  );
};
