import React from "react";
import "./style.scss";

const Badge = ({major = null, grade = null, className = ''}) => {
    return (
        major ? (
            <span className={`badge badge-${major} ${className}`}>{major}</span>
        ) : (
            <span className={`badge badge-${grade} ${className}`}>{grade}</span>
        )

    );
};

export default Badge;