import React from 'react';
import { Button, Col, List, Row } from 'antd';
import { FormattedMessage, FormattedNumber, FormattedRelative, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Wrappers
import PermissionWrapper from '../../hoc/PermissionWrapper';
import withContext from '../../hoc/withContext';
// Components
import { ConfirmButton } from '../../widgets';
import PersonAddForm from './PersonAddForm';

class PersonList extends React.Component {
  state = {
    isModalVisible: false,
    persons: this.props.persons || []
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  deletePerson = item => {
    this.props.deletePerson(item.key).then(() => {
      // Updating persons list
      const { persons } = this.state;
      this.setState({
        persons: persons.filter(person => person.key !== item.key)
      });
      this.props.updateCounts('contacts', persons.length - 1);
      this.props.addSuccess({
        status: 200,
        statusText: this.props.intl.formatMessage({
          id: 'beenDeleted.contact',
          defaultMessage: 'Contact has been deleted'
        })
      });
    }).catch(error => {
      this.props.addError({ status: error.response.status, statusText: error.response.data });
    });
  };

  handleSave = form => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const selectedPerson = JSON.parse(values.person);
      this.props.addPerson(selectedPerson.key).then(() => {
        form.resetFields();
        const { persons } = this.state;
        persons.unshift(selectedPerson);

        this.props.updateCounts('contacts', persons.length + 1);
        this.props.addSuccess({
          status: 200,
          statusText: this.props.intl.formatMessage({
            id: 'beenSaved.contact',
            defaultMessage: 'Contact has been saved'
          })
        });

        this.setState({
          persons,
          isModalVisible: false
        });
      }).catch(error => {
        this.props.addError({ status: error.response.status, statusText: error.response.data });
      });
    });
  };

  render() {
    const { persons, isModalVisible } = this.state;
    const { intl, uuids } = this.props;
    const confirmTitle = intl.formatMessage({
      id: 'delete.confirmation.contact',
      defaultMessage: 'Are you sure to delete this contact?'
    });

    return (
      <React.Fragment>
        <div className="item-details">
          <Row type="flex" justify="space-between">
            <Col xs={12} sm={12} md={16}>
              <h2><FormattedMessage id="contacts" defaultMessage="Contacts"/></h2>
            </Col>
            <Col xs={12} sm={12} md={8} className="text-right">
              <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                <Button htmlType="button" type="primary" onClick={() => this.showModal()}>
                  <FormattedMessage id="addNew" defaultMessage="Add new"/>
                </Button>
              </PermissionWrapper>
            </Col>
          </Row>

          <List
            className="custom-list"
            itemLayout="horizontal"
            dataSource={persons}
            header={
              persons.length ? (<FormattedMessage
                id="nResults"
                defaultMessage={`{formattedNumber} {count, plural, zero {results} one {result} other {results}}`}
                values={{ formattedNumber: <FormattedNumber value={persons.length}/>, count: persons.length }}
              />) : null
            }
            renderItem={item => (
              <List.Item actions={[
                <Link to={`/grbio/person/${item.key}`} target="_blank">
                  <FormattedMessage id="view" defaultMessage="View"/>
                </Link>,
                <PermissionWrapper uuids={uuids} roles={['REGISTRY_EDITOR', 'REGISTRY_ADMIN']}>
                  <ConfirmButton
                    title={confirmTitle}
                    btnText={<FormattedMessage id="delete" defaultMessage="Delete"/>}
                    onConfirm={() => this.deletePerson(item)}
                    link
                  />
                </PermissionWrapper>
              ]}>
                <List.Item.Meta
                  title={
                    <React.Fragment>
                      <Link to={`/grbio/person/${item.key}`} target="_blank">
                        {item.firstName} {item.lastName}
                      </Link>
                    </React.Fragment>
                  }
                  description={
                    <span className="item-description">
                      <FormattedMessage
                        id="createdByRow"
                        defaultMessage={`Created {date} by {author}`}
                        values={{ date: <FormattedRelative value={item.created}/>, author: item.createdBy }}
                      />
                    </span>
                  }
                />
              </List.Item>
            )}
          />

          {isModalVisible && (
            <PersonAddForm
              onCancel={this.handleCancel}
              onCreate={this.handleSave}
              contacts={this.state.persons}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

PersonList.propTypes = {
  persons: PropTypes.array,
  addPerson: PropTypes.func,
  deletePerson: PropTypes.func,
  updateCounts: PropTypes.func,
  uuids: PropTypes.array.isRequired
};

const mapContextToProps = ({ addSuccess, addError }) => ({ addSuccess, addError });

export default withContext(mapContextToProps)(injectIntl(PersonList));