
/*
# 子菜单和子路由 add
SET @mychildren = regexp_replace(JSON_SEARCH((select menu_list from roles where id = 1),'one','Team'),'\.([^\.]*)$','.children"');
SET @mypath = JSON_UNQUOTE(@mychildren);
SET @mylength = (select JSON_LENGTH(JSON_EXTRACT(menu_list,@mypath)) from roles where id = '1');
SET @finalpath = CONCAT(@mypath,'[',@mylength,']');

update roles
set menu_list = JSON_ARRAY_INSERT(
menu_list, @finalpath,
(select cast( '{ "key": "/team/team100", "icon": "SolutionOutlined", "label": "Team100" }' as json))) where id = '1' OR id = '4';

update roles 
set router_list = JSON_ARRAY_INSERT(
router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
(select cast( '{ "path": "/team/team100", "element": "Team100" }' as json))) where id = '1' OR id = '4';
*/


##one root and one submenu 
/*
update roles
set menu_list = JSON_ARRAY_INSERT(
menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), 
(select cast( '{ "key": "/wall", "icon": "SolutionOutlined", "label": "Wall","children":[{"key": "/wall/pciture", "icon": "SolutionOutlined", "label": "Pciture"}	] }' as json))) where id = '1' OR id = '4';

update roles 
set router_list = JSON_ARRAY_INSERT(
router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
(select cast( '{ "path": "/wall/pciture", "element": "Pciture" }' as json))) where id = '1' OR id = '4';
*/

#delete just one submenu; same as deleting just root menu

/*
drop procedure if exists p1;
CREATE PROCEDURE p1(parent varchar(255),children JSON)
BEGIN
DECLARE counter INT DEFAULT (SELECT COUNT(*) from roles);
DECLARE incre INT DEFAULT 0;
DECLARE myid INT DEFAULT 0;
DECLARE myrouter VARCHAR(40);
DECLARE mymenu VARCHAR(40);
DECLARE childcount INT DEFAULT 0;
DECLARE mychild VARCHAR(40);
label: LOOP
	IF incre >= counter THEN
		LEAVE label; 
	END IF; 
	
	SET childcount = 0;
	SET myid = (SELECT id FROM (SELECT id FROM roles ORDER BY id ASC LIMIT incre,1 ) aa);
	REPEAT
		SET mychild = JSON_EXTRACT(children, CONCAT("$[",childcount,"]"));
		SET myrouter = (SELECT regexp_replace(JSON_SEARCH((select router_list from roles ORDER BY id ASC LIMIT incre,1),'one',JSON_UNQUOTE(mychild)),'\.([^\.]*)$','"')); 
		SET childcount = childcount + 1;
		
		IF (!(myrouter <=> null)) THEN
			update roles set router_list =json_remove(router_list, JSON_UNQUOTE(myrouter)) where id = myid;
		END IF; 
	UNTIL childcount = JSON_LENGTH(children) END REPEAT;

	SET mymenu = (SELECT regexp_replace(JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',parent),'\.([^\.]*)$','"')); 

	IF (!(mymenu <=> null)) THEN
		
		#SELECT incre;
		update roles set menu_list =json_remove(menu_list, JSON_UNQUOTE(mymenu)) where id = myid;

	END IF; 
	
	SET incre = incre + 1;
END LOOP label;
	SELECT "OK";
END;

call p1('Dish','["Fish","Meat","Beef"]');
*/

/*
SET @myjson = '["Fish","Meat","Beef"]';
SET @jsonlength = (SELECT JSON_LENGTH(@myjson));
drop procedure if exists testloop;
CREATE PROCEDURE testloop()
BEGIN
SET @i = 0;
while @i<@jsonlength DO
		SELECT JSON_EXTRACT(@myjson, CONCAT("$[",@i,"]"));
		SET @i = @i + 1;
END WHILE;
END;

call testloop();
*/

/* #how to use cursor
drop procedure if exists testloop2;
CREATE PROCEDURE testloop2()
BEGIN
DECLARE myid INT DEFAULT 0;
DECLARE mycount INT DEFAULT 0;
DECLARE myname VARCHAR(255);
DECLARE mycur CURSOR for (SELECT id,name from fruit);
OPEN mycur;

REPEAT
	FETCH mycur into myid,myname;
	SET mycount = mycount +1;
	SELECT myname;
UNTIL mycount=(SELECT COUNT(*) FROM fruit) END REPEAT;

CLOSE mycur;
END;

call testloop2();
*/


##edit one parent or one child first case
/*
drop procedure if exists p;
CREATE PROCEDURE p(labelname varchar(255),menu_re JSON,router_re JSON)
BEGIN
DECLARE counter INT DEFAULT (SELECT COUNT(*) from roles);
DECLARE incre INT DEFAULT 0;
DECLARE myid INT DEFAULT 0;
DECLARE myrouter VARCHAR(40);
DECLARE mymenu VARCHAR(40);

label: LOOP
	IF incre >= counter THEN
		LEAVE label; 
	END IF; 

	SET myrouter = (SELECT regexp_replace(JSON_SEARCH((select router_list from roles ORDER BY id ASC LIMIT incre,1),'one',labelname),'\.([^\.]*)$','"')); 
	SET mymenu = (SELECT regexp_replace(JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',labelname),'\.([^\.]*)$','"')); 
	SELECT mymenu;
	IF (!(mymenu <=> null) and !(myrouter <=> null)) THEN
		
		#SELECT incre;
		
		SET myid = (SELECT id FROM (SELECT id FROM roles ORDER BY id ASC LIMIT incre,1 ) aa);
		update roles set router_list =json_replace(router_list, JSON_UNQUOTE(myrouter),router_re) where id = myid;
		update roles set menu_list =json_replace(menu_list, JSON_UNQUOTE(mymenu),menu_re) where id = myid;

	END IF; 
	SET incre = incre + 1;
END LOOP label;
	#SELECT "OK";
END;

call p('Finance','{ "key": "/finance", "icon": "SolutionOutlined", "label": "OppoDD" }','{ "path": "/finance", "element": "OppoDD" }');

*/


