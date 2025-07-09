import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  airlineOptions: string[];
}

export const SearchFilters = ({ filters, onFiltersChange, airlineOptions }: SearchFiltersProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Price Range</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({...filters, priceRange: value})}
              max={20000}
              min={2000}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Airlines</Label>
            <div className="space-y-2">
              {airlineOptions.map((airline) => (
                <div key={airline} className="flex items-center space-x-2">
                  <Checkbox
                    id={airline}
                    checked={filters.airlines.includes(airline)}
                    onCheckedChange={(checked) => {
                      const newAirlines = checked
                        ? [...filters.airlines, airline]
                        : filters.airlines.filter((a: string) => a !== airline);
                      onFiltersChange({ ...filters, airlines: newAirlines });
                    }}
                  />
                  <Label htmlFor={airline} className="text-sm">{airline}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Departure Time</Label>
            <Select
              value={filters.departureTime}
              onValueChange={(value) => onFiltersChange({ ...filters, departureTime: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Stops</Label>
            <div className="space-y-2">
              {['nonstop', '1stop', '2stops'].map((stop) => (
                <div key={stop} className="flex items-center space-x-2">
                  <Checkbox
                    id={stop}
                    checked={filters.stops.includes(stop)}
                    onCheckedChange={(checked) => {
                      const newStops = checked
                        ? [...filters.stops, stop]
                        : filters.stops.filter((s: string) => s !== stop);
                      onFiltersChange({ ...filters, stops: newStops });
                    }}
                  />
                  <Label htmlFor={stop} className="text-sm">
                    {stop === 'nonstop' ? 'Nonstop' : stop === '1stop' ? '1 Stop' : '2+ Stops'}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
