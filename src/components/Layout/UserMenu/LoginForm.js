import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onLogin(values);
      }
    });
  };

  render() {
    const { formatMessage } = this.props.intl;
    const placeholderUsername = formatMessage({ id: 'placeholder.username', defaultMessage: 'Username' });
    const placeholderPassword = formatMessage({ id: 'placeholder.password', defaultMessage: 'Password' });
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} id="loginForm">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{
              required: true,
              message: <FormattedMessage id="provide.userName" defaultMessage="Please input your username!"/>
            }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder={placeholderUsername}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: <FormattedMessage id="provide.password" defaultMessage="Please input your Password!"/>
            }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder={placeholderPassword}
            />
          )}
        </FormItem>
        <FormItem style={{ width: '100%' }}>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox><FormattedMessage id="rememberMe" defaultMessage="Remember me"/></Checkbox>
          )}
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            <FormattedMessage id="logIn" defaultMessage="Log in"/>
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(injectIntl(NormalLoginForm));

export default WrappedNormalLoginForm;