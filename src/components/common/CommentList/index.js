import React from 'react';
import PropTypes from 'prop-types';
import { List, Skeleton, Button, Row, Col } from 'antd';
import { FormattedRelative, FormattedMessage, injectIntl } from 'react-intl';
import injectSheet from 'react-jss';

import CommentCreateForm from './CommentCreateForm';
import { ConfirmDeleteControl } from '../../widgets';
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';

const styles = {
  comment: {
    whiteSpace: 'pre-line'
  }
};

class CommentList extends React.Component {
  state = {
    visible: false,
    item: this.props.data,
    comments: this.props.data.comments
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  deleteComment = item => {
    return new Promise((resolve, reject) => {
      this.props.deleteComment(item.key).then(() => {
        // Updating list
        const { comments } = this.state;
        this.setState({
          comments: comments.filter(el => el.key !== item.key)
        });
        this.props.update('comments', comments.length - 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenDeleted.comment',
            defaultMessage: 'Comment has been deleted'
          })
        });

        resolve();
      }).catch(reject);
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data })
    });
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.createComment(values).then(response => {
        form.resetFields();

        const { comments } = this.state;
        comments.unshift({
          ...values,
          key: response.data,
          created: new Date(),
          createdBy: this.props.user.userName,
          modified: new Date(),
          modifiedBy: this.props.user.userName
        });
        this.props.update('comments', comments.length);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.comment',
            defaultMessage: 'Comment has been saved'
          })
        });

        this.setState({
          visible: false,
          comments
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data })
      });
    });
  };

  render() {
    const { comments, item, visible } = this.state;
    const { intl, classes } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'deleteMessage.comment',
      defaultMessage: 'Are you sure delete this comment?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col span={20}>
              <span className="help">{item.title}</span>
              <h2><FormattedMessage id="comments" defaultMessage="Comments"/></h2>
            </Col>
            <Col span={4}>
              <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="createNew" defaultMessage="Create new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>
          <p className="help">
            <FormattedMessage
              id="orgCommentsInfo"
              defaultMessage="Comments allow administrators to leave context about communications with publishers etc."
            />
          </p>

          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={item => (
              <List.Item actions={[
                <PermissionWrapper item={item} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmDeleteControl title={confirmTitle} onConfirm={() => this.deleteComment(item)}/>
                </PermissionWrapper>
              ]}>
                <Skeleton title={false} loading={item.loading} active>
                  <List.Item.Meta
                    title={<span className={classes.comment}>{item.content}</span>}
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
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleSave}
          />}
        </div>
      </React.Fragment>
    );
  }
}

CommentList.propTypes = {
  data: PropTypes.object.isRequired,
  createComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired
};

const mapContextToProps = ({ user, addSuccess, addError }) => ({ user, addSuccess, addError });

export default withContext(mapContextToProps)(injectSheet(styles)(injectIntl(CommentList)));