//https://ivwv.github.io/posts/notes/node/express/Express%E4%B8%ADjwt%E9%AA%8C%E8%AF%81%E7%9A%84%E7%AE%80%E5%8D%95%E4%BD%BF%E7%94%A8.html#%E6%BC%94%E7%A4%BA%E4%BB%A3%E7%A0%81
/*

const config = require('@/config.js')

connection.query('select * from users', (err, rows, fields) => {
if (err) throw err

console.log('The solution is: ', rows)
})
connection.end()*/


/*connection.query(`SELECT menu_list FROM  roles where roles.name = '${req.body.role}'`, (err, rows, fields) => {
  const result = JSON.parse(JSON.stringify(rows));
  if (result.length == 0) {
    res.send(handleData.responseJSON(false, {
      error: "Username or password is wrong!!!"
    }))
  } else {
    res.send(handleData.responseJSON(true, {
      info: result
    }))
  }

})*/

/*'[{"label":"Dashboard","key":"/","icon":"PieChartOutlined"},{"label":"Settings","key":"/setting","icon":"SettingOutlined"},{"label":"People","key":"/people","icon":"UserOutlined","children":[{"label":"Admins","key":"/people/admins","icon":"SolutionOutlined"},{"label":"Roles","key":"/people/roles","icon":"TrademarkCircleOutlined"},{"label":"Users","key":"/people/users","icon":"CommentOutlined"}]},{"label":"Team","key":"/team","icon":"TeamOutlined","children":[{"label":"Team1","key":"/team/team1","icon":"AndroidOutlined"},{"label":"Team2","key":"/team/team2","icon":"AppleOutlined"}]},{"label":"Tools","key":"/tools","icon":"ToolOutlined"}]'*/
