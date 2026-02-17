import { useEffect, useRef, useState } from "react";
import { Product } from "../shared/types/product";
import styles from "../pages/ProductsPage.module.css";

interface Props {
  product: Product;
}

export const ProductActionsCell = ({ product }: Props) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setTooltipVisible(false);
      }
    };

    if (tooltipVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipVisible]);

  return (
    <div className={styles.actionButtons}>
      <button
        className={styles.editButton}
        onClick={() => console.log("Edit:", product)}
      >
        +
      </button>

      <div className={styles.tooltipButtonContainer}>
        <button onClick={() => setTooltipVisible((prev) => !prev)}>💬</button>

        {tooltipVisible && (
          <div ref={tooltipRef} className={styles.tooltip}>
            <button>В Избранное</button>
            <button>На проверку</button>
            <div className={styles.tooltipDivider} />
            <button>Удалить</button>
          </div>
        )}
      </div>
    </div>
  );
};
