# jQuery.xon
+ prevent multiple jqAjax event. 
+ (jQuery ajax 중복 이벤트를 막습니다)

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
too **long**!! 너무 길다
### after
```js
$("button").xon("click", function(){
    return $.post('test.php', function(){
        //work..
        ...
    });
});
```
**short!!!** 짧다!
>only return jqXhr. 
>(jQuary Ajax 객체만 린턴하삼!)

## Usage
### default
```js
$("button").xon("click", function(){
    return $.post('test.php', function(){
        //work..
        ...
    });
});
```
```css
*[disabled] { opacity : 0.5; }
```
.xon을 jquery on메소드와 동일하게 사용하면 됩니다. ajax요청이 끝나기 전까지 자동으로 disabled속성이 적용되어집니다. 
>same jQuery **.on()** method!

### enable default event
```js
$("a").xon("click", function(event, enableDefaultEvent){
    enableDefaultEvent();
    return $.post('test.php', function(){
        //work..
        ...
  })
});
```
.xon()을 사용하면 기본이벤트가 비활성화됩니다. (automatically **event.preventdefault()**) 
일반적으로 ajax 결과를 기다리는 경우, element의 기본이벤트가 이를 방해하기 때문입니다.
그러나 두번째 인자함수를 통해 언제든 기본이벤트 비활성화를 취소할 수 있습니다.

### change off attr
```js
$("button").xon(
    "click", 
    {
        xon : {
            offAttr : "data-disabled"
        }
    },
    ,function(){
        return $.post('test.php', function(){
            //work..
            ...
        });
    }
);
```
```css
*[data-disabled] { opacity : 0.5; }
```
event.data에 xon속성을 추가하여 옵션을 설정할 수 있습니다.
#### global config setting
```js
var option = $.xon({
    offAttr : "data-disabled"
});
```
$.xon 헬퍼함수를 통해 전역적(global)으로 옵션을 설정할 수 있습니다. 옵션 우선순위는 **event.data.xon > $.xon()** 순입니다. 
> $.xon()은 전역옵션 전체를 리턴합니다.

### form submit
```js
$("form").xon("submit", function(){
    return $.post('test.php', function(){
        //work..
        ...
    });
});
```
```css
*[type=submit]:disabled{ opacity : 0.5; }
```
form submit 시에는 form이 아니라 폼 내부의 :submit타입에 lock이 걸리며 offAttr과 상관없이 disabled속성이 추가됩니다.

### event bind
```js
$("button").xon(
    "click", 
    {
        xon : {
            onStart : function(){
                console.log("start!");
            },
            onChange : function(){
                console.log("change!");
            },
            onComplete : function(){
                console.log("complete!");
            }
        }
    },
    ,function(){
        return $.post('test.php', function(){
            //work..
            ...
        });
    }
);
```
event.data.xon에 추가적인 이벤트를 등록할수 있습니다. 트리거되는 이벤트는 다음과 같습니다.
* start : 이벤트가 trigger 시작할 때.
* change : start, complete등 모든 시점.
* complete : ajax요청이 모두 완료될 때.
> $.xon() 헬퍼함수를 통해 전역적인 공통 이벤트를 등록할 수도 있습니다. ex) $.xon( { onStart : function(){...} } );

#### or
```js
$("button").xon("click", ,function(){
    return $.post('test.php', function(){
        //work..
        ...
    });
}).on("xon:start", function(){
    console.log("start");
});
```
**"xon:~"** 으로 jQuery로 래핑된  $el을 통해 이벤트를 등록할 수 있습니다. 
> 단 이 때에는 **xon이 아닌 on메소드를 사용**하십시요!!
아래의 예가 잘못된 예입니다.

#### incorrect usage
```js
//incorrect
$("button").xon({
    "xon:start" : function(){ ... },
    "click":function(){...}
});

//correcnt
$("button").xon({
    "click":function(){...}
}).on("xon:start", function(){...});
```
### default options
```js
console.log($.xon());
>>
    {
	    offAttr : "disabled",
		preventDefault : true, //false할 경우 enablePreventDefault를 하지 않아도 preventDefault가 실행되지 않습니다
		onStart : $.noop, //빈 함수입니다.
		onChange : $.noop,
		onComplete : $.noop 
    }
```
### other
**.xone(), .xoff()** 역시 jQuery .one, .off처럼 사용하면 됩니다 
> **.xone(), .xoff()** same **.one(), .off()** method!

```js
var evt = function(){...};
$("button").xone("click", evt); //once trigger
$("a").xon("mouseover", evt).xoff("mouseover", evt); //not trigger..
```
