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