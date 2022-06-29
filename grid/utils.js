export const descendingComparator = (a, b, orderBy) => {
    if (byString(b, orderBy) < byString(a, orderBy)) {
        return -1;
    }

    if (byString(b, orderBy) > byString(a, orderBy)) {
        return 1;
    }

    return 0;
};

export const getComparator = (sort) => sort.direction === 'desc'
    ? (a, b) => descendingComparator(a, b, sort.field)
    : (a, b) => -descendingComparator(a, b, sort.field);

export const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) {
            return order;
        }

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
};

export const byString = (o, s) => {
    if (!s) {
        return;
    }

    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    const a = s.split('.');

    for (let i = 0, n = a.length; i < n; ++i) {
        const x = a[i];

        if (o && x in o) {
            o = o[x];
        } else {
            return;
        }
    }

    return o;
};

export const setByString = (obj, path, value) => {
    let schema = obj;

    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    const pList = path.split('.');

    const len = pList.length;

    for (let i = 0; i < len - 1; i++) {
        const elem = pList[i];

        if (!schema[elem]) {
            schema[elem] = {
            };
        }
        schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
};

export const buildUrl = (endpoint, rowsPerPage, page, searchText, sort) => {
    let url = endpoint;

    url += `${(url.split('?')[1] ? '&' : '?')}`;
    url += `take=${rowsPerPage}`;
    url += `&page=${page + 1}`;
    url += `&search=${searchText ?? ''}`;

    if (sort?.field) {
        url += `&sort=${sort.field}`;

        if (sort.direction) {
            url += `&descending=${sort.direction === 'desc'}`;
        }
    }

    return url;
};

export const getKey = (index, key, row) => byString(row, key);

export const getLabel = (column) => typeof column?.label === 'function' ? column.label(column) : column.label;

export const getValue = (index, column, row) => typeof column?.render === 'function' ? column.render(index, column, row) : byString(row, column.field);

export const search = (data, columns, value) => {
    if (value) {
        return data.filter((row) => columns
            .filter((column) => column.searchable !== false)
            .some((column) => {
                if (typeof column.search === 'function') {
                    return Boolean(columnDef.search(value, column, row));
                } else if (column.field) {
                    const fieldValue = byString(row, column.field);

                    if (fieldValue) {
                        return fieldValue.toString().toUpperCase()
                            .includes(value.toUpperCase());
                    }
                }
            }));
    }

    return data;
};

export const initialize = (data, key) => {
    if (data?.length > 0 && key) {
        data.forEach((row, index) => {
            row.metaData = {
                key: getKey(index, key, row),
            };
        });
    }

    return data?.slice();
};
