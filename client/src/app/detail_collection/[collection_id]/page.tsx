"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DetailCollectionPage } from '@/modules/detail_collection/[collection_id]';

export default function DetailCollection () {
  const params = useParams();
  const collection_id = typeof params.collection_id === 'string' ? params.collection_id : undefined;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndCollectionId = async () => {
      const res = await fetch(`/api/collection/${collection_id}`);
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
      } else {
        console.error('Error fetching token and collectionId');
      }
    };

    if (collection_id) {
      fetchTokenAndCollectionId();
    }
  }, [collection_id]);

  if (!token) return <p>Loading...</p>;

  return (
    <DetailCollectionPage token={token} collectionId={collection_id} />
  );
};
