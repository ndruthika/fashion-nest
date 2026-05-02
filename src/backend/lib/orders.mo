import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import OrderTypes "../types/orders";
import CatalogTypes "../types/catalog";
import Common "../types/common";

module {
  // ─── Cart ─────────────────────────────────────────────────────────────────

  public func getCart(
    carts : Map.Map<Principal, List.List<OrderTypes.CartItem>>,
    caller : Principal,
    _products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
  ) : OrderTypes.Cart {
    let items = switch (carts.get(caller)) {
      case (?list) list.toArray();
      case null [];
    };
    let total = items.foldLeft(0 : Nat, func(acc : Nat, item : OrderTypes.CartItem) : Nat = acc + item.priceInCents * item.quantity);
    { items; totalInCents = total };
  };

  public func addToCart(
    carts : Map.Map<Principal, List.List<OrderTypes.CartItem>>,
    nextItemId : Nat,
    caller : Principal,
    productId : Common.ProductId,
    size : Text,
    color : Text,
    quantity : Nat,
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
  ) : Common.CartItemId {
    let product = switch (products.get(productId)) {
      case (?p) p;
      case null Runtime.trap("Product not found");
    };
    let newItem : OrderTypes.CartItem = {
      id = nextItemId;
      productId;
      size;
      color;
      quantity;
      priceInCents = product.priceInCents;
    };
    let userCart = switch (carts.get(caller)) {
      case (?list) list;
      case null {
        let fresh = List.empty<OrderTypes.CartItem>();
        carts.add(caller, fresh);
        fresh;
      };
    };
    userCart.add(newItem);
    nextItemId;
  };

  public func updateCartItem(
    carts : Map.Map<Principal, List.List<OrderTypes.CartItem>>,
    caller : Principal,
    itemId : Common.CartItemId,
    quantity : Nat,
  ) : Bool {
    switch (carts.get(caller)) {
      case null false;
      case (?userCart) {
        var found = false;
        userCart.mapInPlace(func(item) {
          if (item.id == itemId) {
            found := true;
            { item with quantity };
          } else {
            item;
          };
        });
        found;
      };
    };
  };

  public func removeFromCart(
    carts : Map.Map<Principal, List.List<OrderTypes.CartItem>>,
    caller : Principal,
    itemId : Common.CartItemId,
  ) : Bool {
    switch (carts.get(caller)) {
      case null false;
      case (?userCart) {
        let sizeBefore = userCart.size();
        let filtered = userCart.filter(func(item) { item.id != itemId });
        userCart.clear();
        userCart.append(filtered);
        userCart.size() < sizeBefore;
      };
    };
  };

  public func clearCart(
    carts : Map.Map<Principal, List.List<OrderTypes.CartItem>>,
    caller : Principal,
  ) {
    switch (carts.get(caller)) {
      case null ();
      case (?userCart) userCart.clear();
    };
  };

  // ─── Orders ───────────────────────────────────────────────────────────────

  public func createOrder(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    nextOrderId : Nat,
    carts : Map.Map<Principal, List.List<OrderTypes.CartItem>>,
    caller : Principal,
    input : OrderTypes.CreateOrderInput,
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
  ) : OrderTypes.Order {
    let cartItems = switch (carts.get(caller)) {
      case (?list) list.toArray();
      case null [];
    };
    if (cartItems.size() == 0) {
      Runtime.trap("Cart is empty");
    };
    let orderItems : [OrderTypes.OrderItem] = cartItems.map(func(item : OrderTypes.CartItem) : OrderTypes.OrderItem {
      let productName = switch (products.get(item.productId)) {
        case (?p) p.name;
        case null "Unknown Product";
      };
      {
        productId = item.productId;
        productName;
        size = item.size;
        color = item.color;
        quantity = item.quantity;
        priceInCents = item.priceInCents;
      };
    });
    let subtotal = orderItems.foldLeft(0 : Nat, func(acc : Nat, item : OrderTypes.OrderItem) : Nat = acc + item.priceInCents * item.quantity);
    let shipping : Nat = if (subtotal >= 420000) 0 else 125000;
    let now = Time.now();
    let order : OrderTypes.Order = {
      id = nextOrderId;
      buyer = caller;
      items = orderItems;
      shippingAddress = input.shippingAddress;
      subtotalInCents = subtotal;
      shippingInCents = shipping;
      totalInCents = subtotal + shipping;
      status = #pending;
      stripeSessionId = input.stripeSessionId;
      createdAt = now;
      updatedAt = now;
    };
    orders.add(nextOrderId, order);
    clearCart(carts, caller);
    order;
  };

  public func getOrder(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    id : Common.OrderId,
  ) : ?OrderTypes.Order {
    orders.get(id);
  };

  public func getUserOrders(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    caller : Principal,
  ) : [OrderTypes.Order] {
    var result = List.empty<OrderTypes.Order>();
    for ((_, order) in orders.entries()) {
      if (Principal.equal(order.buyer, caller)) {
        result.add(order);
      };
    };
    result.toArray();
  };

  public func getAllOrders(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>
  ) : [OrderTypes.Order] {
    orders.values().toArray();
  };

  public func updateOrderStatus(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    id : Common.OrderId,
    status : OrderTypes.OrderStatus,
  ) : Bool {
    switch (orders.get(id)) {
      case null false;
      case (?order) {
        orders.add(id, { order with status; updatedAt = Time.now() });
        true;
      };
    };
  };

  public func updateOrderStripeSession(
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    id : Common.OrderId,
    sessionId : Text,
  ) : Bool {
    switch (orders.get(id)) {
      case null false;
      case (?order) {
        orders.add(id, { order with stripeSessionId = ?sessionId; updatedAt = Time.now() });
        true;
      };
    };
  };
};
