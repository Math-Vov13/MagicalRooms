import { useEffect, useLayoutEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { FiEdit2, FiMessageCircle, FiCalendar, FiUser, FiCheck } from 'react-icons/fi';
import "../assets/profile.css";
import { Link, useNavigate, useParams } from "react-router";

function Profile() {
  const { userId } = useParams();
  const { token, getProfile, updateProfile } = useAuth();
  const [isLoading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null
    //   {
    //   name: "",
    //   avatar: "/basic-profile.jpeg",
    //   description: "",
    //   createdAt: "",
    //   // conversations: [
    //   // // { id: 1, title: "Assistance React Router", date: "19 mars 2025", preview: "Comment configurer des routes protégées..." },
    //   // // { id: 2, title: "Problème avec useState", date: "15 mars 2025", preview: "J'ai un problème avec la mise à jour d'état..." },
    //   // // { id: 3, title: "API GraphQL", date: "10 mars 2025", preview: "Quelle est la meilleure façon d'intégrer Apollo..." },
    //   // // { id: 4, title: "Configuration Webpack", date: "5 mars 2025", preview: "Je n'arrive pas à configurer correctement..." }
    //   // ]
    // }
  );

  useEffect(() => {
    const fetchData = async () => {
      setProfile(await getProfile(userId))
      setLoading(false);
    }

    if (!token) {
      setLoading(false);
    } else {
      fetchData();
    }
  }, [token])

  useEffect(() => {
    if (profile) {
      document.title = `Profil de ${profile.username}`
    } else {
      document.title = "Profil Vide"
    }
  }, [profile])

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Profil Utilisateur</h1>
      </header>
      {isLoading ? <p>Chargement du Profile...</p> : null}

      {!isLoading && !profile ? (
        userId === "me" || !token ? (
          <div>
            <h3>Il semblerait que vous n'êtes pas connecté... Connectez-vous pour voir {userId === "me" ? 'votre profil.' : 'le profil de cet utilisateur.'}</h3>
            <Link to="/register">Se Connecter</Link>
          </div>
        ) : (
          <div>
            <h3>Le profil que vous recherchez n'existe pas !</h3>
            <Link to="/">Revenir en lieu sûr</Link>
          </div>
        )
      ) : null}

      {!isLoading && profile ? (
        //  <p>Voici la page du profile de {profile.username}</p>
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-container">
              <img src={profile.avatar || '/basic-profile.jpeg'} alt={`Avatar`} />
              <button className="edit-avatar-btn">
                <FiEdit2 />
              </button>
            </div>
          </div>

          <div className="profile-info">
            <div className="editable-field">
              <div className="field-with-edit">
                <h2>{profile.username}</h2>
              </div>
            </div>

            <div className="editable-field">
              <div className="field-with-edit">
                <p className="profile-description">{profile.description || "Aucune description..."}</p>
              </div>
            </div>

            <div className="profile-metadata">
              <div className="metadata-item">
                <FiUser />
                <span>Membre depuis: {profile.createdAt || ". . ."}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* <div className="conversations-section">
          <h3>
            <span><FiMessageCircle /> Conversations récentes</span>
          </h3>
          <div className="conversations-list">
            {user.conversations.map(conv => (
              <div key={conv.id} className="conversation-card">
                <h4>{conv.title}</h4>
                <p className="conversation-preview">{conv.preview}</p>
                <div className="conversation-footer">
                  <span className="conversation-date"><FiCalendar /> {conv.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
    </div>
  )
}

export default Profile;