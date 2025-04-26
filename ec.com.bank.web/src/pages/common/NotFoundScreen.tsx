import NotFoundImage from 'styles/images/PageNotFound.png'
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import Logo from 'styles/images/Logo.png'
import React from "react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  const handleRedirect = (): void => {
      navigate("/");
  };

  const shouldShowLogo: boolean = true;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: '#fffff',
        padding: "3.5rem"
      }}
    >
      <div style={{ flex: 1, textAlign: "left", paddingRight: "20px" }}>
        {shouldShowLogo && (
          <div style={{ marginBottom: "20px" }}>
            <img src={Logo} alt="logo" style={{ width: "25%", height: '25%' }}/>
          </div>
        )}
        <div className="no-select" style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "70px", fontWeight: 'bold' }}>
            Ooops...
          </h1>
        </div>
        <div className="no-select" style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "50px", color: "#333" }}>
            Página no encontrada
          </span>
        </div>
        <div className="no-select" style={{ marginBottom: "20px" }}>
          <span style={{ fontSize: "30px", color: "#666" }}>
            La página que estás buscando no existe o ocurrió un error. Por favor, vuelve a inicio.
          </span>
        </div>
        <Button
          label="Regresar"
          onClick={handleRedirect}
        />
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <img
          src={NotFoundImage}
          alt="not-found"
          style={{ width: "100%", height: '100%' }}
        />
      </div>
    </div>
  );
};

export default NotFound;