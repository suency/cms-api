const express = require("express");
const roles = express.Router();
const config = require("@/config.js");
const jwt = require("jsonwebtoken");

const handleData = require("@/tools/handleData.js");

// middleware that is specific to this router
roles.use((req, res, next) => {
  console.log("roles general middleware");
  next();
});
// define the home page route
roles.get("/getRoles", (req, res) => {
  const connection = config.createConnection();
  connection.query(`SELECT * FROM  roles`, (err, rows, fields) => {
    let result = JSON.parse(JSON.stringify(rows));
    //console.log(result)
    if (result.length !== 0) {
      result.forEach((item, i) => {
        item.menu_list = JSON.parse(item.menu_list);
        item.router_list = JSON.parse(item.router_list);
      });

      res.send({
        info: {
          roles: result,
        },
        status: "OK",
      });
    } else {
      res.send(
        handleData.responseJSON(false, {
          error: "role is not right, redirect to login page",
        })
      );
    }
  });
  connection.end();
});

roles.post("/updateRole", (req, res) => {
  const connection = config.createConnection();
  console.log("okokokokok");
  connection.query(
    `UPDATE roles SET menu_list='${req.body.resultMenu}',router_list='${req.body.resultRouter}' WHERE id='${req.body.roleId}'`,
    (err, rows, fields) => {
      const result = JSON.parse(JSON.stringify(rows));
      if (result.length !== 0) {
        res.send({
          info: {
            result,
          },
          status: "OK",
        });
      } else {
        res.send(
          handleData.responseJSON(false, {
            error: "role is not right, redirect to login page",
          })
        );
      }
    }
  );
  connection.end();
});
roles.post("/createRole", (req, res) => {
  const connection = config.createConnection();
  console.log("create role");
  connection.query(
    `select * from roles where name = '${req.body.newRoleName}'`,
    (e, r, f) => {
      const resultExist = JSON.parse(JSON.stringify(r));
      if (resultExist.length !== 0) {
        res.send(
          handleData.responseJSON(false, {
            error: "role exist, please change another one!",
          })
        );
      } else {
        connection.query(
          `insert into roles(name,menu_list,router_list,avatar) values(
          '${req.body.newRoleName}',
          '${req.body.newMenu}',
          '${req.body.newRouter}',
          '${req.body.newRoleIcon}')`,
          (err, rows, fields) => {
            //const result = JSON.parse(JSON.stringify(rows));
            console.log("rows", rows);
            console.log("err", err);
            if (rows) {
              res.send({
                info: {
                  result: "nb",
                },
                status: "OK",
              });
            } else {
              res.send(
                handleData.responseJSON(false, {
                  error: "system error role creation",
                })
              );
            }

            connection.end();
          }
        );
      }
    }
  );
  //connection.end()
});

roles.post("/updateRoleName", (req, res) => {
  const connection = config.createConnection();

  connection.query(
    `select * from roles where name = '${req.body.newRoleName}'`,
    (e, r, f) => {
      const resultExist = JSON.parse(JSON.stringify(r));
      if (resultExist.length !== 0) {
        res.send(
          handleData.responseJSON(false, {
            error: "role exist, please change another one!",
          })
        );
      } else {
        connection.query(
          `UPDATE roles SET name='${req.body.editRoleName}',avatar='${req.body.editRoleIcon}' WHERE id='${req.body.editRoleId}'`,
          (err, rows, fields) => {
            const result = JSON.parse(JSON.stringify(rows));
            if (result.length !== 0) {
              res.send({
                info: {
                  result,
                },
                status: "OK",
              });
            } else {
              res.send(
                handleData.responseJSON(false, {
                  error: "system error role edit",
                })
              );
            }
            connection.end();
          }
        );
      }
    }
  );
});

roles.post("/deleteRole", (req, res) => {
  const connection = config.createConnection();
  connection.query(
    `DELETE from roles where id = '${req.body.id}'`,
    (err, rows, fields) => {
      if (rows) {
        res.send({
          info: {
            result: "delete ok",
          },
          status: "OK",
        });
      } else {
        res.send(
          handleData.responseJSON(false, {
            error: "system error role deleting",
          })
        );
      }
    }
  );
  connection.end();
});

