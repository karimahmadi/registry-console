import React from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';

import { AppContext } from '../../App';
import { arrayToString } from '../../../api/util/helpers';
import TagControl from '../../controls/TagControl';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 18 }
  },
  style: {
    paddingBottom: 0,
    marginBottom: '5px'
  }
};

const ContactCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, data } = this.props;
      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title={<FormattedMessage id="createNewContact" defaultMessage="Create a new contact"/>}
          okText={
            data ?
              <FormattedMessage id="edit" defaultMessage="Edit"/> :
              <FormattedMessage id="create" defaultMessage="Create"/>
          }
          onCancel={onCancel}
          onOk={onCreate}
          destroyOnClose={true}
          maskClosable={false}
          closable={false}
        >
          <Form layout="vertical">
            <AppContext.Consumer>
              {({ userTypes }) => (
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="type" defaultMessage="Type"/>}
                >
                  {getFieldDecorator('type', { initialValue: data && data.type })(
                    <Select placeholder={<FormattedMessage id="select.type" defaultMessage="Select a type"/>}>
                      {userTypes.map(userType => (
                        <Option value={userType} key={userType}>
                          <FormattedMessage id={userType}/>
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )}
            </AppContext.Consumer>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="primary" defaultMessage="Primary"/>}
            >
              {getFieldDecorator('primary', { initialValue: data && data.primary })(
                <Checkbox style={{ fontSize: '10px' }}>
                  <FormattedMessage
                    id="primaryCheckboxTip"
                    defaultMessage="Indicates that the contact is the primary contact for the given type"
                  />
                </Checkbox>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="firstName" defaultMessage="First name"/>}
            >
              {getFieldDecorator('firstName', { initialValue: data && data.firstName })(<Input/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="lastName" defaultMessage="Last name"/>}
            >
              {getFieldDecorator('lastName', { initialValue: data && data.lastName })(<Input/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="position" defaultMessage="Position"/>}
            >
              {getFieldDecorator('position', {
                initialValue: data && arrayToString(data.position),
                defaultValue: []
              })(
                <TagControl label={<FormattedMessage id="newPosition" defaultMessage="New position"/>} removeAll={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="description" defaultMessage="Description"/>}
            >
              {getFieldDecorator('description', { initialValue: data && data.description })(<Input/>)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FormattedMessage id="email" defaultMessage="Email"/>}>
              {getFieldDecorator('email', {
                initialValue: data && data.email,
                defaultValue: []
              })(
                <TagControl label={<FormattedMessage id="newEmail" defaultMessage="New email"/>} removeAll={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="phone" defaultMessage="Phone"/>}
            >
              {getFieldDecorator('phone', {
                initialValue: data && data.phone,
                defaultValue: []
              })(
                <TagControl label={<FormattedMessage id="newPhone" defaultMessage="New phone"/>} removeAll={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="homepage" defaultMessage="Homepage"/>}
            >
              {getFieldDecorator('homepage', {
                initialValue: data && data.homepage,
                defaultValue: []
              })(
                <TagControl label={<FormattedMessage id="newHomepage" defaultMessage="New homepage"/>} removeAll={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="organization" defaultMessage="Organization"/>}
            >
              {getFieldDecorator('organization', { initialValue: data && data.organization })(<Input/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="address" defaultMessage="Address"/>}
            >
              {getFieldDecorator('address', {
                initialValue: data && data.address,
                defaultValue: []
              })(
                <TagControl label={<FormattedMessage id="newAddress" defaultMessage="New address"/>} removeAll={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="city" defaultMessage="City"/>}
            >
              {getFieldDecorator('city', { initialValue: data && data.city })(<Input/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="province" defaultMessage="Province"/>}
            >
              {getFieldDecorator('province', { initialValue: data && data.province })(<Input/>)}
            </FormItem>
            <AppContext.Consumer>
              {({ countries }) => (
                <FormItem
                  {...formItemLayout}
                  label={<FormattedMessage id="country" defaultMessage="Country"/>}
                >
                  {getFieldDecorator('country', { initialValue: data && data.country })(
                    <Select placeholder={<FormattedMessage id="select.country" defaultMessage="Select a country"/>}>
                      {countries.map(country => (
                        <Option value={country} key={country}>
                          <FormattedMessage id={`country.${country}`}/>
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )}
            </AppContext.Consumer>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="postalCode" defaultMessage="Postal code"/>}
            >
              {getFieldDecorator('postalCode', { initialValue: data && data.postalCode })(<Input/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="userId" defaultMessage="User ID"/>}
              className="last-row"
            >
              {getFieldDecorator('userId', {
                initialValue: data && data.userId,
                defaultValue: []
              })(
                <TagControl label={<FormattedMessage id="newUserId" defaultMessage="New user ID"/>} removeAll={true}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default ContactCreateForm;