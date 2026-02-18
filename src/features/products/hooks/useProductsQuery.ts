import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts } from "../productsApi";
import { ProductResponse } from "../../../shared/types/product";
import { useProductsStore } from "../../auth/productsStore";
import { useDebounce } from "./useDebounce";


const LIMIT = 20;
const STALE_TIME = 10 * 60 * 1000;
const GC_TIME = 20 * 60 * 1000;

export const useProductsQuery = (search: string, page: number) => {
  const { sortBy, order } = useProductsStore();
  const debouncedSearch = useDebounce(search, 3000);

  const query = useQuery<ProductResponse>({
    queryKey: ["products", debouncedSearch, sortBy, order, page],
    queryFn: () =>
      fetchProducts(
        debouncedSearch,
        sortBy ?? null,
        order ?? null,
        page,
        LIMIT
      ),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
  });

  const products = query.data?.products ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const start = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, total);

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
