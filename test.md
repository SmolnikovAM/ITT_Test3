/_ cSpell:disable _/

1: (25%) **Какво е AJAX и как се различава от обикновенните заявки, които браузъра изпраща?**

Ajax (съкращение на Asynchronous JavaScript and XML) е похват в уеб разработките за създаване на интерактивни уеб приложения. Предимството на Ajax е, че посредством използването му уеб страниците се зареждат по-бързо.

**Как се реализира в JavaScript?**
Има специален обект
`new XMLHttpRequest();`
Можем работим и с Promise

```js
fetch('send-ajax-data.php')
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.log('Error: ' + error);
  });
```

**Какво е Promise и как ни помага при AJAX заявки?**

Promise е специален обект, който съдържа неговото състояние. Първо, в очакване, след това един от: onFulfilled (успешен) или onRejected ("завършен с грешка").

Promise помага да за писане на Asynchronous код. Можем да пишен по синхронене начина с Promise - chain

```js
fetch('send-ajax-data.php')
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.log('Error: ' + error);
  });
```

2: (25%) **Опишете какво е прототипно наследяване и constructor stealing, както и как се реализира в JavaScript?**

Constructor Stealing

В опит да се реши проблемът с наследяването с референтни стойности на прототипи, разработчиците започнаха да използват техника, наречена Constructor Stealing.

Основната идея: обадете се на конструктора на супертипа от конструктора на подтипа. Функциите са просто обекти, които изпълняват код в определен контекст, методите apply () и call () могат да се използват за изпълнение на конструктор на новосъздадения обект, както в този пример:

Пример:

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green'];
}
function SubType() {
  //inherit from SuperType
  SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push('black');
//console.log(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
//console.log(instance2.colors); //"red,blue,green"
```

3: (25%) **За какво се използва jQuery?**
jQuery има много преимущества

* Скорост на писане на код. С помощта на jQuery кодът е написан много по-лесно и по-бързо, отколкото при чист JavaScript. Това позволява на разработчика да спести много време при разработването на проекта.
* Съвместимост между различни браузъри
* Всички версии на JQuery са напълно съвместими.
* добра документация

**Как се търсят, създават, изтриват и манипулират елементи с jQuery?**
Основна функция в JQuery която работи как wrapping аргументи каето на Й подаваме.
$()

и връшта различни неща в зависимоста от аргументи и пак връшта обект JQuery
$("div.test") -- търсене на обекта в DOM
.add("p.quote") -- добаване обекта
.addClass("blue") -- работи с класове
.slideDown("slow");

Търсене по атрибут
$('[cellspacing = 5]')

търсене по клас
$(".someBlock")

delete метод
$(el).remove()

добавяне на обекта
$(el).append(el2)

$(el).appendTo(el3)

**Как се добавят event listeners?**

4: (25%) **По колко начина можем да слушаме за някакво събитие върху някакъв елемент?**

в атибути на елементи

```html
<button onclick='() => console.log("test")'>Test</button>
```

свойства на DOM едементи в скрипта

```js
document.getElementById(‘myLink’).onclick = doConfirm;
```

свойства на DOM едементи в скрипта Третий вариант

```js
document.getElementById(‘myLink’).addEventListener(‘click’, doConfirm, false);
```

remove events

```js
element.removeEventListener(<event name>, <handler function>,
<in capturing or bubbling – (true or false)>);
```

**Каква е разликата между bubbling и capturing фазите?**
capturing - първоначана фаза на събитето
Събитието се разпространява чрез обектите стартира от window чрез dom-дърво до target
bubbling - Събитието се разпространява обратно от target до window.

Разлика, че можем да контролирам детали на реализация
