import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    table: {
        width: '100%',
    },
    body: {
        position: 'relative',
    },
    row: {
        cursor: 'pointer',
        '&:nth-of-type(even):not(.Mui-selected)': {
            backgroundColor: 'rgba(207, 216, 220, 0.3)',
            '&:hover': {
                backgroundColor: 'rgba(176, 190, 197, 0.3)',
            },
        },
        '&:hover': {
            backgroundColor: 'rgba(176, 190, 197, 0.3)',
        },
    },
    cell: {
        padding: 8,
        border: 'none',
    },
    head: {
        whiteSpace: 'pre',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '& th': {
            color: theme.palette.primary.main,
            borderRight: '1px solid rgba(0, 0, 0, 0.2)',
            textTransform: 'uppercase',
            '&:last-of-type': {
                border: 'none',
            },
        },
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    backdrop: {
        position: 'absolute',
        background: 'transparent',
    },
    checkbox: {
        padding: 0,
    },
    success: {
        borderTop: '1px solid #2e7d32',
        borderBottom: '1px solid #2e7d32',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        '&:nth-of-type(even):not(.Mui-selected)': {
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.4)',
            },
        },
        '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.4)',
        },
        '& td': {
            color: '#2e7d32',
        },
    },
    warningText: {
        '& td': {
            color: '#ef6c00',
        },
    },
    info: {
        borderTop: '1px solid #0277bd',
        borderBottom: '1px solid #0277bd',
        backgroundColor: 'rgba(3, 169, 244, 0.2)',
        '&:nth-of-type(even):not(.Mui-selected)': {
            backgroundColor: 'rgba(3, 169, 244, 0.2)',
            '&:hover': {
                backgroundColor: 'rgba(3, 169, 244, 0.4)',
            },
        },
        '&:hover': {
            backgroundColor: 'rgba(3, 169, 244, 0.4)',
        },
        '& td': {
            color: '#0277bd',
        },
    },
    error: {
        borderTop: '1px solid #c62828',
        borderBottom: '1px solid #c62828',
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        '&:nth-of-type(even):not(.Mui-selected)': {
            backgroundColor: 'rgba(244, 67, 54, 0.2)',
            '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.4)',
            },
        },
        '&:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.4)',
        },
        '& td': {
            color: '#c62828',
        },
    },
    warning: {
        borderTop: '1px solid #ef6c00',
        borderBottom: '1px solid #ef6c00',
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
        '&:nth-of-type(even):not(.Mui-selected)': {
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            '&:hover': {
                backgroundColor: 'rgba(255, 152, 0, 0.4)',
            },
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 152, 0, 0.4)',
        },
        '& td': {
            color: '#ef6c00',
        },
    },
}));

export default useStyles;
