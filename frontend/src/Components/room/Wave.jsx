import "./Wave.css"

export const Wave = () => {
    return (
        <div className="ocean">
        <div className="water-texture"></div>
        <div className="ripple-container">
            <div className="ripple"></div>
            <div className="ripple"></div>
            <div className="ripple"></div>
            <div className="ripple"></div>
        </div>
    </div>)
}