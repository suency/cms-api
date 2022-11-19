## 原表结构与数据

``````mysql
SELECT * from test
``````

id	tree
1	[{"name": "sk"}, {"niu": true, "name": "fei"}]

***

### 查询数组中某一条数据

`````mysql
select tree->"$[1]" as b from (SELECT tree from test) as a;
`````

b
{"niu": true, "name": "fei"}

***

### 查询数组中的某一条对象的属性

`````mysql
select tree->"$[1].name" as b from (SELECT tree from test) as a;
`````

b
"fei"

***

### json链式操作方法

``````json
[
    {
        "path": "/", 
        "element": "Layout", 
        "children": [
            {
                "path": "/", 
                "element": "Home"
            }, 
            {
                "path": "/people/roles", 
                "element": "Roles"
            }
        ]
    }, 
    {
        "path": "/Login", 
        "element": "Login"
    }
]
``````

``````mysql
select tree->"$[0].children[0].element" as b from (SELECT tree from test where id=2) as a;
``````

> $[0].children[0].element
>
> $表示开始操作json里面的数据，[]方括号代表操作数组, . 点表示操作对象，以此类推
>
> 表示第1个元素[数组]的children对象下面的第1个元素下面的element，返回Home

***

### 表示所有元素

```mysql
select tree->"$[0].children[*].*" as b from (SELECT tree from test where id=2) as a;
```

> [\*]代表所有数组元素，.\*表示所有里面的对象

***

### 获取所有的key

```mysql
SELECT JSON_KEYS((select tree->"$[1]" from (SELECT tree from test where id=2) as a));
```

***

### 简单的增删改查

[文档在这]: https://zhuanlan.zhihu.com/p/158353284

```mysql
#查 ->> 表示结果去引号
select order_name, area ->> '$.east' from `order` 

#改 oder:表名, area:字段名
update `order` set area = json_set(area, '$[0].south', '60') where id = '1' 

#删除 某一处的属性
update `test` set tree =json_remove(tree, '$[1].niu') where id = '1'

# 插入整一条json
update `test` set tree = json_set(tree, '$[2]', (select cast( '{"east": "50", "south": "65"}' as json ))) where id = '1'

#转化为json数据
select cast( '{"east": "50", "south": "65"}' as json )

#更新路由数据测试 在数组某一个位置插入数据
update `roles` 
set router_list = JSON_ARRAY_INSERT(
router_list, CONCAT('$[',(SELECT JSON_LENGTH(router_list)-1),']'), 
(select cast( '{ "path": "/Logout", "element": "Login" }' as json)));
```

