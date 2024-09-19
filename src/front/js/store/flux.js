const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem('token') || null, 
            user: '',
            message: null,
            isAuthenticated: !!localStorage.getItem('token'),
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
                        setStore({ token: data.token });
                        localStorage.setItem('token', data.token);
                        return { success: true };
                    } else {
                        const error = await response.json();
                        console.error("Error en el registro:", error);
                        return { success: false, error: error.msg || "Error desconocido" };
                    }
                } catch (error) {
                    console.error('Error en el registro:', error);
                    return { success: false, error: "Error de red o servidor" };
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
                        setStore({ user: data.user, token: data.token, isAuthenticated: true, message: null });
                        localStorage.setItem('token', data.token);
                        return { success: true };
                    } else {
                        const error = await response.json();
                        setStore({ message: error.msg });
                        console.error("Error en el inicio de sesión:", error);
                        return { success: false, error: error.msg };
                    }
                } catch (error) {
                    console.error("Error en el inicio de sesión:", error);
                    return { success: false, error: "Error de red o servidor" };
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
                        setStore({ user: data, isAuthenticated: true });
                        return {success: true};
                    } else {
                        setStore({ isAuthenticated: false });
                        return {success: false, error: error.msg};
                    }
                } catch (error) {
                    console.error("Error en la validación del token:", error);
                    setStore({ isAuthenticated: false });
                    return {success: false, error: error.msg};
                }
            },

            logOut: () => {
                localStorage.removeItem("token");
                setStore({ token: null, user: null, isAuthenticated: false });
                return { success: true };
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
