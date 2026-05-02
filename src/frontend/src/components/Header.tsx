import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/products?category=new-arrivals" },
  { label: "Collections", href: "/lookbook" },
  { label: "Women", href: "/products?category=women" },
  { label: "Men", href: "/products?category=men" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Designers", href: "/products?category=designers" },
  { label: "Sale", href: "/products?category=sale" },
];

export default function Header() {
  const { isAuthenticated, login, logout, isAdmin } = useAuth();
  const { cartCount } = useCartContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.navigate({ to: "/products", search: { q: searchQuery } });
      setSearchQuery("");
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-card border-b border-border shadow-xs"
      data-ocid="header"
    >
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center gap-4">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-ocid="header.mobile_menu_toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Logo */}
          <Link to="/" className="shrink-0 mr-4" data-ocid="header.logo_link">
            <img
              src="/assets/fashion-nest-logo.png"
              alt="Fashion Nest"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-6 flex-1"
            data-ocid="header.nav"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap"
                data-ocid={`header.nav_link.${link.label.toLowerCase().replace(/\s+/g, "_")}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center relative max-w-xs flex-1"
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands…"
              className="pl-9 h-9 bg-secondary border-0 text-sm"
              data-ocid="header.search_input"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Account"
                    data-ocid="header.account_button"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/account" data-ocid="header.account_link">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" data-ocid="header.orders_link">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" data-ocid="header.admin_link">
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                          Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    data-ocid="header.logout_button"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={login}
                aria-label="Sign in"
                data-ocid="header.login_button"
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                data-ocid="header.wishlist_button"
              >
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link
                to="/cart"
                aria-label={`Cart (${cartCount} items)`}
                data-ocid="header.cart_button"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs border-0 rounded-full">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t border-border py-4 space-y-1"
            data-ocid="header.mobile_menu"
          >
            <form
              onSubmit={handleSearch}
              className="flex items-center relative mb-3"
            >
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="pl-9 h-9 bg-secondary border-0"
                data-ocid="header.mobile_search_input"
              />
            </form>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2 px-2 text-sm font-body text-foreground hover:text-accent transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
