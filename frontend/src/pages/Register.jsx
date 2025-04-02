import React, { useEffect, useState } from 'react';
import api from '../api';
import "../assets/register.css";
import { Link, useNavigate } from 'react-router';
import { useAuth } from "../Contexts/AuthContext";

function RegisterPage() {
    const [ pageState, setPageState ] = useState("Login") // ENUM("Login", "SignIn", "Profile")
    const [credentials, setCredentials] = useState({
        usrname: '',
        email: '',
        password: '',
        usrdesc: '',
        avatar: ''
      });
    const [isLoading, setLoading] = useState(false);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
          ...credentials,
          [name]: value
        });
    };

    const { setToken, setProfile, setNewConnection } = useAuth()
    const navigate = useNavigate();

    // Gestion du message de succès
    useEffect(() => {
        let successTimer;
        
        if (success) {
            // Timer pour effacer le message de succès après 5 secondes
            successTimer = setTimeout(() => {
                setSuccess('');
            }, 4000);
        }
        
        // Nettoyer les timers lors du démontage du composant
        return () => {
        clearTimeout(successTimer);
        };
    }, [success]);

    useEffect(() => {
        document.title = pageState
    }, [pageState])


    async function handleRegister() {
        try {
            return await api.post("/users/register", {
                username: credentials.usrname,
                email: credentials.email,
                password: credentials.password
            })
        } catch (err) {
            if (err.status === 409) {
                setError("This email is already taken! Please choose an other one or try to login with this account.");
            } else {
                console.error(err);
                setError("An error has occured while trying to fetch data! Please try again later.");
            }
        }
    }

    async function handleLogin() {
        try {
            return await api.post("/users/login", {
                email: credentials.email,
                password: credentials.password
            })
        } catch (err) {
            if (err.status === 404) {
                setError("This account doesn't exists! Try with an other password or change it.");
            } else {
                console.error(err);
                setError("An error has occured while trying to fetch data! Please try again later.");
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(null);
        setError(null);
        setLoading(true);

        if ( (pageState === "SignIn" && !credentials.usrname) || !credentials.email || !credentials.password) {
            setError('Please, complete all fields.');
            setLoading(false);
            return;
        }
        if (credentials.email === "test@email.com") {
            setError("You've just used a placeholder email address? Please provide a valid one!");
            setLoading(false);
            return;
        }

        if (pageState === "SignIn" && credentials.usrname.length < 6) {
            setError("Username must contain at least 6 characters!")
            setLoading(false);
            return;
        }
        if (credentials.password.length < 8) {
            setError("Password must contain at least 8 characters!")
            setLoading(false);
            return;
        }

        if (pageState === "Login") {
            const response = await handleLogin();
            if (response) {
                // console.log("Token:", response.data.token);

                setToken(response.data.token);
                setNewConnection(new Date());
                setProfile({
                    usr_name: "John Doe"
                })

                setTimeout(() => {
                    navigate('/profile/me');
                }, 3000);
                setSuccess("Connected! You'll be redirect in a few seconds...");
                return;
            }

        } else {
            const response = await handleRegister();
            if (response) {
                setSuccess('Account created! You can now customize your profile!');
                setPageState("Login");
            }
        }
        setLoading(false);
    }


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">{pageState === "Login"? "Inscription": (pageState === "SignIn"? "Connexion": "Compte") }</h1>
          <p className="login-subtitle">Veuillez {pageState === "Login"? "vous inscrire": (pageState === "SignIn"? "vous connecter": "finaliser la configuration de votre compte") } pour continuer</p>
        </div>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {success && (
          <div className="login-success">
            {success}
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}
        
        
        <form className="login-form" onSubmit={handleSubmit}>
            
            {pageState === "SignIn"? 
            <div htmlFor="usrname" className="form-group">
                <label className="form-label">
                Username
                </label>
                <input
                id="usrname"
                name="usrname"
                type="text"
                autoComplete="username"
                required
                className="form-input"
                placeholder="username"
                value={credentials.usrname}
                onChange={handleChange}
                />
            </div>: null}

            {pageState !== "Profile"?
            <div className="form-group">
                <label htmlFor="email" className="form-label">
                Adresse e-mail
                </label>
                <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="test@email.com"
                value={credentials.email}
                onChange={handleChange}
                />
            </div>: null}
          
            {pageState !== "Profile"?
            <div className="form-group">
                <label htmlFor="password" className="form-label">
                Mot de passe
                </label>
                <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                />
            </div>: null}

            {pageState === "Profile"? 
            <div htmlFor="usrdesc" className="form-group">
                <label className="form-label">
                Description
                </label>
                <textarea
                id="usrdesc"
                name="usrdesc"
                autoComplete="description"
                required
                className="form-input"
                placeholder="Décrivez-vous pour les autres!"
                value={credentials.usrdesc}
                onChange={handleChange}
                />
            </div>: null}
            
            {pageState === "Login"?
            <div className="login-options">
                <div className="remember-me">
                <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="checkbox-input"
                />
                <label htmlFor="remember-me" className="checkbox-label">
                    Se souvenir de moi
                </label>
                </div>
                
                <Link className='forgot-password' to={"/forgot-password"}>
                    Mot de passe oublié?
                </Link>
            </div> : <br/>}
            
            <button
                type="submit"
                disabled={isLoading}
                className="login-button"
            >
                {isLoading && pageState !== "Profile" ? 'Connexion en cours...' : pageState === "Login"? "Se Connecter": "S'inscrire"}
            </button>
            {pageState === "Profile"?
            
            <button
                className="login-button"
            >
                Passer cette étape
            </button>: null}
        </form>
        
        {pageState !== "Profile"?
        <div className="signup-link-container">
          <p className="signup-text">
            {pageState === "Login" ? "Vous n'avez pas de compte? ": "Vous avez déjà un compte ? "}
            <a disabled={isLoading} onClick={()=> {setPageState(pageState === "Login"? "SignIn": "Login"); setError(null)}} className="signup-link">
              {pageState === "Login"? "S'inscrire": "Se Connecter"}
            </a>
          </p>
        </div>: null }
      </div>
    </div>
  );
}

export default RegisterPage;