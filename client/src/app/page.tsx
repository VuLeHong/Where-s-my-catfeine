import HomePage from "@/modules/home";
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return (
    <div>
      <HomePage token={token}/>
    </div>
  );
}
