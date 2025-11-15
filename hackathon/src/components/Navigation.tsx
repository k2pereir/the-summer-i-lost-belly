import { NavLink } from "react-router-dom";
import { User, Utensils, AlertCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: User, label: "Profile" },
    { to: "/log-food", icon: Utensils, label: "Log Food" },
    { to: "/log-symptoms", icon: AlertCircle, label: "Symptoms" },
    { to: "/history", icon: History, label: "History" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:top-0 md:bottom-auto md:border-b">
      <div className="absolute left-4 top-0 bottom-0 flex items-center z-20">
        <NavLink to="/" className="hidden md:flex items-center">
          <img src="/gutfeeling.png" alt="WIE" className="h-10 md:h-12 w-auto" />
        </NavLink>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center md:gap-8 py-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col md:flex-row items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;