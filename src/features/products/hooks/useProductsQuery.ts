import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts } from "../productsApi";
import { ProductResponse } from "../../../shared/types/product";
import { useProductsStore } from "../../auth/productsStore";
import { useDebounce } from "./useDebounce";
import { useRef, useEffect } from "react";

const LIMIT = 20;
const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export const useProductsQuery = (search: string, page: number) => {
  const { sortBy, order } = useProductsStore();
  const debouncedSearch = useDebounce(search, 400);

  const lastResolvedPage = useRef(page);

  const query = useQuery<ProductResponse>({
    queryKey: ["products", debouncedSearch, sortBy, order, page],

    queryFn: ({ signal }) =>
      fetchProducts(
        debouncedSearch,
        sortBy ?? null,
        order ?? null,
        page,
        LIMIT,
        signal
      ),

    placeholderData: keepPreviousData,

    staleTime: STALE_TIME,
    gcTime: GC_TIME,

    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (!query.isPlaceholderData && query.isSuccess) {
      lastResolvedPage.current = page;
    }
  }, [query.isPlaceholderData, query.isSuccess, page]);

  const products = query.data?.products ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const displayPage = query.isPlaceholderData

    // eslint-disable-next-line react-hooks/refs
    ? lastResolvedPage.current
    : page;

  const start =
    total === 0 ? 0 : (displayPage - 1) * LIMIT + 1;

  const end = Math.min(displayPage * LIMIT, total);

  return {
    products,
    total,
    totalPages,
    start,
    end,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    isError: query.isError,
  };
};