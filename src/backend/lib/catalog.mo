import Map "mo:core/Map";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import CatalogTypes "../types/catalog";
import Common "../types/common";

module {
  // ─── Helpers ──────────────────────────────────────────────────────────────

  public func toPublic(p : CatalogTypes.ProductInternal) : CatalogTypes.Product {
    {
      id = p.id;
      name = p.name;
      description = p.description;
      priceInCents = p.priceInCents;
      compareAtPrice = p.compareAtPrice;
      categoryId = p.categoryId;
      variants = p.variants;
      images = p.images;
      isFeatured = p.isFeatured;
      isNewArrival = p.isNewArrival;
      createdAt = p.createdAt;
    };
  };

  // ─── Categories ───────────────────────────────────────────────────────────

  public func createCategory(
    categories : Map.Map<Common.CategoryId, CatalogTypes.Category>,
    nextId : Nat,
    name : Text,
    slug : Text,
    description : Text,
    parentId : ?Common.CategoryId,
  ) : CatalogTypes.Category {
    let category : CatalogTypes.Category = {
      id = nextId;
      name = name;
      slug = slug;
      description = description;
      parentId = parentId;
      createdAt = Time.now();
    };
    categories.add(nextId, category);
    category;
  };

  public func updateCategory(
    categories : Map.Map<Common.CategoryId, CatalogTypes.Category>,
    id : Common.CategoryId,
    name : Text,
    slug : Text,
    description : Text,
    parentId : ?Common.CategoryId,
  ) : Bool {
    switch (categories.get(id)) {
      case null { false };
      case (?existing) {
        categories.add(id, { existing with name = name; slug = slug; description = description; parentId = parentId });
        true;
      };
    };
  };

  public func deleteCategory(
    categories : Map.Map<Common.CategoryId, CatalogTypes.Category>,
    id : Common.CategoryId,
  ) : Bool {
    switch (categories.get(id)) {
      case null { false };
      case (?_) {
        categories.remove(id);
        true;
      };
    };
  };

  public func listCategories(
    categories : Map.Map<Common.CategoryId, CatalogTypes.Category>
  ) : [CatalogTypes.Category] {
    categories.values().toArray();
  };

  // ─── Products ─────────────────────────────────────────────────────────────

  public func createProduct(
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
    nextId : Nat,
    input : CatalogTypes.CreateProductInput,
  ) : CatalogTypes.Product {
    let product : CatalogTypes.ProductInternal = {
      id = nextId;
      name = input.name;
      description = input.description;
      priceInCents = input.priceInCents;
      compareAtPrice = input.compareAtPrice;
      categoryId = input.categoryId;
      variants = input.variants;
      images = input.images;
      isFeatured = input.isFeatured;
      isNewArrival = input.isNewArrival;
      createdAt = Time.now();
    };
    products.add(nextId, product);
    toPublic(product);
  };

  public func updateProduct(
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
    input : CatalogTypes.UpdateProductInput,
  ) : Bool {
    switch (products.get(input.id)) {
      case null { false };
      case (?existing) {
        products.add(
          input.id,
          {
            existing with
            name = input.name;
            description = input.description;
            priceInCents = input.priceInCents;
            compareAtPrice = input.compareAtPrice;
            categoryId = input.categoryId;
            variants = input.variants;
            images = input.images;
            isFeatured = input.isFeatured;
            isNewArrival = input.isNewArrival;
          },
        );
        true;
      };
    };
  };

  public func deleteProduct(
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
    id : Common.ProductId,
  ) : Bool {
    switch (products.get(id)) {
      case null { false };
      case (?_) {
        products.remove(id);
        true;
      };
    };
  };

  public func getProduct(
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
    id : Common.ProductId,
  ) : ?CatalogTypes.Product {
    switch (products.get(id)) {
      case null { null };
      case (?p) { ?toPublic(p) };
    };
  };

  func matchesVariant(variants : [CatalogTypes.ProductVariant], size : ?Text, color : ?Text, inStockOnly : Bool) : Bool {
    if (variants.size() == 0) {
      // No variants — only stock filter matters (treat as in stock)
      return not inStockOnly;
    };
    let hasMatchingVariant = variants.find(
      func(v : CatalogTypes.ProductVariant) : Bool {
        let sizeOk = switch (size) { case null { true }; case (?s) { v.size == s } };
        let colorOk = switch (color) { case null { true }; case (?c) { v.color == c } };
        let stockOk = if (inStockOnly) { v.stock > 0 } else { true };
        sizeOk and colorOk and stockOk;
      },
    );
    hasMatchingVariant != null;
  };

  func matchesSearch(p : CatalogTypes.ProductInternal, searchText : ?Text) : Bool {
    switch (searchText) {
      case null { true };
      case (?q) {
        let lq = q.toLower();
        p.name.toLower().contains(#text lq) or p.description.toLower().contains(#text lq);
      };
    };
  };

  public func filterProducts(
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
    filter : CatalogTypes.ProductFilter,
  ) : [CatalogTypes.Product] {
    products.entries().filter(
      func((_, p)) {
        let catOk = switch (filter.categoryId) { case null { true }; case (?cid) { p.categoryId == cid } };
        let minOk = switch (filter.minPriceInCents) { case null { true }; case (?mn) { p.priceInCents >= mn } };
        let maxOk = switch (filter.maxPriceInCents) { case null { true }; case (?mx) { p.priceInCents <= mx } };
        let variantOk = matchesVariant(p.variants, filter.size, filter.color, filter.inStockOnly);
        let searchOk = matchesSearch(p, filter.searchQuery);
        catOk and minOk and maxOk and variantOk and searchOk;
      }
    ).map<(Common.ProductId, CatalogTypes.ProductInternal), CatalogTypes.Product>(func((_, p)) { toPublic(p) }).toArray();
  };

  public func getFeaturedProducts(
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>
  ) : [CatalogTypes.Product] {
    products.entries().filter(
      func((_, p)) { p.isFeatured }
    ).map<(Common.ProductId, CatalogTypes.ProductInternal), CatalogTypes.Product>(func((_, p)) { toPublic(p) }).toArray();
  };

  public func getNewArrivals(
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>
  ) : [CatalogTypes.Product] {
    products.entries().filter(
      func((_, p)) { p.isNewArrival }
    ).map<(Common.ProductId, CatalogTypes.ProductInternal), CatalogTypes.Product>(func((_, p)) { toPublic(p) }).toArray();
  };

  // ─── Sample Data ──────────────────────────────────────────────────────────

  public func seedSampleData(
    categories : Map.Map<Common.CategoryId, CatalogTypes.Category>,
    products : Map.Map<Common.ProductId, CatalogTypes.ProductInternal>,
    nextCatId : Nat,
    nextProdId : Nat,
  ) : (Nat, Nat) {
    // Only seed if empty
    if (categories.size() > 0 or products.size() > 0) {
      return (nextCatId, nextProdId);
    };

    let now = Time.now();
    let placeholder : Storage.ExternalBlob = "" : Blob;

    // ── Categories ────────────────────────────────────────────────────────
    // Legacy categories (id 1–3)
    categories.add(1, { id = 1; name = "Dresses"; slug = "dresses"; description = "Elegant and casual dresses for every occasion"; parentId = null; createdAt = now });
    categories.add(2, { id = 2; name = "Tops"; slug = "tops"; description = "Stylish tops, blouses, and shirts"; parentId = null; createdAt = now });
    categories.add(3, { id = 3; name = "Bottoms"; slug = "bottoms"; description = "Skirts, trousers, and shorts"; parentId = null; createdAt = now });
    // New categories (id 4–8)
    categories.add(4, { id = 4; name = "New Arrivals"; slug = "new-arrivals"; description = "Freshest styles just added to the store"; parentId = null; createdAt = now });
    categories.add(5, { id = 5; name = "Women"; slug = "women"; description = "Traditional and contemporary women's clothing"; parentId = null; createdAt = now });
    categories.add(6, { id = 6; name = "Designers"; slug = "designers"; description = "Premium designer wear from India's finest"; parentId = null; createdAt = now });
    categories.add(7, { id = 7; name = "Sale"; slug = "sale"; description = "Great deals on selected styles"; parentId = null; createdAt = now });
    categories.add(8, { id = 8; name = "Accessories"; slug = "accessories"; description = "Jewellery and accessories to complete your look"; parentId = null; createdAt = now });
    categories.add(9, { id = 9; name = "Men"; slug = "men"; description = "Traditional and contemporary menswear for every occasion"; parentId = null; createdAt = now });
    categories.add(10, { id = 10; name = "Collections"; slug = "collections"; description = "Curated seasonal fashion collections — Spring, Summer, Autumn, Winter"; parentId = null; createdAt = now });

    // ── Legacy products (updated to INR paise, id 1–6) ────────────────────
    products.add(1, { id = 1; name = "Floral Wrap Dress"; description = "A beautiful floral wrap dress perfect for summer days and garden parties"; priceInCents = 199900; compareAtPrice = null; categoryId = 1; variants = [{ size = "S"; color = "Pink"; stock = 10 }, { size = "M"; color = "Pink"; stock = 8 }, { size = "L"; color = "Pink"; stock = 5 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(2, { id = 2; name = "Little Black Dress"; description = "A timeless little black dress that transitions seamlessly from day to night"; priceInCents = 299900; compareAtPrice = null; categoryId = 1; variants = [{ size = "XS"; color = "Black"; stock = 6 }, { size = "S"; color = "Black"; stock = 12 }, { size = "M"; color = "Black"; stock = 9 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(3, { id = 3; name = "Silk Camisole Top"; description = "Luxurious silk camisole with delicate lace trim, perfect for layering or wearing alone"; priceInCents = 149900; compareAtPrice = null; categoryId = 2; variants = [{ size = "S"; color = "Ivory"; stock = 15 }, { size = "M"; color = "Ivory"; stock = 11 }, { size = "S"; color = "Blush"; stock = 7 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(4, { id = 4; name = "Oversized Linen Shirt"; description = "Relaxed-fit linen shirt in a breezy oversized silhouette for effortless summer style"; priceInCents = 189900; compareAtPrice = null; categoryId = 2; variants = [{ size = "S"; color = "White"; stock = 8 }, { size = "M"; color = "White"; stock = 14 }, { size = "L"; color = "White"; stock = 10 }, { size = "M"; color = "Sage"; stock = 5 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(5, { id = 5; name = "High-Waist Midi Skirt"; description = "Flowing midi skirt with a flattering high waist and subtle pleat detail"; priceInCents = 219900; compareAtPrice = null; categoryId = 3; variants = [{ size = "XS"; color = "Camel"; stock = 4 }, { size = "S"; color = "Camel"; stock = 9 }, { size = "M"; color = "Camel"; stock = 7 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(6, { id = 6; name = "Wide-Leg Trousers"; description = "Sophisticated wide-leg trousers in a premium fabric blend, ideal for office and evening wear"; priceInCents = 349900; compareAtPrice = null; categoryId = 3; variants = [{ size = "S"; color = "Navy"; stock = 6 }, { size = "M"; color = "Navy"; stock = 8 }, { size = "L"; color = "Navy"; stock = 3 }, { size = "M"; color = "Black"; stock = 10 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });

    // ── New Arrivals (category 4, id 7–9) ────────────────────────────────
    products.add(7, { id = 7; name = "Floral Kurti"; description = "Vibrant floral printed kurti crafted from breathable cotton, perfect for festive occasions"; priceInCents = 249900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Multicolor"; stock = 12 }, { size = "M"; color = "Multicolor"; stock = 10 }, { size = "L"; color = "Multicolor"; stock = 8 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(8, { id = 8; name = "Cotton Salwar Set"; description = "Comfortable yet stylish cotton salwar set with elegant embroidery, ideal for daily wear and casual gatherings"; priceInCents = 329900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Blue"; stock = 8 }, { size = "M"; color = "Blue"; stock = 10 }, { size = "L"; color = "Blue"; stock = 6 }, { size = "XL"; color = "Blue"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(9, { id = 9; name = "Anarkali Suit"; description = "Flowing Anarkali suit in rich fabric with intricate embellishments — a showstopper for any celebration"; priceInCents = 499900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Red"; stock = 5 }, { size = "M"; color = "Red"; stock = 7 }, { size = "L"; color = "Red"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });

    // ── Women — South Indian traditional (category 5, id 10–12) ──────────
    products.add(10, { id = 10; name = "Kanjivaram Silk Saree"; description = "Exquisite Kanjivaram silk saree with traditional zari border — a bridal and festive heirloom from Tamil Nadu"; priceInCents = 899900; compareAtPrice = null; categoryId = 5; variants = [{ size = "Free Size"; color = "Deep Red"; stock = 5 }, { size = "Free Size"; color = "Royal Blue"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(11, { id = 11; name = "Kerala Kasavu Saree"; description = "Elegant off-white Kerala saree with golden kasavu border — the quintessential choice for Onam and temple visits"; priceInCents = 549900; compareAtPrice = null; categoryId = 5; variants = [{ size = "Free Size"; color = "Off-White/Gold"; stock = 8 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(12, { id = 12; name = "Pattu Pavadai"; description = "Traditional South Indian silk skirt and blouse set for girls, richly woven with auspicious motifs"; priceInCents = 379900; compareAtPrice = null; categoryId = 5; variants = [{ size = "S"; color = "Green/Gold"; stock = 6 }, { size = "M"; color = "Green/Gold"; stock = 5 }, { size = "L"; color = "Pink/Gold"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });

    // ── Designers (category 6, id 13–15) ─────────────────────────────────
    products.add(13, { id = 13; name = "Tarun Tahiliani Lehenga"; description = "Opulent bridal lehenga by Tarun Tahiliani — signature drape with hand-embroidered flowers and mirror work"; priceInCents = 1599900; compareAtPrice = null; categoryId = 6; variants = [{ size = "S"; color = "Ivory"; stock = 2 }, { size = "M"; color = "Ivory"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(14, { id = 14; name = "Sabyasachi Kurta"; description = "Handcrafted kurta from Sabyasachi's heritage line — artisanal block prints on premium organic cotton"; priceInCents = 949900; compareAtPrice = null; categoryId = 6; variants = [{ size = "S"; color = "Indigo"; stock = 4 }, { size = "M"; color = "Indigo"; stock = 5 }, { size = "L"; color = "Indigo"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(15, { id = 15; name = "Manish Malhotra Suit"; description = "Contemporary churidar suit by Manish Malhotra with intricate resham embroidery and tassel details"; priceInCents = 1299900; compareAtPrice = null; categoryId = 6; variants = [{ size = "S"; color = "Teal"; stock = 3 }, { size = "M"; color = "Teal"; stock = 4 }, { size = "L"; color = "Teal"; stock = 2 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });

    // ── Sale (category 7, id 16–18) ───────────────────────────────────────
    products.add(16, { id = 16; name = "Party Wear Dress"; description = "Glamorous party wear dress with sequin embellishments — now at an unbeatable price"; priceInCents = 299900; compareAtPrice = ?499900; categoryId = 7; variants = [{ size = "S"; color = "Black"; stock = 6 }, { size = "M"; color = "Black"; stock = 8 }, { size = "L"; color = "Black"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(17, { id = 17; name = "Designer Kurti"; description = "Chic designer kurti with intricate embroidery — limited stock at sale price"; priceInCents = 179900; compareAtPrice = ?349900; categoryId = 7; variants = [{ size = "S"; color = "Maroon"; stock = 5 }, { size = "M"; color = "Maroon"; stock = 7 }, { size = "L"; color = "Maroon"; stock = 3 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(18, { id = 18; name = "Embroidered Blouse"; description = "Beautifully embroidered silk blouse — a versatile piece now on clearance sale"; priceInCents = 129900; compareAtPrice = ?249900; categoryId = 7; variants = [{ size = "S"; color = "Gold"; stock = 8 }, { size = "M"; color = "Gold"; stock = 6 }, { size = "L"; color = "Gold"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });

    // ── Accessories / Jewellery (category 8, id 19–22) ───────────────────
    products.add(19, { id = 19; name = "Kundan Necklace Set"; description = "Stunning Kundan necklace set with matching earrings — perfect for bridal and festive occasions"; priceInCents = 349900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Gold/White"; stock = 10 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(20, { id = 20; name = "Jhumka Earrings"; description = "Traditional gold-plated jhumka earrings with intricate filigree work — a timeless South Indian classic"; priceInCents = 99900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Gold"; stock = 20 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(21, { id = 21; name = "Temple Jewelry Set"; description = "Complete temple jewelry set in antique gold finish with ruby-red stones — inspired by South Indian heritage"; priceInCents = 599900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Antique Gold"; stock = 6 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(22, { id = 22; name = "Bangles Collection"; description = "Set of 12 hand-painted lac bangles in vibrant colours with golden accents — festive and everyday wear"; priceInCents = 149900; compareAtPrice = null; categoryId = 8; variants = [{ size = "2.4"; color = "Multicolor"; stock = 15 }, { size = "2.6"; color = "Multicolor"; stock = 12 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });

    // ── New Arrivals — expanded (category 4, id 23–30) ───────────────────
    products.add(23, { id = 23; name = "Banarasi Silk Anarkali Suit"; description = "Resplendent Banarasi silk Anarkali suit with traditional zari weave and flared silhouette — perfect for festive celebrations"; priceInCents = 449900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Royal Blue"; stock = 8 }, { size = "M"; color = "Royal Blue"; stock = 10 }, { size = "L"; color = "Royal Blue"; stock = 6 }, { size = "XL"; color = "Royal Blue"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(24, { id = 24; name = "Cotton Linen Kurti Set"; description = "Breezy cotton-linen kurti set with matching pallazo pants — light, breathable, and effortlessly stylish for summer days"; priceInCents = 189900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Sage Green"; stock = 12 }, { size = "M"; color = "Sage Green"; stock = 15 }, { size = "L"; color = "Sage Green"; stock = 9 }, { size = "XL"; color = "Sand"; stock = 6 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(25, { id = 25; name = "Mirror Work Lehenga"; description = "Vibrant mirror-work lehenga with hand-stitched shisha embroidery from Kutch — a statement piece for weddings and sangeet"; priceInCents = 499900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Fuschia"; stock = 5 }, { size = "M"; color = "Fuschia"; stock = 7 }, { size = "L"; color = "Turquoise"; stock = 5 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(26, { id = 26; name = "Digital Print Saree"; description = "Contemporary digital-print saree on georgette base with modern abstract motifs — ideal for office, parties, and day outings"; priceInCents = 249900; compareAtPrice = null; categoryId = 4; variants = [{ size = "Free Size"; color = "Multicolor"; stock = 20 }, { size = "Free Size"; color = "Blue Print"; stock = 14 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(27, { id = 27; name = "Rayon Palazzo Set"; description = "Flowy rayon palazzo set with printed kurta and wide-leg pants — ultra-comfortable and casually chic for everyday wear"; priceInCents = 149900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Peach"; stock = 14 }, { size = "M"; color = "Peach"; stock = 16 }, { size = "L"; color = "Peach"; stock = 11 }, { size = "XL"; color = "Mint"; stock = 7 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(28, { id = 28; name = "Embroidered Sharara"; description = "Elegant embroidered sharara set with heavily embellished kurta and flared sharara pants — a showstopper for receptions and Eid"; priceInCents = 379900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Ivory"; stock = 6 }, { size = "M"; color = "Ivory"; stock = 8 }, { size = "L"; color = "Ivory"; stock = 5 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(29, { id = 29; name = "Chikankari Kurta"; description = "Hand-crafted Lucknowi Chikankari kurta on fine mul cotton — delicate white threadwork that is timeless and elegant"; priceInCents = 219900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "White"; stock = 10 }, { size = "M"; color = "White"; stock = 13 }, { size = "L"; color = "Blush Pink"; stock = 8 }, { size = "XL"; color = "Blush Pink"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(30, { id = 30; name = "Block Print Dupatta Set"; description = "Artisan hand block-printed kurta and dupatta set from Jaipur — earthy natural dyes on kota fabric for a boho-traditional look"; priceInCents = 299900; compareAtPrice = null; categoryId = 4; variants = [{ size = "S"; color = "Indigo"; stock = 9 }, { size = "M"; color = "Indigo"; stock = 11 }, { size = "L"; color = "Rust"; stock = 7 }, { size = "XL"; color = "Rust"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });

    // ── Women — expanded South Indian (category 5, id 31–38) ─────────────
    products.add(31, { id = 31; name = "Pure Silk Kanjivaram Saree"; description = "Museum-quality pure silk Kanjivaram saree with intricate temple border and peacock motifs — an heirloom piece for brides and festivities"; priceInCents = 1299900; compareAtPrice = null; categoryId = 5; variants = [{ size = "Free Size"; color = "Crimson/Gold"; stock = 4 }, { size = "Free Size"; color = "Emerald/Gold"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(32, { id = 32; name = "Pattu Half Saree"; description = "Traditional South Indian pattu half saree set with silk langa, davani, and matching blouse — essential for puberty ceremony and temple festivals"; priceInCents = 599900; compareAtPrice = null; categoryId = 5; variants = [{ size = "S"; color = "Pink/Gold"; stock = 6 }, { size = "M"; color = "Pink/Gold"; stock = 5 }, { size = "L"; color = "Teal/Gold"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(33, { id = 33; name = "Mysore Silk Saree"; description = "Lightweight Mysore crepe silk saree with charmeuse finish and bold contrast border — easy to drape and perfect for office and celebrations"; priceInCents = 449900; compareAtPrice = null; categoryId = 5; variants = [{ size = "Free Size"; color = "Lilac/Gold"; stock = 7 }, { size = "Free Size"; color = "Mustard/Maroon"; stock = 5 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(34, { id = 34; name = "Chanderi Silk Saree"; description = "Gossamer Chanderi silk saree with zari butti all over and delicate border — a versatile drape that transitions from day to evening effortlessly"; priceInCents = 329900; compareAtPrice = null; categoryId = 5; variants = [{ size = "Free Size"; color = "Ivory/Silver"; stock = 9 }, { size = "Free Size"; color = "Pastel Blue/Gold"; stock = 8 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(35, { id = 35; name = "Cotton Handloom Saree"; description = "Handwoven cotton saree from Chettinad looms with geometric checks and natural dye finish — artisan craft for the conscious fashion lover"; priceInCents = 219900; compareAtPrice = null; categoryId = 5; variants = [{ size = "Free Size"; color = "Rust/Black"; stock = 12 }, { size = "Free Size"; color = "Navy/White"; stock = 10 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(36, { id = 36; name = "Silk Lehenga Choli"; description = "Richly crafted silk lehenga choli with golden zardozi embroidery on bodice and hem — the ultimate choice for receptions and sangeet nights"; priceInCents = 899900; compareAtPrice = null; categoryId = 5; variants = [{ size = "S"; color = "Red/Gold"; stock = 5 }, { size = "M"; color = "Red/Gold"; stock = 6 }, { size = "L"; color = "Peach/Gold"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(37, { id = 37; name = "Georgette Saree with Blouse"; description = "Elegant georgette saree with embroidered border and matching stitched blouse included — easy drape for parties and evening events"; priceInCents = 279900; compareAtPrice = null; categoryId = 5; variants = [{ size = "Free Size"; color = "Wine/Gold"; stock = 11 }, { size = "Free Size"; color = "Royal Blue/Silver"; stock = 9 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(38, { id = 38; name = "Embroidered Anarkali Kurta"; description = "Flared Anarkali kurta with thread and sequin embroidery on yoke and hem — pair with churidar or wide pants for a complete festive look"; priceInCents = 349900; compareAtPrice = null; categoryId = 5; variants = [{ size = "S"; color = "Teal"; stock = 8 }, { size = "M"; color = "Teal"; stock = 10 }, { size = "L"; color = "Magenta"; stock = 7 }, { size = "XL"; color = "Magenta"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });

    // ── Designers — expanded premium (category 6, id 39–45) ──────────────
    products.add(39, { id = 39; name = "Sabyasachi-Inspired Embroidered Lehenga"; description = "Breathtaking bridal lehenga with Bengal-inspired hand embroidery, raw silk base, and traditional gota patti borders — couture craft at its finest"; priceInCents = 4599900; compareAtPrice = null; categoryId = 6; variants = [{ size = "S"; color = "Scarlet/Gold"; stock = 2 }, { size = "M"; color = "Scarlet/Gold"; stock = 2 }, { size = "L"; color = "Ivory/Gold"; stock = 2 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(40, { id = 40; name = "Manish Malhotra Style Silk Saree"; description = "Cinema-inspired silk saree with Swarovski crystal border and hand-pleated pallu — as worn on the red carpet, now available exclusively"; priceInCents = 1899900; compareAtPrice = null; categoryId = 6; variants = [{ size = "Free Size"; color = "Champagne/Silver"; stock = 3 }, { size = "Free Size"; color = "Black/Gold"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(41, { id = 41; name = "Raw Silk Designer Blouse"; description = "Architecturally structured raw silk blouse with hand-painted kalamkari panels and cold-shoulder detail — the perfect pairing for any premium saree"; priceInCents = 899900; compareAtPrice = null; categoryId = 6; variants = [{ size = "S"; color = "Off-White"; stock = 5 }, { size = "M"; color = "Off-White"; stock = 6 }, { size = "L"; color = "Burgundy"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(42, { id = 42; name = "Velvet Embroidered Anarkali"; description = "Luxe velvet Anarkali with antique zardozi and aari embroidery on a floor-length silhouette — for the bride who commands every room she enters"; priceInCents = 2499900; compareAtPrice = null; categoryId = 6; variants = [{ size = "S"; color = "Midnight Blue"; stock = 3 }, { size = "M"; color = "Midnight Blue"; stock = 4 }, { size = "L"; color = "Plum"; stock = 2 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(43, { id = 43; name = "Zardozi Work Bridal Lehenga"; description = "Masterpiece bridal lehenga with five-layer skirt and over 2,000 hours of traditional zardozi gold wire embroidery — heirloom quality for the special day"; priceInCents = 3499900; compareAtPrice = null; categoryId = 6; variants = [{ size = "S"; color = "Blush/Rose Gold"; stock = 2 }, { size = "M"; color = "Blush/Rose Gold"; stock = 2 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(44, { id = 44; name = "Organza Silk Saree with Border"; description = "Ultra-sheer organza silk saree with embroidered floral border and scattered resham butti — luminous and ethereal for evening galas"; priceInCents = 1499900; compareAtPrice = null; categoryId = 6; variants = [{ size = "Free Size"; color = "Pearl Pink"; stock = 4 }, { size = "Free Size"; color = "Mint/Silver"; stock = 3 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(45, { id = 45; name = "Hand-Painted Kalamkari Saree"; description = "Rare hand-painted kalamkari saree from Srikalahasti artisans depicting mythological narratives in natural vegetable dyes — wearable art"; priceInCents = 1299900; compareAtPrice = null; categoryId = 6; variants = [{ size = "Free Size"; color = "Earthy Tones"; stock = 3 }, { size = "Free Size"; color = "Indigo/Terracotta"; stock = 2 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });

    // ── Sale — expanded (category 7, id 46–53) ───────────────────────────
    products.add(46, { id = 46; name = "Cotton Printed Kurti"; description = "Cheerful cotton printed kurti in bold Jaipur block-print motifs — comfortable for daily wear and easy to pair with jeans or leggings"; priceInCents = 179900; compareAtPrice = ?299900; categoryId = 7; variants = [{ size = "S"; color = "Yellow Print"; stock = 10 }, { size = "M"; color = "Yellow Print"; stock = 14 }, { size = "L"; color = "Pink Print"; stock = 9 }, { size = "XL"; color = "Pink Print"; stock = 5 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(47, { id = 47; name = "Polyester Georgette Saree"; description = "Graceful polyester georgette saree with printed border and fall — lightweight drape for office and casual occasions, now at a special price"; priceInCents = 149900; compareAtPrice = ?249900; categoryId = 7; variants = [{ size = "Free Size"; color = "Teal"; stock = 12 }, { size = "Free Size"; color = "Coral"; stock = 9 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(48, { id = 48; name = "Casual Palazzo Set"; description = "Relaxed palazzo trouser set in printed rayon with matching kurta — go-to comfort look for weekends, now on sale while stocks last"; priceInCents = 199900; compareAtPrice = ?349900; categoryId = 7; variants = [{ size = "S"; color = "Floral Blue"; stock = 8 }, { size = "M"; color = "Floral Blue"; stock = 11 }, { size = "L"; color = "Floral Blue"; stock = 7 }, { size = "XL"; color = "Olive"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(49, { id = 49; name = "Office Wear Kurta"; description = "Tailored straight-cut kurta in subtle cotton-silk blend with minimal embroidery at collar — office-ready elegance now at clearance price"; priceInCents = 179900; compareAtPrice = ?299900; categoryId = 7; variants = [{ size = "S"; color = "Light Grey"; stock = 7 }, { size = "M"; color = "Light Grey"; stock = 9 }, { size = "L"; color = "Navy"; stock = 6 }, { size = "XL"; color = "Navy"; stock = 3 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(50, { id = 50; name = "Flared Skirt Set"; description = "Boho-chic flared skirt and crop top set in textured cotton — perfect for casual outings, beach trips, and festive markets"; priceInCents = 219900; compareAtPrice = ?369900; categoryId = 7; variants = [{ size = "S"; color = "Terracotta"; stock = 6 }, { size = "M"; color = "Terracotta"; stock = 8 }, { size = "L"; color = "Sage"; stock = 5 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(51, { id = 51; name = "Crepe Salwar Kameez"; description = "Classic straight-fit crepe salwar kameez with subtle self-print — a wardrobe staple for visits, ceremonies, and everyday elegance"; priceInCents = 239900; compareAtPrice = ?399900; categoryId = 7; variants = [{ size = "S"; color = "Powder Blue"; stock = 7 }, { size = "M"; color = "Powder Blue"; stock = 10 }, { size = "L"; color = "Peach"; stock = 7 }, { size = "XL"; color = "Peach"; stock = 3 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(52, { id = 52; name = "Casual Linen Kurti"; description = "Breathable linen kurti with pintuck details and rounded hem — minimal, modern, and perfect for the summer heat"; priceInCents = 119900; compareAtPrice = ?199900; categoryId = 7; variants = [{ size = "S"; color = "Natural"; stock = 13 }, { size = "M"; color = "Natural"; stock = 16 }, { size = "L"; color = "Sky Blue"; stock = 11 }, { size = "XL"; color = "Sky Blue"; stock = 6 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(53, { id = 53; name = "Tiered Maxi Dress"; description = "Flowy tiered maxi dress in lightweight chiffon with smocked bodice — ethereal holiday vibes, now on end-of-season sale"; priceInCents = 249900; compareAtPrice = ?449900; categoryId = 7; variants = [{ size = "S"; color = "Lavender"; stock = 6 }, { size = "M"; color = "Lavender"; stock = 9 }, { size = "L"; color = "White"; stock = 6 }, { size = "XL"; color = "White"; stock = 3 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });

    // ── Accessories / Jewellery — expanded (category 8, id 54–60) ────────
    products.add(54, { id = 54; name = "Temple Jewellery Necklace Set"; description = "Majestic South Indian temple jewellery necklace set with gold-plated deities, ruby-red stones, and pearl drops — bridal and occasion wear"; priceInCents = 799900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Antique Gold"; stock = 6 }, { size = "Free Size"; color = "Gold"; stock = 5 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(55, { id = 55; name = "Antique Gold Jhumka Earrings"; description = "Traditional antique gold jhumka earrings with intricate granulation work and hanging pearl drops — a timeless piece for sarees and ethnic wear"; priceInCents = 349900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Antique Gold"; stock = 14 }, { size = "Free Size"; color = "Gold"; stock = 12 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(56, { id = 56; name = "Stone-Studded Bangles Set"; description = "Set of 6 stone-studded gold-plated bangles with colourful kundan and meenakari inlay — perfect for weddings, festivals, and everyday glamour"; priceInCents = 249900; compareAtPrice = null; categoryId = 8; variants = [{ size = "2.4"; color = "Gold/Red"; stock = 10 }, { size = "2.6"; color = "Gold/Red"; stock = 8 }, { size = "2.8"; color = "Rose Gold/Green"; stock = 6 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(57, { id = 57; name = "Oxidised Silver Anklet"; description = "Bohemian oxidised silver anklet (pair) with ghungroo bells and leaf motifs — makes a melodious statement with every step"; priceInCents = 89900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Silver"; stock = 20 }, { size = "Free Size"; color = "Oxidised Silver"; stock = 16 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(58, { id = 58; name = "Meenakari Bangle Set"; description = "Vibrant meenakari enamel bangle set of 4 with floral patterns in blue, red, and green on gold base — Rajasthani craft meets everyday wear"; priceInCents = 199900; compareAtPrice = null; categoryId = 8; variants = [{ size = "2.4"; color = "Gold/Blue"; stock = 12 }, { size = "2.6"; color = "Gold/Blue"; stock = 10 }, { size = "2.8"; color = "Gold/Red"; stock = 7 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(59, { id = 59; name = "Pearl Maang Tikka"; description = "Delicate pearl maang tikka with gold chain and emerald-green drop — an elegant bridal hair ornament that adds grace to any hairstyle"; priceInCents = 149900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Gold/Pearl"; stock = 15 }, { size = "Free Size"; color = "Rose Gold/Pearl"; stock = 10 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(60, { id = 60; name = "Bridal Choker Set"; description = "Grand bridal choker necklace set with layered gold-plated chains, large kundan stones, and matching earrings — commanding and unforgettable"; priceInCents = 699900; compareAtPrice = null; categoryId = 8; variants = [{ size = "Free Size"; color = "Gold/Ruby"; stock = 5 }, { size = "Free Size"; color = "Gold/Emerald"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });

    // ── Men — traditional + casual (category 9, id 61–74) ────────────────
    products.add(61, { id = 61; name = "Silk Kurta Pyjama Set"; description = "Luxurious pure silk kurta pyjama set with subtle self-weave pattern and fine zari collar — the quintessential festive outfit for weddings and Diwali"; priceInCents = 599900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Ivory"; stock = 8 }, { size = "M"; color = "Ivory"; stock = 10 }, { size = "L"; color = "Ivory"; stock = 7 }, { size = "XL"; color = "Royal Blue"; stock = 5 }, { size = "XXL"; color = "Royal Blue"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(62, { id = 62; name = "Sherwani with Churidar"; description = "Regal sherwani in brocade fabric with intricate embroidery on cuffs and collar, paired with churidar — groom and baraati essential for grand weddings"; priceInCents = 1299900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Off-White/Gold"; stock = 4 }, { size = "M"; color = "Off-White/Gold"; stock = 5 }, { size = "L"; color = "Maroon/Gold"; stock = 4 }, { size = "XL"; color = "Maroon/Gold"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(63, { id = 63; name = "Traditional Dhoti Kurta Set"; description = "Classic cotton dhoti and kurta set with delicate embroidery at hem — timeless South Indian attire for temple visits, pujas, and festive occasions"; priceInCents = 349900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "White/Gold"; stock = 10 }, { size = "M"; color = "White/Gold"; stock = 12 }, { size = "L"; color = "White/Gold"; stock = 8 }, { size = "XL"; color = "White/Gold"; stock = 5 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(64, { id = 64; name = "Nehru Jacket with Kurta"; description = "Sophisticated Nehru collar jacket in printed cotton over a plain kurta — the go-to ensemble for ethnic-smart events and corporate Diwali functions"; priceInCents = 449900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Navy Print"; stock = 7 }, { size = "M"; color = "Navy Print"; stock = 9 }, { size = "L"; color = "Maroon Print"; stock = 6 }, { size = "XL"; color = "Maroon Print"; stock = 4 }, { size = "XXL"; color = "Black"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(65, { id = 65; name = "Bandhgala Suit"; description = "Tailored bandhgala (Jodhpuri) suit in premium suiting fabric with mandarin collar — an elegant blend of royal heritage and modern menswear for receptions"; priceInCents = 899900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Charcoal"; stock = 5 }, { size = "M"; color = "Charcoal"; stock = 6 }, { size = "L"; color = "Navy"; stock = 5 }, { size = "XL"; color = "Navy"; stock = 3 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });
    products.add(66, { id = 66; name = "Kashmiri Embroidered Shawl Kurta Set"; description = "Hand-embroidered Kashmiri motif kurta with matching stole in a warm wool-blend — ideal for winter weddings, evening parties, and festive gatherings"; priceInCents = 749900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Teal"; stock = 4 }, { size = "M"; color = "Teal"; stock = 5 }, { size = "L"; color = "Burgundy"; stock = 4 }, { size = "XL"; color = "Burgundy"; stock = 2 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(67, { id = 67; name = "Linen Casual Kurta"; description = "Breezy straight-cut linen kurta with minimal mandarin collar — cool, breathable, and effortlessly stylish for summer weekends and casual outings"; priceInCents = 189900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Sky Blue"; stock = 14 }, { size = "M"; color = "Sky Blue"; stock = 18 }, { size = "L"; color = "White"; stock = 13 }, { size = "XL"; color = "White"; stock = 8 }, { size = "XXL"; color = "Olive"; stock = 5 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(68, { id = 68; name = "Cotton Printed Short Kurta"; description = "Casual short kurta in soft cotton with hand block-print motifs — pairs well with jeans, chinos, or dhoti pants for a relaxed yet put-together look"; priceInCents = 159900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Blue Print"; stock = 12 }, { size = "M"; color = "Blue Print"; stock = 15 }, { size = "L"; color = "Rust Print"; stock = 11 }, { size = "XL"; color = "Rust Print"; stock = 7 }, { size = "XXL"; color = "Rust Print"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(69, { id = 69; name = "Slim Fit Chino Trousers"; description = "Well-tailored slim-fit chino trousers in stretch cotton — versatile, comfortable, and pairs perfectly with any kurta or casual shirt"; priceInCents = 249900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Khaki"; stock = 11 }, { size = "M"; color = "Khaki"; stock = 14 }, { size = "L"; color = "Navy"; stock = 10 }, { size = "XL"; color = "Navy"; stock = 7 }, { size = "XXL"; color = "Olive"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(70, { id = 70; name = "Cotton Linen Casual Shirt"; description = "Relaxed linen-cotton blend casual shirt with subtle texture and roll-up sleeves — perfect for brunches, casual Fridays, and summer travel"; priceInCents = 219900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "White"; stock = 13 }, { size = "M"; color = "White"; stock = 16 }, { size = "L"; color = "Light Blue"; stock = 12 }, { size = "XL"; color = "Light Blue"; stock = 8 }, { size = "XXL"; color = "Sand"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(71, { id = 71; name = "Pathani Suit Set"; description = "Iconic Pathani kurta and salwar set in durable khaddar fabric with traditional side-slit design — rugged, comfortable, and culturally rich"; priceInCents = 299900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Beige"; stock = 8 }, { size = "M"; color = "Beige"; stock = 10 }, { size = "L"; color = "Slate Grey"; stock = 8 }, { size = "XL"; color = "Slate Grey"; stock = 5 }, { size = "XXL"; color = "Charcoal"; stock = 3 }]; images = [placeholder]; isFeatured = false; isNewArrival = true; createdAt = now });
    products.add(72, { id = 72; name = "Angrakha Style Kurta"; description = "Distinctive Angrakha-style wrap kurta with tie closure and asymmetric hem — a fashion-forward take on Rajasthani folk tradition for modern style-conscious men"; priceInCents = 379900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Indigo"; stock = 6 }, { size = "M"; color = "Indigo"; stock = 8 }, { size = "L"; color = "Terracotta"; stock = 6 }, { size = "XL"; color = "Terracotta"; stock = 4 }]; images = [placeholder]; isFeatured = true; isNewArrival = true; createdAt = now });
    products.add(73, { id = 73; name = "Festive Mojari Juttis (Footwear)"; description = "Hand-crafted leather mojari juttis with intricate gold embroidery and turned-up toe — the finishing touch to any sherwani or kurta look"; priceInCents = 249900; compareAtPrice = null; categoryId = 9; variants = [{ size = "7"; color = "Gold/Maroon"; stock = 8 }, { size = "8"; color = "Gold/Maroon"; stock = 10 }, { size = "9"; color = "Gold/Maroon"; stock = 9 }, { size = "10"; color = "Gold/Black"; stock = 6 }, { size = "11"; color = "Gold/Black"; stock = 4 }]; images = [placeholder]; isFeatured = false; isNewArrival = false; createdAt = now });
    products.add(74, { id = 74; name = "Premium Zari Kurta Set"; description = "Premium festive kurta set in Chanderi fabric with rich zari weave all-over and matching off-white pyjama — a statement for Eid, Diwali, and weddings"; priceInCents = 549900; compareAtPrice = null; categoryId = 9; variants = [{ size = "S"; color = "Champagne Gold"; stock = 5 }, { size = "M"; color = "Champagne Gold"; stock = 7 }, { size = "L"; color = "Champagne Gold"; stock = 5 }, { size = "XL"; color = "Ivory"; stock = 3 }, { size = "XXL"; color = "Ivory"; stock = 2 }]; images = [placeholder]; isFeatured = true; isNewArrival = false; createdAt = now });

    (11, 75); // return next available IDs
  };
};
