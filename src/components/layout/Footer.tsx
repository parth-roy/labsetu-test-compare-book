import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import labsetuLogo from "@/assets/labsetu-logo.png";

const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={labsetuLogo} alt="LabSetu" className="h-8 w-auto" />
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              India's trusted platform for comparing diagnostic labs and booking tests at the best prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/search" className="text-sm text-muted-foreground hover:text-primary">Find Tests</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-primary">Login</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Contact Us</h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:9330490777" className="text-sm text-muted-foreground hover:text-primary">9330490777</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:parthroy852@gmail.com" className="text-sm text-muted-foreground hover:text-primary">parthroy852@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LabSetu. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
