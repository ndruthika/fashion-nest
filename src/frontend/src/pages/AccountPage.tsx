import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner";
import PriceDisplay from "../components/PriceDisplay";
import { useAuth } from "../hooks/useAuth";
import { useBackendActor } from "../hooks/useBackendActor";
import { useMyOrders } from "../hooks/useOrders";
import type { OrderStatus, SavedAddress } from "../types";

type AnyActor = Record<string, (...args: unknown[]) => Promise<unknown>>;

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-accent/15 text-accent",
  shipped: "bg-secondary text-secondary-foreground",
  delivered: "bg-accent/20 text-accent",
  cancelled: "bg-destructive/15 text-destructive",
  paid: "bg-accent/15 text-accent",
  processing: "bg-primary/10 text-primary",
};

const EMPTY_ADDRESS: Omit<SavedAddress, "id"> = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  isDefault: false,
};

function AddressCard({
  address,
  onEdit,
  onDelete,
  index,
}: {
  address: SavedAddress;
  onEdit: (a: SavedAddress) => void;
  onDelete: (id: string) => void;
  index: number;
}) {
  return (
    <div
      className="bg-card rounded-lg border border-border p-5 flex flex-col gap-3"
      data-ocid={`account.address_item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-medium text-foreground text-sm">
              {address.fullName}
            </p>
            {address.isDefault && (
              <Badge className="text-xs bg-accent/15 text-accent border-0 py-0">
                Default
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(address)}
            aria-label="Edit address"
            data-ocid={`account.edit_address_button.${index + 1}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(address.id ?? "")}
            aria-label="Delete address"
            data-ocid={`account.delete_address_button.${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AddressDialog({
  open,
  onClose,
  initial,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  initial: Omit<SavedAddress, "id"> & { id?: string };
  onSave: (data: Omit<SavedAddress, "id"> & { id?: string }) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(initial);
  useEffect(() => setForm(initial), [initial]);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const isEdit = !!initial.id;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" data-ocid="account.address_dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="addr-name">Full Name</Label>
            <Input
              id="addr-name"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Jane Doe"
              className="mt-1"
              data-ocid="account.address_fullname_input"
            />
          </div>
          <div>
            <Label htmlFor="addr-line1">Address Line 1</Label>
            <Input
              id="addr-line1"
              value={form.line1}
              onChange={(e) => set("line1", e.target.value)}
              placeholder="123 Main St"
              className="mt-1"
              data-ocid="account.address_line1_input"
            />
          </div>
          <div>
            <Label htmlFor="addr-line2">Address Line 2 (optional)</Label>
            <Input
              id="addr-line2"
              value={form.line2}
              onChange={(e) => set("line2", e.target.value)}
              placeholder="Apt 4B"
              className="mt-1"
              data-ocid="account.address_line2_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="addr-city">City</Label>
              <Input
                id="addr-city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="New York"
                className="mt-1"
                data-ocid="account.address_city_input"
              />
            </div>
            <div>
              <Label htmlFor="addr-state">State</Label>
              <Input
                id="addr-state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="NY"
                className="mt-1"
                data-ocid="account.address_state_input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="addr-postal">Postal Code</Label>
              <Input
                id="addr-postal"
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
                placeholder="10001"
                className="mt-1"
                data-ocid="account.address_postal_input"
              />
            </div>
            <div>
              <Label htmlFor="addr-country">Country</Label>
              <Input
                id="addr-country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder="US"
                className="mt-1"
                data-ocid="account.address_country_input"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="addr-default"
              checked={form.isDefault}
              onCheckedChange={(c) => set("isDefault", !!c)}
              data-ocid="account.address_default_checkbox"
            />
            <Label
              htmlFor="addr-default"
              className="cursor-pointer font-normal"
            >
              Set as default address
            </Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-primary text-primary-foreground"
              onClick={() => onSave(form)}
              disabled={isSaving || !form.fullName || !form.line1 || !form.city}
              data-ocid="account.address_save_button"
            >
              {isSaving ? (
                <LoadingSpinner size="sm" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Address"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="account.address_cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AccountPage() {
  const {
    isAuthenticated,
    profile,
    login,
    logout,
    isLoadingProfile,
    saveProfile,
  } = useAuth();
  const { data: orders } = useMyOrders();
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [addressDialog, setAddressDialog] = useState<{
    open: boolean;
    data: Omit<SavedAddress, "id"> & { id?: string };
  }>({ open: false, data: EMPTY_ADDRESS });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setEmail(profile.email);
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const saveAddressMutation = useMutation({
    mutationFn: async (addr: Omit<SavedAddress, "id"> & { id?: string }) => {
      if (!actor) throw new Error("Not connected");
      if (addr.id) {
        await (actor as unknown as AnyActor).updateSavedAddress({
          ...addr,
          id: addr.id,
        });
      } else {
        await (actor as unknown as AnyActor).addSavedAddress(addr);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setAddressDialog({ open: false, data: EMPTY_ADDRESS });
      toast.success("Address saved");
    },
    onError: () => toast.error("Failed to save address"),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      await (actor as unknown as AnyActor).deleteSavedAddress(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Address removed");
    },
    onError: () => toast.error("Failed to remove address"),
  });

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="account.page"
      >
        <div className="text-center max-w-sm px-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-3xl font-medium mb-2">My Account</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to manage your profile, orders, wishlist, and saved
            addresses.
          </p>
          <Button
            className="bg-primary text-primary-foreground w-full"
            onClick={login}
            data-ocid="account.login_button"
          >
            Sign In with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) return <LoadingSpinner className="py-32" />;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProfile({ displayName, email, phone });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addresses = profile?.savedAddresses ?? [];

  return (
    <div className="bg-background min-h-screen" data-ocid="account.page">
      {/* Page header */}
      <div className="bg-card border-b border-border py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center text-accent text-xl font-display font-semibold flex-shrink-0">
              {(profile?.displayName?.[0] ?? "U").toUpperCase()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">
                Welcome back
              </p>
              <h1 className="font-display text-3xl font-medium text-foreground">
                {profile?.displayName || "Member"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              {
                href: "/orders",
                icon: Package,
                label: "Orders",
                count: orders?.length,
              },
              { href: "/wishlist", icon: Heart, label: "Wishlist" },
            ].map(({ href, icon: Icon, label, count }) => (
              <Link
                key={href}
                to={href as "/orders"}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 border-b-2 border-transparent hover:border-accent"
                data-ocid={`account.quick_link_${label.toLowerCase()}`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {count !== undefined && count > 0 && (
                  <Badge className="ml-1 text-xs h-5 px-1.5 bg-muted text-muted-foreground border-0">
                    {count}
                  </Badge>
                )}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <Tabs defaultValue="profile">
          <TabsList className="mb-8" data-ocid="account.tabs">
            <TabsTrigger value="profile" data-ocid="account.profile_tab">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" data-ocid="account.addresses_tab">
              <MapPin className="mr-2 h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="account.orders_tab">
              <Package className="mr-2 h-4 w-4" />
              Recent Orders
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div
              className="max-w-lg space-y-6"
              data-ocid="account.profile_section"
            >
              <div className="bg-card rounded-lg border border-border p-6 space-y-5">
                <h2 className="font-display text-xl font-medium text-foreground">
                  Personal Information
                </h2>
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                    data-ocid="account.display_name_input"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1"
                    data-ocid="account.email_input"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="mt-1"
                    data-ocid="account.phone_input"
                  />
                </div>
                <Separator />
                <div className="flex gap-3">
                  <Button
                    className="bg-primary text-primary-foreground font-body"
                    onClick={handleSave}
                    disabled={isSaving}
                    data-ocid="account.save_button"
                  >
                    {isSaving ? <LoadingSpinner size="sm" /> : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="gap-2 text-muted-foreground"
                    data-ocid="account.logout_button"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="max-w-2xl" data-ocid="account.addresses_section">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-medium text-foreground">
                  Saved Addresses
                </h2>
                <Button
                  className="bg-primary text-primary-foreground gap-2"
                  onClick={() =>
                    setAddressDialog({ open: true, data: EMPTY_ADDRESS })
                  }
                  data-ocid="account.add_address_button"
                >
                  <Plus className="h-4 w-4" />
                  Add Address
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div
                  className="text-center bg-card rounded-lg border border-border py-14 px-6"
                  data-ocid="account.addresses_empty_state"
                >
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-display text-lg font-medium text-foreground mb-1">
                    No addresses saved
                  </p>
                  <p className="text-sm text-muted-foreground mb-5">
                    Add a shipping address to speed up checkout.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setAddressDialog({ open: true, data: EMPTY_ADDRESS })
                    }
                    data-ocid="account.add_first_address_button"
                  >
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr, i) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      index={i}
                      onEdit={(a) => setAddressDialog({ open: true, data: a })}
                      onDelete={(id) => deleteAddressMutation.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div
              className="space-y-4 max-w-2xl"
              data-ocid="account.orders_section"
            >
              {!orders || orders.length === 0 ? (
                <div
                  className="text-center py-14 bg-card rounded-lg border border-border"
                  data-ocid="account.orders_empty_state"
                >
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="font-display text-lg font-medium text-foreground mb-1">
                    No orders yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-5">
                    Your Fashion Nest orders will appear here.
                  </p>
                  <Button
                    asChild
                    className="bg-primary text-primary-foreground"
                  >
                    <Link
                      to="/products"
                      data-ocid="account.browse_products_button"
                    >
                      Browse Products
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  {orders.slice(0, 5).map((order, i) => (
                    <div
                      key={order.id.toString()}
                      className="bg-card rounded-lg border border-border p-4 flex items-center justify-between gap-4 hover:shadow-card transition-smooth"
                      data-ocid={`account.order_item.${i + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground font-mono text-sm">
                            #{order.id.toString()}
                          </p>
                          <Badge
                            className={`${STATUS_COLORS[order.status]} border-0 capitalize text-xs`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""} ·{" "}
                          {new Date(
                            Number(order.createdAt) / 1_000_000,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <PriceDisplay
                          price={order.totalPrice ?? order.totalInCents ?? 0n}
                          size="md"
                        />
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to="/orders/$id"
                            params={{ id: order.id.toString() }}
                            data-ocid={`account.view_order_button.${i + 1}`}
                          >
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Button variant="outline" asChild>
                      <Link
                        to="/orders"
                        data-ocid="account.view_all_orders_button"
                        className="gap-2"
                      >
                        View All Orders <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddressDialog
        open={addressDialog.open}
        onClose={() => setAddressDialog({ open: false, data: EMPTY_ADDRESS })}
        initial={addressDialog.data}
        onSave={(data) => saveAddressMutation.mutate(data)}
        isSaving={saveAddressMutation.isPending}
      />
    </div>
  );
}
