import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Transition } from 'react-transition-group';

const transitionStyles: Record<string, { opacity: number }> = {
    entering: { opacity: 0.9 },
    entered: { opacity: 1 },
    exiting: { opacity: 0.1 },
    exited: { opacity: 0 },
    unmounted: { opacity: 0 },
};

export const FadeIn = ({ in: inProp, children, duration }: { in: boolean; children: any; duration: number }) => {
    const defaultStyle = useMemo(
        () => ({
            transition: `opacity ${duration}ms ease-in-out`,
            opacity: 0,
        }),
        [duration],
    );

    return (
        <Transition in={inProp} timeout={duration}>
            {(state) => {
                return (
                    <div
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                            display: 'flex',
                            flex: 1,
                        }}
                    >
                        {children}
                    </div>
                );
            }}
        </Transition>
    );
};
FadeIn.propTypes = {
    in: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
    duration: PropTypes.number,
};
FadeIn.defaultProps = {
    children: null,
    in: false,
    duration: 500,
};
