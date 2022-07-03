
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';


export const Action = (props) => {
    const { tooltip, icon, color, onClick, hide, disabled, data } = props;

    if (hide) {
        return null;
    }

    return (
        <Tooltip title={tooltip} placement="bottom">
            <div>
                <IconButton
                    disabled={disabled}
                    onClick={
                        (event) => {
                            event.stopPropagation();
                            onClick(event, data);
                        }
                    }
                    color={color ?? 'default'}
                    variant="outlined"
                    size="small"
                >
                    {icon}
                </IconButton>
            </div>
        </Tooltip>
    );
};

export default Action;
