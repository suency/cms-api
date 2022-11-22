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
  let superSql = `
  drop procedure if exists p1;
CREATE PROCEDURE p1(parent varchar(255),child varchar(255))
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

	SET myrouter = (SELECT regexp_replace(JSON_SEARCH((select router_list from roles ORDER BY id ASC LIMIT incre,1),'one',child),'\.([^\.]*)$','"')); 
	SET mymenu = (SELECT regexp_replace(JSON_SEARCH((select menu_list from roles ORDER BY id ASC LIMIT incre,1),'one',parent),'\.([^\.]*)$','"')); 

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

call p1('${handleData.capital(req.body.parentLabel)}','${handleData.capital(req.body.childLabel)}');
  `;
  const connection = config.createConnection({ multipleStatements: true });
  connection.query(superSql, (err, rows, fields) => {
    console.log(req.body)
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
