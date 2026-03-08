import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, ChevronDown, Search, ShoppingCart, UserCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
import labsetuLogo from "@/assets/labsetu-logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import CartSidebar from "@/components/cart/CartSidebar";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, role, signOut } = useAuth();
  const { city, setCity, cities, detecting } = useLocation();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [cityOpen, setCityOpen] = useState(false);

  const handleSearch = () => {
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardLink = role === "admin" ? "/admin" : role === "lab_partner" ? "/lab-dashboard" : "/my-bookings";

  return (
    <header className="sticky top-0 z-50 border-b bg-background shadow-sm">
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src={labsetuLogo} alt="LabSetu" className="h-8 w-auto" />
        </Link>

        {/* Location Selector */}
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <button className="hidden items-center gap-1 rounded-lg border px-3 py-2 text-sm md:flex hover:bg-muted/50 transition-colors">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="max-w-[100px] truncate font-medium">{detecting ? "Detecting..." : city || "Select City"}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandList>
                <CommandEmpty>No city found</CommandEmpty>
                {cities.map((c) => (
                  <CommandItem key={c} onSelect={() => { setCity(c); setCityOpen(false); }} className="cursor-pointer">
                    <MapPin className="mr-2 h-3 w-3" />{c}
                    {c === city && <span className="ml-auto text-xs text-primary">✓</span>}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-xl">
            <Input
              placeholder="Search tests or full body checkups"
              className="h-10 rounded-l-lg rounded-r-none border-r-0 pl-4 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              size="sm"
              className="absolute right-0 top-0 h-10 rounded-l-none rounded-r-lg px-4"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2">
          <CartSidebar />
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to={dashboardLink}>
                  <UserCircle className="mr-1 h-4 w-4" />
                  {role === "admin" ? "Admin" : role === "lab_partner" ? "Lab" : "My Bookings"}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>Log out</Button>
            </div>
          ) : (
            <Button size="sm" className="hidden md:flex" asChild>
              <Link to="/login">Login / Sign Up</Link>
            </Button>
          )}

          {/* Mobile user icon */}
          {user && (
            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" onClick={() => navigate(dashboardLink)}>
              <UserCircle className="h-5 w-5" />
            </Button>
          )}

          <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="border-t px-4 py-2 md:hidden">
        <div className="relative">
          <Input
            placeholder="Search tests or full body checkups"
            className="h-10 pl-4 pr-10 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/search" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Find Tests</Link>
            <Link to="/packages" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Packages</Link>
            {user && <Link to={dashboardLink} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
          </nav>
          <div className="mt-3">
            {/* Mobile city selector */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  {city || "Select City"}
                  <ChevronDown className="ml-auto h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No city found</CommandEmpty>
                    {cities.map((c) => (
                      <CommandItem key={c} onSelect={() => setCity(c)} className="cursor-pointer">
                        <MapPin className="mr-2 h-3 w-3" />{c}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-3 flex gap-2">
            {user ? (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Log out</Button>
            ) : (
              <Button size="sm" className="flex-1" asChild><Link to="/login" onClick={() => setMobileOpen(false)}>Login / Sign Up</Link></Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
