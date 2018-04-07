import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Modal } from 'antd';
import StandardTable from '../../../components/System/RoleTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Permission from '../../../components/Permission';
import P from '../../../common/permission';

import styles from '../Menu.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  role: state.role,
  permissionList: state.user.permissionList,
}))
@Form.create()
export default class List extends PureComponent {
  state = {
    formValues: {},
    visible: false,
    roleid: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
    });
  }

  getCurrentStep() {
    const { location, routeData, match } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    if (match.isExact) return;
    return routeData.children.find(item => item.path === pathList[pathList.length - 1]);
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  }

  handleRemove = (roleid, e) => {
    e.preventDefault();
    this.setState({ visible: true, roleid });
  }

  handleOk = () => {
    this.setState({ visible: false });
    const { roleid } = this.state;
    this.props.dispatch({
      type: 'role/remove',
      payload: { roleid },
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  render() {
    const { role: { loading: ruleLoading, data, confirmLoading }, permissionList, routeData } = this.props;
    const { visible } = this.state;
    const menuName = routeData.name;

    return (
      <PageHeaderLayout title={menuName}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Permission permissionList={permissionList} permission={P.system.role.add}>
                <Button icon="plus" type="primary" href="#/system/role/add">
                  新建
                </Button>
              </Permission>
            </div>
            <StandardTable
              loading={ruleLoading}
              data={data}
              pathname={this.props.location.pathname}
              handleRemove={this.handleRemove}
              permissionList={permissionList}
            />
          </div>
        </Card>


        <Modal
          title="提示"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>你确定删除吗？</p>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
