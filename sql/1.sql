#select tree->"$[0].path" as b from (SELECT tree from test where id=2) as a;
#SELECT tree from test where id=2
#SELECT * from test
#SELECT JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]');
#SELECT tree from test where id=2
#select tree->"$[0]" from (SELECT tree from test where id=2) as a
#select tree->"$[0]" from (SELECT tree from test where id=2) as a
#SELECT JSON_KEYS((select tree->"$[0]" from (SELECT tree from test where id=2) as a)）

#SET @j = (select tree->"$[1]" from (SELECT tree from test where id=2) as a);
#SELECT JSON_KEYS((select tree->"$[1]" from (SELECT tree from test where id=2) as a));
#SELECT JSON_KEYS('{"niu": true, "name": "fei"}');

#select tree->"$[1]" from (SELECT tree from test where id=1) as a;
#SET @j = (select tree->"$[1]" from (SELECT tree from test where id=1) as a);
#SELECT JSON_SET(@j, '$.niu', false);

#SET @j = (select tree->"$[1]" from (SELECT tree from test where id=2) as a);
#SELECT JSON_INSERT(@j, '$.a1', 10);

#UPDATE test set tree = JSON_SET(@j, '$.a1', 120) where id = 1;

#SELECT JSON_UNQUOTE(tree->"$[1].name") from test where id = 2
#{ "path": "/Logout", "element": "Login" },
#update `test` set tree =json_remove(tree, '$[1].niu') where id = '1'
#update `test` set tree = json_set(tree, '$[2]', )) where id = '1'

#update `roles` set tree = json_set(tree, '$[2]', (select cast( '{ "path": "/Logout", "element": "Login" }' as json )))

#set @obj = (JSON_UNQUOTE(select cast( '{"east": "501", "south": "651"}' as json)));
#set @l = (SELECT JSON_LENGTH(tree) from test where id = "1");

#SELECT @obj;
#update `test` set tree = JSON_ARRAY_INSERT(tree, CONCAT('$[',@l,']'), (select cast( '{"diao": "5011", "south1": "6511"}' as json))) where id = '1'


#set @l = (SELECT JSON_LENGTH(tree) from test where id = "1");
#update `test` 
#set tree = JSON_ARRAY_INSERT(
#tree, CONCAT('$[',(SELECT JSON_LENGTH(tree)-1),']'), 
#(select cast( '{"niu": "5011", "south1": "6511"}' as json)));

#update `roles` 
#set router_list = JSON_ARRAY_INSERT(
#router_list, CONCAT('$[',(SELECT JSON_LENGTH(router_list)-1),']'), 
#(select cast( '{ "path": "/Logout", "element": "Login" }' as json)));

######################### test before ########################

## insert root menu
#update `roles` 
#set menu_list = JSON_ARRAY_INSERT(
#menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), 
#(select cast( '{ "key": "/app1/users", "icon": "SolutionOutlined", "label": "Users" }' as json))) where id = '1' OR id = '4';

## insert root router
#update `roles` 
#set router_list = JSON_ARRAY_INSERT(
#router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
#(select cast( '{ "path": "/app1", "element": "App1" }' as json))) where id = '1' OR id = '4';

## delete root last menu
#update `roles` set menu_list =json_remove(menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)-1),']')) where id = '1' OR id = '4';

## delete root last router_list
#update `roles` set router_list =json_remove(router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')-1),']')) where id = '1' OR id = '4';

#有路由的根菜单，不能有子页面

#第一种情况，插入根菜单并且有路由
#插入根菜单
#update `roles` 
#set menu_list = JSON_ARRAY_INSERT(
#menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), 
#(select cast( '{ "key": "/app1", "icon": "SolutionOutlined", "label": "App1" }' as json))) where id = '1' OR id = '4';

#插入根路由
#update `roles` 
#set router_list = JSON_ARRAY_INSERT(
#router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
#(select cast( '{ "path": "/app1", "element": "App1" }' as json))) where id = '1' OR id = '4';


#第二种情况，插入根菜单，根菜单没有目录，所有它没有对应的路由
#插入根菜单
#update `roles` 
#set menu_list = JSON_ARRAY_INSERT(
#menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), 
#(select cast( '{ "key": "/app1", "icon": "SolutionOutlined", "label": "App1" }' as json))) where id = '1' OR id = '4';

