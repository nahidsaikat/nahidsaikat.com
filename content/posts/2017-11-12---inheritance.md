---
title: "Inheritance (OOP)"
date: "2017-12-30T22:12:03.284Z"
template: "post"
draft: false
slug: "/blog/2017/11/12/inheritance/"
category: "Programming Paradism"
tags:
  - "OOP"
  - "Language"
  - "Programming Paradism"
description: "Encapsulation is the process that binds data and functions which operates on the data under a single entity. It is one of the most important four features of Object Oriented Programming."
---

![Inheritance](/media/pixabay/inheritance.jpg "Inheritance")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/illustrations/microbiology-dna-people-structure-163521/)

Inheritance is the process of acquiring the properties and functionalities of another class. An object is a container that contains properties and methods to operate of these properties. Class is the blueprint or template that can be used to create that object. Inheritance is the relationship between the blueprints. We can express inheritance like the statement: we want to create an object, but there is an object that is similar to this one so instead of creating the new object from scratch we want to use the properties and functionalities of that existing object.
The class that is receiving or inheriting the properties and functionalities of other class is termed as sub class or child class or derived class.
The class that is being inheriting is called as super or parent or base class.

**Example:**

Suppose there are two departments in a University. Physics department and chemistry department. The teachers of both the departments have the properties designation and all takes classes. But physics department teachers have main subject property which is “Physics” and the chemistry department teachers have the same property which is “Chemistry”. So we can create a class Teacher that will contain common properties and functionalities (in that case designation and taking class) and create other two class PhysicsTeacher and ChemistryTeacher that will inherit the Teacher class and specify the things the is not common. The following code will illustrate this.

```java
class Teacher{
String designation = “Teacher”
    void Take_Class(){
    	System.out.println(“Taking classes…”);
    }
}

class PhysicsTeacher extends Teacher{
    String main_subject = “Physics”;
}

class ChemistryTeacher extends Teacher{
    String main_subject = “Chemistry”;
}
```

**Types of Inheritance:**

There are several types of inheritance that are being used.

1. Single Inheritance: Single inheritance is a inheritance where child class inherits only parent class. For example, class B inherits class A.
	```python
	class A(object):
	    pass

	class B(A):
	    pass
	```

2. Multilevel Inheritance: This is a inheritance where child class is being inherited by other class. Example, class C inherits class B and class B inherits class A.
	```python
	class A(object):
	    pass
	class B(A):
	    pass
	class C(B):
	    pass
	```
3. Multiple inheritance: In this type of inheritance a class can inherit many other classes. Example, class D is inheriting class A, B and C.
	```python
	class A(object):
	    pass
	class B(A):
	    pass
	class C(B):
	    pass
	class D(A, B, C):
	    pass
	```
4. Hierarchical inheritance: When a class is being inherited by many other classes it is called hierarchical inheritance. For example, class A is being inherited by classes B and C.
	```python
	class A(object):
	    pass
	class B(A):
	    pass
	class C(A):
	    pass
	```
5. Hybrid inheritance: When more than one types of inheritance is combined in a single program it is called hybrid inheritance. Suppose class C inherits class B and class B inherits class A, and in other place class D inherits class A. As multilevel and single inheritance both are present in one program it is hybrid inheritance.
	```python
	class A(object):
	    pass
	class B(A):
	    pass
	class C(B):
	    pass
	class D(A):
	    pass
	```

**Constructors with Inheritance:**

Constructors are called when an object is being created. By default the constructor of super class is called. But using super keyword base class constructor can explicitly being called. In inheritance constructors are called in top-down approach. The super keyword uses the class immediately above the child class not the parent class of the parent.

**Method Overriding:**

Method overriding is one of the important concepts in inheritance. It is possible that there is a need to implement the parent method in different way in child class. The redefinition of methods that already exists in parent class is called method overriding. Which version of method will be called is depends of the language. Different language implements this in different ways. But mostly child version of overridden method is called.

**Un-inheritable Class:**

Different languages have different ways to indicate which class can be inherited by child class. Java and C++ uses ‘final’ keywords to indicate that a class cannot be inherited. Where-as C# language use ‘sealed’ keyword for the same purpose. But when a class is declared as final or sealed then no class can inherit it. The final or sealed keywords needs to add at the beginning of the class declaration. That means before the class keyword.

**Un-overridden Method:**

Just as the sealed or finalized can not be inherited further there is also method modifier that sealed the method so that it can not be override in sub class. A private method can never be override as because it can not be accessed from child class. The only place from where private class can be accessed is the place where it is being defined. A final method in Java and C++ and a sealed method in C# can never be overridden.

**Code reuse:**

One of the advantages of inheritance is that it provides mechanism to reuse the code. Parent classes contains all the common properties and functionalities. Child classes only defines the properties and functionalities that are specific to them. So common properties and functionalities are not duplicated in child classes and code are being reused. That can make the code base shortened and maintainable for future.


Check out [Wikipedia](https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)) "Inheritance (object-oriented programming)") for more. [Click here](https://www.nahidsaikat.com/tag/oop/ "Nahid Saikat") for other OOP posts.
