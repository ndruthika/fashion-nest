import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartContext } from "../context/CartContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type CheckoutStep = "address" | "review" | "payment" | "complete";

interface Address {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(paise / 100));
}

function generateOrderId(): string {
  return `FN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: CheckoutStep }) {
  const steps: { key: CheckoutStep; label: string }[] = [
    { key: "address", label: "Shipping" },
    { key: "review", label: "Review" },
    { key: "payment", label: "Payment" },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex items-center gap-1 mt-4">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1">
          <div
            className={`text-xs px-2.5 py-1 rounded-full border transition-smooth font-body font-medium ${
              i < currentIdx
                ? "bg-accent/20 border-accent/30 text-accent"
                : i === currentIdx
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted border-border text-muted-foreground"
            }`}
          >
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-0.5" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Order Summary Panel ─────────────────────────────────────────────────────
function OrderSummaryPanel() {
  const { localCart } = useCartContext();
  const subtotal = localCart.reduce(
    (s, i) => s + Number(i.price) * Number(i.quantity),
    0,
  );
  const FREE_SHIPPING_THRESHOLD = 500000; // ₹5,000 in paise
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12500; // ₹125
  const total = subtotal + shipping;

  return (
    <div
      className="bg-card rounded-lg border border-border p-6 sticky top-24"
      data-ocid="checkout.order_summary"
    >
      <h2 className="font-display text-lg font-medium text-foreground mb-4">
        Order Summary
      </h2>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
        {localCart.map((item, i) => (
          <div
            key={`${String(item.productId)}-${item.size}-${item.color}`}
            className="flex gap-3 items-center"
            data-ocid={`checkout.order_item.${i + 1}`}
          >
            <div className="w-12 h-14 flex-shrink-0 rounded bg-muted overflow-hidden">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.productName}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.size} · {item.color} · Qty {item.quantity.toString()}
              </p>
            </div>
            <span className="text-sm font-body font-medium text-foreground whitespace-nowrap">
              {formatINR(Number(item.price) * Number(item.quantity))}
            </span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-2 mt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="text-accent font-medium">Free</span>
          ) : (
            <span>{formatINR(shipping)}</span>
          )}
        </div>
        <Separator />
        <div className="flex justify-between font-medium text-foreground text-base pt-1">
          <span>Total</span>
          <span className="font-semibold text-lg">{formatINR(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation screen ──────────────────────────────────────────────────────
function ConfirmationScreen({ orderId }: { orderId: string }) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="checkout.success_state"
    >
      <div className="bg-card border-b border-border py-10">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Order Confirmed
          </p>
          <h1 className="font-display text-4xl font-medium text-foreground">
            Thank You!
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-8 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-9 w-9 text-accent" />
          </div>
          <h2 className="font-display text-2xl font-medium text-foreground mb-1">
            Your order is confirmed!
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            We've received your order and will process it right away.
          </p>
          <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Order #
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {orderId}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-medium text-foreground">
              Estimated Delivery
            </h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Expected by{" "}
            <span className="text-foreground font-medium">
              {formattedDelivery}
            </span>
          </p>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            🎓 <span className="font-medium text-foreground">Demo Mode</span> —
            This is a simulated order for the college project demo. No real
            payment was processed.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            className="flex-1 bg-primary text-primary-foreground font-body"
            size="lg"
            data-ocid="checkout.view_orders_button"
          >
            <Link to="/orders">View My Orders</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="font-body"
            data-ocid="checkout.continue_shopping_button"
          >
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { localCart, clearLocalCart } = useCartContext();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState<Address>({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const subtotal = localCart.reduce(
    (s, i) => s + Number(i.price) * Number(i.quantity),
    0,
  );
  const FREE_SHIPPING_THRESHOLD = 500000;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12500;
  const total = subtotal + shipping;

  // Empty cart guard
  if (localCart.length === 0 && step !== "complete") {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="checkout.page"
      >
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-medium mb-4">
            Your cart is empty
          </h2>
          <Button
            asChild
            className="bg-primary text-primary-foreground font-body"
          >
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (step === "complete" && confirmedOrderId) {
    return <ConfirmationScreen orderId={confirmedOrderId} />;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.fullName ||
      !address.line1 ||
      !address.city ||
      !address.postalCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = generateOrderId();
    const orderData = {
      id: orderId,
      date: new Date().toISOString(),
      items: localCart.map((item) => ({
        productId: item.productId.toString(),
        productName: item.productName,
        productImage: item.productImage,
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: item.size,
        color: item.color,
      })),
      total,
      address,
      status: "confirmed",
    };

    // Save to localStorage
    const existing = JSON.parse(
      localStorage.getItem("fashionNest_orders") ?? "[]",
    ) as unknown[];
    localStorage.setItem(
      "fashionNest_orders",
      JSON.stringify([orderData, ...existing]),
    );

    clearLocalCart();
    setConfirmedOrderId(orderId);
    setStep("complete");
    setIsSubmitting(false);
  };

  return (
    <div className="bg-background min-h-screen" data-ocid="checkout.page">
      <div className="bg-card border-b border-border py-10">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Secure
          </p>
          <h1 className="font-display text-4xl font-medium text-foreground">
            Checkout
          </h1>
          <StepIndicator step={step} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main form area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {step === "address" && (
              <form
                onSubmit={handleAddressSubmit}
                className="bg-card rounded-xl border border-border p-6 space-y-5"
                data-ocid="checkout.address_form"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-xl font-medium text-foreground">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="font-body text-sm">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, fullName: e.target.value }))
                      }
                      placeholder="Priya Sharma"
                      className="mt-1"
                      data-ocid="checkout.full_name_input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="line1" className="font-body text-sm">
                      Address Line 1 *
                    </Label>
                    <Input
                      id="line1"
                      value={address.line1}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, line1: e.target.value }))
                      }
                      placeholder="123, MG Road"
                      className="mt-1"
                      data-ocid="checkout.address_line1_input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2" className="font-body text-sm">
                      Address Line 2
                    </Label>
                    <Input
                      id="line2"
                      value={address.line2}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, line2: e.target.value }))
                      }
                      placeholder="Apartment, area, landmark"
                      className="mt-1"
                      data-ocid="checkout.address_line2_input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="font-body text-sm">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, city: e.target.value }))
                        }
                        placeholder="Chennai"
                        className="mt-1"
                        data-ocid="checkout.city_input"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="font-body text-sm">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={address.state}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, state: e.target.value }))
                        }
                        placeholder="Tamil Nadu"
                        className="mt-1"
                        data-ocid="checkout.state_input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode" className="font-body text-sm">
                        PIN Code *
                      </Label>
                      <Input
                        id="postalCode"
                        value={address.postalCode}
                        onChange={(e) =>
                          setAddress((a) => ({
                            ...a,
                            postalCode: e.target.value,
                          }))
                        }
                        placeholder="600001"
                        className="mt-1"
                        data-ocid="checkout.postal_code_input"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="font-body text-sm">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={address.phone}
                        onChange={(e) =>
                          setAddress((a) => ({ ...a, phone: e.target.value }))
                        }
                        placeholder="+91 98765 43210"
                        className="mt-1"
                        data-ocid="checkout.phone_input"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-body"
                  size="lg"
                  data-ocid="checkout.address_submit_button"
                >
                  Continue to Review
                </Button>
              </form>
            )}

            {/* Step 2: Review */}
            {step === "review" && (
              <div
                className="bg-card rounded-xl border border-border p-6 space-y-5"
                data-ocid="checkout.review_section"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-xl font-medium text-foreground">
                    Review Your Order
                  </h2>
                </div>

                <div className="bg-muted/40 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5 font-body">
                    Shipping To
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {address.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.line1}
                    {address.line2 ? `, ${address.line2}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-accent underline underline-offset-2 mt-1 hover:text-accent/80 font-body"
                    onClick={() => setStep("address")}
                    data-ocid="checkout.edit_address_button"
                  >
                    Edit address
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-body">
                    {localCart.length}{" "}
                    {localCart.length === 1 ? "Item" : "Items"}
                  </p>
                  {localCart.map((item, i) => (
                    <div
                      key={`${String(item.productId)}-${item.size}-${item.color}`}
                      className="flex gap-3 items-center py-2 border-b border-border last:border-0"
                      data-ocid={`checkout.review_item.${i + 1}`}
                    >
                      <div className="w-14 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Size: {item.size} · Color: {item.color}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity.toString()}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {formatINR(Number(item.price) * Number(item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep("address")}
                    className="font-body"
                    data-ocid="checkout.back_button"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-primary text-primary-foreground font-body gap-2"
                    size="lg"
                    onClick={() => setStep("payment")}
                    data-ocid="checkout.proceed_to_payment_button"
                  >
                    <CreditCard className="h-4 w-4" />
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment (Demo) */}
            {step === "payment" && (
              <div
                className="bg-card rounded-xl border border-border p-6 space-y-5"
                data-ocid="checkout.payment_section"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-accent" />
                  <h2 className="font-display text-xl font-medium text-foreground">
                    Demo Payment
                  </h2>
                </div>

                {/* Demo notice */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-1">
                    🎓 Demo Mode Active
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This is a demo checkout for the college project. No real
                    payment will be processed. Click "Place Order" to simulate a
                    successful order.
                  </p>
                </div>

                {/* Fake card fields */}
                <div className="space-y-4">
                  <div>
                    <Label className="font-body text-sm">Card Number</Label>
                    <Input
                      value="4242 4242 4242 4242"
                      readOnly
                      className="mt-1 font-mono bg-muted/50 text-muted-foreground"
                      data-ocid="checkout.card_number_input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-body text-sm">Expiry Date</Label>
                      <Input
                        value="12/28"
                        readOnly
                        className="mt-1 font-mono bg-muted/50 text-muted-foreground"
                        data-ocid="checkout.expiry_input"
                      />
                    </div>
                    <div>
                      <Label className="font-body text-sm">CVV</Label>
                      <Input
                        value="123"
                        readOnly
                        className="mt-1 font-mono bg-muted/50 text-muted-foreground"
                        data-ocid="checkout.cvv_input"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted/40 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-body">
                    Total Amount
                  </span>
                  <span className="text-lg font-semibold text-foreground font-body">
                    {formatINR(total)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("review")}
                    className="font-body"
                    data-ocid="checkout.back_button"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-body gap-2 text-base"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    data-ocid="checkout.pay_button"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Place Order (Demo)
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground font-body">
                  🔒 This is a demo checkout. No real payment will be processed.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <OrderSummaryPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
