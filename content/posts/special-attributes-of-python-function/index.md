---
title: "Special Attributes of Python Function"
date: "2025-01-28T14:07:13+06:00"
tags:
  - "Python"
  - "attribute"
description: "Internally Python heavily rely on special methods and attributes. Typically special methods and attributes starts and ends with double underscores (`__`). Functions as a first class object in Python can have attributes too."
---

![Special Attributes of Python Function](python-function-special-attributes.png "Special Attributes of Python Function")
<center>
Image by <a href="https://pixabay.com/users/archipix-36936035/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8184040">ArchiPix</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8184040">Pixabay</a>
</center>

<br>

Internally Python heavily rely on special methods and attributes. Typically special methods and attributes starts and ends with double underscores (`__`). Functions as a first class object in Python can have attributes too. Python provides several special attributes that give you access to internal details and metadata about a function. In this article, we will go through each special attributes of functions and understand about them.

### function.`__doc__`
A **docstring** (short for "documentation string") of a function is string literals that briefly describes what the function does along with the parameters it takes and the data it returns. Usually docstring appears right after the function definition. The docstring is enclosed by a triple quotes (''' or """) and you can access it using the **`__doc__`** special attribute of function objects.

```python
def foo():
    """This is the docstring of the function foo."""
    print("Foo")

print(foo.__doc__)
# This is the docstring of the function foo.
```

### function.`__name__`
In Python, the special attribute **`__name__`** stores the name of a function, class or module, as it was defined in the code. You can use this attribute to get the function name dynamically. It is very helpfull while debugging the code. 

```python
def foo():
    print("Foo")

print(foo.__name__)
# foo
```
Inside the decorator, the **`__name__`** attribute get overwritten by the wrapper function. To preserve the original name you need to use `functools.wraps` inside the decorator.

Without `functools.wraps` **:**
```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Something is happening before the function is called.")
        func(*args, **kwargs)
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def foo():
    print("Foo")

print(foo.__name__)
# wrapper
```

With `functools.wraps` **:**
```python
from functools import wraps


def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("Something is happening before the function is called.")
        func(*args, **kwargs)
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def foo():
    print("Foo")

print(foo.__name__)
# foo
```

### function.`__qualname__`
The **`__qualname__`** attribute of a function is used to provides the full qualified name of the function. For a normal function the `__qualname__` and `__name__` attributes returns the same value. But for any nested function or functions inside the class it also provide information about the outter scoping where the function is defined.

```python
def outer():
    def inner():
        print("Inner function")
    return inner

print(outer.__name__)
print(outer.__qualname__)
print(outer().__name__)
print(outer().__qualname__)
# outer
# outer
# inner
# outer.<locals>.inner
```
`__qualname__` special attribute is helpful at the time of debugging the code. Also during creating functions dynamically this attribute is very useful.

### function.`__module__`
The module where a function is defined is stored in **`__module__`** special attribute. While using imported code from different modules or dynamically generating code, the `__module__` attributes helps to identify the module where the function was defined. When a function was created Python automatically assigns the module name in its `__module__` attribute. Nested function also refers to the module where the outermost enclosing function is defined.

```python
# my_module.py

def my_function():
    print("Hello from my_function")
```
```python
# main.py

from my_module import my_function

print(my_function.__module__)
# my_module
```

### function.`__defaults__`
When defining a function that has parameters Python allows us to set a default value for the parameters. At the time of calling that function, it is optional to provide values for the parameters having default values. 

The **`__defaults__`** special attribute of Python function holds a tuple that contains the defaults values of the parameters that has default value. If no parameter has default value set this attribute is set to `None`. For multiple parameters, it maintains the order of the parameters in function definition.

```python
def func(param1, param2=100):
    return param1 + param2

print(func.__defaults__)
# (100,)
```

You can also modify the `__defaults__` attribute of a function dynamically that will change the value of default parameters. However, this is not recommended unless you have a specific reason.
```python
def func(param1, param2=100):
    return param1 + param2

print(func.__defaults__)
# (100,)

print(func(10))
# 110

func.__defaults__ = (200,)
print(func.__defaults__)
# (200,)

print(func(10))
# 210
```

### function.`__code__`
**`__code__`** special attribute of Python function represents the compiled bytecode and other metadata of the function. This attributes provides low-level information such as name of local variables, number of arguments, the actual byte code instructions etc. You can run the builtin **dir()** function to see the list of all attributes of code object.

```python
def func(param1, param2=100):
    return param1 + param2

print(func.__code__)
# <code object func at 0x104618440, file "/Users/admin/Documents/main.py", line 1>

print(dir(func.__code__))
# ['__class__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getstate__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '_co_code_adaptive', '_varname_from_oparg', 'co_argcount', 'co_cellvars', 'co_code', 'co_consts', 'co_exceptiontable', 'co_filename', 'co_firstlineno', 'co_flags', 'co_freevars', 'co_kwonlyargcount', 'co_lines', 'co_linetable', 'co_lnotab', 'co_name', 'co_names', 'co_nlocals', 'co_positions', 'co_posonlyargcount', 'co_qualname', 'co_stacksize', 'co_varnames', 'replace']
```

By providing low-level details this attributes help during debugging. Not only that you can run some advanced tools to get the performance details and do the security analysis using the code objects. 

While the actual code object itself is read-only but you can replace the code object entirely with a new code object. This operation is risky, so extra care should be taken while performing it.
```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

add.__code__ = subtract.__code__

print(add(1, 2))  # -1
```

### function.`__dict__`
Every object in Python has the special attribute **`__dict__`**. It is a dictionary that stores an object's namespace. Containing all the attributes and methods of that object. 

As function is also an object in Python, it has a `__dict__` attribute too. It stores user defined attributes of the function. You can dynamically add, remove or modify any attribute by manipulating `__dict__` directly.

The default state of `__dict__` attribute is empty unless you attach any attributes to it.

```python
def function(a, b):
    c = a + b
    return c

print(function.__dict__)
# {}

function.author = "Guido van Rossum"
function.__dict__["version"] = 1.0

print(function.__dict__)
# {'author': 'Guido van Rossum', 'version': 1.0}
```

### function.`__annotations__`
**`__annotations__`** is a dictionary that contains type annotations information of a function. The keys of this dictionary are the parameters name and the "return" is for the return annotation if present.

```python
def func(a: int, b: int) -> int:
    return a + b

print(func.__annotations__)
# {'a': <class 'int'>, 'b': <class 'int'>, 'return': <class 'int'>}
```

You should not assign to `__annotations__` attribute of an function object. You should not also modifying or deleting the `__annotations__` attribute. You should let Python manage setting into `__annotations__`.

### function.`__kwdefaults__`
To define keyword only parameter in Python function, you need to put * in the parameter list. Any parameter after * is keyword only. Thus while calling that function you should pass value as keyword arguments for those parameters.

The **`__kwdefaults__`** is a dictionary that contains the default values of those keyword arguments. You can also manipulate this dictionary and can see the modified values in action as follows.

```python
def greet(*, name="world"):
    return "Hello, " + name + "!"

print(greet.__kwdefaults__)
print(greet())
# {'name': 'world'}
# Hello, world!

greet.__kwdefaults__["name"] = "Alice"
print(greet())
# Hello, Alice!
```

### function.`__type_params__`
Introduced in Python 3.12, **`__type_params__`** special attribute provides access to the type parameters of a functions. For generic functions it returns a tuple of type parameters and for non-generic functions it returns an empty tuple. 

```python
def first_element[T](sequence: list[T]) -> T:
    return sequence[0]

print(first_element.__type_params__)
# (T,)


def my_function():
    pass

print(my_function.__type_params__)
# ()
```

### function.`__globals__`
The **`__globals__`** special attribute of Python function points to the global namespace of the module where the function is defined. This global namespace contains all the global variables, functions, classes and other objects defined in the global level. You can use this **`__global__`** attribute of a function to access that global namespace.

```python
def foo():
    print("Foo")

print(foo.__globals__)
print(foo.__globals__ is globals())
# {'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <_frozen_importlib_external.SourceFileLoader object at 0x10b741850>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, '__file__': '/Users/admin/Documents/main.py', '__cached__': None, 'foo': <function foo at 0x10b71a340>}
# True
```

### function.`__closure__`
The **`__closure__`** attribute of a function provides access to the closure of the function. A closure is a tuple of cell objects containing vairable from the enclosing scope. When a nested function uses variables from the enclosing function a closure forms. You can access the value of cell objects using **cell_contents** attribute of each cell objects. 

```python
def outer_function(x):
    def inner_function(y):
        return x + y
    return inner_function

closure = outer_function(10)

print(closure.__closure__)
# (<cell at 0x100401cf0: int object at 0x100e13950>,)

print(closure.__closure__[0].cell_contents)
# 10
```

For normal function or if the nested function doesn't uses variable from enclosing scope then closure doesn't form and in that case the `__closure__` attribute returns None.

```python

def outer_function():
    def inner_function(y):
        return 10 + y
    return inner_function

inner = outer_function()
print(inner.__closure__)
# None

def func():
    print("Hello, world!")

print(func.__closure__)
# None
```

### Conclusion
Special attributes provides powerful tools for understanding and manipulating Python functions. You can use those to gain insights of the function. Not only that, you can modify them to change the behavior of a function. They are useful for advanced programming tasks such as debugging, dynamic code generation, frameworks etc.


---

##### References
1. [Data model](https://docs.python.org/3/reference/datamodel.html#callable-types)
