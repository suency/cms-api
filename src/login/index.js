const express = require('express');
const loginRouter = express.Router();
const config = require('@/config.js')
const jwt = require("jsonwebtoken");

const handleData = require("@/tools/handleData.js");


// middleware that is specific to this router
loginRouter.use((req, res, next) => {
  console.log('login general middleware');
  next();
});
// define the home page route
loginRouter.post('/', (req, res) => {
  //connection.query(`select * from users where username = ${req.body.username} and password=${req.body.password}`
  const connection = config.createConnection();
  //console.log(req.get("Authorization")) get header info by get Method
  connection.query(`select * from users where username = '${req.body.username}' and password='${req.body.password}'`, (err, rows, fields) => {
    const result = JSON.parse(JSON.stringify(rows));
    if (result.length == 0) {
      res.send(handleData.responseJSON(false, {
        error: "Username or password is wrong!!!"
      }))
    } else {
      const tokenStr = 'Bearer ' + jwt.sign({
        username: req.body.username,
        currentTime: new Date()
      }, config.secretKey, {
        expiresIn: config.expiresIn,
      });
      res.send(handleData.responseJSON(true, {
        token: tokenStr,
        role: result[0].role,
        menuList: [
          {
            label: "Dashboard",
            key: "/",
            icon: "PieChartOutlined"
          }, {
            label: "Settings",
            key: "/setting",
            icon: "SettingOutlined"
          },
          {
            label: "People",
            key: "/people",
            icon: "UserOutlined",
            children: [{
                label: "Admins",
                key: "/people/admins",
                icon: "SolutionOutlined"
              },
              {
                label: "Roles",
                key: "/people/roles",
                icon: "TrademarkCircleOutlined"
              },
              {
                label: "Users",
                key: "/people/users",
                icon: "CommentOutlined"
              }
            ]
          },
          {
            label: "Team",
            key: "/team",
            icon: "TeamOutlined",
            children: [{
                label: "Team1",
                key: "/team/team1",
                icon: "AndroidOutlined"
              },
              {
                label: "Team2",
                key: "/team/team2",
                icon: "AppleOutlined"
              }
            ]
          },
          {
            label: "Tools",
            key: "/tools",
            icon: "ToolOutlined"
          }
        ],
        routerList: [{
            path: "/",
            element: "Layout",
            children: [{
                path: "/",
                element: "Home",
              },
              {
                path: "/setting",
                element: "Setting"
              },
              {
                path: "/tools",
                element: "Tools"
              },
              {
                path: "/team/team1",
                element: "Team1"
              },
              {
                path: "/team/team2",
                element: "Team2"
              },
              {
                path: "/people/admins",
                element: "Admins"
              },
              {
                path: "/people/roles",
                element: "Roles"
              },
              {
                path: "/people/users",
                element: "Users"
              },
            ],
          },
          {
            path: "/Login",
            element: "Login"
          },
          {
            path: "*",
            element: "NotFound"
          },
        ]
      }));
    }
    console.log(JSON.parse(JSON.stringify(rows)))

    //res.send('The solution is: ', rows)
    //console.log(rows)
  })
  connection.end()


});
// define the about route
loginRouter.get('/register', (req, res) => {
  console.log(req.body);
  res.send('register');
});

loginRouter.post('/test', (req, res) => {
  res.send('test');
});


module.exports = loginRouter;
