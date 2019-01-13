import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from 'reactstrap';
import jwt from 'jsonwebtoken';
import { FormattedMessage } from 'react-intl';
import { OrderForm } from '../forms';
import config from '../../config';

class Order extends Component {
  render() {
    const { history, match: { path } } = this.props;
    const { data: { storeId } } = jwt.decode(localStorage.getItem(config.accessTokenKey));

    return (
      <div>
        <div className="page-navbar">
          <div className="page-name"><FormattedMessage id="sys.orderDetails" /></div>
          <Breadcrumb>
            <BreadcrumbItem>
              <Button color="link" onClick={() => history.push('/dashboard')}>
                <FormattedMessage id="sys.dashboard" />
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Button color="link" onClick={() => history.push('/orders')}>
                <FormattedMessage id="sys.orders" />
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <FormattedMessage id="sys.orderDetails" />
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="content-body">
          <Row>
            <Col md={12}>
              <OrderForm
                mode={path === '/new-order' ? 'new' : 'update'}
                storeId={storeId} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

Order.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withRouter(Order);