roles.post("/addrootmenu", (req, res) => {
  const connection = config.createConnection({ multipleStatements: true });
  console.log(req.body);
  // first case,root menu and root router
  // data sample { "key": "/app1", "icon": "SolutionOutlined", "label": "App1" }
  //let moackData = { menuIcon: "ChromeFilled", menuName: "finance", parentMenu: "/" }
  let moackData = req.body;

  let insert_root_menu_query = `update roles set menu_list = JSON_ARRAY_INSERT(menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), (select cast( '{ "key": "/${moackData.menuName.toLowerCase()
    }", "icon": "${moackData.menuIcon}", "label": "${handleData.capital(
      moackData.menuName
    )}" }' as json))) where id = '1' OR id = '4'`;

  //data sample { "path": "/app1", "element": "App1" }
  let insert_root_router_query = `update roles set router_list = JSON_ARRAY_INSERT(router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'),(select cast( '{ "path": "/${moackData.menuName.toLowerCase()
    }", "element": "${handleData.capital(
      moackData.menuName
    )}" }' as json))) where id = '1' OR id = '4'`;

  let mutipleQuery =
    insert_root_menu_query + ";" + insert_root_router_query + ";";
  //mutipleQuery = mutipleQuery.replace(/\r|\n/ig, "");

  //let mutipleQuery = "select 1";
  connection.query(mutipleQuery, (err, rows, fields) => {
    // const result1 = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows)))[0][0].tree)
    // const result2 = JSON.parse(Object.values(JSON.parse(JSON.stringify(rows)))[1][0].tree)
    if (rows) {
      res.send({
        status: "OK",
        message: "add successfully!",
      });
    } else {
      res.send(
        handleData.responseJSON(false, {
          error: "system error in adding root menu",
        })
      );
    }

    /* const result = Object.values(JSON.parse(JSON.stringify(rows)))[0].tree
    const result2 = JSON.parse(result)
    console.log(result2)
    if (rows) {
      res.send({
        info: result2
      })
    } else {
      res.send(handleData.responseJSON(false, {
        error: "system error role deleting"
      }))
    } */
  });
  connection.end();
});

roles.post("/deletewholerootsubmenu", (req, res) => {
  //let moackData = req.body;
  let chidlrenlables = req.body.children.map(item => handleData.capital(item))
  chidlrenlables = JSON.stringify(chidlrenlables)
  //console.log(chidlrenlables)
  let superSql = `
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
		
		update roles set menu_list =json_remove(menu_list, JSON_UNQUOTE(mymenu)) where id = myid;

	END IF; 
	
	SET incre = incre + 1;
END LOOP label;
	SELECT "OK";
END;

call p1('${handleData.capital(req.body.parentLabel)}','${chidlrenlables}');
  `;

  const connection = config.createConnection({ multipleStatements: true });
  connection.query(superSql, (err, rows, fields) => {
    //console.log(err)
    if (err === null) {
      res.send({
        status: "OK",
        message: "delete successfully!",
      });
    } else {
      console.log(err);
      res.send(
        handleData.responseJSON(false, {
          error: "system error in delete root menu",
        })
      );
    }
  });

  connection.end();
});

roles.post("/deleterootmenu", (req, res) => {
  //let moackData = req.body;
  let superSql = `
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

call p('${handleData.capital(req.body.label)}');
  `;
  const connection = config.createConnection({ multipleStatements: true });
  connection.query(superSql, (err, rows, fields) => {
    if (err === null) {
      res.send({
        status: "OK",
        message: "delete successfully!",
      });
    } else {
      console.log(err);
      res.send(
        handleData.responseJSON(false, {
          error: "system error in delete root menu",
        })
      );
    }
  });

  connection.end();
});

