import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguajeSwitcher";
import "bootstrap/dist/css/bootstrap.min.css";

const Kinicio = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos simulados de pedidos para la demo
  const mockOrders = [
    {
      id: 1,
      product: t("product1", { defaultValue: "Laptop Gaming" }),
      status: t("statusPending", { defaultValue: "Pendiente" }),
      date: "2025-01-15",
      total: "$1,299.99",
      statusColor: "warning"
    },
    {
      id: 2,
      product: t("product2", { defaultValue: "Mouse Inalámbrico" }),
      status: t("statusDelivered", { defaultValue: "Entregado" }),
      date: "2025-01-10",
      total: "$49.99",
      statusColor: "success"
    },
    {
      id: 3,
      product: t("product3", { defaultValue: "Teclado Mecánico" }),
      status: t("statusShipping", { defaultValue: "En camino" }),
      date: "2025-01-12",
      total: "$129.99",
      statusColor: "info"
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u?.displayName) setName(u.displayName);
      else if (u?.email) setName(u.email.split("@")[0]);
      else setName("");
      
      if (!u) {
        navigate("/login");
      } else {
        // Simular carga de datos
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      }
    });
    return () => unsubscribe();
  }, [navigate, t]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t("loading", { defaultValue: "Cargando..." })}</span>
        </div>
        <p className="mt-3">{t("loadingOrders", { defaultValue: "Cargando tus pedidos..." })}</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            {t("appName", { defaultValue: "Mi Tienda" })}
          </span>
          
          <div className="d-flex align-items-center">
            <span className="text-white me-3">
              {t("welcome", { defaultValue: "Bienvenido" })}, {name}
            </span>
            <LanguageSwitcher />
            <button 
              className="btn btn-outline-light ms-3" 
              onClick={handleLogout}
            >
              {t("logout", { defaultValue: "Cerrar sesión" })}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h2 text-primary">
                {t("myOrders", { defaultValue: "Mis Pedidos" })}
              </h1>
              <button className="btn btn-success">
                {t("newOrder", { defaultValue: "Nuevo Pedido" })}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="card-title">{t("totalOrders", { defaultValue: "Total Pedidos" })}</h5>
                        <h2 className="mb-0">{orders.length}</h2>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-shopping-cart fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="card-title">{t("delivered", { defaultValue: "Entregados" })}</h5>
                        <h2 className="mb-0">{orders.filter(o => o.statusColor === 'success').length}</h2>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-check-circle fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="card-title">{t("pending", { defaultValue: "Pendientes" })}</h5>
                        <h2 className="mb-0">{orders.filter(o => o.statusColor === 'warning').length}</h2>
                      </div>
                      <div className="align-self-center">
                        <i className="fas fa-clock fa-2x opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="card shadow">
              <div className="card-header bg-white">
                <h5 className="mb-0">{t("recentOrders", { defaultValue: "Pedidos Recientes" })}</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>{t("orderNumber", { defaultValue: "N° Pedido" })}</th>
                        <th>{t("product", { defaultValue: "Producto" })}</th>
                        <th>{t("date", { defaultValue: "Fecha" })}</th>
                        <th>{t("total", { defaultValue: "Total" })}</th>
                        <th>{t("status", { defaultValue: "Estado" })}</th>
                        <th>{t("actions", { defaultValue: "Acciones" })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="fw-bold">#{order.id.toString().padStart(4, '0')}</td>
                          <td>{order.product}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td className="fw-bold text-success">{order.total}</td>
                          <td>
                            <span className={`badge bg-${order.statusColor}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2">
                              {t("view", { defaultValue: "Ver" })}
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                              {t("track", { defaultValue: "Rastrear" })}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-plus-circle fa-3x text-primary mb-3"></i>
                    <h5>{t("createOrder", { defaultValue: "Crear Nuevo Pedido" })}</h5>
                    <p className="text-muted">{t("createOrderDesc", { defaultValue: "Agrega productos a tu carrito y realiza un nuevo pedido" })}</p>
                    <button className="btn btn-primary">
                      {t("startShopping", { defaultValue: "Comenzar Compra" })}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-headset fa-3x text-info mb-3"></i>
                    <h5>{t("support", { defaultValue: "Soporte al Cliente" })}</h5>
                    <p className="text-muted">{t("supportDesc", { defaultValue: "¿Necesitas ayuda? Contacta a nuestro equipo de soporte" })}</p>
                    <button className="btn btn-info">
                      {t("contactSupport", { defaultValue: "Contactar Soporte" })}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kinicio;