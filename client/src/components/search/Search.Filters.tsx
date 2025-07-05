import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const airlines = [
    "United Airlines",
    "American Airlines",
    "Delta Airlines",
    "Southwest Airlines",
    "JetBlue Airways"
  ];

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
              max={2000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Airlines</Label>
            <div className="space-y-2">
              {airlines.map((airline) => (
                <div key={airline} className="flex items-center space-x-2">
                  <Checkbox id={airline} />
                  <Label htmlFor={airline} className="text-sm">{airline}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Departure Time</Label>
            <Select>
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
              <div className="flex items-center space-x-2">
                <Checkbox id="nonstop" />
                <Label htmlFor="nonstop" className="text-sm">Nonstop</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="1stop" />
                <Label htmlFor="1stop" className="text-sm">1 Stop</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="2stops" />
                <Label htmlFor="2stops" className="text-sm">2+ Stops</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
