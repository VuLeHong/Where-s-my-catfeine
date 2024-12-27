"use client"

import { useParams } from 'next/navigation';
import DetailPage from '@/modules/detail/[place_id]';

export default function Detail() {
  const { place_id } = useParams();

  return place_id ? <DetailPage placeId={place_id as string} /> : <p>Loading...</p>;
}
