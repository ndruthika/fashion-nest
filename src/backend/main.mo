import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import CatalogTypes "types/catalog";
import CatalogLib "lib/catalog";
import OrderTypes "types/orders";
import UserTypes "types/users";
import Common "types/common";
import MixinCatalog "mixins/catalog-api";
import MixinOrders "mixins/orders-api";
import MixinUsers "mixins/users-api";



actor {
  // ─── Authorization ────────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ─── Object Storage ───────────────────────────────────────────────────────
  include MixinObjectStorage();

  // ─── Catalog State ────────────────────────────────────────────────────────
  let categories = Map.empty<Common.CategoryId, CatalogTypes.Category>();
  let products = Map.empty<Common.ProductId, CatalogTypes.ProductInternal>();
  let catalogCounters : Common.CatalogCounters = {
    var nextCategoryId = 1;
    var nextProductId = 1;
  };

  // Seed sample data once at canister initialization
  do {
    let (seedCatId, seedProdId) = CatalogLib.seedSampleData(categories, products, catalogCounters.nextCategoryId, catalogCounters.nextProductId);
    catalogCounters.nextCategoryId := seedCatId;
    catalogCounters.nextProductId := seedProdId;
  };

  // ─── Orders & Cart State ──────────────────────────────────────────────────
  let carts = Map.empty<Principal, List.List<OrderTypes.CartItem>>();
  let orders = Map.empty<Common.OrderId, OrderTypes.Order>();
  let orderCounters : Common.OrderCounters = {
    var nextCartItemId = 1;
    var nextOrderId = 1;
  };

  // ─── User State ───────────────────────────────────────────────────────────
  let profiles = Map.empty<Principal, UserTypes.UserProfile>();
  let wishlists = Map.empty<Principal, Set.Set<Common.ProductId>>();

  // ─── Mixins ───────────────────────────────────────────────────────────────
  include MixinCatalog(accessControlState, categories, products, catalogCounters);
  include MixinOrders(accessControlState, carts, orders, products, orderCounters);
  include MixinUsers(accessControlState, profiles, wishlists);

  // ─── Stripe ───────────────────────────────────────────────────────────────
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?cfg) { cfg };
    };
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
