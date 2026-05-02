import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StoredOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface StoredOrder {
  id: string;
  date: string;
  items: StoredOrderItem[];
  total: number;
  address: {
    fullName: string;
    city: string;
    state: string;
  };
  status: string;
}

function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fashionNest_orders");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredOrder[];
        setOrders(parsed);
      }
    } catch {
      setOrders([]);
    }
  }, []);

  return (
    <div className="bg-background min-h-screen" data-ocid="orders.page">
      <div className="bg-card border-b border-border py-10">
        <div className="container mx-auto px-4 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Your
            </p>
            <h1 className="font-display text-4xl font-medium text-foreground">
              Orders
            </h1>
          </div>
          {orders.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-7 w-7" />}
            title="No orders yet"
            description="When you place an order, it'll appear here. Start shopping to build your wardrobe."
            action={{
              label: "Browse Collection",
              onClick: () => {
                window.location.href = "/products";
              },
            }}
            data-ocid="orders.empty_state"
          />
        ) : (
          <div className="max-w-3xl space-y-4" data-ocid="orders.list">
            {orders.map((order, i) => (
              <div
                key={order.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-elevated transition-smooth"
                data-ocid={`orders.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-medium text-foreground">
                        Order #{order.id}
                      </span>
                      <Badge className="bg-accent/15 text-accent border-0 capitalize text-xs">
                        Order Confirmed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-semibold text-lg text-foreground">
                      {formatINR(order.total)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Item thumbnails */}
                <div className="px-5 pb-4 flex items-center gap-2 overflow-x-auto">
                  {order.items.slice(0, 5).map((item, j) => (
                    <div
                      key={`${item.productId}-${j}`}
                      className="flex-shrink-0 w-12 h-14 rounded bg-muted overflow-hidden"
                      title={item.productName}
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="flex-shrink-0 w-12 h-14 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-5 py-3 flex justify-between items-center bg-muted/20">
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {order.address?.city
                      ? `Ships to ${order.address.city}, ${order.address.state}`
                      : "—"}
                  </p>
                  <div className="ml-auto">
                    <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                      Estimated delivery: 3–5 business days{" "}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Demo note */}
            <div className="mt-6 bg-accent/5 border border-accent/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">
                🎓{" "}
                <span className="font-medium text-foreground">Demo Mode</span> —
                These are simulated orders for the college project demo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
