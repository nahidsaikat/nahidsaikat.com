---
title: "LEGB Rule and Name Scoping in Python"
date: "2024-12-05T18:58:08+06:00"
tags:
  - "Python"
description: "Name scoping is one of the fundamental concepts of programming. All the programming language has the scoping implemented. Scope of a name refers to the timeline where the name is visible or accessable."
---

![LEGB Rule and Name Scoping in Python](legb-rule-and-name-scoping-in-python.jpeg "LEGB Rule and Name Scoping in Python")
<center>
Image by <a href="https://pixabay.com/users/psychofladoodle-19768699/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5889366">psychofladoodle</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5889366">Pixabay</a>
</center>

<br>

Name scoping is one of the fundamental concepts of programming. All the programming language has the scoping implemented. Scope of a name refers to the timeline where the name is visible or accessable. In Python, the scope of a name or variable depends on where it is defined or created. The Python scope concept follows the well known **LEGB rule**.

The accronym LEGB stands for "Local, Enclosing, Global and Built-in" scopes. In Python, we can create a variable by the assignment operator (=). This assignment operator either creates a new variable or updates the variable is already created. 

So, if a variable is created inside a function it is called as local variable of that function, if the variable is created in the outter function then it is called as enclosing variable of the inner function, if the variable is created at the module level then it is called global variable and the names that are reserved for Python reside in the built-in scope.

The concept of scope and namespace are closely related in Python. As we know the scope determines where in the program a name is visible. Python implemented this as a dictionary where the keys are the name that maps to the actual objects. These dictionary is called namespace. They are stored in the `__dict__` attribute.

```python
import os
print(os.__dict__.keys())
# dict_keys(['__name__', '__doc__', '__package__', '__loader__', ....., '_wrap_close', 'fdopen', '_fspath', 'PathLike'])
```

The LEGB rule is a name lookup procedure that determines the order in which Python looks up the names. First Python checks the name in the Local scope, if it is not there it checks in the enclosing scope, if it is not there it checks in the global scope and finally in the built-in scope.

### Local Scope
The local scope is the code block or the body of any function. The variables that are defined within the function body will be visible into the local scope. We cannot see those variable from outside. Note that the scope is created at function call time not on the function definition time. That means we can create as many scope as we want by calling that function. 

```python
def add(a: int, b: int) -> int:
    result = a + b
    return result

print(add(10, 20))
# 30
print(result)
# NameError: name 'result' is not defined
```
In the "add" function, we have taken two input parameter a and b computed there sum and assigned the result to the "result" variable. Total three variable are there in the "add" function's scope. When we called "add(10, 20)" it returned 30 as result. As soon as it finished executing the function all its namespace and scope are destroyed. Thus we get a **NameError** when we try to access "result" from outside the function.

As each function scopes are indipendent from each other we can define variable with the same name in multiple function and they will not collide with each other as there scope is different.

### Enclosing Scope
In Python, we can define nested functions, meaning defining a function inside another function. The enclosing scope exists only for the case of nested function. The scope of outter function is the enclosing scope for the inner function as it is not local or global scope for the inner function. The inner function can access the local scope of the outter function till the point where inner is called. 

```python
def outter():
    var = "World"
    def inner():
        print("Hello, " + var)
        print(another_var)
    inner()
    another_var = "Second variable"

outter()
# Hello, World
# NameError: cannot access free variable 'another_var' where it is not associated with a value in enclosing scope
```

In the example the variable "var" is in local scope of function *outter* by in enclosing scope for the function *inner*. Inside *inner* we can access "var". After we called "inner()" function we defined "another_var" in *outter* function which *inner* can't access and raised **NameError** when we tried to access it.

### Global Scope
This is the top level scope of Python program or module. There is only one global scope per program execution in Python. When the program terminaates it forgots exerything from the global scope. Any variable defined in global scope is available in the whole module. We can access it from the function as well.

```python
number = 1000
def func():
    print(number)
func()
print(number)
# 1000
# 1000
```

It is easy to access the global variable from within a function but modifying a global variable inside a function is trickier. In Python, when we assign a value to a variable it will either create it or update it. When we assign a value the a variable with the same name as a global variable inside a function it will just create a new variable. It doesn't mean we can't modify global variable from a function. Later we will discuss how we can modify a global variable from a function.

