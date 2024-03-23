---
title: "What You Can Do with Python's F-String"
date: "2024-03-23T22:20:00+06:00"
tags:
  - "Python"
description: "F-string which is a short form of formatted string literals, which is concise and very useful feature of Python."
---

![What You Can Do with Python's F-String](python-f-string.jpeg "What You Can Do with Python's F-String")
<center>
Image by <a href="https://pixabay.com/users/chenspec-7784448/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7863504">Chen</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7863504">Pixabay</a>
</center>

<br>

F-string which is a short form of formatted string literals, which is concise and very useful feature of Python. It was introduced in Python back with version 3.6. F-string is a mechanism for formatting strings and interpolating values inside them. It lets us use Python expression directly inside a string. Any string prefixed with `F` or `f` is f-string. We can use the Python expression using `{expression}` format inside of a string. Let's take a look in an example.

```Python
>>> name = "Nahid"
>>> f"My name is {name}."
My name is Nahid.
```

Here is another example that invokes a function directly inside of f-string.
```python
>>> def greeting(name):
>>>     return f"Hello {name}!"
>>> f"{greeting('Nahid')}"
Hello Nahid!
```

We can embed any arithmetic expressions inside f-string. 
```python
>>> f"{2 * 10}"
'20'
```

The arithmetic expressions can also be printed as well.
```python
>>> f"{2 * 10 = }"
'2 * 10 = 20'
```
It will be super helpfull during debuging. Note that the spaces around the `=` sign will have effect in the output.
```python
>>> f"{2 * 10=}"
'2 * 10=20'
```

F-string supports string formating protocal. That means if we supply format specifier it will return a formatted value using that specifier.
```python
>>> amount = 1234.5678
>>> f"Amount: ${amount:.2f}"
'Amount: $1234.57'

>>> value = -987654321
>>> f"Value: {value:,}"
'Value: -987,654,321'

>>> float_value = 12345.6789
>>> f"Float value: {float_value:,.2f}"
'Float value: 12,345.68'
```

We can also apply format specifier to differently align the string values.
```python
>>> test = "This is a text."
>>> f"{test:#^50}"
'#################This is a text.##################'

>>> f"{test:#<50}"
'This is a text.###################################'

>>> f"{test:#>50}"
'###################################This is a text.'
```

Format specifier can be applied on the datetime objects as well.
```python
>>> from datetime import datetime
>>> now = datetime.now()
>>> f"{now:%m/%d/%Y}"
'03/23/2024'
```

Python's f-string supports two flags that has special meaning in the interpolation process. Those flags are related to the string representation of an object. We know that `.__str__()` provides a user friendly representation of an object and `.__repr__()` provides developer friendly representation. In f-string we can use `!s` flag that will invoke `.__str__()` of the object and `!r` flat that will invoke `.__repr__()` internally.
```python
class Post:
    def __init__(self, title, body):
        self.title = title
        self.body = body

    def __str__(self):
        return f"Title: '{self.title}'"

    def __repr__(self):
        return f"Post(title='{self.title}', body='{self.body}')"
```
Now we will create an object of Post and we can choose which representation will be used inside the f-string.
```python
>>> from post import Post
>>> obj = Post("This is title", "This is body")
>>> f"{obj!s}"
"Title: 'This is title'"
>>> f"{obj!r}"
"Post(title='This is title', body='This is body')"
```
As you can see when we have used !s flag it invoked .__str__() method and for !r flag it has invoked .__repr__() method.

<hr>

#### Improvements in Python 3.12

* ##### Quotation Marks
Python supports different types of quotation marks in string literals. We can use single quotes ('), double quotes ("), triple single quotes (''') and triple double quotes ("""). Before Python 3.12 we can use any combination of them thus we can go a maximum of depth four in f-string.
```python
>>> f"""{
        f'''{
            f"{ f'{100}' }"
        }'''
    }"""
'100'
```
When we try to mix the quotation marks we get an error.
```python
>>> f"{f'{f"{100}"}'}"
Traceback (most recent call last):
  File "<main.py>", line 1
    print(f"{f'{f"{100}"}'}")
                  ^
SyntaxError: f-string: unterminated string
```

In Python 3.12 we can use the same quotes multiple time in f-string and there is no limit.
```Python
>>> # Python 3.12

>>> print(f"{ f"{ f"{100}" }" }")
100
```

* ##### Backslashes
Before Python 3.12 we can't use backslash characters inside f-strings.
```python
>>> parts = ["This", "is", "a", "sentence."]
>>> f"{'\n'.join(parts)}"
Traceback (most recent call last):
  File "<main.py>", line 1
    f"{'\n'.join(parts)}"
                         ^
SyntaxError: f-string expression part cannot include a backslash
```

But in Python 3.12 we can use backslash characters inside f-strings.
```python
>>> # Python 3.12

>>> parts = ["This", "is", "a", "sentence."]
>>> f"{'\n'.join(parts)}"
'This\nis\na\nsentence.'
```

* ##### Inline Comments
Upto Python 3.11 we can't use inline comments inside the expression of f-string.
```python
>>> name = "Nahid"
>>> f"""{
    name.upper().  # always upper
}"""
Traceback (most recent call last):
  File "<main.py>", line 3
    f"""{
    name.upper().  # always upper
}"""
        ^
SyntaxError: f-string expression part cannot include '#'
```

In Python 3.12 we can use inline comments inside the f-string.
```python
>>> # Python 3.12

>>> name = "Nahid"
>>> f"""{
    name.upper()   # always upper case
}"""
'NAHID'
```

* ##### Error Messages
Python 3.12 has better error messages than previously. It points the exact location where the error occurs. Also instead of surrending with parentheses it shows the actual string which removes noise from the error trace.
```python
>>> # Python 3.11

>>> f"{42 + }"
Traceback (most recent call last):
  File "<main.py>", line 1
    (100 + )
           ^
SyntaxError: f-string: invalid syntax

>>> # Python 3.12

>>> f"{42 + }"
File "<input>", line 1
    f"{42 + }"
          ^
SyntaxError: f-string: expecting '=', or '!', or ':', or '}'
```

<hr>

F-string is a nice tool for string interpolation and formatting. By interpolating values, objects and expressions inside string it makes the program more readable.

<hr>

##### References
* [Python's F-String for String Interpolation and Formatting](https://realpython.com/python-f-strings/)
* [The Complete Guide to Python f-Strings](https://www.nickmccullum.com/complete-guide-python-f-strings/)
* [Python f-string cheat sheets](https://fstring.help/cheat/)
* []()
