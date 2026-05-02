import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useAllOrders } from "../hooks/useOrders";
import { useProducts } from "../hooks/useProducts";
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

function formatPrice(cents: bigint) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(cents) / 100);
}

function formatDate(ts: bigint) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Number(ts) / 1_000_000));
}

function truncatePrincipal(p: string) {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
  subtitle?: string;
  ocid: string;
}

function StatCard({
  title,
  value,
  icon,
  loading,
  subtitle,
  ocid,
}: StatCardProps) {
  return (
    <Card className="shadow-card" data-ocid={ocid}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-9 w-24 mb-1" />
        ) : (
          <p className="font-display text-3xl font-semibold text-foreground tabular-nums">
            {value}
          </p>
        )}
        <p className="text-sm font-medium text-foreground mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const { isAdmin, isAuthenticated, isLoadingProfile, login } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const { data: products, isLoading: productsLoading } = useProducts();

  useEffect(() => {
    if (!isLoadingProfile && isAuthenticated && !isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAdmin, isAuthenticated, isLoadingProfile, navigate]);

  if (isLoadingProfile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center bg-background"
        data-ocid="admin.page"
      >
        <div className="text-center max-w-sm px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-5">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in with your admin account to continue.
          </p>
          <Button
            onClick={login}
            className="bg-primary text-primary-foreground"
            data-ocid="admin.login_button"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingOrders = (orders ?? []).filter(
    (o: Order) => o.status === "pending",
  );
  const totalRevenue = (orders ?? [])
    .filter((o: Order) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.totalPrice), 0);

  const recentOrders = [...(orders ?? [])]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background" data-ocid="admin.page">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-medium">
            Admin
          </p>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Fashion Nest store overview
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={products?.length ?? 0}
            icon={<Package className="h-5 w-5" />}
            loading={productsLoading}
            subtitle={`${products?.filter((p) => !p.isActive).length ?? 0} inactive`}
            ocid="admin.stat.products"
          />
          <StatCard
            title="Total Orders"
            value={orders?.length ?? 0}
            icon={<ShoppingBag className="h-5 w-5" />}
            loading={ordersLoading}
            ocid="admin.stat.orders"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders.length}
            icon={<Clock className="h-5 w-5" />}
            loading={ordersLoading}
            subtitle="Awaiting fulfillment"
            ocid="admin.stat.pending"
          />
          <StatCard
            title="Total Revenue"
            value={
              ordersLoading
                ? ""
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(totalRevenue / 100)
            }
            icon={<TrendingUp className="h-5 w-5" />}
            loading={ordersLoading}
            subtitle="Excluding cancelled"
            ocid="admin.stat.revenue"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/products" data-ocid="admin.products_link">
              <Card className="group hover:shadow-elevated transition-smooth cursor-pointer">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Manage Products
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Products, categories & inventory
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 shrink-0" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/admin/orders" data-ocid="admin.orders_link">
              <Card className="group hover:shadow-elevated transition-smooth cursor-pointer">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Manage Orders
                      </p>
                      <p className="text-sm text-muted-foreground">
                        View, filter & update order status
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Recent Orders
            </h2>
            <Link to="/admin/orders" data-ocid="admin.view_all_orders_link">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <Card className="shadow-card overflow-hidden">
            {ordersLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Skeleton key={n} className="h-12 w-full" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <CardContent className="py-14 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground mb-1">
                  No orders yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Orders will appear here when customers purchase
                </p>
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  data-ocid="admin.recent_orders_table"
                >
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Order
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Date
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                        Customer
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Total
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order: Order, idx: number) => (
                      <tr
                        key={order.id.toString()}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors duration-150"
                        data-ocid={`admin.recent_order.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{order.id.toString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="font-mono text-xs text-muted-foreground">
                            {truncatePrincipal(order.userId ?? "")}
                          </span>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
