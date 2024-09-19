import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

export const Private = () => {
    const { actions } = useContext(Context);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await actions.checkToken(token);
                    if (response) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Error al verificar el token:", error);
                    setIsAuthenticated(false);
                    navigate("/login");
                }
            } else {
                setIsAuthenticated(false);
                navigate("/login");
            }
        };

        checkAuthentication();
    }, []);

    const handleLogout = async () => {
        await actions.logOut();
        navigate('/login');
    }

    if (!isAuthenticated) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h1 className="display-4">Cargando...</h1>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
            <h1 className="display-4">Welcome Again!</h1>
            <img src={rigoImageUrl} alt="Demo" className="img-fluid" />
            <hr />
            <Link to="/">
                <span onClick={handleLogout} className="btn btn-primary btn-lg" role="button">Cerrar Sesión</span>
            </Link>
        </div>
    );
};
