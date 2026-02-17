import { useForm } from "react-hook-form";
import { Button } from "../shared/ui/Button/Button";
import { Input } from "../shared/ui/Input/Input";
import styles from "./ProductModal.module.css";
import { Product } from "../shared/types/product";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, "id">) => void;
}

interface FormValues {
  title: string;
  price: number;
  brand: string;
}

export const ProductModal = ({ isOpen, onClose, onAdd }: Props) => {
  const { register, handleSubmit, reset } = useForm<FormValues>();


  const onSubmit = (data: FormValues) => {

    const newProduct: Omit<Product, "id"> = {
      title: data.title,
      price: data.price,
      brand: data.brand,
      rating: 0,
      category: "unknown",
    };

     console.log(' ProductModal: Создан новый товар', newProduct);
    
    onAdd(newProduct);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Добавить товар</h3>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            placeholder="Название"
            {...register("title", { required: true })}
          />
          <Input
            placeholder="Бренд"
            {...register("brand", { required: true })}
          />
          <Input
            type="number"
            placeholder="Цена"
            {...register("price", { required: true, valueAsNumber: true })}
          />
          <div className={styles.actions}>
            <Button type="submit">Добавить</Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};