drop procedure if exists p100;
CREATE PROCEDURE p100(parent varchar(255),currentData varchar(255),children_router JSON,currentIcon varchar(255))
BEGIN
DECLARE counter INT DEFAULT (SELECT COUNT(*) from roles);
DECLARE incre INT DEFAULT 0;
DECLARE myid INT DEFAULT 0;
DECLARE myrouter VARCHAR(40);
DECLARE mymenu VARCHAR(40);
DECLARE child_count_router INT DEFAULT 0;
DECLARE mychild_router VARCHAR(40);

DECLARE child_count_menu INT DEFAULT 0;
DECLARE mychild_menu VARCHAR(40);
label: LOOP
	IF incre >= counter THEN
		LEAVE label; 
	END IF; 
	
	SET child_count_router = 0;
	SET child_count_menu = 0;
	SET myid = (SELECT id FROM (SELECT id FROM roles ORDER BY id ASC LIMIT incre,1 ) aa);
	
	##router repeat
	#ok
	REPEAT
		SET @originJson = (SELECT router_list from roles where id = myid);
		SET mychild_router = JSON_EXTRACT(children_router, CONCAT("$[",child_count_router,"]"));
		SET myrouter = (SELECT (JSON_SEARCH((select router_list from roles ORDER BY id ASC LIMIT incre,1),'one',JSON_UNQUOTE(mychild_router))));
		SET child_count_router = child_count_router + 1;
		SET @originDataRouter = JSON_EXTRACT(@originJson,JSON_UNQUOTE(myrouter));
		SET @newDataRouter = REPLACE(@originDataRouter,LOWER(parent),LOWER(currentData));
		
		IF (!(myrouter <=> null)) THEN
			update roles set router_list =json_replace(router_list, JSON_UNQUOTE(myrouter),JSON_UNQUOTE(@newDataRouter)) where id = myid;
		END IF; 
	UNTIL child_count_router = JSON_LENGTH(children_router) END REPEAT;
	#ok
	
	#menu repeat
	#ok
	REPEAT
		SET @originJson = (SELECT menu_list from roles where id = myid);
		SET mychild_menu = JSON_EXTRACT(children_router, CONCAT("$[",child_count_menu,"]"));
		SET mymenu = (SELECT (JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',JSON_UNQUOTE(mychild_menu))));
		SET child_count_menu = child_count_menu + 1;
		
		SET @originDataMenu = JSON_EXTRACT(@originJson,JSON_UNQUOTE(mymenu));
		SET @newDataMenu = REPLACE(@originDataMenu,LOWER(parent),LOWER(currentData));
		SELECT @newDataMenu;
		IF (!(mymenu <=> null)) THEN
			update roles set menu_list =json_replace(menu_list, JSON_UNQUOTE(mymenu),JSON_UNQUOTE(@newDataMenu)) where id = myid;
		END IF; 
	UNTIL child_count_menu = JSON_LENGTH(children_router) END REPEAT;
	
	
	SET @uniqueMenuLabel = (SELECT (JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',JSON_UNQUOTE(parent))));
	SET @uniqueMenuKey = (SELECT (JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',JSON_UNQUOTE(CONCAT('/',LOWER(parent))))));
	SET @uniqueMenuIcon = regexp_replace(JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',JSON_UNQUOTE(parent)),'\.([^\.]*)$','.icon"');
	
	update roles set menu_list =json_replace(menu_list, JSON_UNQUOTE(@uniqueMenuKey),JSON_UNQUOTE(CONCAT('/',LOWER(currentData)))) where id = myid;
	update roles set menu_list =json_replace(menu_list, JSON_UNQUOTE(@uniqueMenuLabel),JSON_UNQUOTE(currentData)) where id = myid;
	
	
	update roles set menu_list =json_replace(menu_list, JSON_UNQUOTE(@uniqueMenuIcon),JSON_UNQUOTE(currentIcon)) where id = myid;
	#select @uniqueMenuIcon;
	SET incre = incre + 1;
END LOOP label;
	SELECT "OK";
END;


call p100('Zaoshang','Zhongwu','["/zaoshang/salt","/zaoshang/sweet","/zaoshang/bitter"]','FileExcelOutlined');
#call p100('Zaoshang','Wanshang','["/zaoshang/salt","/zaoshang/sweet","/zaoshang/bitter"]','FileExcelOutlined');
#call p100('Bread','Zaoshang','["/bread/salt","/bread/sweet","/bread/bitter"]','UserOutlined');


