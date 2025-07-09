'use client';
import { useEffect } from 'react';

export function useSSE(clientId: string, onEvent: (event: any) => void) {
  useEffect(() => {
    if (!clientId) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/sse/connect/${clientId}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (e) {
        console.error('Failed to parse SSE event', e);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [clientId, onEvent]);
} 