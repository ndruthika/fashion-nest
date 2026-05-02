import Common "common";

module {
  public type CartItem = {
    id : Common.CartItemId;
    productId : Common.ProductId;
    size : Text;
    color : Text;
    quantity : Nat;
    priceInCents : Nat;
  };

  public type Cart = {
    items : [CartItem];
    totalInCents : Nat;
  };

  public type ShippingAddress = {
    fullName : Text;
    street : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
  };

  public type OrderStatus = {
    #pending;
    #paid;
    #processing;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type OrderItem = {
    productId : Common.ProductId;
    productName : Text;
    size : Text;
    color : Text;
    quantity : Nat;
    priceInCents : Nat;
  };

  public type Order = {
    id : Common.OrderId;
    buyer : Principal;
    items : [OrderItem];
    shippingAddress : ShippingAddress;
    subtotalInCents : Nat;
    shippingInCents : Nat;
    totalInCents : Nat;
    status : OrderStatus;
    stripeSessionId : ?Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateOrderInput = {
    shippingAddress : ShippingAddress;
    stripeSessionId : ?Text;
  };
};
