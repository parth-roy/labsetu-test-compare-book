import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, ChevronDown, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "@/hooks/useLocation";
import CartSidebar from "@/components/cart/CartSidebar";
import labsetuLogo from "@/assets/labsetu-logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const { city, setCity, cities, detecting } = useLocation();
  const navigate = useNavigate();
  const [cityOpen, setCityOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const dashboardLink = role === "admin" ? "/admin" : role === "lab_partner" ? "/lab-dashboard" : "/my-bookings";
  const dashboardLabel = role === "admin" ? "Admin" : role === "lab_partner" ? "Lab Dashboard" : "My Bookings";

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={labsetuLogo} alt="LabSetu" className="h-9 w-auto" />
          </Link>
          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[80px] truncate text-xs font-medium">{detecting ? "Detecting..." : city || "Select City"}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0" align="start">
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
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Home</Link>
          <Link to="/search" className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Find Tests</Link>
          {user && <Link to={dashboardLink} className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">{dashboardLabel}</Link>}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CartSidebar />
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>Log out</Button>
            </>
          ) : (
            <Button size="sm" asChild><Link to="/login">Login / Sign Up</Link></Button>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          <CartSidebar />
          {user && (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate(dashboardLink)}>
              <UserCircle className="h-5 w-5" />
            </Button>
          )}
          <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/search" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>Find Tests</Link>
            {user && <Link to={dashboardLink} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>{dashboardLabel}</Link>}
          </nav>
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
