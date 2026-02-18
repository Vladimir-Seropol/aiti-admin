// productsApi.ts

import { api } from "../../shared/api/axios";
import { ProductResponse } from "../../shared/types/product";

export const fetchProducts = async (
  search: string,
  sortBy: string | null,
  order: "asc" | "desc" | null,
  page: number,
  limit: number,
  signal?: AbortSignal
): Promise<ProductResponse> => {
  const params: Record<string, string | number> = {
    limit,
    skip: (page - 1) * limit,
  };

  if (sortBy && order) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const url = search
    ? `/products/search?q=${search}`
    : "/products";

  const response = await api.get<ProductResponse>(url, {
    params,
    signal,
  });

  return response.data;
};
