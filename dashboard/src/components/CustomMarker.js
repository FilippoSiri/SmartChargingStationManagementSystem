import React from "react";

const CustomMarker = ({ color }) => {
    return (
        <div className="marker">
            <div className="marker-content" style={{ backgroundColor: color }}>
            </div>
        </div>
    );
};

export default CustomMarker;