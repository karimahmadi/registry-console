import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Modal, Button, Row } from 'antd';
import { FormattedRelative, FormattedMessage } from 'react-intl';

import CommentCreateForm from './CommentCreateForm';

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

class CommentList extends React.Component {
  state = {
    list: this.props.data || [],
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleDelete = item => {
    Modal.confirm({
      title: <FormattedMessage id="deleteTitle.comment" defaultMessage="Do you want to delete this?"/>,
      content: <FormattedMessage id="deleteMessage.comment" defaultMessage="Are you really want to delete?"/>,
      onOk: () => {
        return this.deleteComponent(item);
      },
      onCancel: () => {}
    });
  };

  deleteComponent = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteComment(item.key).then(() => {
        // Updating list
        const { list } = this.state;
        this.setState({
          list: list.filter(el => el.key !== item.key)
        });
        this.props.update('comments', list.length - 1);

        resolve();
      }).catch(reject);
    }).catch(() => console.log('Oops errors!'));
  };

  handleSave = () => {
    const form = this.formRef.props.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createComment(values).then(response => {
        form.resetFields();

        const list = this.state.list;
        list.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          modified: new Date(),
          modifiedBy: this.props.user.userName
        });
        this.props.update('comments', list.length);

        this.setState({
          visible: false,
          list
        });
      });
    });
  };

  render() {
    const { list, visible } = this.state;
    const user = this.props.user;

    return (
      <React.Fragment>
        <Row type="flex" justify="space-between">
          <h1><FormattedMessage id="organizationComments" defaultMessage="Organization comments"/></h1>
          {user ?
            <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
              <FormattedMessage id="createNew" defaultMessage="Create new"/>
            </Button>
            : null}
        </Row>
        <p style={{ color: '#999', marginBottom: '10px' }}>
          <small>
            <FormattedMessage
              id="orgCommentsInfo"
              defaultMessage="Comments allow administrators to leave context about communications with publishers etc."
            />
          </small>
        </p>

        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item actions={user ? [
              <Button htmlType="button" onClick={() => this.handleDelete(item)} {...formButton}>
                <FormattedMessage id="delete" defaultMessage="Delete"/>
              </Button>
            ] : []}>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={item.content}
                  description={
                    <React.Fragment>
                      <FormattedMessage
                        id="createdByRow"
                        defaultMessage={`Created {date} by {author}`}
                        values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                      />
                    </React.Fragment>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
        />

        {visible && <CommentCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleSave}
        />}
      </React.Fragment>
    );
  }
}

CommentList.propTypes = {
  data: PropTypes.array.isRequired,
  createComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired
};

export default CommentList;