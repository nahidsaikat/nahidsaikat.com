---
title: "Special Attributes of Python Class"
date: "2025-04-01T12:40:06+06:00"
tags:
  - "Python"
description: "Learning classes and objects is a must have skills to be master at object oriented programming. Python provides a minimum mechanism to define a class. A class in Python is also a data type from which an object can be instantiated."
---

![Special Attributes of Python Class](special-attributes-python-class.jpeg "Special Attributes of Python Class")
<center>
Image by <a href="https://pixabay.com/users/alexandra_koch-621802/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8623039">Alexandra_Koch</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8623039">Pixabay</a>
</center>

<br>

Learning classes and objects is a must have skills to be master at object oriented programming. Python provides a minimum mechanism to define a class. A class in Python is also a data type from which an object can be instantiated. Classes are defined at the runtime and they have attributes representing the state of objects and methods that contains functionality of the objects.

In one of my previous [article](https://nahidsaikat.com/posts/essential-special-methods-for-object-creation/) I have discusses the special methods involved in creating an object from a class. In this article I will explore all the attributes that a class object can have.

### type.`__name__`
This attribute returns the name of the class. You can also assign a new value to this attribute. In that case, when you try accessing the attributes after assigning a new value it will return the updated name of the class.
```python
class MyClass:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__name__)
MyClass.__name__ = "NewClassName"
print(MyClass.__name__)
obj = MyClass("Alice")
print(obj.greet())
print(obj.__class__.__name__)
# MyClass
# NewClassName
# Hello, Alice!
# NewClassName
```

### type.`__qualname__`
The qualified name of the class. For top level classes the qualified name is same as the class name. You can also modify this attribute by assigning a new value.
```python
class MyClass:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__qualname__)
MyClass.__qualname__ = "NewClassName"
print(MyClass.__qualname__)
# MyClass
# NewClassName
```
For the nested class it will show the dotted name of the nested class.
```python
class MyClass:
    class NestedClass:
        pass

print(MyClass.NestedClass.__qualname__)
# MyClass.NestedClass
```

### type.`__module__`
Returns the name of the module in which the class is defined.
```python
# module.py

class MyClass:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"
```
```python
from module import MyClass

print(MyClass.__module__)
# module
```
If we directly run the module using the python command is will return `__main__` as the name of the module.
```python
class MyClass:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__module__)
# __main__
```

### type.`__dict__`
Provides a read-only view of the class's namespace. It is a dictionary or mapping objects that stores the attributes of the class object. You can not reassign or insert/update keys into this dictionary.
```python
class MyClass:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__dict__)
# {'__module__': '__main__', '__init__': <function MyClass.__init__ at 0x101310ae0>, 'greet': <function MyClass.greet at 0x101310b80>, '__dict__': <attribute '__dict__' of 'MyClass' objects>, '__weakref__': <attribute '__weakref__' of 'MyClass' objects>, '__doc__': None}
```

### type.`__bases__`
A tuple that contains all the base classes of a particular class. The order of this tuple's values is the same as the bases are mentioned in class definition. When a class doesn't have a base class, by default it's base class is the `object` class.
```python
class BaseClass:
    pass

class AnotherBaseClass:
    pass

class MyClass(BaseClass, AnotherBaseClass):
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__bases__)
# (<class '__main__.BaseClass'>, <class '__main__.AnotherBaseClass'>)
print(BaseClass.__bases__)
# (<class 'object'>,)
```

### type.`__doc__`
This attribute returns the documentation string of the class if defined. When there is no doc string defined in the class definition this attribute return *None*.
```python
class MyClass:
    """A simple example class."""
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__doc__)
# A simple example class.
```

### type.`__annotations__`
This attribute contains a dictionary that holds variable's annotations that are collected during class body execution. Accessing the annotations attribute doesn't yield the correct result all the time, thus it is recommended to use [inspect.get_annotations()](https://docs.python.org/3/library/inspect.html#inspect.get_annotations) which is introduced in Python 3.10 to retrieve class annotations safely.

```python
class MyClass:
    attribute: str = "Value"

    def __init__(self, name: str):
        self.name: str = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__annotations__)
# {'attribute': <class 'str'>}
```

### type.`__type_params__`
This attribute holds a tuple that contains type parameters of a generic class. Generic classes are a type of classes that can work on any kind of data. You have to specify the type of data when instantiating an object of generic class. The `__type_params__` attribute holds that type parameters defined in a class.

```python
class MyGenericClass[T]:
    pass

print(MyGenericClass.__type_params__)
# (T,)
```
Note that the above example works on Python 3.12+ versions.

### type.`__static_attributes__`
This attribute holds a tuple containing all the attributes that are assigned using **self.X** within any methods of a class.

```python
class MyClass:
    def __init__(self, name: str):
        self.name: str = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__static_attributes__)
# ('name',)
```
Note that this attribute is added in Python 3.13.

### type.`__firstlineno__`
This attribute returns the first line number of the class in the module. Note that this attribute is added in Python 3.13.
```python
class MyClass:
    def __init__(self, name: str):
        self.name: str = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__firstlineno__)
# 1
```

### type.`__mro__`
This is a tuple that contains the classes that will be used for method resolution. When we call a method of a class Python checks the presence of that method in those classes maintaining the sequence order. The first class where the method definition is found gets invoked.

```python
class BaseClass:
    pass

class AnotherBaseClass:
    pass

class MyClass(BaseClass, AnotherBaseClass):
    def __init__(self, name: str):
        self.name: str = name

    def greet(self):
        return f"Hello, {self.name}!"

print(MyClass.__mro__)
# (<class '__main__.MyClass'>, <class '__main__.BaseClass'>, <class '__main__.AnotherBaseClass'>, <class 'object'>)
```

### Conclusion
In this article we have discussed about the special attributes of a class. Although those are not something that you will be using in day to day time of writing Python code but knowing them will help you Python's internal mechanism and write Python more appropriately.

---

##### References
1. [Data Model](https://docs.python.org/3/reference/datamodel.html#custom-classes)
2. https://docs.python.org/3/glossary.html
3. https://docs.python.org/3/tutorial/classes.html
