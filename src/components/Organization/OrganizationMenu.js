import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Row } from 'antd';
import { FormattedMessage } from 'react-intl';

const OrganizationMenu = (props) => {
  const { children, counts, publishedDataset, hostedDataset, installations, match } = props;
  const { location, history } = props;

  return (
    <div style={{ background: 'white' }}>
      <Row type="flex" justify="start">
        <Menu
          onClick={(e) => {
            history.push(e.key);
          }}
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          style={{ width: 256 }}
          mode="inline"
        >
          <Menu.Item key={`/organization/${match.params.key}`}>
            <FormattedMessage id="overview" defaultMessage="Overview"/>
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/contact`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="contacts" defaultMessage="Contacts"/> ({counts.contacts})
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/endpoint`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="endpoints" defaultMessage="Endpoints"/> ({counts.endpoints})
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/identifier`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="identifiers" defaultMessage="Identifiers"/> ({counts.identifiers})
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/tag`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="tags" defaultMessage="Tags"/> ({counts.tags})
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/machineTag`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="machineTags" defaultMessage="Machine Tags"/> ({counts.machineTags})
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/comment`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="comments" defaultMessage="Comments"/> ({counts.comments})
          </Menu.Item>
          <Menu.Item
            key={`/organization/${match.params.key}/publishedDataset`}
            disabled={match.params.key === 'create'}
          >
            <FormattedMessage id="publishedDataset" defaultMessage="Published Dataset"/> ({publishedDataset})
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/hostedDataset`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="hostedDataset" defaultMessage="Hosted Dataset"/> ({hostedDataset})
          </Menu.Item>
          <Menu.Item key={`/organization/${match.params.key}/installation`} disabled={match.params.key === 'create'}>
            <FormattedMessage id="installations" defaultMessage="Installations"/> ({installations})
          </Menu.Item>
        </Menu>
        <div style={{ padding: 16, width: 'calc(100% - 256px)' }}>
          {children}
        </div>
      </Row>
    </div>
  );
};

export default withRouter(OrganizationMenu);