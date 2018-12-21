import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import injectSheet from 'react-jss';
import PresentationItem from '../../widgets/PresentationItem';

const styles = {
  modalPresentation: {
    paddingTop: '4px',
    marginBottom: 0
  }
};

const EndpointPresentation = ({ visible, onCancel, data, classes }) => (
  <Modal
    visible={visible}
    title={<FormattedMessage id="endpointDetails" defaultMessage="Endpoint details"/>}
    destroyOnClose={true}
    closable={false}
    footer={[
      <Button key="submit" onClick={onCancel}>
        <FormattedMessage id="close" defaultMessage="Close"/>
      </Button>
    ]}
    onCancel={onCancel}
  >
    <dl className={classes.modalPresentation}>
      <PresentationItem label={<FormattedMessage id="type" defaultMessage="Type"/>}>
        {data && data.type}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="url" defaultMessage="URL"/>}>
        {data && data.url}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="description" defaultMessage="Description"/>}>
        {data && data.description}
      </PresentationItem>
      <PresentationItem label={<FormattedMessage id="machineTags" defaultMessage="Machine tags"/>}>
        {data && data.machineTags.length > 0 ? data.machineTags : <FormattedMessage id="noMachineTags" defaultMessage="No machine tags"/>}
      </PresentationItem>
    </dl>
  </Modal>
);

export default injectSheet(styles)(EndpointPresentation);