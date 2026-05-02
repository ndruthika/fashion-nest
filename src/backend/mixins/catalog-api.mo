import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CatalogLib "../lib/catalog";
import CatalogTypes "../types/catalog";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  categories : Map.Map<Common.CategoryId, CatalogTypes.Category>,
  products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
  counters : Common.CatalogCounters,
) {
  // ─── Categories ───────────────────────────────────────────────────────────

  public query func getCategories() : async [CatalogTypes.Category] {
    CatalogLib.listCategories(categories);
  };

  public shared ({ caller }) func createCategory(
    name : Text,
    slug : Text,
    description : Text,
    parentId : ?Common.CategoryId,
  ) : async CatalogTypes.Category {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };
    let category = CatalogLib.createCategory(categories, counters.nextCategoryId, name, slug, description, parentId);
    counters.nextCategoryId += 1;
    category;
  };

  public shared ({ caller }) func updateCategory(
    id : Common.CategoryId,
    name : Text,
    slug : Text,
    description : Text,
    parentId : ?Common.CategoryId,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    CatalogLib.updateCategory(categories, id, name, slug, description, parentId);
  };

  public shared ({ caller }) func deleteCategory(id : Common.CategoryId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    CatalogLib.deleteCategory(categories, id);
  };

  // ─── Products ─────────────────────────────────────────────────────────────

  public query func getProduct(id : Common.ProductId) : async ?CatalogTypes.Product {
    CatalogLib.getProduct(products, id);
  };

  public query func searchProducts(filter : CatalogTypes.ProductFilter) : async [CatalogTypes.Product] {
    CatalogLib.filterProducts(products, filter);
  };

  public query func getFeaturedProducts() : async [CatalogTypes.Product] {
    CatalogLib.getFeaturedProducts(products);
  };

  public query func getNewArrivals() : async [CatalogTypes.Product] {
    CatalogLib.getNewArrivals(products);
  };

  public shared ({ caller }) func createProduct(input : CatalogTypes.CreateProductInput) : async CatalogTypes.Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let product = CatalogLib.createProduct(products, counters.nextProductId, input);
    counters.nextProductId += 1;
    product;
  };

  public shared ({ caller }) func updateProduct(input : CatalogTypes.UpdateProductInput) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    CatalogLib.updateProduct(products, input);
  };

  public shared ({ caller }) func deleteProduct(id : Common.ProductId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    CatalogLib.deleteProduct(products, id);
  };
};
