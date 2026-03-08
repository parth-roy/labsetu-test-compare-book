import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search as SearchIcon, FlaskConical } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useLocation } from "@/hooks/useLocation";

export interface LabTest {
  id: string;
  price: number;
  turnaround_hours: number | null;
  labs: { id: string; name: string; address: string; city: string; rating: number | null; home_collection: boolean | null; nabl_certified: boolean | null } | null;
  tests: { id: string; name: string; category: string; sample_type: string | null; description: string | null } | null;
}

export interface Filters {
  sortBy: string;
  homeCollection: boolean;
  nablOnly: boolean;
  maxPrice: number;
  minRating: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("category") || searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    sortBy: "price",
    homeCollection: false,
    nablOnly: false,
    maxPrice: 10000,
    minRating: 0,
  });
  const [compareList, setCompareList] = useState<string[]>([]);
  const { addItem, isInCart } = useCart();
  const { city } = useLocation();

  const searchTests = async (searchQuery?: string) => {
    setLoading(true);
    const q_text = searchQuery ?? query;

    let q = supabase
      .from("lab_tests")
      .select("id, price, turnaround_hours, labs(id, name, address, city, rating, home_collection, nabl_certified), tests(id, name, category, sample_type, description)")
      .eq("is_available", true);

    if (q_text) {
      q = q.or(`name.ilike.%${q_text}%,category.ilike.%${q_text}%`, { referencedTable: "tests" });
    }

    const { data, error } = await q.limit(100);
    if (!error && data) {
      let sorted = (data as LabTest[]).filter((r) => {
        if (!r.labs || !r.tests) return false;
        if (city && r.labs.city.toLowerCase() !== city.toLowerCase()) return false;
        if (filters.homeCollection && !r.labs.home_collection) return false;
        if (filters.nablOnly && !r.labs.nabl_certified) return false;
        if (r.price > filters.maxPrice) return false;
        if (filters.minRating > 0 && (r.labs.rating || 0) < filters.minRating) return false;
        return true;
      });

      sorted.sort((a, b) => {
        if (filters.sortBy === "price") return a.price - b.price;
        if (filters.sortBy === "rating") return (b.labs?.rating || 0) - (a.labs?.rating || 0);
        if (filters.sortBy === "turnaround") return (a.turnaround_hours || 99) - (b.turnaround_hours || 99);
        return 0;
      });
      setResults(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    const q = searchParams.get("category") || searchParams.get("q") || "";
    if (q) setQuery(q);
    searchTests(q || undefined);
  }, [searchParams.get("category"), searchParams.get("q"), filters, city]);

  const toggleCompare = (id: string) => {
    setCompareList((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="mb-4 text-2xl font-bold">
          {initialQuery ? `${initialQuery} Tests` : "Find & Compare Lab Tests"}
        </h1>

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
          <Button onClick={() => searchTests()}>Search</Button>
        </div>

        {city && <Badge variant="outline" className="mb-4 gap-1">📍 {city}</Badge>}

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <SearchFilters filters={filters} setFilters={setFilters} />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {compareList.length > 0 && (
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium">
                {compareList.length}/3 selected for compare
              </div>
            )}

            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Searching...</div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <FlaskConical className="mx-auto mb-3 h-12 w-12 opacity-40" />
                <p>No tests found{city ? ` in ${city}` : ""}. Try a different search or city.</p>
              </div>
            ) : (
              <SearchResults
                results={results}
                compareList={compareList}
                toggleCompare={toggleCompare}
                addItem={addItem}
                isInCart={isInCart}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
