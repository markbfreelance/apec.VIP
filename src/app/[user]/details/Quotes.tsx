'use client';

import { useEffect, useState } from 'react';

interface Quote {
  id: number;
  name: string;
  description: string;
}

interface QuotesProps {
  userId: number;
}

export default function Quotes({ userId }: QuotesProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      if (!userId) throw new Error('User ID is missing');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/quotes?userId=${userId}`,
        { cache: 'no-store' }
      );

      if (!response.ok) throw new Error(`Failed to fetch quotes: ${response.status}`);

      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading quotes...</div>;
  }

  if (quotes.length === 0) {
    return <div className="text-center py-8 text-gray-600">No quotes found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold text-red-600 mb-6">Quotes</h3>
      <div className="space-y-6">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105"
          >
            <h4 className="text-xl font-semibold text-red-500 truncate">{quote.name}</h4>
            <p className="text-sm text-gray-600 line-clamp-3">{quote.description}</p>
            <a
              href={`/quotes/${quote.id}`}
              className="block mt-4 text-sm font-semibold text-orange-500 hover:underline"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}