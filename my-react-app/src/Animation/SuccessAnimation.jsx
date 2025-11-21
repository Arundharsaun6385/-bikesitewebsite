// src/components/SuccessAnimation.jsx
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const SuccessAnimation = ({ style }) => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        fetch("/animations/success.json")
            .then((res) => res.json())
            .then(setAnimationData);
    }, []);

    return animationData ? (
        <Lottie animationData={animationData} loop={false} style={style} />
    ) : null;
};

export default SuccessAnimation;
