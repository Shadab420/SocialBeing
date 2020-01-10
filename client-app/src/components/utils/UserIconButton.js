import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

export default ({children, onClick, tip, btnClassName, tipClassName}) => (

    <Tooltip title={tip} classNmae={tipClassName} placement="top-start">
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>
)

