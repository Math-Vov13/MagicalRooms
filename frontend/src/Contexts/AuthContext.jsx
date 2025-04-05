import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext()

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (! authContext) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    return authContext;
}


export const AuthContextProvider = ({ children }) => {
    const [lastConnection, setNewConnection] = useState()
    const [token, setToken] = useState();
    const [profile, setProfile] = useState({
        usr_name: null,
        usr_desc: null,
        usr_avater: null,
        usr_cdate: null,
    });

    console.log("Token from there:", token);

    async function getProfile(userid) {
        if (userid && token) {
            try {
                const response = await api.get(`/users/profile/${userid}`); // Peut être remplacé par du GraphQL

                if (userid === "me") {
                    setProfile(response.data);
                    localStorage.setItem("Username", response.data.username);
                }

                return response.data;
            } catch (err) {
                console.error(err);
                return null;
            }
        }
        return null;
    }

    async function updateProfile(params) {
        if (token) {
            try {
                const response = await api.patch(`/users/update`, params)
                return true;
            } catch (err) {
                console.error(err)
                return false;
            }
        }
        return false;
    }

    useLayoutEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token)
        } else {
            setToken(localStorage.getItem("authToken"))
            setProfile(null)
        }

        const authInterceptor = api.interceptors.request.use((config) => {
            console.log("Nouvelle requête !")
            config.headers.Authorization = !config._retry && token ? `Bearer ${token}` : config.headers.Authorization;
            return config;
        })

        return () => {
            api.interceptors.request.eject(authInterceptor);
        }
    }, [token]);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const {name, value} = await api.get("/users/profile");

                // setToken(response.data.token);
                console.log(name, value)
                setProfile({
                    ...profile,
                    [name]: value
                })
                console.log("New Profile:", profile)
            } catch {
                setToken(null);
                setProfile(null);
                setNewConnection(null);
            }
        }

        console.log("New Token set !", token)
        if (token) {
            fetchMe();
        }
    }, []);


    // const logout = async () => {
    //     try {
    //         await axios.delete('/api/v1/groups/users/auth', { withCredentials: true }); // Call the logout API if necessary
    //     } catch (error) {
    //       console.error("Logout Error:", error);
    //     } finally {
    //         setToken(null);
    //         setUser(null); // Clear user data
        
    //         // Redirect to '/profiles' after logout instead of '/login'
    //         const navigate = useNavigate();
    //         navigate("/profile");
    //     }
    // };


    return (
        <AuthContext.Provider value={{token, setToken, profile, setProfile, lastConnection, setNewConnection, getProfile, updateProfile}}>
            { children }
        </AuthContext.Provider>
    )
}