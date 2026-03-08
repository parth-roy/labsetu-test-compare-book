import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import labsetuLogo from "@/assets/labsetu-logo.png";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/">
              <img src={labsetuLogo} alt="LabSetu" className="h-8 w-auto" />
            </Link>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              India's trusted platform for comparing diagnostic labs and booking tests at the best prices. All partner labs are NABL certified.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/search" className="text-xs text-muted-foreground hover:text-primary">Find Tests</Link></li>
              <li><Link to="/packages" className="text-xs text-muted-foreground hover:text-primary">Health Packages</Link></li>
              <li><Link to="/lab-registration" className="text-xs text-muted-foreground hover:text-primary">Partner With Us</Link></li>
              <li><Link to="/login" className="text-xs text-muted-foreground hover:text-primary">Login / Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">Contact Us</h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <a href="tel:1800-XXX-XXXX" className="text-xs text-muted-foreground hover:text-primary">1800-XXX-XXXX</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <a href="mailto:support@labsetu.com" className="text-xs text-muted-foreground hover:text-primary">support@labsetu.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">Kolkata, India</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li><Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/refund" className="text-xs text-muted-foreground hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LabSetu. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
