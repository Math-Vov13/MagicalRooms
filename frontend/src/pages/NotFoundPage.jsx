import { Link } from "react-router";

const NotFoundPage = () => {
    return (
        <div>
            <h1>This Page doesn't exists ! (You can try to call a wizzard 🧙‍♂️)</h1>
            <br/><br/>
            <center>OR</center>
            <br/><br/>
            <h3>Return in Safe Place:</h3>
            <br/>
            <Link to={"/"}>
                <button>Magic Button ✨</button>
            </Link>
        </div>
    )
}

export default NotFoundPage;