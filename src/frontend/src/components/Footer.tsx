import { Link } from "@tanstack/react-router";
import { SiInstagram, SiPinterest, SiX } from "react-icons/si";

const SHOP_LINKS = [
  { label: "New Arrivals", to: "/products?category=new-arrivals" },
  { label: "Women", to: "/products?category=women" },
  { label: "Men", to: "/products?category=men" },
  { label: "Accessories", to: "/products?category=accessories" },
  { label: "Sale", to: "/products?sale=true" },
];

const HELP_LINKS = [
  { label: "Browse All Products", to: "/products" },
  { label: "Shipping & Returns", to: "/products" },
  { label: "My Account", to: "/account" },
  { label: "My Orders", to: "/orders" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "fashionnest",
  );

  return (
    <footer
      className="bg-card border-t border-border mt-auto"
      data-ocid="footer"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="font-display text-3xl font-semibold tracking-tight text-foreground"
            >
              Fashion Nest
            </Link>
            <p className="mt-3 text-muted-foreground text-sm max-w-xs leading-relaxed">
              Curated collections for effortless luxury. Discover the world's
              finest designers, thoughtfully selected for the modern wardrobe.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <SiPinterest className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium text-foreground mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-medium text-foreground mb-4">
              Help
            </h4>
            <ul className="space-y-2">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-4">
            <Link
              to="/"
              className="hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
