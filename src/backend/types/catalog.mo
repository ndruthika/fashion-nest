import Storage "mo:caffeineai-object-storage/Storage";
import Common "common";

module {
  public type Category = {
    id : Common.CategoryId;
    name : Text;
    slug : Text;
    description : Text;
    parentId : ?Common.CategoryId;
    createdAt : Common.Timestamp;
  };

  public type ProductVariant = {
    size : Text;
    color : Text;
    stock : Nat;
  };

  public type ProductInternal = {
    id : Common.ProductId;
    name : Text;
    description : Text;
    priceInCents : Nat;
    compareAtPrice : ?Nat;
    categoryId : Common.CategoryId;
    variants : [ProductVariant];
    images : [Storage.ExternalBlob];
    isFeatured : Bool;
    isNewArrival : Bool;
    createdAt : Common.Timestamp;
  };

  public type Product = {
    id : Common.ProductId;
    name : Text;
    description : Text;
    priceInCents : Nat;
    compareAtPrice : ?Nat;
    categoryId : Common.CategoryId;
    variants : [ProductVariant];
    images : [Storage.ExternalBlob];
    isFeatured : Bool;
    isNewArrival : Bool;
    createdAt : Common.Timestamp;
  };

  public type ProductFilter = {
    categoryId : ?Common.CategoryId;
    size : ?Text;
    color : ?Text;
    minPriceInCents : ?Nat;
    maxPriceInCents : ?Nat;
    inStockOnly : Bool;
    searchQuery : ?Text;
  };

  public type CreateProductInput = {
    name : Text;
    description : Text;
    priceInCents : Nat;
    compareAtPrice : ?Nat;
    categoryId : Common.CategoryId;
    variants : [ProductVariant];
    images : [Storage.ExternalBlob];
    isFeatured : Bool;
    isNewArrival : Bool;
  };

  public type UpdateProductInput = {
    id : Common.ProductId;
    name : Text;
    description : Text;
    priceInCents : Nat;
    compareAtPrice : ?Nat;
    categoryId : Common.CategoryId;
    variants : [ProductVariant];
    images : [Storage.ExternalBlob];
    isFeatured : Bool;
    isNewArrival : Bool;
  };
};
