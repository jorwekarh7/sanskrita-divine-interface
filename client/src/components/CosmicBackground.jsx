    import StarfieldCanvas from "./StarfieldCanvas";

    export default function CosmicBackground() {
    return (
        <div className="cosmic-bg">
        <StarfieldCanvas />
        <div className="cosmic-grad" />
        <div className="cosmic-vignette" />
        <div className="cosmic-noise" />
        </div>
    );
    }
