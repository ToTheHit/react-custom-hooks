import { useState, useEffect } from 'react';

export default (ref, threshold = 0.5, disableAfterFirstDisplay = true) => {
    const [isVisible, setIsVisible] = useState(false);

    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsVisible(entry.isIntersecting);
            if (entry.isIntersecting && disableAfterFirstDisplay) {
                observer.disconnect();
            }
        },
        {
            threshold: threshold
        }
    );

    useEffect(() => {
        if (!ref.current) return console.error('Custom hook "inView": Ref not found');
        else {
            observer.observe(ref.current);
        }

        return () => observer.unobserve(ref.current);
    }, [ref]);

    return isVisible;
}
