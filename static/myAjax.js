/*Ajax 封装 终极版*/
/* 使用方式：

        myAjax({
               type: 'get',
                url: '/fenye',
                data: {
                   index: this.curentPage,
                   length: this.length
                },
                dataType: 'json',
                onsuccess: function(text){
                  if(text.status!==0){
                    alert('数据获取失败');

                  }else{
                    //这里的this 指的是ajax
                    if(_this.callback){
                      _this.callback(text.data)
                    }else{
                      _this.showContent(text.data);
                    }
                   
                  }           
              },
             onerror: function(){
                alert('系统异常')
              }
            });


*/
   function myAjax(ajaxObj){
          //-----------参数初始化--------------------
          ajaxObj.type = ajaxObj.type||'get';
          ajaxObj.data = ajaxObj.data||{};
          ajaxObj.dataType = ajaxObj.dataType||'json';
          ajaxObj.onerror = ajaxObj.onerror||function(){};
          ajaxObj.onsuccess = ajaxObj.onsuccess||function(){};
          var query = '';
          //-------------拼接query----------------------
          for(var key in ajaxObj.data){
            query+=key+'='+ajaxObj.data[key]+'&';
          }
          query = query.substr(0,query.length-1);
          //------------发送ajax请求-------------------
          //----------接收数据时，对数据格式区分：text 还是 json
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function(){
            if(xhr.readyState===4){
              if(xhr.status>=200&&xhr.status<300||xhr.status===304){
                if(ajaxObj.dataType.toLowerCase()==='text'){
                  ajaxObj.onsuccess(xhr.responseText);
                }
                if(ajaxObj.dataType.toLowerCase()==='json'){
                  ajaxObj.onsuccess(JSON.parse(xhr.responseText));
                }
              }else{
                ajaxObj.onerror();
              }
            }
          }
          //-----------发送数据时，对post 和 get 区分
          if(ajaxObj.type.toLowerCase()=='post'){
            //体现在 Request URL 和 method 中
            xhr.open(ajaxObj.type,ajaxObj.url,true);
            //这里的内容会体现在 Request Headers中
            xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
            xhr.send(query); //这里的内容会体现在 formdata中
          }
          if(ajaxObj.type.toLowerCase()==='get'){
            //拼接的query 会显示在 query string parameter中
            xhr.open(ajaxObj.type,ajaxObj.url+'?'+query,true);
            xhr.send();
          }
          
        }

