import React from 'react'
import PropTypes from 'prop-types'

const Loading = ({ text, color, size, borderColor }) => {

  const style = {
    color: color || '#dbdbdb',
    borderColor: borderColor || '#526980',
    fontSize: size || '.5em'
  }

  return <div className="Loading">
    <div style={style} className="Spinner" />
    {text && <div className="LoadingText">{text}</div>}
  </div>
}


Loading.propTypes = {
  /**
   * color
  */
  color: PropTypes.string,
  /**
    * border color
  */
  borderColor: PropTypes.string,
  /**
   * Loading size
  */
  size: PropTypes.string
}

export default Loading
