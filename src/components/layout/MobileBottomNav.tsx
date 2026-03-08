import { Link, useLocation as useRouterLocation } from "react-router-dom";
import { Home, Search, CalendarCheck, FileText, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { label: "Home", icon: Home, href: "/", authRequired: false },
  { label: "Tests", icon: Search, href: "/search", authRequired: false },
  { label: "Bookings", icon: CalendarCheck, href: "/my-bookings", authRequired: true },
  { label: "Profile", icon: User, href: "/login", authRequired: false },
];

const MobileBottomNav = () => {
  const location = useRouterLocation();
  const { user, role } = useAuth();

  const getProfileHref = () => {
    if (!user) return "/login";
    if (role === "admin") return "/admin";
    if (role === "lab_partner") return "/lab-dashboard";
    return "/my-bookings";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex items-center justify-around py-1.5">
        {tabs.map((tab) => {
          if (tab.authRequired && !user) return null;
          const href = tab.label === "Profile" ? getProfileHref() : tab.href;
          const isActive = location.pathname === href || (tab.href === "/" && location.pathname === "/");

          return (
            <Link
              key={tab.label}
              to={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
