'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateBooking, CreateBookingDto, PassengerDto } from '@/hooks/useBookings';
import { FlightDto } from '@/hooks/useFlightSearch';
import { toast } from 'sonner';

interface BookingModalProps {
  flight: FlightDto | null;
  isOpen: boolean;
  onClose: () => void;
  passengers: number;
}

export const BookingModal = ({ flight, isOpen, onClose, passengers }: BookingModalProps) => {
  const [passengerDetails, setPassengerDetails] = useState<PassengerDto[]>([]);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const createBooking = useCreateBooking();

  // Initialize passenger details when modal opens
  useState(() => {
    if (isOpen && passengers > 0) {
      const initialPassengers: PassengerDto[] = Array.from({ length: passengers }, (_, index) => ({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        nationality: '',
      }));
      setPassengerDetails(initialPassengers);
    }
  });

  const handlePassengerChange = (index: number, field: keyof PassengerDto, value: string) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengerDetails(updatedPassengers);
  };

  const handleSubmit = async () => {
    if (!flight) return;

    // Validate passenger details
    const isValid = passengerDetails.every(passenger => 
      passenger.firstName && passenger.lastName && passenger.dateOfBirth && passenger.nationality
    );

    if (!isValid) {
      toast.error('Please fill in all required passenger details');
      return;
    }

    const bookingData: CreateBookingDto = {
      flightId: flight.id,
      passengers: passengerDetails,
      cabinClass,
      specialRequests: specialRequests || undefined,
    };

    try {
      await createBooking.mutateAsync(bookingData);
      toast.success('Booking created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const totalPrice = flight ? flight.price * passengers : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Flight</DialogTitle>
        </DialogHeader>

        {flight && (
          <div className="space-y-6">
            {/* Flight Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Flight Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Flight:</span> {flight.flightNumber}
                </div>
                <div>
                  <span className="text-gray-600">Airline:</span> {flight.airline}
                </div>
                <div>
                  <span className="text-gray-600">Route:</span> {flight.origin} → {flight.destination}
                </div>
                                 <div>
                   <span className="text-gray-600">Duration:</span> {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                 </div>
                                 <div>
                   <span className="text-gray-600">Departure:</span> {new Date(flight.departureTime).toLocaleString()}
                 </div>
                 <div>
                   <span className="text-gray-600">Arrival:</span> {new Date(flight.arrivalTime).toLocaleString()}
                 </div>
              </div>
            </div>

            {/* Cabin Class Selection */}
            <div>
              <Label htmlFor="cabinClass">Cabin Class</Label>
              <Select value={cabinClass} onValueChange={setCabinClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Passenger Details */}
            <div>
              <h3 className="font-semibold mb-4">Passenger Details</h3>
              <div className="space-y-4">
                {passengerDetails.map((passenger, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Passenger {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`firstName-${index}`}>First Name *</Label>
                        <Input
                          id={`firstName-${index}`}
                          value={passenger.firstName}
                          onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lastName-${index}`}>Last Name *</Label>
                        <Input
                          id={`lastName-${index}`}
                          value={passenger.lastName}
                          onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`dateOfBirth-${index}`}>Date of Birth *</Label>
                        <Input
                          id={`dateOfBirth-${index}`}
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`nationality-${index}`}>Nationality *</Label>
                        <Input
                          id={`nationality-${index}`}
                          value={passenger.nationality}
                          onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor={`passport-${index}`}>Passport Number (Optional)</Label>
                        <Input
                          id={`passport-${index}`}
                          value={passenger.passportNumber}
                          onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <textarea
                id="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Any special requests or requirements..."
              />
            </div>

            {/* Price Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Price ({passengers} passengers)</p>
                  <p className="text-2xl font-bold text-blue-600">${totalPrice}</p>
                </div>
                <Button 
                  onClick={handleSubmit}
                  disabled={createBooking.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createBooking.isPending ? 'Creating Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 