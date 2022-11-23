#select json_replace('{"name":"Zhaim","tel":"13240133388"}',"$.tel","hhe");

#select json_replace('[{"name":"Zhaim","tel":"13240133388"}]',"$[0].name","hhe");

SELECT REPLACE("abv","b","999");