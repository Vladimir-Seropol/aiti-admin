import { Pagination } from "../shared/ui/Pagination/Pagination";
import styles from "../pages/ProductsPage.module.css";

interface Props {
  page: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const ProductsFooter = ({
  page,
  totalPages,
  start,
  end,
  total,
  onPageChange,
}: Props) => {
  if (!total || totalPages <= 0) return null;

  return (
    <div className={styles.tableFooter}>
      <div className={styles.tableInfo}>
        Показано {start}-{end} из {total}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
};
