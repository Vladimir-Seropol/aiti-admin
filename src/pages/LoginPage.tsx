import { useForm } from "react-hook-form";
import { useAuthStore } from "../features/auth/authStore";
import { api } from "../shared/api/axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../shared/ui/Input/Input";
import { Button } from "../shared/ui/Button/Button";
import { Checkbox } from "../shared/ui/Checkbox/Checkbox"; // Импортируем Checkbox
import styles from "./LoginPage.module.css";
import { useState } from "react";
import { AxiosError } from "axios";

interface FormValues {
  username: string;
  password: string;
  remember: boolean;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      remember: false,
    },
  });

  const rememberValue = watch("remember");

  const onSubmit = async (data: FormValues) => {
    setApiError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: data.username,
        password: data.password,
      });

      login(response.data.token, data.remember);
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setApiError(error.response?.data?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    console.log("Переход на регистрацию");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bg}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.card}>
          <img className={styles.logo} src="/Logo.png" alt="Logo" loading="lazy" />
          <h2 className={styles.title}>
            Добро пожаловать!
            <p className={styles.subtitle}>Пожалуйста, авторизуйтесь</p>
          </h2>

          <Input
            type="text"
            placeholder="Логин"
            {...register("username", { required: "Введите логин" })}
            onChange={() => setApiError("")}
          />
          {errors.username && (
            <p className={styles.error}>{errors.username.message}</p>
          )}

          <Input
            type="password"
            placeholder="Пароль"
            {...register("password", { required: "Введите пароль" })}
            onChange={() => setApiError("")}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}

          <label className={styles.remember}>
            <Checkbox
              checked={rememberValue}
              onChange={(e) => setValue("remember", e.target.checked)}
            />
            Запомнить меня
          </label>

          {apiError && <p className={styles.error}>{apiError}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </Button>

          <div className={styles.divider}>или</div>

          <div className={styles.registerPrompt}>
            <span className={styles.registerText}>Нет аккаунта?</span>
            <Button type="button" variant="link" onClick={handleRegisterClick}>
              Создать
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};