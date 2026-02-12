import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search as SearchIcon, Star, Clock, Home, FlaskConical, ArrowUpDown } from "lucide-react";

interface LabTest {
  id: string;
  price: number;
  turnaround_hours: number | null;
  labs: { id: string; name: string; address: string; city: string; rating: number | null; home_collection: boolean | null; nabl_certified: boolean | null } | null;
  tests: { id: string; name: string; category: string; sample_type: string | null; description: string | null } | null;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [filterHome, setFilterHome] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const searchTests = async () => {
    setLoading(true);
    let q = supabase
      .from("lab_tests")
      .select("id, price, turnaround_hours, labs(id, name, address, city, rating, home_collection, nabl_certified), tests(id, name, category, sample_type, description)")
      .eq("is_available", true);

    if (query) {
      q = q.or(`name.ilike.%${query}%,category.ilike.%${query}%`, { referencedTable: "tests" });
    }

    const { data, error } = await q.limit(50);
    if (!error && data) {
      let sorted = [...data] as LabTest[];
      if (filterHome) sorted = sorted.filter((r) => r.labs?.home_collection);
      sorted.sort((a, b) => {
        if (sortBy === "price") return a.price - b.price;
        if (sortBy === "rating") return (b.labs?.rating || 0) - (a.labs?.rating || 0);
        if (sortBy === "turnaround") return (a.turnaround_hours || 99) - (b.turnaround_hours || 99);
        return 0;
      });
      setResults(sorted);
    }
    setLoading(false);
  };

  useEffect(() => { searchTests(); }, [sortBy, filterHome]);

  const toggleCompare = (id: string) => {
    setCompareList((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const getScore = (item: LabTest) => {
    let score = 0;
    score += Math.max(0, 100 - item.price / 10);
    score += (item.labs?.rating || 0) * 15;
    score += item.turnaround_hours ? Math.max(0, 50 - item.turnaround_hours) : 0;
    if (item.labs?.nabl_certified) score += 20;
    if (item.labs?.home_collection) score += 10;
    return Math.round(score);
  };

  const compared = results.filter((r) => compareList.includes(r.id));

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="mb-6 font-display text-3xl font-bold">Find & Compare Lab Tests</h1>

        {/* Search Bar */}
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tests (e.g., CBC, Thyroid, Lipid Profile)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && searchTests()}
            />
          </div>
          <Button onClick={searchTests}>Search</Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price: Low → High</SelectItem>
              <SelectItem value="rating">Rating: High → Low</SelectItem>
              <SelectItem value="turnaround">Fastest Results</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={filterHome ? "default" : "outline"} size="sm" onClick={() => setFilterHome(!filterHome)}>
            <Home className="mr-1 h-4 w-4" /> Home Collection
          </Button>
          {compareList.length > 0 && (
            <Badge variant="secondary">{compareList.length}/3 selected for compare</Badge>
          )}
        </div>

        {/* Compare Panel */}
        {compared.length >= 2 && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <h3 className="mb-3 font-display font-semibold">Lab Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Lab</th>
                      <th className="p-2 text-left">Test</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Rating</th>
                      <th className="p-2 text-right">TAT</th>
                      <th className="p-2 text-center">Home</th>
                      <th className="p-2 text-center">NABL</th>
                      <th className="p-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compared.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 font-medium">{item.labs?.name}</td>
                        <td className="p-2">{item.tests?.name}</td>
                        <td className="p-2 text-right font-semibold text-primary">₹{item.price}</td>
                        <td className="p-2 text-right">{item.labs?.rating || "-"} ⭐</td>
                        <td className="p-2 text-right">{item.turnaround_hours || "-"}h</td>
                        <td className="p-2 text-center">{item.labs?.home_collection ? "✅" : "❌"}</td>
                        <td className="p-2 text-center">{item.labs?.nabl_certified ? "✅" : "❌"}</td>
                        <td className="p-2 text-right font-bold text-primary">{getScore(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Searching...</div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <FlaskConical className="mx-auto mb-3 h-12 w-12 opacity-40" />
            <p>No tests found. Try a different search term.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <Card key={item.id} className={`transition-shadow hover:shadow-md ${compareList.includes(item.id) ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item.tests?.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.tests?.category}</p>
                    </div>
                    <Badge className="text-lg font-bold">₹{item.price}</Badge>
                  </div>
                  <p className="mb-2 text-sm font-medium text-foreground">{item.labs?.name}</p>
                  <p className="mb-3 text-xs text-muted-foreground">{item.labs?.address}, {item.labs?.city}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.labs?.rating && (
                      <Badge variant="secondary" className="gap-1"><Star className="h-3 w-3" />{item.labs.rating}</Badge>
                    )}
                    {item.turnaround_hours && (
                      <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{item.turnaround_hours}h</Badge>
                    )}
                    {item.labs?.home_collection && <Badge variant="outline" className="gap-1"><Home className="h-3 w-3" />Home</Badge>}
                    {item.labs?.nabl_certified && <Badge variant="secondary">NABL</Badge>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Score: <strong className="text-primary">{getScore(item)}</strong></span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleCompare(item.id)}>
                        {compareList.includes(item.id) ? "Remove" : "Compare"}
                      </Button>
                      <Button size="sm" asChild>
                        <a href={`/book/${item.id}`}>Book Now</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
