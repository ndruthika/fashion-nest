import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Package, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useAllOrders, useUpdateOrderStatus } from "../hooks/useOrders";
import type { Order, OrderStatus } from "../types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-accent/15 text-accent border border-accent/30",
  confirmed: "bg-primary/10 text-primary border border-primary/30",
  shipped: "bg-secondary text-secondary-foreground border border-border",
  delivered: "bg-primary/20 text-primary border border-primary/40",
  cancelled: "bg-destructive/10 text-destructive border border-destructive/30",
  paid: "bg-accent/15 text-accent border border-accent/30",
  processing: "bg-primary/10 text-primary border border-primary/30",
};

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(ts: bigint) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Number(ts) / 1_000_000));
}

function formatPrice(cents: bigint) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(cents) / 100);
}

function truncatePrincipal(p: string) {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}

const STATUS_COUNTS_KEYS = ["all", ...STATUSES] as const;

export default function AdminOrdersPage() {
  const { isAdmin, isLoadingProfile } = useAuth();
  const { data: orders, isLoading } = useAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmChange, setConfirmChange] = useState<{
    orderId: bigint;
    status: OrderStatus;
    label: string;
  } | null>(null);

  if (isLoadingProfile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl mb-4">Access Denied</h2>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const allOrders = orders ?? [];

  const filtered = allOrders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.id.toString().includes(search) ||
      (o.userId ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = allOrders.filter((o) => o.status === s).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const requestStatusChange = (orderId: bigint, status: OrderStatus) => {
    setConfirmChange({
      orderId,
      status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    });
  };

  const handleConfirmedStatusChange = async () => {
    if (!confirmChange) return;
    try {
      await updateStatusMutation.mutateAsync({
        orderId: confirmChange.orderId,
        status: confirmChange.status,
      });
      toast.success(`Order marked as ${confirmChange.status}`);
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setConfirmChange(null);
    }
  };

  return (
    <div className="bg-background min-h-screen" data-ocid="admin_orders.page">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-medium">
            Admin
          </p>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            {allOrders.length} total orders
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Status Summary Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_COUNTS_KEYS.map((s) => {
            const count =
              s === "all" ? allOrders.length : (statusCounts[s] ?? 0);
            const isActive = statusFilter === s;
            return (
              <button
                type="button"
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted/50"
                }`}
                data-ocid={`admin_orders.filter.${s}`}
              >
                <span className="capitalize">{s === "all" ? "All" : s}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-primary-foreground/20" : "bg-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID or customer…"
            className="pl-9"
            data-ocid="admin_orders.search_input"
          />
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
            <div className="p-4 border-b border-border bg-muted/30">
              <Skeleton className="h-4 w-48" />
            </div>
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="px-4 py-3 border-b border-border last:border-0"
              >
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="h-7 w-7" />}
            title="No orders found"
            description={
              search || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "Orders will appear here when customers purchase."
            }
            data-ocid="admin_orders.empty_state"
          />
        ) : (
          <div
            className="bg-card rounded-xl border border-border overflow-hidden shadow-card"
            data-ocid="admin_orders.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Order ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Customer
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Items
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order: Order, i: number) => (
                    <tr
                      key={order.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors duration-150"
                      data-ocid={`admin_orders.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{order.id.toString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground whitespace-nowrap text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">
                          {truncatePrincipal(order.userId ?? "")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground hidden md:table-cell tabular-nums">
                        {order.items.length}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                        {formatPrice(
                          order.totalPrice ?? order.totalInCents ?? 0n,
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(v) =>
                              requestStatusChange(order.id, v as OrderStatus)
                            }
                          >
                            <SelectTrigger
                              className="h-7 w-28 text-xs"
                              data-ocid={`admin_orders.status_select.${i + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="capitalize text-xs"
                                >
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-muted-foreground hover:text-foreground text-xs h-7 px-2"
                            data-ocid={`admin_orders.view_button.${i + 1}`}
                          >
                            <Link
                              to="/orders/$id"
                              params={{ id: order.id.toString() }}
                            >
                              View
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-muted/20 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {allOrders.length} orders
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Change Confirmation */}
      <AlertDialog
        open={!!confirmChange}
        onOpenChange={() => setConfirmChange(null)}
      >
        <AlertDialogContent data-ocid="admin_orders.confirm_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Update Order Status
            </AlertDialogTitle>
            <AlertDialogDescription>
              Mark order #{confirmChange?.orderId.toString()} as{" "}
              <strong>{confirmChange?.label}</strong>? This will notify the
              customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_orders.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedStatusChange}
              disabled={updateStatusMutation.isPending}
              className="bg-primary text-primary-foreground"
              data-ocid="admin_orders.confirm_button"
            >
              {updateStatusMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                `Mark as ${confirmChange?.label}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
