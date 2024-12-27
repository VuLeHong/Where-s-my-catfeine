import { FavoritePage } from "@/modules/favorite";
import { cookies } from 'next/headers';

export default async function Favorite() {
  const cookieStore = await cookies();
  const token = cookieStore.get('Token')?.value;
  return (
    <div>
      <FavoritePage token={token}/>
    </div>
  );
}