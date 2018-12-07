import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, Skeleton, Modal, Button, Spin, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import { createMachineTag, deleteMachineTag, getOrganizationMachineTags} from '../../../api/organization';
import { prepareData } from '../../../api/util/helpers';
import MachineTagCreateForm from './MachineTagCreateForm';

const confirm = Modal.confirm;
// TODO think about CSSinJS for styles
const formButton = {
  type: 'primary',
  ghost: true,
  style: {
    border: 'none',
    padding: 0,
    height: 'auto',
    boxShadow: 'none'
  }
};

class MachineTagList extends React.Component {
  state = {
    list: [],
    visible: false,
    loading: true
  };

  componentDidMount() {
    // Requesting list of endpoints of Organization
    const { key } = this.props.match.params;
    getOrganizationMachineTags(key).then(response => {
      this.setState({
        list: response.data,
        loading: false
      });
    });
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  deleteEndpoint = item => {
    const { key } = this.props.match.params;
    // I have never liked assigning THIS to SELF (((
    const self = this;

    confirm({
      title: <FormattedMessage id="titleDeleteMachineTag" defaultMessage="Do you want to delete this machine tag?"/>,
      content: <FormattedMessage id="deleteEndpointMessage" defaultMessage="Are you really want to delete machine tag?"/>,
      onOk() {
        return new Promise((resolve, reject) => {
          deleteMachineTag(key, item.key).then(() => {
            // Updating endpoints list
            const { list } = self.state;
            self.setState({
              list: list.filter(endpoint => endpoint.key !== item.key)
            });

            resolve();
          }).catch(reject);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      }
    });
  };

  handleSave = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { key } = this.props.match.params;
      const preparedData = prepareData(values);

      createMachineTag(key, preparedData).then(response => {
        form.resetFields();

        const list = this.state.endpoints;
        list.push({
          ...preparedData,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName
        });

        this.setState({
          visible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, loading, visible } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationMachineTags" defaultMessage="Organization machine tags"/></h1>
          {!loading && user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>

        {loading && <Spin size="large"/>}

        {!loading ?
          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <List.Item actions={user ? [
                <Button htmlType="button" onClick={() => this.deleteEndpoint(item)} {...formButton}>
                  <FormattedMessage id="delete" defaultMessage="Delete"/>
                </Button>
              ] : []}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={
                      <React.Fragment>
                        {item.name} = {item.value}
                        <div style={{ fontSize: '12px', color: 'grey' }}>{item.namespace}</div>
                      </React.Fragment>
                    }
                    description={<FormattedRelative value={item.created}/>}
                  />
                </Skeleton>
              </List.Item>
            )}
          />
          : null}

        {visible && <MachineTagCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

export default withRouter(MachineTagList);