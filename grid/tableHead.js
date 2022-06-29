import TableCell from '@material-ui/core/TableCell';
import { default as MUITableHead } from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { getLabel } from './utils';

export const TableHead = (props) => {
    const { classes, columns, selection, onSelectAll, sort, rowCount, onSort, actions } = props;

    const createSortHandler = (property) => (event) => {
        onSort(event, property);
    };

    return (
        <MUITableHead>
            <TableRow className={classes.head}>
                {
                    selection.enabled === true &&
                    <TableCell padding="checkbox" className={classes.cell}>
                        <Checkbox
                            indeterminate={selection.all && selection.unselected.length > 0}
                            checked={(selection.all && selection.unselected.length === 0) || (rowCount > 0 && selection.selected.length === rowCount)}
                            onChange={onSelectAll}
                            className={classes.checkbox}
                            inputProps={
                                {
                                    'aria-label': 'Tout sélectionner',
                                }
                            }
                        />
                    </TableCell>
                }
                {
                    columns.map((column) => (
                        <TableCell
                            key={column.field}
                            className={classes.cell}
                            align={column.align === 'right' ? 'right' : 'left'}
                            sortDirection={sort?.field === column.field ? sort?.direction : false}
                        >
                            <TableSortLabel
                                active={sort?.field === column.field}
                                direction={sort?.field === column.field ? sort?.direction : 'asc'}
                                onClick={createSortHandler(column.field)}
                            >
                                {getLabel(column)}
                            </TableSortLabel>
                        </TableCell>
                    ))
                }
                {
                    actions?.length > 0 &&
                    <TableCell className={classes.cell} />
                }
            </TableRow>
        </MUITableHead>
    );
};

export default TableHead;
