module {
  public type Timestamp = Int;
  public type ProductId = Nat;
  public type CategoryId = Nat;
  public type OrderId = Nat;
  public type CartItemId = Nat;

  // Counter wrappers — passed to mixins so they can mutate shared counters
  public type CatalogCounters = {
    var nextCategoryId : Nat;
    var nextProductId : Nat;
  };

  public type OrderCounters = {
    var nextCartItemId : Nat;
    var nextOrderId : Nat;
  };
};
