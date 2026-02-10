import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-lg font-bold text-primary-foreground">L</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Lab<span className="text-primary">Setu</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/search" className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Find Tests
          </Link>
          <Link to="/about" className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Sign up</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link to="/search" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              Find Tests
            </Link>
            <Link to="/about" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileOpen(false)}>
              About
            </Link>
          </nav>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
