---
title: "Special Attributes of Python Module"
date: "2025-02-15T10:10:02+06:00"
tags:
  - "Python"
  - "module"
  - "attribute"
description: ""
---

![Special Attributes of Python Module](special-attributes-of-python-module.jpeg "Special Attributes of Python Module")
<center>
Image by <a href="https://pixabay.com/users/alexandra_koch-621802/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8623039">Alexandra_Koch</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8623039">Pixabay</a>
</center>

<br>

Like most other programming languages, in Python the codebase is also organized into modules. The modules in Python are created by the import system, either using an *import* statement or using *importlib.import_module()* or directly using the *`__import__`()* function call. 

The module object has a namespace associated with it which is a dictionary `__dict__`. Attribute reference of module object is translated to a lookup into the dictionary.

Module object has some attributes that gets created and filled with data while the module object itself is created. In this article we will discuss about all the attributes that Python module objects has and what they are for. 

### module.`__name__`
The `__name__` attribute is the fully qualified name of the module. This is used to uniquely identify the module in the import system. When you directly execute a script, its `__name__` attribute is set to `__main__`.

```python
# module1.py
def function():
    print("function")
```
```python
# module2.py
import module1

print(module1.__name__)
# module1

print(__name__)
# __main__
```
In the above code, when we access `__name__` of *module1* from inside the *module2* we get "module1" as value. And when we directly access the `__name__` attribute of currently executing module we get `__main__`.

### module.`__spec__`
The import machinery uses a variety of imformation about the modules. Those information are the specs of the modules. The purpose of the module spec is to keep the import related information on per module basis. The module spec is used to transfer state information between different componenets of import system. When a Python script is executed directly its `__spec__` is set to None.

```python
# module1.py
def function():
    print("function")
```
```python
# module2.py
import module1

print(module1.__spec__)
# ModuleSpec(name='exercise', loader=<_frozen_importlib_external.SourceFileLoader object at 0x10682e420>, origin='/Users/admin/Documents/module1.py')

print(__spec__)
# None
```

### module.`__package__`
The `__package__` attribute of a module is used to indicate the package where the module belongs to. If the module is a top level script that gets run directly then the `__package__` attribute is set to empty string ('') or None. This attribute helps Python resolve relative imports correctly.

Consider the following package structure.
```bash
mypackage/
    __init__.py
    module1.py
    subpackage/
        __init__.py
        module2.py
script.py
```
If we print the `__package__` attribute inside *module2.py*, by running it as part of imported package would print something like "mypackage.subpackage".
```python
# module2.py

print(__package__)
```
```python
# script.py
from mypackage.subpackage import module2

# OUTPUT:
# mypackage.subpackage
```
However, if we run *module2.py* directly using `python module2.py`, it will print empty string ('') or None.

### module.`__loader__`
The loader object that is used to load the module by the import system. This attribute is usefull to get access to the load specific functionality of a module. Python's **importlib** module uses this for advanced module mechanism.

```python
import script

print(script.__loader__)
# <_frozen_importlib_external.SourceFileLoader object at 0x1092fe420>
```

### module.`__path__`
It is a sequence of string that indicates where the packages submodules will be found. If a module has `__path__` attribute that means it is a package. Non-package modules should not have this attribute.

When we have the package structure mentioned above the `__path__` attribute will output like following.

```python
# script.py

import mypackage

print(mypackage.__path__)
# ['/Users/admin/Documents/mypackage']
```

### module.`__file__`
This attribute contains a string value that points to the location from where the module was loaded. It is only available if the module is loaded from a file based source. Built-in module don't have `__file__` attribute and when a module is loaded non-standard way, thie attribute may absent.
```python
import mypackage

print(mypackage.__file__)
# /Users/admin/Documents/mypackage/__init__.py
```

### module.`__cached__`
This attribute is a string path of the compiled version of the code (.pyc) inside the `__pycache__` directory. Usually if `__file__` attribute is set then `__cached__` will also be set, but there are some cases where `__cached__` has value where as `__file__` may not have.

```python
import mypackage

print(mypackage.__cached__)
# /Users/admin/Documents/mypackage/__pycache__/__init__.cpython-312.pyc
```

### module.`__doc__`
This attribute is set to the documentation string of the module if present otherwise it is set to None.

```python
"""This is documentation string"""

print(__doc__)
# This is documentation string
```


### module.`__annotations__`
It is a dictionary that contains variable annotations collected during module body execution. If no annotations exists, it defaults to empty dictionary `{}`. It doesn't include annotations of local variables inside functions.

```python
# script.py

count: int = 0

print(__annotations__)
# {'count': <class 'int'>}
```

### module.`__dict__`
This is a namespace dictionary that contains all the module level variables, classes, functions and objects. It is mutable, so you can modify it dynamically. You can not access `__dict__` as a global variable within a module but can access it as an attribute of module objects.

```python
import mymodule

print(mymodule.__dict__)
```
OUTPUT
```python
{
    '__name__': 'mymodule',
    '__doc__': None,
    '__package__': None,
    '__loader__': <...>,
    '__spec__': <...>,
    'x': 10,
    'y': 'hello',
    'greet': <function mymodule.greet at 0x...>,
    'MyClass': <class 'mymodule.MyClass'>,
}
```

### Conclusion
Internally Python heavily rely on special methods and attributes. In this article you learned about the special attributes that Python module objects provides. Although those attributes are not something that you will use in your day to day job but knowing them is an extra knowledge that will help you understand Python's internals which ultimately helps you write better code.

---

##### References
1. [Data model](https://docs.python.org/3/reference/datamodel.html#callable-types)
2. [The import system](https://docs.python.org/3/reference/import.html#importsystem)
