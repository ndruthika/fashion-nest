import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import OrderTypes "../types/orders";
import CatalogTypes "../types/catalog";
import Common "../types/common";
import OrderLib "../lib/orders";

mixin (
  accessControlState : AccessControl.AccessControlState,
  carts : Map.Map<Principal, List.List<OrderTypes.CartItem>>,
  orders : Map.Map<Common.OrderId, OrderTypes.Order>,
  products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
  counters : Common.OrderCounters,
) {
  // ─── Cart ─────────────────────────────────────────────────────────────────

  public query ({ caller }) func getCart() : async OrderTypes.Cart {
    OrderLib.getCart(carts, caller, products);
  };

  public shared ({ caller }) func addToCart(
    productId : Common.ProductId,
    size : Text,
    color : Text,
    quantity : Nat,
  ) : async Common.CartItemId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Authentication required");
    };
    let id = OrderLib.addToCart(carts, counters.nextCartItemId, caller, productId, size, color, quantity, products);
    counters.nextCartItemId += 1;
    id;
  };

  public shared ({ caller }) func updateCartItem(
    itemId : Common.CartItemId,
    quantity : Nat,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Authentication required");
    };
    OrderLib.updateCartItem(carts, caller, itemId, quantity);
  };

  public shared ({ caller }) func removeFromCart(itemId : Common.CartItemId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Authentication required");
    };
    OrderLib.removeFromCart(carts, caller, itemId);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Authentication required");
    };
    OrderLib.clearCart(carts, caller);
  };

  // ─── Orders ───────────────────────────────────────────────────────────────

  public shared ({ caller }) func createOrder(input : OrderTypes.CreateOrderInput) : async OrderTypes.Order {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Authentication required");
    };
    let order = OrderLib.createOrder(orders, counters.nextOrderId, carts, caller, input, products);
    counters.nextOrderId += 1;
    order;
  };

  public query ({ caller }) func getOrder(id : Common.OrderId) : async ?OrderTypes.Order {
    switch (OrderLib.getOrder(orders, id)) {
      case null null;
      case (?order) {
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);
        if (Principal.equal(order.buyer, caller) or isAdmin) {
          ?order;
        } else {
          Runtime.trap("Unauthorized");
        };
      };
    };
  };

  public query ({ caller }) func getMyOrders() : async [OrderTypes.Order] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Authentication required");
    };
    OrderLib.getUserOrders(orders, caller);
  };

  public query ({ caller }) func getAllOrders() : async [OrderTypes.Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
    OrderLib.getAllOrders(orders);
  };

  public shared ({ caller }) func updateOrderStatus(
    id : Common.OrderId,
    status : OrderTypes.OrderStatus,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Admin access required");
    };
    OrderLib.updateOrderStatus(orders, id, status);
  };

  public shared ({ caller }) func updateOrderStripeSession(
    id : Common.OrderId,
    sessionId : Text,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Authentication required");
    };
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    switch (OrderLib.getOrder(orders, id)) {
      case null false;
      case (?order) {
        if (not (Principal.equal(order.buyer, caller) or isAdmin)) {
          Runtime.trap("Unauthorized");
        };
        OrderLib.updateOrderStripeSession(orders, id, sessionId);
      };
    };
  };
};
