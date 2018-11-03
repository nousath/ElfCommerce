import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Row,
  Col,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import ToggleButton from 'react-toggle-button';
import { FiSave } from 'react-icons/fi';
import { ProductForm } from '../../components/forms';

class NewProduct extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button
              color="link"
              onClick={() => this.props.history.push('/dashboard')}
            >
              <FormattedMessage id="sys.dashboard" />
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button
              color="link"
              onClick={() => this.props.history.push('/products')}
            >
              <FormattedMessage id="sys.products" />
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <FormattedMessage id="sys.newProduct" />
          </BreadcrumbItem>
        </Breadcrumb>
       
        <div className="content-body">
          <div style={{overflow: 'hidden', marginBottom: 10}}>
            <Button size="sm" color="primary" className="pull-right">
              <FiSave />
              &nbsp;
              <FormattedMessage id="sys.save" />
            </Button>
          </div>
          <Row className="table-container">
            <Col md={12} className="table-content">
              <ProductForm
                categories={[]}
              />
              <br />              
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  null
)(withRouter(NewProduct));