/*实现一个服务器*/
var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var server=http.createServer(function(req,res){
   //staticRoot(path.join(__dirname,'static'),req,res)
    routePath(req,res)
    
})
console.log('open http://localhost:8080/')
server.listen(8080);

/*------------------静态服务器-----------------------------------*/
/*  1. staticPath === path.join(__dirname,'loadMore')
       服务器要展示的文件路径
    2. filePath 是用户要求访问的具体文件路径,展示的是个页面
*/

function staticRoot(staticPath,req,res){
   var pathObj = url.parse(req.url,true);
   console.log(pathObj);
   if(pathObj.pathname==='/'){
   	 pathObj.pathname+='index.html';
   }   
   var filePath = path.join(staticPath,pathObj.pathname);
   console.log(filePath);
    readFile(filePath,req,res);
   /*fs.readFile(filePath,'binary',function(err,fileContent){
       if(err){
       	res.write('<h1>出错了</h1>');
       	res.end();
       }else{
       	res.write(fileContent,'binary');
       	res.end();
       }
   })*/
}

/*------------------路由配置--------------------------------*/
/*---------简版-------------------------------*/
 function routePath(req,res){
        var staticPath = path.join(__dirname,'static');
        var pathObj = url.parse(req.url,true);
         
        console.log(pathObj)
        //输出为 undefined,说明 req并没有 query 和body 属性
        console.log(req.query);   
 	    console.log(req.body);
 	    //为其添加query 和 body 属性，若是 get 则 query , post  则 body
        //handleQuery(pathObj,req);


        switch(pathObj.pathname){
          case '/loadMore1': readFile(path.join(staticPath,'src','loadMore.json'),req,res);
                            break;
          case '/loadMore': 
              /*  ‘加载更多功能’ 前后端约定数据格式：{ index：3, length: 5 }*/
              console.log('loadMore')
                 var data=[];
                 var curIndex = pathObj.query.index;
                 var length = pathObj.query.length;            
                 //模拟消息延迟
                // setTimeout( function(){
                           for(var i=0;i<length;i++){
                                data.push('内容'+(parseInt(curIndex)+i))
                             }
                             res.end(JSON.stringify(data));
                //  },30)
                 

                 break;
          case '/zhubao': readFile(path.join(staticPath,'src','zhubao.json'),req,res);
                            break;
       
          case '/loadNew': readFile(path.join(staticPath,'src','loadNews.json'),req,res);
                            break;
          case '/fenye': 
            handleQuery(pathObj,req);
            readFile(path.join(staticPath,'src','loadNews.json'),req,res);


                            break;
       
          default: //readFile(path.join(staticPath,'loadMore.html'),req,res);
                 // readFile(path.join(staticPath,'zhubao.html'),req,res);
                  // readFile(path.join(staticPath,'loadMorejq.html'),req,res);
                   readFile(path.join(staticPath,'zhubao.html'),req,res);

        }      
 }








 var routes = {
  '/a': function(filePath,req,res){
          res.end(JSON.stringfy(req.query));
        },
  '/loadMore': function(filePath,req,res){
        readFile(path.join(filePath,'src/loadMore.json'),req,res)
  }
 }





/*
    约定的接口: data: {
               index: xxx   //当前页数
               length: xxx   //一页显示的内容
              }
*/
 function readFile(filePath,req,res){

       fs.readFile(filePath,'binary',function(err,fileContent){
            if(err){
                   res.write('<h1>出错了</h1>');
                   res.end();
            }else{
                   if(req.body||req.query){
                    // pathObj.query.index length 是字符串，转为数值
                        var curIndex =req.query.index? parseInt(req.query.index):parseInt(req.body.index);
                        var length =req.query.length? parseInt(req.query.length):parseInt(req.body.length); 
                     
                      //fileContent 是JSON格式的字符串，转为数组                  
                        fileContent=JSON.parse(fileContent); 
                        console.log(curIndex)    
                        //截取相应的内容       
                        var beginc = length*(curIndex-1)+1;
                        var  endc =  curIndex*length;
                        var data = fileContent.slice(beginc,endc+1);  //silce(beg,end-1)的数据
                       /* console.log(curIndex);
                        console.log(length) 
                        console.log(data.length)   */ 
                        // 与前端约定的是JSON格式      
                          var senddata = {
                            status: 0,
                            data: data
                          }      
                        res.write(JSON.stringify( senddata ),'binary');
                        res.end();
                   }else{
                   	    res.write(fileContent,'binary');
                        res.end();
                        
                   }
                   
            }
       })

 }

 function handleQuery(pathObj,req){
 	/* req 的data 和 end 事件，给req 加上 query 和 body属性*/

     
   	  // 若是post 的话,req.query={},获得pathObj的search属性,拼接到req.body上   
       var body='';
     /* data事件，获得的是req的search属性*/
   	   req.on('data',function(chunk){
     		console.log("chunk=");
     		console.log(chunk);
     		//chunk=<Buffer 69 6e 64 65 78 3d 31 26 6c 65 6e 67 74 68 3d 35>

       		 body+=chunk;
    	 }).on('end',function(){
     		console.log("body=");
     		console.log(body);
     		//body=index=1&length=5
     		var obj = parseBody(body);     		
     		req.body=obj;       //若是get，则结果为 { '': undefined }	
     })   
        //若是 get 请求，则把 pathObj.query 放到 req.query上
     	req.query=pathObj.query;
     	console.log("req.body=");
     	console.log(req.body);
     	console.log("req.query=");
     	console.log(req.query);
        
  
 }
 function parseBody(body){
  	var obj={};
  	body.split('&').forEach(function(str){
  		
       obj[str.split('=')[0]]=str.split('=')[1];
      

  	})
    return obj;
  }