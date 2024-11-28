---
title: "Understanding Protocols in Python"
date: "2024-11-27T11:12:30+06:00"
tags:
  - "Python"
  - "Typing"
description: ""
---

![What Are Protocols in Python](python-protocols.png "What Are Protocols in Python")
<center>
Image by <a href="https://pixabay.com/users/acatxio-20233758/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7955446">AcatXIo</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7955446">Pixabay</a>
</center>

<br>

Python is a dynamically type general-purpose programming language. Python uses dynamic typing, means it checks variable type during runtime while running the program. Protocols as introduced in Python 3.8 ([PEP 544](https://peps.python.org/pep-0544/ "PEP 544 – Protocols: Structural subtyping (static duck typing)")) offers a way for Python to becomes more dynamic in nature. Protocol is a class that has a set of methods and attributes. Any class that has the required methods implemented and attributes defined is considered a subtype of that protocol class. They provides a way to have structural subtyping or static duck typing in Python.

Python provides more a flexible approach for interface definition using protocol. We can create a protocol class by sub classing from `typing.Protocol` and specifying its methods and attributes. Any class that will have the same methods and attributes will be considered as subtype of that protocol class.

```python
from typing import Protocol

class Writable(Protocol):
    def write(self): 
        ...
```

Here, "Writable" is a protocol which has a "write" method. Any class that has a "write" method will be considered an "Writable" type while checking the type.

```Python
class Logger:
    def write(self):
        print("Write to the logger.")

class File:
    def write(self):
        print("Write to the file.")
```

"Logger" and "File" both classes implemented the "write" method which is the requirement for "Writable" protocol. So we can treat them as "Writable" type.

```python
def write_all(writter: Writable):
    writter.write()

write_all(Logger())
write_all(File())
# Write to the logger.
# Write to the file.
```
In "write_all" function we are taking a "Writable" parameter. As "Logger" and "File" both have the write method they works as a "Writable".

Protocol is also inheritable and we can create new protocol by inhariting an existing one. In the example below, "ReadableWritable" class inherits from "Writable" protocol. Now any class that has "read" and "write" method will be considered as "ReadableWritable" type.

```python
from typing import Protocol

class ReadableWritable(Writable, Protocol):
    def read(self):
        ...

class File:
    def write(self):
        print("Write to the file.")
    
    def read(self):
        print("Read from the file.")
```

We can also type hint the method parameters of a protocol to leverage more strict type checking process. 
```python
from typing import Protocol

class Adder(Protocol):
    def add(self, a: int, b: int) -> int:
        ...

class IntAdder:
    def add(self, a: int, b: int) -> int:
        return a + b

class FloatAdder:
    def add(self, a: float, b: float) -> float:
        return a + b
```
Here, "Adder" uses explicit type hint thus the class "IntAdder" will be considered as "Adder" type by the typing system. But "FloatAdder: will not be considered a "Adder" type although it implements the "add" method. It is because "FloatAdder.add" method parameter has different type.

To fix the problem we need to create a generic protocol. The systax for creating a generic protocol is,
```Python
from typing import Protocol, TypeVar

T = TypeVar("T")

class Generic(Protocol[T]):
    def method(self, arg: T) -> T:
        ...
```
So, to make the "FloatAdder" a subtype of "Adder" protocol we need to rewrite it using generic protocol.
```python
from typing import Protocol, TypeVar

T = TypeVar("T")

class Adder(Protocol[T]):
    def add(self, a: T, b: T) -> T:
        ...
```
Now that we have generic "Adder" protocol we can use both "IntAdder" and "FloatAdder" as "Adder" type.

```python
def add(adder: Adder) -> None:
    print(adder.add(2, 3))

add(IntAdder())
add(FloatAdder())
```

From Python 3.12 and onwords, we can have a more simplified version of generic protocol.
```python
from typing import Protocol

class Adder(Protocol):
    def add[T: int | float](self, x: T, y: T) -> T:
        ...
```

A protocol class can have different types of members including, class attributes, class methods, instance attributes, instance methods, class methods, static methods, properties and abstruct methods. We should use `ClassVar` class to distinguish between class attributes and the instance attributes. We need to define the instance attributes at the class level. If we define them inside the instance method type checker will through an error.
```python
from abc import abstractmethod
from typing import ClassVar, Protocol

class ProtocolMembersDemo(Protocol):
    class_attribute: ClassVar[int]
    instance_attribute: str = ""

    def instance_method(self, arg: int) -> int:
        ...

    @classmethod
    def class_method(cls) -> str:
        ...

    @staticmethod
    def static_method(arg: int) -> int:
        ...

    @property
    def property_name(self) -> str:
        ...

    @property_name.setter
    def property_name(self, value: str) -> str:
        ...

    @abstractmethod
    def abstract_method(self) -> float:
        ...
```

Till now we have discussed Protocols from typing perspective. But the word "Protocol" in not new in Python. Python has lots internal protocols like Iterator, contex Manager, Descriptor protocol and many more. 

These built-in protocols consists of special methods that make up the given protocol. Like, `__iter__()` and `__next__()` methods defines iterator protocol, `__hash__()` method defines Hashable protocol, `__call__()` method defines Callable protocol and many more.

Those protocols live mostly in the `collections.abc` module because they are implemented as abstruct base class. ABC protocols offers nominal subtyping through inheritance. A class that inherits from parent classs is considered a subtype of the parent class

There is a difference between abstruct base class protocols and typing protocols. ABC protocols works through inheritance relationship while typing protocols does not require inheritance they works by defining a set of characteristics. 

Note that this differences doesn't make ABCs better than typing protocols and vice versa. ABCs are suitable when there is hierarchy in the classes and protocols are suitable to handle totally different kinds of class that has common behavior.

Following is an example of inheritance based nominal subtyping in Python,
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def eat(self) -> None:
        ...

class Dog(Animal):
    def __init__(self, name: str):
        self.name = name

    def eat(self) -> None:
        print(f"Dog {self.name} is eating.")
        

class Cat(ABC):
    def __init__(self, name: str):
        self.name = name

    def eat(self) -> None:
        print(f"Cat {self.name} is eating.")

def time_to_eat(animal: Animal):
    animal.eat()

time_to_eat(Dog("Milo"))
time_to_eat(Cat("Tobo"))
# Dog Milo is eating.
# Cat Tobo is eating.
```

### Conclusion
Python has two kinds of protocols, ABCs and typing.Protocol. We can use both of them for type checking. ABCs allows us to create an inheritance based interface while typing.Protocol allows us to create relationship based interface. With both of the Protocols, we can perform static duck typing in Python's type hint system. We can also use expernal tools like mypy, Pyright and Pyre to check proper typing before runtime.

---

##### References
1. [Python Protocols: Leveraging Structural Subtyping](https://realpython.com/python-protocol/)
2. [What is a Protocol in python?](https://dev.to/shameerchagani/what-is-a-protocol-in-python-3fl1)
3. [Python Protocols vs. ABCs: Choosing The Right Approach for Interface Design](https://medium.com/@pouyahallaj/introduction-1616b3a4a637)