roles.post("/addsubmenu", (req, res) => {
  let moackData = req.body;

  let superSql =
    `
  SET @mychildren = regexp_replace(JSON_SEARCH((select menu_list from roles where id = 1),'one','${handleData.capital(moackData.parentMenu)}'),'\.([^\.]*)$','.children"');
SET @mypath = JSON_UNQUOTE(@mychildren);
SET @mylength = (select JSON_LENGTH(JSON_EXTRACT(menu_list,@mypath)) from roles where id = '1');
SET @finalpath = CONCAT(@mypath,'[',@mylength,']');

update roles
set menu_list = JSON_ARRAY_INSERT(
menu_list, @finalpath,
(select cast( '{ "key": "${moackData.parentMenu.toLowerCase()}/${moackData.menuName.toLowerCase()}", "icon": "${moackData.menuIcon}", "label": "${handleData.capital(moackData.menuName)}" }' as json))) where id = '1' OR id = '4';

update roles 
set router_list = JSON_ARRAY_INSERT(
router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
(select cast( '{ "path": "${moackData.parentMenu.toLowerCase()}/${moackData.menuName.toLowerCase()}", "element": "${handleData.capital(moackData.menuName)}" }' as json))) where id = '1' OR id = '4';
  `;
  //console.log(moackData);
  //console.log(superSql);
  const connection = config.createConnection({ multipleStatements: true });
  connection.query(superSql, (err, rows, fields) => {
    if (err === null) {
      res.send({
        status: "OK",
        message: "add submenu successfully!",
      });
    } else {
      console.log(err);
      res.send(
        handleData.responseJSON(false, {
          error: "system error in delete submenu",
        })
      );
    }
  })
});

roles.post("/addrootsubmenu", (req, res) => {
  let moackData = req.body;

  let superSql =
    `
    update roles
    set menu_list = JSON_ARRAY_INSERT(
    menu_list, CONCAT('$[',(SELECT JSON_LENGTH(menu_list)),']'), 
    (select cast( '{ "key": "/${moackData.rootMenuName.toLowerCase()}", "icon": "${moackData.rootMenuIcon}", "label": "${handleData.capital(moackData.rootMenuName)}","children":[{"key": "/${moackData.rootMenuName.toLowerCase()}/${moackData.subMenuName.toLowerCase()}", "icon": "${moackData.subMenuIcon}", "label": "${handleData.capital(moackData.subMenuName)}"}	] }' as json))) where id = '1' OR id = '4';
    
    update roles 
    set router_list = JSON_ARRAY_INSERT(
    router_list, CONCAT('$[0].children[',(SELECT JSON_LENGTH(router_list->'$[0].children')),']'), 
    (select cast( '{ "path": "/${moackData.rootMenuName.toLowerCase()}/${moackData.subMenuName.toLowerCase()}", "element": "${handleData.capital(moackData.subMenuName)}" }' as json))) where id = '1' OR id = '4'
  `;
  //console.log(moackData);
  //console.log(superSql);
  const connection = config.createConnection({ multipleStatements: true });
  connection.query(superSql, (err, rows, fields) => {
    if (err === null) {
      res.send({
        status: "OK",
        message: "add root sub menu successfully!",
      });
    } else {
      console.log(err);
      res.send(
        handleData.responseJSON(false, {
          error: "system error in delete root sub menu",
        })
      );
    }
  })
});

roles.post("/editrootmenu", (req, res) => {
  //let moackData = req.body;
  //console.log(req.body)
  let superSql = `
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

call p('${handleData.capital(req.body.label)}','${req.body.menu}','${req.body.router}');
  `;
  const connection = config.createConnection({ multipleStatements: true });
  connection.query(superSql, (err, rows, fields) => {
    console.log(err)
    if (err === null) {
      res.send({
        status: "OK",
        message: "edit successfully!",
      });
    } else {
      console.log(err);
      res.send(
        handleData.responseJSON(false, {
          error: "system error in edit root menu",
        })
      );
    }
  });

  connection.end();
});
roles.post("/editrootmenuall", (req, res) => {
  //let moackData = req.body;
  //console.log(req.body)
  let superSql = `
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


call p100('${handleData.capital(req.body.orginLabel)}','${handleData.capital(req.body.newLabel)}','${JSON.stringify(req.body.originChildren)}','${req.body.newIcon}');
  `;
  const connection = config.createConnection({ multipleStatements: true });
  connection.query(superSql, (err, rows, fields) => {
    console.log(err)
    if (err === null) {
      res.send({
        status: "OK",
        message: "edit root sub all successfully!",
      });
    } else {
      console.log(err);
      res.send(
        handleData.responseJSON(false, {
          error: "system error in edit root sub all menu",
        })
      );
    }
  });

  connection.end();
});
// test express mysql
roles.post("/test", (req, res) => {
  const connection = config.createConnection({ multipleStatements: true });
  connection.query("select 1;", (err, rows, fields) => {
    if (err === null) {
      res.send({
        status: "OK",
        message: "delete successfully!",
      });
    } else {
      console.log(err);
      res.send(
        handleData.responseJSON(false, {
          error: "system error in delete root menu",
        })
      );
    }
  })
});

module.exports = roles;
