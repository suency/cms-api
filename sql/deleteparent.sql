
SET @mychildren = regexp_replace(JSON_SEARCH((select menu_list from roles where id = 1),'one','Team'),'\.([^\.]*)$','.children"');
SET @mypath = JSON_UNQUOTE(@mychildren);
SET @mylength = (select JSON_LENGTH(JSON_EXTRACT(menu_list,@mypath)) from roles where id = '1');
SET @finalpath = CONCAT(@mypath,'[',@mylength,']');

SELECT @mylength;

#update roles
#set menu_list = JSON_ARRAY_INSERT(
#menu_list, @mypath,
#(select cast( '{ "key": "/team/team100", "icon": "SolutionOutlined", "label": "Team100" }' as json))) where id = '1' OR id = '4';

#插入根路由
#update roles 
#set router_list = JSON_ARRAY_INSERT(
#router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
#(select cast( '{ "path": "/app1", "element": "App1" }' as json))) where id = '1' OR id = '4';