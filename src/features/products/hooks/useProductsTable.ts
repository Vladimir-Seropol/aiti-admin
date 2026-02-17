import { useState } from "react";
import { Product } from "../../../shared/types/product";
import { useProductsStore } from "../../auth/productsStore";

export const useProductsTable = (data: Product[], onPageReset?: () => void) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );

  const { sortBy, order, setSort } = useProductsStore();

  const handleSelectAll = () => {
    if (selectedProducts.size === data.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(data.map((p) => p.id)));
    }
  };

  const handleSelectProduct = (id: number) => {
    const newSelected = new Set(selectedProducts);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedProducts(newSelected);
  };

  const handleSort = (field: keyof Product) => {
    onPageReset?.();

    if (sortBy !== field) {
      setSort(field, "asc");
    } else if (order === "asc") {
      setSort(field, "desc");
    } else {
      setSort(field, null);
    }
  };

  const clearSelection = () => setSelectedProducts(new Set());

  return {
    selectedProducts,
    sortBy,
    order,
    handleSelectAll,
    handleSelectProduct,
    handleSort,
    clearSelection,
  };
};
