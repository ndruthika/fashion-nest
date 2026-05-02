import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  FolderOpen,
  ImagePlus,
  Package,
  Pencil,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import {
  useAdminCategories,
  useAdminProducts,
  useCategories,
  useProducts,
} from "../hooks/useProducts";
import type { Category, Product } from "../types";

interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: bigint;
  compareAtPrice: bigint | null;
  categoryId: bigint;
  images: string[];
  sizes: string[];
  colors: string[];
  sku: string;
  stockQuantity: bigint;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  tags: string[];
  variants: ProductVariant[];
}

const EMPTY_FORM: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: 0n,
  compareAtPrice: null,
  categoryId: 1n,
  images: [],
  sizes: [],
  colors: [],
  sku: "",
  stockQuantity: 0n,
  isActive: true,
  isFeatured: false,
  isNewArrival: false,
  tags: [],
  variants: [],
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function CategoryManager({
  categories,
  onClose,
}: {
  categories: Category[];
  onClose: () => void;
}) {
  const { addCategory, deleteCategory, isAdding, isDeleting } =
    useAdminCategories();
  const [newName, setNewName] = useState("");
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await addCategory({
        name: newName.trim(),
        slug: slugify(newName.trim()),
        description: "",
        imageUrl: "",
        parentId: null,
        sortOrder: BigInt(categories.length),
        isActive: true,
      });
      setNewName("");
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteCategory(id);
      setDeleteId(null);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="admin_categories.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Tag className="h-4 w-4" /> Manage Categories
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add category */}
          <div className="flex gap-2">
            <Input
              placeholder="New category name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              data-ocid="admin_categories.name_input"
            />
            <Button
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
              className="bg-primary text-primary-foreground shrink-0"
              data-ocid="admin_categories.add_button"
            >
              {isAdding ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Category list */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No categories yet
              </p>
            ) : (
              categories.map((cat: Category, i: number) => (
                <div
                  key={cat.id.toString()}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 hover:bg-muted/60 group"
                  data-ocid={`admin_categories.item.${i + 1}`}
                >
                  <span className="text-sm text-foreground">{cat.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDeleteId(cat.id)}
                    data-ocid={`admin_categories.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_categories.close_button"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="admin_categories.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This cannot be undone. Products in this category
              will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_categories.delete_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin_categories.delete_confirm_button"
            >
              {isDeleting ? <LoadingSpinner size="sm" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

function VariantRow({
  variant,
  index,
  onChange,
  onRemove,
}: {
  variant: ProductVariant;
  index: number;
  onChange: (
    idx: number,
    field: keyof ProductVariant,
    val: string | number,
  ) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div
      className="flex gap-2 items-center"
      data-ocid={`admin_products.variant.${index + 1}`}
    >
      <Input
        placeholder="Size"
        value={variant.size}
        onChange={(e) => onChange(index, "size", e.target.value)}
        className="w-24 text-sm"
      />
      <Input
        placeholder="Color"
        value={variant.color}
        onChange={(e) => onChange(index, "color", e.target.value)}
        className="w-28 text-sm"
      />
      <Input
        type="number"
        placeholder="Stock"
        value={variant.stock}
        onChange={(e) => onChange(index, "stock", Number(e.target.value))}
        className="w-20 text-sm"
        min={0}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function AdminProductsPage() {
  const { isAdmin, isLoadingProfile } = useAuth();
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const {
    addProduct,
    updateProduct,
    deleteProduct,
    isAdding,
    isUpdating,
    isDeleting,
  } = useAdminProducts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoadingProfile) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl mb-4">Access Denied</h2>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const filtered = (products ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm({
      ...EMPTY_FORM,
      categoryId: categories?.[0]?.id ?? 1n,
    });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      categoryId: p.categoryId,
      images: p.images,
      sizes: p.sizes,
      colors: p.colors,
      sku: p.sku,
      stockQuantity: p.stockQuantity,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      isNewArrival: p.tags.includes("new-arrival"),
      tags: p.tags,
      variants: [],
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      // Use object-storage uploadFile if available, otherwise use FileReader for preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setForm((f) => ({ ...f, images: [...f.images, dataUrl] }));
        setImageUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read image");
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Image upload failed");
      setImageUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { size: "", color: "", stock: 0 }],
    }));
  };

  const updateVariant = (
    idx: number,
    field: keyof ProductVariant,
    val: string | number,
  ) => {
    setForm((f) => {
      const updated = [...f.variants];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...f, variants: updated };
    });
  };

  const removeVariant = (idx: number) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    // Derive sizes/colors from variants, compute total stock
    const variantSizes = [
      ...new Set(form.variants.map((v) => v.size).filter(Boolean)),
    ];
    const variantColors = [
      ...new Set(form.variants.map((v) => v.color).filter(Boolean)),
    ];
    const totalStock = form.variants.reduce((s, v) => s + v.stock, 0);

    const finalTags = form.isNewArrival
      ? [...form.tags.filter((t) => t !== "new-arrival"), "new-arrival"]
      : form.tags.filter((t) => t !== "new-arrival");

    const productData = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      price: form.price,
      compareAtPrice: form.compareAtPrice,
      categoryId: form.categoryId,
      images: form.images,
      sizes: variantSizes.length > 0 ? variantSizes : form.sizes,
      colors: variantColors.length > 0 ? variantColors : form.colors,
      sku: form.sku,
      stockQuantity:
        form.variants.length > 0 ? BigInt(totalStock) : form.stockQuantity,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      tags: finalTags,
    };

    try {
      if (editingProduct) {
        await updateProduct({
          ...productData,
          id: editingProduct.id,
          createdAt: editingProduct.createdAt,
        });
        toast.success("Product updated");
      } else {
        await addProduct(productData);
        toast.success("Product added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const getCategoryName = (id: bigint) => {
    return categories?.find((c: Category) => c.id === id)?.name ?? `Cat ${id}`;
  };

  return (
    <div className="bg-background min-h-screen" data-ocid="admin_products.page">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 font-medium">
              Admin
            </p>
            <h1 className="font-display text-4xl font-semibold text-foreground">
              Products
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCategoryManagerOpen(true)}
              className="gap-2"
              data-ocid="admin_products.categories_button"
            >
              <FolderOpen className="h-4 w-4" /> Categories
            </Button>
            <Button
              onClick={openAdd}
              className="bg-primary text-primary-foreground gap-2"
              data-ocid="admin_products.add_button"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Search */}
        <Input
          placeholder="Search products by name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs mb-6"
          data-ocid="admin_products.search_input"
        />

        {/* Table */}
        {isLoading ? (
          <LoadingSpinner className="py-24" />
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-20 bg-card rounded-xl border border-border"
            data-ocid="admin_products.empty_state"
          >
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-display text-xl font-medium text-foreground mb-2">
              {search ? "No products match" : "No products yet"}
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              {search
                ? "Try a different search term"
                : "Add your first product to start selling"}
            </p>
            {!search && (
              <Button
                onClick={openAdd}
                className="bg-primary text-primary-foreground"
              >
                Add First Product
              </Button>
            )}
          </div>
        ) : (
          <div
            className="bg-card rounded-xl border border-border overflow-hidden shadow-card"
            data-ocid="admin_products.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Category
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Price
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Stock
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product, i) => (
                    <tr
                      key={product.id.toString()}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors duration-150"
                      data-ocid={`admin_products.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-10 h-12 object-cover rounded-md bg-muted shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-12 rounded-md bg-muted flex items-center justify-center shrink-0">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-[180px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {getCategoryName(product.categoryId)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(Number(product.price) / 100)}
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground hidden md:table-cell tabular-nums">
                        {product.stockQuantity.toString()}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 justify-center">
                          <Badge
                            className={`text-xs border-0 ${product.isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {product.isFeatured && (
                            <Badge className="text-xs bg-accent/15 text-accent border-0">
                              Featured
                            </Badge>
                          )}
                          {product.tags.includes("new-arrival") && (
                            <Badge className="text-xs bg-secondary text-secondary-foreground border-0">
                              New
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(product)}
                            data-ocid={`admin_products.edit_button.${i + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteId(product.id)}
                            data-ocid={`admin_products.delete_button.${i + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin_products.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Product Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    }))
                  }
                  placeholder="e.g. Tailored Wool Blazer"
                  className="mt-1"
                  data-ocid="admin_products.name_input"
                />
              </div>
              <div>
                <Label>Price (cents)</Label>
                <Input
                  type="number"
                  value={Number(form.price)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      price: BigInt(Math.max(0, Number(e.target.value))),
                    }))
                  }
                  placeholder="e.g. 85000 = $850.00"
                  className="mt-1"
                  data-ocid="admin_products.price_input"
                />
              </div>
              <div>
                <Label>Compare At Price (cents)</Label>
                <Input
                  type="number"
                  value={
                    form.compareAtPrice !== null
                      ? Number(form.compareAtPrice)
                      : ""
                  }
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      compareAtPrice: e.target.value
                        ? BigInt(e.target.value)
                        : null,
                    }))
                  }
                  placeholder="Optional"
                  className="mt-1"
                  data-ocid="admin_products.compare_price_input"
                />
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  value={form.sku}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sku: e.target.value }))
                  }
                  placeholder="e.g. WBL-001-BLK"
                  className="mt-1"
                  data-ocid="admin_products.sku_input"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.categoryId.toString()}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, categoryId: BigInt(v) }))
                  }
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="admin_products.category_select"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).map((cat: Category) => (
                      <SelectItem
                        key={cat.id.toString()}
                        value={cat.id.toString()}
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Describe the product…"
                className="mt-1 min-h-[80px] resize-none"
                data-ocid="admin_products.description_textarea"
              />
            </div>

            {/* Images */}
            <div>
              <Label className="mb-2 block">Product Images</Label>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.images.map((img, i) => (
                  <div
                    key={`img-${img.slice(-16)}-${i}`}
                    className="relative group"
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-20 h-24 object-cover rounded-md border border-border bg-muted"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-24 rounded-md border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                  disabled={imageUploading}
                  data-ocid="admin_products.upload_button"
                >
                  {imageUploading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5" />
                      <span className="text-xs">Upload</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Variants (Size / Color / Stock)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addVariant}
                  className="h-7 text-xs gap-1 text-primary"
                  data-ocid="admin_products.add_variant_button"
                >
                  <Plus className="h-3 w-3" /> Add variant
                </Button>
              </div>
              {form.variants.length === 0 ? (
                <div className="text-sm text-muted-foreground py-3 px-3 rounded-md bg-muted/30 text-center">
                  No variants — use stock quantity below or add variants
                </div>
              ) : (
                <div className="space-y-2">
                  {form.variants.map((v, i) => (
                    <VariantRow
                      key={`variant-${v.size}-${v.color}-${i}`}
                      variant={v}
                      index={i}
                      onChange={updateVariant}
                      onRemove={removeVariant}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Stock (when no variants) */}
            {form.variants.length === 0 && (
              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={Number(form.stockQuantity)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      stockQuantity: BigInt(
                        Math.max(0, Number(e.target.value)),
                      ),
                    }))
                  }
                  className="mt-1 max-w-[120px]"
                  data-ocid="admin_products.stock_input"
                  min={0}
                />
              </div>
            )}

            {/* Flags */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isActive: v }))
                  }
                  id="sw-active"
                  data-ocid="admin_products.active_switch"
                />
                <Label htmlFor="sw-active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isFeatured: v }))
                  }
                  id="sw-featured"
                  data-ocid="admin_products.featured_switch"
                />
                <Label htmlFor="sw-featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isNewArrival}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isNewArrival: v }))
                  }
                  id="sw-new-arrival"
                  data-ocid="admin_products.new_arrival_switch"
                />
                <Label htmlFor="sw-new-arrival">New Arrival</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin_products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={handleSave}
              disabled={isAdding || isUpdating}
              data-ocid="admin_products.save_button"
            >
              {isAdding || isUpdating ? (
                <LoadingSpinner size="sm" />
              ) : editingProduct ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="admin_products.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_products.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin_products.delete_confirm_button"
            >
              {isDeleting ? <LoadingSpinner size="sm" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Category Manager */}
      {categoryManagerOpen && (
        <CategoryManager
          categories={categories ?? []}
          onClose={() => setCategoryManagerOpen(false)}
        />
      )}
    </div>
  );
}
