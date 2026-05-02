import Common "common";

module {
  public type UserProfile = {
    displayName : Text;
    email : Text;
    savedAddresses : [SavedAddress];
    createdAt : Common.Timestamp;
  };

  public type SavedAddress = {
    addressLabel : Text;
    fullName : Text;
    street : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
  };

  public type WishlistEntry = {
    productId : Common.ProductId;
    addedAt : Common.Timestamp;
  };
};
