# jQuery.xon
prevent multiple jqAjax event.

jquery ajax이벤트 중복을 막습니다.

##  What?
### before
```js
$("button").on("click", function(){
  var $this = $(this);
  
  if($this.is(":disabled")){
    return false;
  }else{
    $this.attr("disabled", "true");
  }

  $.post('test.php', function(){
    //work..
    ...
    
  }).always(function(){
    $this.removeAttr("disabled");
  });
});
```

too **long**!!

너무 길다

### after
```js
$("button").xon("click", function(){
  return $.post('test.php', function(){
    //work..
    ...
  })
});
```
**short!!!**

짧다!

only return jqXhr

jquary ajax 객체만 린턴하삼

## Usage
### API
#### .xon
```js
$("button").xon("click", function(){
  return $.post('test.php', function(){
    //work..
    ...
  })
});
```
same jquery "on" method.

jquery on 메서드와 사용방법이 동일합니다

*폼(form)일 경우 해당 jquery dom이 아닌(not jquery dom), 자식(children) submit을 잠급니다(lock).

### config(설정, 옵션)

#### global config
```js
//get
var xon_config = $.xon();
// set
$.xon({
  offAttr : "data-off"
});
```
전역설정 가져오는 법(get), 설정하는 법(set)입니다.

#### default config
```js
{
  offAttr : "disabled"
}
```
기본옵션(default option). 현재는 하나밖에 없다. 나중에 추가할 예정입니다
- offAttr : 이벤트 금지되었을 때 추가되는 속성.

#### each config
```js
$("button").xon("click", 
  {
    xon:{
      offAttr:"disabled"
    }
  },function(){
  return $.post('test.php', function(){
    //work..
    ...
  })
});
```
event.data 위치 xon 속성에 개별적용할 옵션을 작성한다. 다른 옵션은 전역옵션을 따른다