#插入基于上面的子菜单
#update `roles` 
#set menu_list = JSON_ARRAY_INSERT(
#menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), 
#(select cast( '{ "key": "/app1/money", "icon": "SolutionOutlined", "label": "Money" }' as json))) where id = '1' OR id = '4';

#插入基于上面的子路由
#update `roles` 
#set router_list = JSON_ARRAY_INSERT(
#router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
#(select cast( '{ "path": "/app1/money", "element": "Money" }' as json))) where id = '1' OR id = '4';


#第三种情况，在父节点下，插入子菜单，有子菜单和子路由
#插入子菜单
#update 'roles' 
#set menu_list = JSON_ARRAY_INSERT(
#menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), 
#(select cast( '{ "key": "/app1/income", "icon": "SolutionOutlined", "label": "Income" }' as json))) where id = '1' OR id = '4';

#插入基于上面的子路由
#update `roles` 
#set router_list = JSON_ARRAY_INSERT(
#router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
#(select cast( '{ "path": "/app1/income", "element": "Income" }' as json))) where id = '1' OR id = '4';

## 删除
#第一种，删除根目录（没有子菜单的），直接删除菜单和路由
#update `roles` set menu_list =json_remove(menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)-1),']')) where id = '1' OR id = '4';

#select menu_list from roles
#start transaction;
#rollback;

#SELECT JSON_SEARCH((select menu_list from roles limit 0,1),'one','Setting');
#SELECT SUBSTRING_INDEX(JSON_SEARCH((select menu_list from roles limit 0,1),'one','Setting'),".",100);

#SET @a = (SELECT regexp_replace(JSON_SEARCH((select router_list from roles limit 0,1),'one','Setting'),'\.([^\.]*)$','"'));
#select @a;
#select router_list from roles limit 0,1;

##SET @menu = (SELECT regexp_replace(JSON_SEARCH((select menu_list from roles limit 0,1),'one','Paper'),'\.([^\.]*)$','"')); #menu
#update `roles` set menu_list =json_remove(menu_list, @menu) where id IN (SELECT id FROM (SELECT id FROM roles LIMIT 0,1) aa);

#SET @router = (SELECT regexp_replace(JSON_SEARCH((select router_list from roles limit 0,1),'one','Paper'),'\.([^\.]*)$','"')); #router

#select @router;
#SELECT regexp_replace(JSON_SEARCH((select router_list from roles limit 0,1),'one','Paper'),'\.([^\.]*)$','"');
#update `roles` set router_list =json_remove(router_list, @router) where id IN (SELECT id FROM (SELECT id FROM roles LIMIT 0,1) bb);

#第二种，如果有子菜单，有多个（大于一个），直接删除子路由和菜单

#第三种，如果有子菜单并且只有一个，不能删除，要删除，根菜单也得删除

#SELECT COUNT(*) from roles;
#update roles set menu_list = JSON_ARRAY_INSERT(menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), (select cast( '{ "key": "/finance", "icon": "ChromeFilled", "label": "Finance" }' as json))) where id = '1' OR id = '4'


## delete root menu and router
drop procedure if exists p;
CREATE PROCEDURE p(labelname varchar(255))
BEGIN
DECLARE counter INT DEFAULT (SELECT COUNT(*) from roles);
DECLARE incre INT DEFAULT 0;
DECLARE myid INT DEFAULT 0;
DECLARE myrouter VARCHAR(40);
DECLARE mymenu VARCHAR(40);

label: LOOP
	IF incre > counter THEN
		LEAVE label; 
	END IF; 

	SET myrouter = (SELECT regexp_replace(JSON_SEARCH((select router_list from roles ORDER BY id ASC LIMIT incre,1),'one',labelname),'\.([^\.]*)$','"')); 
	SET mymenu = (SELECT regexp_replace(JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',labelname),'\.([^\.]*)$','"')); 

	IF (!(mymenu <=> null) and !(myrouter <=> null)) THEN
		#SELECT mymenu;
		#SELECT incre;
		
		SET myid = (SELECT id FROM (SELECT id FROM roles ORDER BY id ASC LIMIT incre,1 ) aa);
		update roles set router_list =json_remove(router_list, JSON_UNQUOTE(myrouter)) where id = myid;
		update roles set menu_list =json_remove(menu_list, JSON_UNQUOTE(mymenu)) where id = myid;

	END IF; 
	SET incre = incre + 1;
END LOOP label;
	SELECT "OK";
END;

#call p('pol');




