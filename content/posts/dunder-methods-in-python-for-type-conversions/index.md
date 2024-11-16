---
title: "Dunder Methods in Python for Type Conversions"
date: "2024-11-12T11:36:55+06:00"
tags:
  - "Python"
  - "Dunder Methods"
description: "Python has some build-in modules that offers us to serialize and persists python object into a file and also allows us to de-serialize and use them from the file."
---

![Dunder Methods in Python for Type Conversions](type-conversion-dunder.png "Dunder Methods in Python for Type Conversions")
<center>
Image by <a href="https://pixabay.com/users/acatxio-20233758/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7955446">AcatXIo</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7955446">Pixabay</a>
</center>

<br>

Dunder methods are special kind of methods that begins and ends with double underscores. The name "dunder" is used unofficially in the Python community. Python documentation refers them as "special methods" or "magic methods". The convention for their naming is `__method__()`. They have special purpose in Python. Some are for creating and controlling objects, some are to support object-oriented features in Python, some are for arithmetic operations and many more. In this article we will discuss all the dunder methods that are used for type conversions in Python.

### `x.__str__()`

In Python, to convert any object into a string we use built-in function `str()`. When `str()` is call on any object, it returns the user friendly string representaion of that object. Internally it calls the dunder method `__str__()`. So, if we call `str(x)`, this invocation converts to `x.__str__(x)` internally by Python and returns what ever the `__str__()` method returns. Note that `__str__()` will always return a string value, if not Python will raise a `TypeError`. 

There is a built-in `__str__` method defined for all the classes across Python that returns general information like the class this object belongs-to and the objects memory address. But we can override this behavior and return more meaningful information by overriding `__str__()` method in a class. When we call `print()` built-in function on any object it also call `__str__()` method internally.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __str__(self):
        return f"Name is {self.name} and age is {self.age}"

obj = Person("Nahid", 30)
print(obj)
# Name is Nahid and age is 30
```

### `x.__repr__()`

`__repr__()` is called by Python when we invoke `repr()` function on any object. This method should return the official representation of an object which is usually used by the developers mostly instead of users. The returned value of `__repr__()` should be a valid Python expression string that if we evaluate should recreate the object itself. When a class doesn't define `__str__()` but `__repr__()` is defined then after calling `str()` function on that class's object will invoke `__repr__()`.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __repr__(self):
        return f"Person('{self.name}', {self.age})"

obj1 = Person("Nahid", 30)
print(str(obj1))     # Person('Nahid', 30)
print(repr(obj1))    # Person('Nahid', 30)

# when we evaluate the return value of __repr__(), it recreates the object.
obj2 = eval(repr(obj1))
print("obj1 repr representation: ", repr(obj1))
print("obj2 repr representation: ", repr(obj2))
# obj1 repr representation:  Person('Nahid', 30)
# obj2 repr representation:  Person('Nahid', 30)
```

### `x.__bool__()`

Python's built-in function `bool(x)` converts value `x` to a boolean value of True or False. For the built-in types Python has its own rules to convert a value into a boolean. Python converts all the zero values(0, 0.0, "", [], {})  to **False** and all the other values to **True**. But when it comes for the object of a user defined class `bool(x)` will always return True. To customize this behavior we can implement `__bool__()` method in a class. Note that, `__bool__()` method should always return a boolean value otherwise Python will through a `TypeError` exception. In the code snippet below we will implement **"Person.`__bool__`()"** method that will return False if the age is negative or greater than 100.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __bool__(self):
        if self.age < 0 or self.age > 100:
            return False
        return True

obj = Person("Nahid", 30)
print(bool(obj))    # True

obj = Person("Nahid", -1)
print(bool(obj))    # False
```

### `x.__int__()`

To convert a numeric string value or a float value into integer we use `int(x)` in Python. When we call **int('100')** it returns the numeric value of *100* and when we call **int(100.5)** it returns the numetic value of *100* rounding down the value to the closest integer. Internally Python calls `__int__()` method on the object when we call built-it "int()" function. So we can define `__int__()` on any custom class to make it work with the built-in function "int()". Note that, `__int__()` must return a integer value otherwise it will raise a `TypeError` when called with "int()". If the custom class doesn't implement `__int__()` and we call "int()" on it's object, Python will also raise a `TypeError`.

```python
class MyInt:
    def __int__(self):
        return 100

obj = MyInt()
print(int(obj))
# 100
```

### `x.__float__()`

The built-in `float()` function converts a value into a float value. If we call **float('100')** it will convert the string value '100' into a float *100.0*. We can implement `__float__()` method on our custom class to make its object work with `float()` function. `__float__()` must return a float type value otherwise will raise `TypeError` exception. Also when we call `float()` on an object without `__float__()` method defined it will also raise `TypeError` exception.

```python
class MyFloat:
    def __float__(self):
        return 100.0

obj = MyFloat()
print(float(obj))
# 100.0
```

### `x.__bytes__()`

When we call `bytes()` on any objects it return a Bytes object. Byte object is like string but only consists of byte characters. Bytes are immutable, on the other hand `bytearray()` returns mutable bytearray object. In our custom user defined class, we have to define `__bytes__()` method to make it work with `bytes()`. `__bytes__()` should always return a Bytes object, otherwise it will raise `TypeError` exception. Also if a class doesn't define `__bytes__()` method calling its object with `bytes()` will results a `TypeError` exception.

```python
class MyBytes:
    def __bytes__(self):
        return b'100'

obj = MyBytes()
print(bytes(obj))
# b'100'
```

### `x.__complex__()`

Built-in `complex()` function returns a complex number. Complex number has two parts, the real part and the imaginary part. In python we can append the letter 'j' or 'J' to a numeric literals yielding a imaginary number which can be converted to complex number by adding an integer or a float value. If we want our custom class to work with `complex()` function we have to define `__complex__()` method in the class. This method always returns a complex number, if not will raise `TypeError` exception. Same is true when we call `complex()` with an object not implementing `__complex__()` method.

```python
class MyComplex:
    def __complex__(self):
        return 1 + 2j

obj = MyComplex()
print(complex(obj))
# (1+2j)
```

### Conclusion

Type conversion is a fundamental aspect of any programming language, and Python provides built-in mechanism to facilitates type conversion between types. Beyond those built-ins, Python allows programmers to integrate type conversion behavior into their custom classes. Python provides different dunder methods to achieve this. In this article we just discussed those dunder methods and how they enable custom type conversion in Python.

---

##### References
* [Python Dunder Methods Cheat Sheet](https://blog.finxter.com/python-dunder-methods-cheat-sheet/)
* [Python Classes `__str__()` Method](https://www.pynerds.com/python-classes-str-method/)
* [How To Use the `__str__()` and `__repr__()` Methods in Python](https://www.digitalocean.com/community/tutorials/python-str-repr-functions)
* [Python `__bool__`](https://www.pythontutorial.net/python-oop/python-__bool__/)
* [Python `__int__`() Magic Method](https://blog.finxter.com/python-__int__-magic-method/)
* [Python `__float__`() Magic Method](https://blog.finxter.com/python-__float__-magic-method/)
* [Python `__bytes__`() Magic Method](https://blog.finxter.com/python-__bytes__-magic-method/)
* [Python `__complex__`() Magic Method](https://blog.finxter.com/python-__complex__-magic-method/)
