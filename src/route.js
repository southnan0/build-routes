import dynamic from 'dva/dynamic';
import P from './permission';

const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import('../models/' + m + '.js')),
  component,
});

export const getNavData = app => [{
  component:dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
  path:'',
  layout:'UserLayout',
  children:[<%= routes.userLayout%>]
  },{
    component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '',
    children:[<%= routes.basicLayout%>]
  },{
  component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
  layout: 'BlankLayout',
  children: {
  name: '使用文档',
  path: 'http://pro.ant.design/docs/getting-started',
  target: '_blank',
  icon: 'book',
  },
},];
