/**
 * <name:新增>
 * <models:role,user>
 */
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Spin} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
        md: {span: 13},
    },
};

const submitFormLayout = {
    wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
    },
};

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
}))
@Form.create()
export default class MenuAdd extends PureComponent {
    componentWillMount() {
        const {dispatch} = this.props;
        const {search} = this.props.location;
        if (search) {
            dispatch({
                type: 'role/fetch',
                payload: {...parseSearch(search), isEdit: true},
            });
        }
    }

    handleFormReset = () => {
        const {form} = this.props;
        form.resetFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'role/submitRegularForm',
                    payload: values,
                });
            }
        });
    }

    render() {
        const {role: {loading: ruleLoading, data: {list = []}, regularFormSubmitting: submitting, operationList, formData}, routeData} = this.props;
        const {getFieldDecorator} = this.props.form;

        return (
            <PageHeaderLayout
                title={`${routeData.name}`}
            >
                {
                    <Spin spinning={ruleLoading}>
                        <Form
                            onSubmit={this.handleSubmit}
                            hideRequiredMark
                            style={{marginTop: 8}}
                        >
                            <FormItem
                                {...formItemLayout}
                                label="角色名称"
                            >{getFieldDecorator('rolename', {
                                rules: [{
                                    required: true,
                                    message: '请输入角色名称',
                                }],
                                initialValue: formData.rolename,
                            })(<Input placeholder="请输入角色名称"/>)}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="角色描述"
                            >{getFieldDecorator('description', {
                                rules: [{
                                    required: false,
                                    message: '请输入角色描述',
                                }],
                                initialValue: formData.description,
                            })(<Input placeholder="请输入角色描述"/>)}
                            </FormItem>
                            <FormItem {...submitFormLayout} style={{marginTop: 32}}>
                                <Button type="primary" htmlType="submit" loading={submitting}>
                                    提交
                                </Button>
                            </FormItem>
                        </Form>
                    </Spin>
                }

            </PageHeaderLayout>
        );
    }
}
