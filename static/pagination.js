//分页组件
//向后台要新闻数据，每页展示5条新闻
//使用：  new Pagination($('容器'),按钮个数)

 var $ = require('.jquery');
 function Pagination($ct,pages,callback){
        this.$ct = $ct;
        this.$ct.addClass('pagination');
        this.callback = callback;
        this.allPage = pages;
        this.createHtml();
        this.init();
        this.bind();
        this.getData(); //先显示第一页的数据

       }

       Pagination.prototype={
        init: function(){
          this.$content = $(this.$ct.find('.content'));
          this.$page = $(this.$ct.find('.page'));
          this.curentPage = 1;   //当前页
          this.length=5;    //一页显示的内容
          this.btnNum = this.$page.find('li').length; //按键的个数 index： 0~length-1  page：1 ~        
        },
        bind: function(){
          var _this=this;
          this.$page.on('click','li',function(e){
           // e.cancelDefault();
           var curIndex = $(this).index();
           console.log('li:',curIndex)
            if(curIndex===0){
               if(_this.curentPage===1){
                alert('当前是第一页');
                return;
               }
              _this.curentPage-=1;
            }else if(curIndex===_this.btnNum-1){  //最后一个li,则页数加一
              if(_this.curentPage===_this.allPage){
                alert('当前是最后一页');
                return;
               }
               _this.curentPage+=1;
            }else{
              _this.curentPage = $(this).index();
            }

            $(this).siblings().removeClass('active');
            _this.$page.find('li').eq(_this.curentPage).addClass('active')

           
            console.log(_this.curentPage)
            _this.getData();
            
          })

        },
        //初始化按键
        createHtml: function(){
             var html='<div class="content"></div><ul class= "page clearfix"> <li><<</li>';
              for(var i=0;i<this.allPage;i++){
                   
                    if(i===1){
                        html+='<li class="active">'+(i+1)+'</li>'
                    }else{
                       html+='<li>'+(i+1)+'</li>'
                    }
              }
              html+='<li>>></li></ul>'
              this.$ct.append(html);
              
        },
        /*
    约定的接口: data: {
               index: xxx   //当前页数
               length: xxx   //一页显示的内容
              }
*/
        getData: function(){
          var _this =this;
              $.ajax({
                type: 'get',
                url: '/fenye',
                data: {
                   index: this.curentPage,
                   length: this.length
                },
                dataType: 'json'
              }).done(function(text){
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
               

              }).fail(function(){
                alert('系统异常')
              })

        },
        showContent: function(data){
          var _this = this;
          var html = '';
          data.forEach(function(ele,idx){
               html+= _this.getHtml(ele);
          })
               
                this.$content.html(html);

        },
        getHtml: function(data){
           if(data.length===0){
                isDataOver = true;
                return '<h2>没有数据了~</h2>'
           }
      
            var html = '';
           
            html+='<li class="item"><a href='+data.link;
            html+='><img src='+data.img+'><h2 >';
            html+=data.title+'</h2><p>';
            html+=data.brif+'</p></a> </li>';
              return html;
         }
       }