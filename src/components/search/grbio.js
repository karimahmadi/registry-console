import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import DataTable from '../DataTable';
import DataQuery from '../DataQuery';
import { collectionSearch } from '../../api/grbio.collection';
import { institutionSearch } from '../../api/grbio.institution';
import { personSearch } from '../../api/grbio.person';
import { standardColumns } from './columns';

const collectionsTitle = { id: 'title.collections', defaultMessage: 'Collections | GBIF Registry' };
const institutionsTitle = { id: 'title.institutions', defaultMessage: 'Institutions | GBIF Registry' };
const personsTitle = { id: 'title.persons', defaultMessage: 'Persons | GBIF Registry' };
const collectionsListName = <FormattedMessage id="collections" defaultMessage="Collections"/>;
const institutionsListName = <FormattedMessage id="institutions" defaultMessage="Institutions"/>;
const personsListName = <FormattedMessage id="persons" defaultMessage="Persons"/>;
const typeSearch = <FormattedMessage id="search" defaultMessage="Search"/>;

const collectionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    width: '400px',
    render: (text, record) => <Link to={`/grbio/collection/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const CollectionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={collectionSearch}
    initQuery={initQuery}
    listType={[collectionsListName, typeSearch]}
    render={props => <DataTable {...props} columns={collectionColumns} title={collectionsTitle} searchable/>}/>;
};

const institutionColumns = [
  {
    title: <FormattedMessage id="name" defaultMessage="Name"/>,
    dataIndex: 'name',
    render: (text, record) => <Link to={`/grbio/institution/${record.key}`}>{text}</Link>
  },
  ...standardColumns
];

export const InstitutionSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={institutionSearch}
    initQuery={initQuery}
    listType={[institutionsListName, typeSearch]}
    render={props => <DataTable {...props} columns={institutionColumns} title={institutionsTitle} searchable/>}/>;
};

const personColumns = [
  {
    title: <FormattedMessage id="firstName" defaultMessage="Name"/>,
    dataIndex: 'firstName',
    render: (text, record) => <Link to={`/grbio/person/${record.key}`}>{text}</Link>
  },
  {
    title: <FormattedMessage id="email" defaultMessage="Email"/>,
    dataIndex: 'email'
  },
  ...standardColumns
];

export const PersonSearch = ({ initQuery = { q: '', limit: 25, offset: 0 } }) => {
  return <DataQuery
    api={personSearch}
    initQuery={initQuery}
    listType={[personsListName, typeSearch]}
    render={props => <DataTable {...props} columns={personColumns} title={personsTitle} searchable/>}/>;
};
