---
title: "Essential Special Methods for Object Creation"
date: "2025-02-28T09:52:52+06:00"
tags:
  - "Python"
description: ""
---

![Essential Special Methods for Object Creation](essential-special-methods-for-objects-creation.png "Essential Special Methods for Object Creation")
<center>
Image by <a href="https://pixabay.com/users/alexandra_koch-621802/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8623039">Alexandra_Koch</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8623039">Pixabay</a>
</center>

<br>

In Python, objects are considered as first class citizen. Virtually everything, like integers, strings, functions, classes, modules and even types themselves are considered as object. Which means they all inherit similar properties and behaviors of objects. They can have attributes and methods, they can be passed as function arguments and even they can be returned from function.

Python also facilitates us to create objects when we need them. Python provides class type where we can group the related data together and also define their functionality. We can instantiate objects from those classes and serve our purposes. 

The internal mechanism for creating objects in Python is not that complex. Python uses some dunder ("double underscore") or special methods to create and instantiate the objects. In this article we will explore those special methods that take part in object creation in Python.

### `__new__` Method
The `__new__` is a static method that is responsible for creating the actual objects. Its responsibility also includes allocating the memory of the object as well. This method is called on the class itself before the `__init__` method. This method takes the class object as first argument and then takes other arguments. 

```python
class MyClass:
    def __new__(cls, *args, **kwargs):
        print("Creating instance with __new__")
        instance = super().__new__(cls)
        return instance

obj = MyClass(42)
# Creating instance with __new__
```
In the example above the call `super().__new__(cls)` actually creates the instance and returns it. 

Although you can override this method but you have to do that rarely. You can use it to ensure that the object is of certain type. You can also use it to prevent creating more than one object of the class to implement the singleton pattern.

### `__init__` Method
The `__init__` method is the constructor method in Python. It is called automatically after the object is created. It's an instance method that takes the object as first argument and after that the other objects. The main responsibility of this method is to initialize the object's attribute. It doesn't return anything but initialize the object.

When the parent class also has the `__init__` method implemented, it will override the parent's init method. If you want to execute the parent's init method as well then you have to call that explicitly using `super().__init__([args...])`.

```python
class MyClass:
    def __init__(self, value):
        print("Initializing instance with __init__")
        self.value = value

obj = MyClass(42)
# Initializing instance with __init__
```
In the example above the **self** argument is the object itself and we are also passing a value which is assigned to the *value* attribute of the object.

### `__call__` Method
You create an instance by calling the class name. Internally it invokes the `__call__` method of the metaclass which is *type*. This call method is responsible of creating the object by calling the `__new__` method of the class and initiating the object by calling `__init__` method of the class. And it finally returns the newly created object.

```python
class CustomMeta(type):
    def __call__(cls, *args, **kwargs):
        print("entering Meta_1.__call__()")
        rv = super().__call__(*args, **kwargs)
        print("exiting Meta_1.__call__()")
        return rv

class MyClass(metaclass=CustomMeta):
    def __new__(cls, *args, **kwargs):
        print("Entering Class: Creating instance with __new__")
        instance = super().__new__(cls)
        print("Exiting Class: Creating instance with __new__")
        return instance

    def __init__(self, value):
        print("Init Class: Initializing instance with __init__")
        self.value = value

obj = MyClass(42)

# entering Meta_1.__call__()
# Entering Class: Creating instance with __new__
# Exiting Class: Creating instance with __new__
# Init Class: Initializing instance with __init__
# exiting Meta_1.__call__()
```

### `__del__` Method
The `__del__` method is for deleting an object. It is also called a destructor. When the reference count on an object reaches to zero, this method gets called. 

Although this method is not a part of object creation but it is important while destroying an object. That's why we have discussed this method here in this article.

If the base class also implemented the del method then it must be explicitly called from the child method to perform deletion part of the base class. 
```python
class MyClass:
    def __init__(self, value):
        print("Init Class: Initializing instance with __init__")
        self.value = value

    def __del__(self):
        print("Deleting instance with __del__")

obj = MyClass(42)
del obj
# Deleting instance with __del__
```

In the above script, the *obj* has one reference count. When the **del** statement is executed the reference count becomes zero which makes Python trigger the `__del__()` method.

### Conclusion
As objects are the first class citizen in Python, understanding how the objects are created is a valuable skill for any Python developer. Knowing this also helps write better Python code. After reading this article you should have the understanding about the internal mechanism of how Python objects are created.

---

##### References
1. [Python `__init__` vs `__new__`](https://www.geeksforgeeks.org/python-init-vs-new/)
2. [`__init__` vs. `__new__` Methods in Python](https://builtin.com/data-science/new-python)
3. [Data Model](https://docs.python.org/3/reference/datamodel.html#basic-customization)
4. [Using the `__call__` method of a metaclass instead of `__new__`?](https://stackoverflow.com/a/39363704/6427186)
