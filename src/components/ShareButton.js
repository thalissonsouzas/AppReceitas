import React, { useState } from 'react';
import copy from 'clipboard-copy';
import PropTypes from 'prop-types';
import shareIcon from '../images/shareIcon.svg';

function ShareButton({ type, id }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = `http://localhost:3000/${type}s/${id}`;
    setCopied(true);
    copy(url);
  };

  return (
    <>
      <button
        type="button"
        data-testid="share-btn"
        onClick={ copyLink }
        src={ shareIcon }
      >
        <img src={ shareIcon } alt="share icon" />
      </button>
      { copied && <p>Link copied!</p> }
    </>
  );
}

ShareButton.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.shape().isRequired,
};

export default ShareButton;
