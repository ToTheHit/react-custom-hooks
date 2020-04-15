import { useState, useEffect, useCallback } from 'react';

/**
 * @param ref - React.ref to element
 * @param topOffset - Offset in percent (0 - 100)
 * @param disableAfterFullDisplay
 * @param throttleDelay - Delay for scroll event listener in ms
 * @returns {number}
 */
export default (ref, topOffset = 0, disableAfterFullDisplay = true, throttleDelay = 50) => {
    const [percent, setPercent] = useState(0);

    // eslint-disable-next-line no-extend-native
    Function.prototype.throttle = function(delay = 100, ignoreLast = false) {
        let func = this;
        let lastTime = 0;
        let timer;

        return function() {
            let self = this, args = arguments;
            let exec = function () {
                lastTime = new Date();
                func.apply(self, args);
            };
            if(timer) {
                clearTimeout(timer);
                timer = null;
            }
            let diff = new Date() - lastTime;
            if (diff > delay) {
                exec();
            } else if(!ignoreLast) {
                timer = setTimeout(exec, delay - diff);
            }
        };
    };

    function percentageSeen() {
        // Get the relevant measurements and positions
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        const elementOffsetTop = ref.current.offsetTop;
        console.log();
        const elementHeight = -1 * ref.current.offsetHeight + ref.current.getBoundingClientRect().height * topOffset / 100;

        // Calculate percentage of the element that's been seen
        const distance = scrollTop + viewportHeight - elementOffsetTop;
        const percentage = Math.round(
            distance / ((viewportHeight + elementHeight) / 100)
        );
        // Restrict the range to between 0 and 100
        setPercent(Math.min(100, Math.max(0, percentage)));
    }

    // Используется useCallback для того, чтобы в дальнейшем применить removeEventListener.
    // Без useCallback ссылка на функцию percentageSeen сбивается при каждом ререндере родительского компонента
    const onScroll = useCallback(percentageSeen.throttle(throttleDelay, false), [])

    useEffect(() => {
        if (disableAfterFullDisplay && percent === 100) {
            window.removeEventListener("scroll", onScroll);
        }
    }, [percent]);

    useEffect(() => {
        if (ref.current) {

        }
        if (!ref.current) return console.error('Custom hook "inViewportPercentage": Ref not found');
        else {
            percentageSeen();
            window.addEventListener("scroll", onScroll);
        }

        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [onScroll, percentageSeen, ref]);


    return percent;
}

// export default inViewportPercentage;