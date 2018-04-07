/**
 * <name:编辑权限>
 * <models:role, menu, user>
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Spin, Tree, Checkbox } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { permission } from '../../../common/permission';
import _ from 'lodash';

const TreeNode = Tree.TreeNode;

const parseSearch = (search) => {
  search = search.replace('?', '');
  const arr = search.split('&');
  const obj = {};
  arr.forEach((item) => {
    const arrItem = item.split('=');
    obj[arrItem[0]] = arrItem[1];
  });

  return obj;
};

@connect(state => ({
  role: state.role,
  menu: state.menu,
}))
export default class MenuAdd extends PureComponent {
  state = {
    arrCheckedKeys: null,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const { search } = this.props.location;
    if (search) {
      dispatch({
        type: 'menu/fetch',
        payload: {},
      });
      dispatch({
        type: 'role/getRoleMenuList',
        payload: { ...parseSearch(search) },
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { arrCheckedKeys } = this.state;
    const { dispatch } = this.props;
    const { search } = this.props.location;
    dispatch({
      type: 'role/editMenuRole',
      payload: {
        arrCheckedKeys,
        ...search,
      },
    });
  }

  onCheck = (arrCheckedKeys, info) => {
    this.setState({
      arrCheckedKeys,
    });
  }

  checkChange = () => {
    const { arrCheckedKeys } = this.state;
    const { role: { defaultCheckedKeys } } = this.props;

    return _.isEqual(arrCheckedKeys || defaultCheckedKeys, defaultCheckedKeys);
  }

  render() {
    const { role: { loading: ruleLoading, regularFormSubmitting: submitting, menuList, defaultCheckedKeys }, routeData, menu: { data: { list } } } = this.props;
    const { arrCheckedKeys } = this.state;

    return (
      <PageHeaderLayout
        title={routeData.name}
      >
        {
          <Spin spinning={ruleLoading}>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              disabled={this.checkChange()}
            >保存
            </Button>
            {list.length && <Tree
              checkable
              checkedKeys={arrCheckedKeys || defaultCheckedKeys}
              onCheck={this.onCheck}
              defaultExpandAll
            >
              {
                list.map((item, itemIndex) => {
                  return (
                    <TreeNode title={item.p_menuname} key={item.p_menuid}>
                      {
                        item.children.map((child, childIndex) => {
                          const arrMenuid = child.p_menuid.split('_');

                          const objOperate = _.reduce(arrMenuid, (obj, key) => obj[key], permission);

                          return (
                            <TreeNode title={child.p_menuname} key={`${child.p_menuid}`}>
                              {
                                Object.keys(objOperate).map((key, keyIndex) => {
                                  const o = objOperate[key];
                                  return (
                                    <TreeNode title={o.label} key={`${child.p_menuid}--${o.value}`} />
                                  );
                                })
                              }
                            </TreeNode>
                          );
                        })
                      }
                    </TreeNode>
                  );
                })
              }
            </Tree>}
          </Spin>
        }

      </PageHeaderLayout>
    );
  }
}
