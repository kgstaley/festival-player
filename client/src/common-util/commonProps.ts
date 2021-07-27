import PropTypes from "prop-types";

export const userProps = {
  country: PropTypes.string,
  display_name: PropTypes.string,
  email: PropTypes.string,
  external_urls: PropTypes.shape({
    spotify: PropTypes.string,
  }),
  id: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      height: PropTypes.number,
      url: PropTypes.string,
      width: PropTypes.number,
    })
  ),
  product: PropTypes.oneOf(["premium", "free"]),
  type: PropTypes.string,
  uri: PropTypes.string,
};
