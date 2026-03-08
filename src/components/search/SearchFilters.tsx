import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import type { Filters } from "@/pages/Search";

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const SearchFilters = ({ filters, setFilters }: Props) => {
  return (
    <div className="space-y-6 rounded-xl border bg-background p-4 shadow-sm">
      <h3 className="text-sm font-bold text-foreground">Filters</h3>

      {/* Sort */}
      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v }))}>
          <SelectTrigger className="h-9 text-xs">
            <ArrowUpDown className="mr-1.5 h-3 w-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price: Low → High</SelectItem>
            <SelectItem value="rating">Rating: High → Low</SelectItem>
            <SelectItem value="turnaround">Fastest Results</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Max Price: ₹{filters.maxPrice.toLocaleString()}
        </Label>
        <Slider
          value={[filters.maxPrice]}
          onValueChange={([v]) => setFilters((f) => ({ ...f, maxPrice: v }))}
          max={10000}
          min={100}
          step={100}
          className="mt-2"
        />
      </div>

      {/* Min Rating */}
      <div>
        <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
          Min Rating: {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
        </Label>
        <Slider
          value={[filters.minRating]}
          onValueChange={([v]) => setFilters((f) => ({ ...f, minRating: v }))}
          max={5}
          min={0}
          step={0.5}
          className="mt-2"
        />
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Home Collection</Label>
          <Switch
            checked={filters.homeCollection}
            onCheckedChange={(v) => setFilters((f) => ({ ...f, homeCollection: v }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">NABL Certified Only</Label>
          <Switch
            checked={filters.nablOnly}
            onCheckedChange={(v) => setFilters((f) => ({ ...f, nablOnly: v }))}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
