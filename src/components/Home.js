import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u?.displayName) setName(u.displayName);
      else if (u?.email) setName(u.email.split("@")[0]);
      else setName("");
      if (!u) navigate("/login");
      else navigate("/kinicio"); // Redirige a Kinicio si está autenticado
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="container mt-5" style={{ maxWidth: 720 }}>
      <div className="card shadow p-4">
        <h1 className="text-primary mb-3">{t("homeTitle", { defaultValue: "🏠 Inicio" })}</h1>
        {user ? (
          <>
            <p className="fs-5 fw-bold">
              {t("hello", { defaultValue: "Hola" })} {name}
            </p>
            <button className="btn btn-outline-danger" onClick={() => logout()}>
              {t("logout", { defaultValue: "Cerrar sesión" })}
            </button>
          </>
        ) : (
          <p className="fs-5 text-muted">{t("loading", { defaultValue: "Cargando..." })}</p>
        )}
      </div>
    </div>
  );
};

export default Home;
