import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Home, Shield, ShoppingCart, Check, Building2 } from "lucide-react";
import type { LabTest } from "@/pages/Search";
import type { CartItem } from "@/hooks/useCart";

interface Props {
  results: LabTest[];
  compareList: string[];
  toggleCompare: (id: string) => void;
  addItem: (item: CartItem) => void;
  isInCart: (id: string) => boolean;
}

const SearchResults = ({ results, compareList, toggleCompare, addItem, isInCart }: Props) => {
  return (
    <div className="space-y-3">
      {results.map((item) => (
        <Card
          key={item.id}
          className={`rounded-xl border shadow-sm transition-all hover:shadow-md ${
            compareList.includes(item.id) ? "ring-2 ring-primary" : ""
          }`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-foreground">{item.tests?.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.tests?.category}</p>
                  <p className="mt-1 text-xs font-medium text-foreground">{item.labs?.name}</p>
                  <p className="text-[11px] text-muted-foreground">{item.labs?.address}, {item.labs?.city}</p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.labs?.rating ? (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Star className="h-2.5 w-2.5 fill-warning text-warning" /> {item.labs.rating}
                      </Badge>
                    ) : null}
                    {item.turnaround_hours && (
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <Clock className="h-2.5 w-2.5" /> {item.turnaround_hours}h
                      </Badge>
                    )}
                    {item.labs?.home_collection && (
                      <Badge variant="outline" className="text-[10px] gap-1">
                        <Home className="h-2.5 w-2.5" /> Home
                      </Badge>
                    )}
                    {item.labs?.nabl_certified && (
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Shield className="h-2.5 w-2.5" /> NABL
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <span className="text-xl font-bold text-foreground">₹{item.price}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleCompare(item.id)}
                  >
                    {compareList.includes(item.id) ? "Remove" : "Compare"}
                  </Button>
                  {isInCart(item.id) ? (
                    <Button size="sm" variant="secondary" disabled className="gap-1 text-xs">
                      <Check className="h-3 w-3" /> Added
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() =>
                        addItem({
                          id: item.labs?.id || "",
                          labTestId: item.id,
                          testName: item.tests?.name || "",
                          labName: item.labs?.name || "",
                          labCity: item.labs?.city || "",
                          price: item.price,
                          turnaroundHours: item.turnaround_hours,
                          homeCollection: item.labs?.home_collection || false,
                        })
                      }
                    >
                      <ShoppingCart className="h-3 w-3" /> Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
