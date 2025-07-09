import { useSSE } from '@/hooks/useSSE';
import { toast } from 'sonner';

interface SSEListenerProps {
  clientId: string;
}

function SSEListener({ clientId }: SSEListenerProps) {
  useSSE(clientId, (event) => {
    if (event.type === 'flight_update') {
      toast.info(`Flight ${event.flightId} updated: ${JSON.stringify(event.update)}`);
    }
    if (event.type === 'booking_update') {
      toast.info(`Booking ${event.bookingId} updated: ${JSON.stringify(event.update)}`);
    }
  });
  return null;
}

export default SSEListener;