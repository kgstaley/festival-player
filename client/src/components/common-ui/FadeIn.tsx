import PropTypes from "prop-types";
import { Transition } from "react-transition-group";

const duration = 1000;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

export const FadeIn = ({
  in: inProp,
  children,
}: {
  in: boolean;
  children: any;
}) => {
  return (
    <Transition in={inProp} timeout={duration} unmountOnExit={false}>
      {(state) => (
        <div style={{ ...defaultStyle, ...transitionStyles[state] }}>
          {children}
        </div>
      )}
    </Transition>
  );
};
FadeIn.propTypes = {
  in: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]).isRequired,
};
FadeIn.defaultProps = {
  in: false,
};
