import { Link } from 'react-router';
import "../assets/home.css";
import { Bubbles } from '../Components/home/Bubbles';

function Home() {
    document.title = "MagicalRooms - Home"

    return (
        <div>
            <Bubbles />
            
            <div className='FirstContent'>
                <img className='logo' src="/big-logo-2.png" alt="Logo Magical Room" width="1000" height="10"></img>
                <h1>Faîtes des rencontres Magiques !</h1>
                <br/>
                <div className='button-container'>
                    <Link to={"/register"}>
                        < button className='Registerutton'>Se Connecter</button>
                    </Link>
                    
                    <Link to={"/room"}>
                        < button className='RoomButton'>Rejoindre une Room 🏠</button>
                    </Link>
                </div>
            </div>
            {/* <img className='wave-image' src="/wave.svg" alt="Wave"></img> */}
            {/* <Waves/> */}
        </div>
    )
}

export default Home;