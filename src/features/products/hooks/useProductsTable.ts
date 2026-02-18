import { useState, useMemo, useCallback } from "react";
import { Product } from "../../../shared/types/product";
import { useProductsStore } from "../../auth/productsStore";

export const useProductsTable = (
  data: Product[],
  onPageReset?: () => void
) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    () => new Set()
  );

  const { sortBy, order, setSort } = useProductsStore();

  const sortedData = useMemo(() => {
    if (!sortBy || !order) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;

      return 0;
    });
  }, [data, sortBy, order]);


  const handleSelectAll = useCallback(() => {
    setSelectedProducts((prev) => {
      if (prev.size === data.length) {
        return new Set();
      }
      return new Set(data.map((p) => p.id));
    });
  }, [data]);

  const handleSelectProduct = useCallback((id: number) => {
    setSelectedProducts((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);


  const handleSort = useCallback(
    (field: keyof Product) => {
      onPageReset?.();

      if (sortBy !== field) {
        setSort(field, "asc");
      } else if (order === "asc") {
        setSort(field, "desc");
      } else {
        setSort(field, null);
      }
    },
    [sortBy, order, setSort, onPageReset]
  );

  const clearSelection = useCallback(() => {
    setSelectedProducts(new Set());
  }, []);

  return {
    data: sortedData, 
    selectedProducts,
    sortBy,
    order,
    handleSelectAll,
    handleSelectProduct,
    handleSort,
    clearSelection,
  };
};
