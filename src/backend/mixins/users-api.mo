import Map "mo:core/Map";
import Set "mo:core/Set";
import AccessControl "mo:caffeineai-authorization/access-control";
import UsersLib "../lib/users";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Principal, UserTypes.UserProfile>,
  wishlists : Map.Map<Principal, Set.Set<Common.ProductId>>,
) {
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfile {
    UsersLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserTypes.UserProfile) : async () {
    UsersLib.saveProfile(profiles, caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserTypes.UserProfile {
    if (Principal.equal(caller, user) or AccessControl.hasPermission(accessControlState, caller, #admin)) {
      UsersLib.getProfile(profiles, user);
    } else null;
  };

  public shared ({ caller }) func addSavedAddress(address : UserTypes.SavedAddress) : async Bool {
    UsersLib.addSavedAddress(profiles, caller, address);
  };

  public shared ({ caller }) func removeSavedAddress(addressLabel : Text) : async Bool {
    UsersLib.removeSavedAddress(profiles, caller, addressLabel);
  };

  public shared ({ caller }) func addToWishlist(productId : Common.ProductId) : async () {
    UsersLib.addToWishlist(wishlists, caller, productId);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Common.ProductId) : async () {
    UsersLib.removeFromWishlist(wishlists, caller, productId);
  };

  public query ({ caller }) func getWishlist() : async [Common.ProductId] {
    UsersLib.getWishlist(wishlists, caller);
  };
};
