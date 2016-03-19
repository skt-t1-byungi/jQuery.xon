# jQuery.xon
prevent multiple jqAjax event.

jquery ajax이벤트 중복을 막습니다.

## What?
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

very **long**!!

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
