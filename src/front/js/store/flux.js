const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem('token') || null, 
            user: null,
            message: null,
            isAuthenticated: !!localStorage.getItem('token') // true si hay un token
        },
        actions: {
            Signup: async (formData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ token: data.token, isAuthenticated: true });
                        localStorage.setItem('token', data.token);
                        return data;
                    } else {
                        const error = await response.json();
                        console.error("Error en el registro:", error);
                        return error;
                    }
                } catch (error) {
                    console.error('Error en el registro:', error);
                }
            },

            login: async (email, password) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ token: data.token, isAuthenticated: true });
                        localStorage.setItem('token', data.token);
                        return true;
                    } else {
                        const error = await response.json();
                        console.error("Error en el inicio de sesión:", error);
                        return false;
                    }
                } catch (error) {
                    console.error("Error en el inicio de sesión:", error);
                    return false;
                }
            },

            checkToken: async (token) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/token`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({ user: data.user, isAuthenticated: true });
                        return true;
                    } else {
                        setStore({ isAuthenticated: false });
                        return false;
                    }
                } catch (error) {
                    console.error("Error en la validación del token:", error);
                    setStore({ isAuthenticated: false });
                    return false;
                }
            },

            logOut: () => {
                localStorage.removeItem("token");
                setStore({ token: null, user: null, isAuthenticated: false });
                return true;
            },

            getMessage: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/hello`);
                    const data = await response.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error al obtener el mensaje del backend", error);
                }
            }
        }
    };
};

export default getState;
