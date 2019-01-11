import React from 'react';
import { Modal, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// APIs
import { personSearch } from '../../../../api/grbioPerson';
// Components
import { FilteredSelectControl, FormItem } from '../../index';

const PersonAddForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      persons: [],
      fetching: false
    };

    handleSearch = value => {
      if (!value) {
        this.setState({ institutions: [] });
        return;
      }

      this.setState({ fetching: true });

      personSearch({ q: value }).then(response => {
        this.setState({
          persons: response.data.results,
          fetching: false
        });
      });
    };


    validateUnique = () => (rule, value, callback) => {
      const { contacts } = this.props;
      const selectedPerson = value ? JSON.parse(value) : value;

      if (selectedPerson && contacts && contacts.length > 0) {
        const hasValue = contacts.some(contact => contact.key === selectedPerson.key);
        if (hasValue) {
          callback(
            <FormattedMessage id="error.contact.duplicate" defaultMessage="You can't add the same contact twice"/>
          );
        }
      }
      callback();
    };

    render() {
      const { onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const { persons, fetching } = this.state;

      return (
        <Modal
          visible={true}
          title={<FormattedMessage id="addNewContact" defaultMessage="Add a new contact"/>}
          okText={<FormattedMessage id="add" defaultMessage="Add"/>}
          onCancel={onCancel}
          onOk={() => onCreate(form)}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form>
            <FormItem label={<FormattedMessage id="contact" defaultMessage="Contact"/>}>
              {getFieldDecorator('person', {
                rules: [{
                  validator: this.validateUnique()
                }]
              })(
                <FilteredSelectControl
                  placeholder={<FormattedMessage
                    id="select.person"
                    defaultMessage="Select a person"
                  />}
                  search={this.handleSearch}
                  fetching={fetching}
                  items={persons}
                  delay={1000}
                  optionValue={null}
                  optionText={'firstName'}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

PersonAddForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  contacts: PropTypes.array.isRequired
};

export default PersonAddForm;