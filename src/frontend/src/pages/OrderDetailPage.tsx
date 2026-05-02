import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import PriceDisplay from "../components/PriceDisplay";
import { useOrder } from "../hooks/useOrders";
import type { OrderStatus } from "../types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-accent/15 text-accent",
  shipped: "bg-secondary text-secondary-foreground",
  delivered: "bg-accent/20 text-accent",
  cancelled: "bg-destructive/15 text-destructive",
  paid: "bg-accent/15 text-accent",
  processing: "bg-primary/10 text-primary",
};

const STATUS_STEPS: {
  key: OrderStatus;
  label: string;
  icon: LucideIcon;
  desc: string;
}[] = [
  {
    key: "pending",
    label: "Order Placed",
    icon: Circle,
    desc: "We received your order",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
    desc: "Payment processed",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
    desc: "On its way to you",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: Package,
    desc: "Arrived at destination",
  },
];

const SHIPPING_THRESHOLD = 420000; // ₹4,200 in paise
const SHIPPING_COST = 125000; // ₹1,250 in paise
const TAX_RATE = 0.18; // Indian GST 18%

export default function OrderDetailPage() {
  const params = useParams({ from: "/orders/$id" });
  const { data: order, isLoading } = useOrder(BigInt(params.id));

  if (isLoading)
    return (
      <LoadingSpinner
        className="py-32"
        data-ocid="order_detail.loading_state"
      />
    );

  if (!order) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="order_detail.error_state"
      >
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-medium mb-2">
          Order not found
        </h2>
        <p className="text-muted-foreground mb-6">
          We couldn't locate this order in your account.
        </p>
        <Button asChild className="bg-primary text-primary-foreground">
          <Link to="/orders" data-ocid="order_detail.back_to_orders_button">
            Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const subtotal = Number(order.totalPrice);
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-background min-h-screen" data-ocid="order_detail.page">
      {/* Page header */}
      <div className="bg-card border-b border-border py-10">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-3 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link to="/orders" data-ocid="order_detail.back_button">
              <ArrowLeft className="mr-1 h-4 w-4" /> All Orders
            </Link>
          </Button>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="font-display text-3xl font-medium text-foreground">
              Order #{order.id.toString()}
            </h1>
            <Badge
              className={`${STATUS_COLORS[order.status]} border-0 capitalize`}
            >
              {order.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on{" "}
            {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Order status timeline */}
        {order.status !== "cancelled" && (
          <div
            className="bg-card rounded-xl border border-border p-6 mb-8"
            data-ocid="order_detail.timeline"
          >
            <h2 className="font-display text-base font-medium text-foreground mb-6">
              Order Progress
            </h2>
            <div className="relative">
              {/* Track line */}
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-accent transition-all duration-700"
                style={{
                  width:
                    currentStep >= 0
                      ? `${(currentStep / (STATUS_STEPS.length - 1)) * (100 - 10 / STATUS_STEPS.length)}%`
                      : "0%",
                }}
              />
              <div className="relative grid grid-cols-4 gap-2">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const Icon = done ? CheckCircle2 : step.icon;
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center gap-2 text-center"
                      data-ocid={`order_detail.step.${i + 1}`}
                    >
                      <div
                        className={`relative z-10 h-10 w-10 rounded-full border-2 flex items-center justify-center transition-smooth ${
                          done
                            ? "bg-accent border-accent text-accent-foreground"
                            : "bg-card border-border text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground hidden sm:block leading-snug mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-display text-xl font-medium text-foreground">
              Items ({order.items.length})
            </h2>
            {order.items.map((item, i) => (
              <div
                key={`${item.productId}-${i}`}
                className="bg-card rounded-lg border border-border p-4 flex gap-4"
                data-ocid={`order_detail.item.${i + 1}`}
              >
                <div className="w-16 h-20 flex-shrink-0 rounded bg-muted overflow-hidden">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to="/products/$id"
                    params={{ id: item.productId.toString() }}
                    className="font-display font-medium text-foreground hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug block"
                  >
                    {item.productName}
                  </Link>
                  <div className="flex gap-3 mt-1">
                    {item.size && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {item.color}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity.toString()}
                    </p>
                    <PriceDisplay
                      price={Number(item.price) * Number(item.quantity)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Price breakdown */}
            <div
              className="bg-card rounded-lg border border-border p-5"
              data-ocid="order_detail.price_summary"
            >
              <h2 className="font-display text-lg font-medium text-foreground mb-4">
                Price Breakdown
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <PriceDisplay price={subtotal} size="sm" />
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span
                    className={shipping === 0 ? "text-accent font-medium" : ""}
                  >
                    {shipping === 0 ? (
                      "Free"
                    ) : (
                      <PriceDisplay price={SHIPPING_COST} size="sm" />
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <PriceDisplay price={tax} size="sm" />
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <PriceDisplay price={total} size="md" />
                </div>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-accent mt-3 bg-accent/10 px-2 py-1 rounded text-center">
                  ✓ Free shipping applied — order over ₹4,200
                </p>
              )}
            </div>

            {/* Shipping address */}
            {order.shippingAddress && (
              <div
                className="bg-card rounded-lg border border-border p-5"
                data-ocid="order_detail.shipping_address"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-display text-lg font-medium text-foreground">
                    Shipping Address
                  </h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p className="font-medium text-foreground">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && (
                    <p>{order.shippingAddress.line2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            )}

            {/* Help */}
            <div className="bg-muted/40 rounded-lg border border-border p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Need help?</p>
              <p>
                For questions about your order, contact our team at{" "}
                <a
                  href="mailto:support@fashionnest.com"
                  className="text-accent hover:underline"
                >
                  support@fashionnest.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
