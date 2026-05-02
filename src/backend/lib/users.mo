import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import UserTypes "../types/users";
import Common "../types/common";

module {
  public func getProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    caller : Principal,
  ) : ?UserTypes.UserProfile {
    profiles.get(caller);
  };

  public func saveProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    caller : Principal,
    profile : UserTypes.UserProfile,
  ) {
    profiles.add(caller, profile);
  };

  public func addSavedAddress(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    caller : Principal,
    address : UserTypes.SavedAddress,
  ) : Bool {
    switch (profiles.get(caller)) {
      case null {
        let newProfile : UserTypes.UserProfile = {
          displayName = "";
          email = "";
          savedAddresses = [address];
          createdAt = Time.now();
        };
        profiles.add(caller, newProfile);
        true;
      };
      case (?profile) {
        let updated = profile.savedAddresses.concat([address]);
        profiles.add(caller, { profile with savedAddresses = updated });
        true;
      };
    };
  };

  public func removeSavedAddress(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    caller : Principal,
    addressLabel : Text,
  ) : Bool {
    switch (profiles.get(caller)) {
      case null false;
      case (?profile) {
        let filtered = profile.savedAddresses.filter(
          func(a : UserTypes.SavedAddress) : Bool { a.addressLabel != addressLabel }
        );
        profiles.add(caller, { profile with savedAddresses = filtered });
        true;
      };
    };
  };

  public func addToWishlist(
    wishlists : Map.Map<Principal, Set.Set<Common.ProductId>>,
    caller : Principal,
    productId : Common.ProductId,
  ) {
    let wishlist = switch (wishlists.get(caller)) {
      case null {
        let s = Set.empty<Common.ProductId>();
        wishlists.add(caller, s);
        s;
      };
      case (?s) s;
    };
    wishlist.add(productId);
  };

  public func removeFromWishlist(
    wishlists : Map.Map<Principal, Set.Set<Common.ProductId>>,
    caller : Principal,
    productId : Common.ProductId,
  ) {
    switch (wishlists.get(caller)) {
      case null {};
      case (?s) s.remove(productId);
    };
  };

  public func getWishlist(
    wishlists : Map.Map<Principal, Set.Set<Common.ProductId>>,
    caller : Principal,
  ) : [Common.ProductId] {
    switch (wishlists.get(caller)) {
      case null [];
      case (?s) s.toArray();
    };
  };
};
