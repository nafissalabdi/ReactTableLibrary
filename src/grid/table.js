/* eslint-disable max-len */
import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { default as MUITable } from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Backdrop from '@material-ui/core/Backdrop';
import { CircularProgress } from '@material-ui/core';
import debounce from 'lodash.debounce';
import useApi from '../../../hooks/api';
import useError from '../../../hooks/error';
import Toolbar from './toolbar';
import TableHead from './tableHead';
import Action from './action';
import { initialize, getComparator, stableSort, buildUrl, getValue, search } from './utils';
import useStyles from './theme';

const defaultRowsPerPageOptions = [5, 10, 15, 20, 25, 30];
const defaultRowsPerPage = 15;

export const Table = (props) => {
    const classes = useStyles();
    const client = useApi();
    const errorHandler = useError();
    const { data, endPoint, columns, rowsPerPage, rowsPerPageOptions, sort, selection, rowKey, onRowClick, onSelectionChange, getRowClasses, actions, refresh } = props;

    const [state, setState] = useState({
        originalData: data ?? [],
        source: initialize(data ?? [], rowKey),
        data: [],
        columns,
        rowsPerPage: rowsPerPage ?? defaultRowsPerPage,
        rowsPerPageOptions: rowsPerPageOptions ?? defaultRowsPerPageOptions,
        page: 0,
        count: 0,
        sort,
        searchText: '',
        isLoading: false,
        selection: {
            enabled: selection,
            all: false,
            selected: [],
            unselected: [],
        },
    });

    const isRemote = Boolean(endPoint);

    const handleSelectAll = (event) => {
        setState({
            ...state,
            selection: {
                ...state.selection,
                all: event.target.checked,
                selected: [],
                unselected: [],
                count: event.target.checked ? state.count : 0,
            },
        });
    };

    const handleRowClick = (event, key, row) => {
        if (typeof onRowClick === 'function') {
            onRowClick(event, key, row);

            return;
        }

        if (selection) {
            const selected = state.selection.selected ?? [];
            const unselected = state.selection.unselected ?? [];

            const selectedIndex = selected.indexOf(key);
            const unselectedIndex = unselected.indexOf(key);

            let newSelected = [];

            let newUnselected = [];

            if (state.selection.all) {
                if (unselectedIndex === -1) {
                    newUnselected = newUnselected.concat(unselected, key);
                } else if (unselectedIndex === 0) {
                    newUnselected = newUnselected.concat(unselected.slice(1));
                } else if (unselectedIndex === unselected.length - 1) {
                    newUnselected = newUnselected.concat(unselected.slice(0, -1));
                } else if (unselectedIndex > 0) {
                    newUnselected = newUnselected.concat(
                        unselected.slice(0, unselectedIndex),
                        unselected.slice(unselectedIndex + 1),
                    );
                }
            } else if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, key);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }

            setState({
                ...state,
                selection: {
                    ...state.selection,
                    selected: newSelected,
                    unselected: newUnselected,
                    count: state.selection.all ? state.count - newUnselected.length : newSelected.length,
                },
            });
        }
    };

    const handleSelectionChange = () => {
        if (typeof onSelectionChange === 'function') {
            onSelectionChange(state.selection, state.searchText);
        }
    };

    const handlePageChange = (event, page) => {
        setState({
            ...state,
            page,
        });
    };

    const handleRowsPerPageChange = (event) => {
        setState({
            ...state,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0,
        });
    };

    const handleSort = (event, field) => {
        const isAsc = state.sort?.field === field && state.sort?.direction === 'asc';

        const newSort = {
            field,
            direction: isAsc ? 'desc' : 'asc',
        };

        setState({
            ...state,
            sort: newSort,
        });
    };

    const handleSearchTextChange = (event, value) => {
        setState({
            ...state,
            searchText: value.trim(),
            page: 0,
            selection: {
                ...state.selection,
                all: false,
                selected: [],
                unselected: [],
                count: 0,
            },
        });
    };

    const isSelected = (key) => state.selection.selected.indexOf(key) !== -1 || (state.selection.all && state.selection.unselected.indexOf(key) === -1);

    const emptyRows = state.isLoading
        ?
        state.rowsPerPage :
        state.rowsPerPage - Math.min(state.rowsPerPage, state.count - state.page * state.rowsPerPage);

    const emptyColumns = state.columns.length + (selection ? 1 : 0) + (actions?.length > 0 ? 1 : 0);

    const load = useCallback(
        debounce(async (page, rowsPerPage, sort, searchText, selection) => {
            const newState = {
                ...state,
                rowsPerPage,
                page,
                searchText,
                sort,
                isLoading: true,
                selection,
            };

            setState(newState);

            const url = buildUrl(endPoint, rowsPerPage, page, searchText, sort);

            try {
                const result = await client.get(url);

                setState({
                    ...newState,
                    source: initialize(result.data.data, rowKey),
                    count: result.data.count,
                    isLoading: false,
                });
            } catch (error) {
                setState({
                    ...state,
                    isLoading: false,
                });
                errorHandler.handle(500);
            }
        }, 200)
        , [],
    );

    useEffect(() => {
        if (isRemote) {
            load(state.page, state.rowsPerPage, state.sort, state.searchText, state.selection);
        }
    }, [state.page, state.rowsPerPage, state.sort, state.searchText, refresh]);

    useEffect(() => {
        if (!isRemote) {
            setState({
                ...state,
                source: initialize(data ?? [], rowKey),
                page: 0,
            });
        }
    }, [data, refresh]);

    useEffect(() => {
        if (isRemote) {
            setState({
                ...state,
                data: state.source,
            });
        }
    }, [state.source]);

    useEffect(() => {
        if (!isRemote) {
            const result = search(stableSort(state.source, getComparator(state.sort)), state.columns, state.searchText);

            setState({
                ...state,
                count: result.length,
                data: result.slice(state.page * state.rowsPerPage, state.page * state.rowsPerPage + state.rowsPerPage),
            });
        }
    }, [state.source, state.page, state.rowsPerPage, state.sort, state.searchText]);

    useEffect(() => {
        handleSelectionChange();
    }, [state.selection]);

    return (
            <>
            <Toolbar title={props.title} selection={state.selection} onSearchTextChange={handleSearchTextChange} /><TableContainer>
            <MUITable className={classes.table}>
                <TableHead
                    columns={state.columns}
                    classes={classes}
                    selection={state.selection}
                    sort={state.sort}
                    onSelectAll={handleSelectAll}
                    onSort={handleSort}
                    rowCount={state.count}
                    actions={actions} />
                <TableBody className={classes.body}>
                    {state.isLoading &&
                        <Backdrop className={classes.backdrop} open={true}>
                            <CircularProgress color="primary" />
                        </Backdrop>}
                    {!state.isLoading &&
                        state.data?.length > 0 &&
                        state.data.map((row, index) => {
                            const isItemSelected = isSelected(row.metaData?.key);
                            const labelId = `table-checkbox-${index}`;

                            return (
                                <TableRow
                                    onClick={(event) => handleRowClick(event, row.metaData?.key, row)}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.metaData?.key}
                                    selected={isItemSelected}
                                    className={clsx(classes.row, typeof getRowClasses === 'function' ? getRowClasses(row.metaData?.key, row) : null)}
                                >
                                    {selection === true &&
                                        <TableCell padding="checkbox" className={classes.cell}>
                                            <Checkbox
                                                checked={isItemSelected}
                                                className={classes.checkbox}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }} />
                                        </TableCell>}
                                    {state.columns.map((column, index) => (
                                        <TableCell
                                            className={classes.cell}
                                            align={column.align === 'right' ? 'right' : 'left'}
                                        >
                                            {getValue(index, column, row)}
                                        </TableCell>
                                    ))}
                                    {actions?.length > 0 &&
                                        <TableCell className={classes.cell}>
                                            {actions.map((action) => <Action {...action} data={row} />)}
                                        </TableCell>}
                                </TableRow>
                            );
                        })}
                    {emptyRows > 0 && (
                        <TableRow style={{
                            height: 36 * emptyRows,
                        }}
                        >
                            <TableCell colSpan={emptyColumns} />
                        </TableRow>
                    )}
                </TableBody>
            </MUITable>
        </TableContainer><TablePagination
                rowsPerPageOptions={state.rowsPerPageOptions}
                component="div"
                count={state.count}
                rowsPerPage={state.rowsPerPage}
                page={state.page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Lignes par page"
                backIconButtonText="Page précédente"
                nextIconButtonText="Page suivante" />
                </>
    );
};

export default Table;
