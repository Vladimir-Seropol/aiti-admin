import { useCallback, useEffect, useMemo, useState } from "react";
import { Table } from "../shared/ui/Table/Table";
import { Column } from "../shared/ui/Table/Table.types";
import { Product } from "../shared/types/product";
import Skeleton from "../shared/ui/Loader/Skeleton";
import { Button } from "../shared/ui/Button/Button";
import { useProductsTable } from "../features/products/hooks/useProductsTable";
import { ProductActionsCell } from "./ProductActionsCell";
import { ProductsFooter } from "./ProductsFooter";
import { Checkbox } from "../shared/ui/Checkbox/Checkbox";
import styles from "../pages/ProductsPage.module.css";
import ImageWithLoader from "../shared/ui/Loader/ImageWithLoader";

interface Props {
  data: Product[];
  isFetching: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  page: number;
  total: number;
  totalPages: number;
  start: number;
  end: number;
  onPageChange: (page: number) => void;
  onAddClick: () => void;
  onRefresh: () => void;
}

export const ProductsTableSection = ({
  data,
  isFetching,
  isLoading,
  isSuccess,
  isError,
  page,
  total,
  totalPages,
  start,
  end,
  onPageChange,
  onAddClick,
  onRefresh,
}: Props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading || isFetching) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(30);

      const interval = window.setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 200);

      return () => clearInterval(interval);
    }

    setProgress(100);

    const timeout = window.setTimeout(() => {
      setProgress(0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [isLoading, isFetching]);
  

  const {
    data: sortedData,
    selectedProducts,
    sortBy,
    order,
    handleSelectAll,
    handleSelectProduct,
    handleSort,
    clearSelection,
  } = useProductsTable(data, () => onPageChange(1));

  const getOptimizedUrl = useCallback((product: Product) => {
    if (!product.thumbnail) return "/placeholder.png";

    if (product.thumbnail.includes(".webp")) {
      return `${product.thumbnail}?w=50&h=50&q=75`;
    }

    return product.thumbnail;
  }, []);

  useEffect(() => {
  data.slice(0, 20).forEach((product) => {
    const img = new Image();
    img.src = getOptimizedUrl(product); 
  });
}, [data, getOptimizedUrl]);

 const columns: Column<Product>[] = useMemo(() => {

  const indexMap = new Map(data.map((item, idx) => [item.id, idx]));

  return [
    {
      key: "selection",
      title: (
        <Checkbox
          checked={data.length > 0 && selectedProducts.size === data.length}
          onChange={handleSelectAll}
        />
      ),
      render: (_, row) => (
        <Checkbox
          checked={selectedProducts.has(row.id)}
          onChange={() => handleSelectProduct(row.id)}
        />
      ),
    },
    {
      key: "thumbnail",
      title: "",
      render: (_, row) => {
        const index = indexMap.get(row.id) ?? 0;
        return (
          <div className={styles.productName}>
            <ImageWithLoader
              src={getOptimizedUrl(row)}
              alt={row.title}
              className={styles.productThumb}
              priority={index < 20}
            />
          </div>
        );
      },
    },
    { key: "title", title: "Название", sortable: true },
    { key: "brand", title: "Бренд", sortable: true },
    { key: "price", title: "Цена, ₽", sortable: true },
    {
      key: "rating",
      title: "Рейтинг",
      sortable: true,
      render: (v) => (
        <span style={{ color: v < 3 ? "red" : "inherit" }}>{v}</span>
      ),
    },
    {
      key: "actions",
      title: "",
      render: (_, row) => <ProductActionsCell product={row} />,
    },
  ];
}, [data, selectedProducts, handleSelectAll, handleSelectProduct, getOptimizedUrl]);

  const showInitialLoader = isLoading;
  const showEmpty = isSuccess && !isFetching && data.length === 0;

  return (
    <div className={styles.tableWrapper}>
      {progress > 0 && (
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{
              width: `${progress}%`,
              transition: "width 0.2s linear",
            }}
          />
          <span className={styles.spanLoader}>Загрузка...</span>

        </div>
      )}

      <div className={styles.tableHeader}>
        <h3>Все позиции</h3>
        <div className={styles.refresh}>
          <img
            src="./refresh.png"
            alt="Refresh"
            className={styles.refreshIcon}
            onClick={onRefresh}
            style={{ cursor: "pointer" }}
            title="Обновить данные"
          />
          <Button onClick={onAddClick}>+ Добавить</Button>
        </div>
      </div>

      {isError ? (
        <div className={styles.errorState}>Ошибка загрузки данных</div>
      ) : showInitialLoader ? (
        <Skeleton rows={5} columns={columns.length} />
      ) : showEmpty ? (
        <div className={styles.emptyState}>Товары не найдены</div>
      ) : (
        <>
          <div className={isFetching ? styles.tableFetching : ""}>
            <Table<Product>
              data={sortedData}
              columns={columns}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              rowClassName={(row) =>
                selectedProducts.has(row.id) ? styles.selectedRow : ""
              }
            />
          </div>

          {total > 0 && (
            <ProductsFooter
              page={page}
              totalPages={totalPages}
              start={start}
              end={end}
              total={total}
              onPageChange={(p) => {
                clearSelection();
                onPageChange(p);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
