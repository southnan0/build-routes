{
  name: '<%= name %>',<% if(icon){ %>
  icon:'<%= icon %>',<% } %>
  path: '<%= path %>', <% if(fullPath){ %>
  component: dynamicWrapper(app, [<%if(Array.isArray(models)){%><% models.forEach(function(model){%>'<%= model%>',<%}) %><%}else if(models){%>'<%= models%>'<%}%>], () => import('../routes<%= fullPath %>')), <% }if(hideChildren){ %>
  hideChildren: <%= hideChildren%>,<% } if(fullPath && exact){%>
  exact: <%= exact%>,<% } if(permission){%>
  permission: <%= permission %>,<% } if(children && children.length){%>
  children:[<%= getChildren(children,template)%>]<% }%>
}