```python
number = 1000
def func():
    number = 2000
    print(number)
func()
print(number)
# 2000
# 1000
```

### Built-in Scope
Built-is scope is the last scope where Python looks for a name. Typically all the built-in objects and keywords are stored in this scope. The built-in scope loads when we run the Python interpreter. Thus, everything in the built-in scope can be accessable without import any module. We can see what is there in the built-in scope from a special name `__builtins__`.

```python
print(dir(__builtins__))
['ArithmeticError', 'AssertionError', 'AttributeError', ....., 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip']
```

Although We can access the built-in scope free, we can also explicitly import the **builtins** standard library and use the objects using the dot notation.
```python
import builtins

print(builtins.sum([1, 2, 3, 4]))
print(builtins.max([1, 2, 3, 4]))
# 10
# 4
```
We can override any name from built-in scope, but keep in mind that it will effect the whole code. The good practice is to not redefine anything from the built-in scope.

### `global` Statement
Previously we discussed that when we try to assign a value to a global variable from inside a function it creates a new local variable. To alter this behavior we can use **global** statement. In the *global* statement there is a keyword `global` followed by a list of variable names. The names in the global statement will be mapped to the variable in the global scope.

```python
counter = 0

def func():
    global counter
    print(counter)
    counter += 1
func()
print(counter)
# 0
# 1
```
We can also use the *global* keyword to create a new global variable. Just declare a variable global inside a function and it will create the variable. After that it will be available to the whole module.
```python
def func():
    global counter
    counter = 10
func()
print(counter)
# 10
```
It is a bad practice to create a global variable like that. Because it will lead to a **NameError** if we try to access *counter* from other part of the program before calling the *func()*.

### `global()` Function
We can also use the built-in **global()** function to access and modify the global variables. When called the *global()* function returns the dictionary where the global variables are stores. The keys are the variables and the values are the actual object of the global variable. We can access the variables using the global variable as a key to that dictionary. We can also assign a new value to the key like any other dictionary.

```python
counter = 0
def func():
    print(globals()["counter"])
    globals()["counter"] = 1
func()
print(counter)
# 0
# 1
```

### `nonlocal` Statement
Similar to *global* we can use *nonlocal* statement to modify the enclosing variables from the *inner* function. Like *global* statement we can declare *nonlocal* variable by the `nonlocal` keyword followed by a list of variable. But unlike *global* statement we can not create new enclosing variable using the *nonlocal* statement.
```python
def outter():
    var = 10
    def inner():
        nonlocal var
        var = 20
    inner()
    print(var)
outter()
# 20

def outter():
    def inner():
        nonlocal var
        var2 = 20
    inner()
outter()
# SyntaxError: no binding for nonlocal 'var' found
```

### Closure
The enclosing scope we discussed earlier has a byproduct. When we handle the *inner* function as data and return it, it is packed with the environment along with the data of the *outter* function. And the resulting is called a closure. 

```python
def add(base):
    def inner(value):
        return base + value
    return inner

add_two = add(2)
print(add_two(3))
# 5
```

In the example above, we are return the function *inner* in the outter function *add*. Although the execution of the function *add* has finished but *inner* function retains the state information of the enclosing scope. Thus we can still has access to this enclosing scope. 

### Conclusion
In some of the old programming languages (like BASIC) there was only one global scope. Writing code on that language gets hard when the code base grows. Python solves this problem with name scoping. Python has Local, Enclosing, Global and Built-in scope. It searches the name in those scopes sequencially and when not found in any of them it raises an error. This mechanism that Python uses to resolve the name is called **LEGB rule**.

---

##### References
1. [Python Scope & the LEGB Rule: Resolving Names in Your Code](https://realpython.com/python-scope-legb-rule/)
2. [Using and Creating Global Variables in Your Python Functions](https://realpython.com/python-use-global-variable-in-function/)
3. [Scope of Variables in Python](https://www.datacamp.com/tutorial/scope-of-variables-python)
4. [Namespaces and Scope in Python](https://realpython.com/python-namespaces-scope/)
