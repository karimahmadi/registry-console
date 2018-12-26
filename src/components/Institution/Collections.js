import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { collectionSearch } from '../../api/grbio.collection';
import DataTable from '../widgets/DataTable';
import DataQuery from '../DataQuery';
import { standardColumns } from '../search/columns';

const columns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/grbio/collection/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

const Collections = ({ institutionKey }) => {
  return (
    <React.Fragment>
      <h2>
        <FormattedMessage id="collections" defaultMessage="Collections"/>
      </h2>
      <DataQuery
        api={collectionSearch}
        initQuery={{ institution: institutionKey, q: '', limit: 25, offset: 0 }}
        render={props => <DataTable {...props} columns={columns}/>}
      />
    </React.Fragment>
  );
};

export default Collections;