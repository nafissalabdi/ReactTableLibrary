
import React from 'react';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { default as MUIToolbar } from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchInput from '../searchInput';
import useDialog from '../../../hooks/dialog';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
    },
    highlight:
    theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
        },
    title: {
        flex: '1 1 100%',
    },
}));


export const Toolbar = (props) => {
    const classes = useToolbarStyles();
    const { title, selection, onSearchTextChange } = props;
    const dialog = useDialog();

    const filtering = () => {
        dialog.filterTable();
    };

    const hasSelection = () => selection?.all || selection?.selected?.length > 0 || selection?.unselected?.length > 0;

    return (
        <MUIToolbar
            className={
                clsx(classes.root, {
                    [classes.highlight]: hasSelection(),
                })
            }
        >
            {
                hasSelection()
                    ? (
                        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                            {selection.count} enregistrement(s) selectionné(s)
                        </Typography>
                    )
                    : (
                        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                            { title }
                        </Typography>
                    )
            }
            <>
                <Tooltip title="Filter list" onClick={filtering} placement="bottom">
                    <div>
                        <IconButton aria-label="filter list" disabled>
                            <FilterListIcon />
                        </IconButton>
                    </div>
                </Tooltip>
                <SearchInput onChange={onSearchTextChange} debounceWait={500} />
            </>
        </MUIToolbar>
    );
};

export default Toolbar;
