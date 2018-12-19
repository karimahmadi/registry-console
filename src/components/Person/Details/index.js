import React from 'react';
import { Switch } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import Presentation from './Presentation';
import Form from './Form';
import PermissionWrapper from '../../hoc/PermissionWrapper';

class PersonDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: props.person === null
    };
  }

  onCancel = () => {
    if (this.props.dataset) {
      this.setState({ edit: false });
    } else {
      this.props.history.push('/dataset/search');
    }
  };

  render() {
    const { person, refresh } = this.props;
    return (
      <React.Fragment>
        <div className="item-details">
          <span className="help"><FormattedMessage id="person" defaultMessage="Person"/></span>
          <h2>{person ? person.name :
            <FormattedMessage id="newPerson" defaultMessage="New person"/>}</h2>

          <PermissionWrapper item={person} roles={['REGISTRY_ADMIN']}>
            <div className="item-btn-panel">
              {person && <Switch
                checkedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                unCheckedChildren={<FormattedMessage id="edit" defaultMessage="Edit"/>}
                onChange={(val) => this.setState({ edit: val })}
                checked={this.state.edit}
              />}
            </div>
          </PermissionWrapper>

          {!this.state.edit && <Presentation person={person}/>}
          {this.state.edit && (
            <Form
              person={person}
              onSubmit={key => {
                this.setState({ edit: false });
                refresh(key);
              }}
              onCancel={this.onCancel}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(PersonDetails);