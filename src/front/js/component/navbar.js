import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogout = async () => {
		await actions.logOut();
		navigate('/login');
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						{store.isAuthenticated ? "Welcome!" : "Registrate gratis!"}
					</span>
				</Link>
				<div className="d-flex">
					{store.isAuthenticated ? (
						<button className="btn btn-primary" onClick={handleLogout}>
							Cerrar sesión
						</button>
					) : (
						<Link to="/login">
							<button className="btn btn-primary">
								¿Ya tienes cuenta? Inicia sesión.
							</button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};
