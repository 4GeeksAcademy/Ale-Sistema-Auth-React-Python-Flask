import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const { actions, store } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);  // Estado para el mensaje de éxito
    const navigate = useNavigate();

    useEffect(() => {
        if (store.error) {
            setError(store.error);
        } else {
            setError(null);
        }
        return () => setError(null);
    }, [store.error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const result = await actions.Signup({ email, password });

        if (result.success) {
            setSuccessMessage("Te has registrado correctamente");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                        {successMessage && <p className="alert alert-success text-success text-center">{successMessage}</p>}
                            <h2 className="card-title text-center mb-4">Registro</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Ingresa tu correo electrónico"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ingresa tu contraseña"
                                        required
                                    />
                                </div>
                                {error && <p className="text-danger text-center">{error}</p>}
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Registrarse
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

