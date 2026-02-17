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


  const safeStart = Math.min(start, total);
  const safeEnd = Math.min(end, total);

  return (
    <div className={styles.tableFooter}>
      <div className={styles.tableInfo}>
        Показано {safeStart}-{safeEnd} из {total}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={onPageChange}
      />
    </div>
  );
};
