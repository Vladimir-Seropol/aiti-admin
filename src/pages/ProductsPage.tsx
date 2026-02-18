import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "../shared/layout/MainLayout";
import { ProductModal } from "../components/ProductModal";
import { Toast } from "../shared/ui/Toast/Toast";
import { ProductsTableSection } from "../components/ProductsTableSection";
import { useProductsQuery } from "../features/products/hooks/useProductsQuery";
import { useToastStore } from "../shared/ui/Toast/Toast";
import { Product } from "../shared/types/product";

export const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToast } = useToastStore();
  const queryClient = useQueryClient();

  const {
    products,
    total,
    totalPages,
    start,
    end,
    isFetching,
    isLoading,
    isSuccess,
    isError, 
  } = useProductsQuery(search, page);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

    const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    addToast("Данные обновлены");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddProduct = (_: Omit<Product, "id">) => {

    queryClient.invalidateQueries({ queryKey: ["products"] });
    addToast("Товар успешно добавлен");
    setIsModalOpen(false);
  };



  

  return (
    <MainLayout
      title="Товары"
      searchValue={search}
      onSearchChange={(value) => {
        setPage(1);
        setSearch(value);
      }}
    >
      <ProductsTableSection
        data={products}
         onRefresh={handleRefresh}
        isFetching={isFetching}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError} 
        page={page}
        total={total}
        totalPages={totalPages}
        start={start}
        end={end}
        onPageChange={handlePageChange}
        onAddClick={() => setIsModalOpen(true)}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddProduct}
      />

      <Toast />
    </MainLayout>
  );
};
