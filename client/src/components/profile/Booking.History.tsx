import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, MapPin } from "lucide-react";

const mockBookings = [
  {
    id: "BK001",
    flightNumber: "UA1234",
    airline: "United Airlines",
    route: "JFK → LAX",
    date: "2024-01-15",
    status: "Confirmed",
    price: 299,
  },
  {
    id: "BK002",
    flightNumber: "AA5678",
    airline: "American Airlines",
    route: "LAX → JFK",
    date: "2024-01-22",
    status: "Completed",
    price: 349,
  },
];

export const BookingHistory = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Booking History</h2>
      
      {mockBookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                {booking.flightNumber} - {booking.airline}
              </CardTitle>
              <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {booking.route}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {booking.date}
                </div>
                <div className="font-semibold">${booking.price}</div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">View Details</Button>
                {booking.status === "Confirmed" && (
                  <Button variant="outline" size="sm">Modify</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
