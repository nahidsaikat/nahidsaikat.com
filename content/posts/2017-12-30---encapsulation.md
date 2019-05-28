---
title: "Encapsulation (OOP)"
date: "2017-12-30T22:12:03.284Z"
template: "post"
draft: false
slug: "/blog/2017/12/30/encapsulation/"
category: "OOP"
tags:
  - "OOP"
  - "Language"
  - "Programming Paradism"
description: "German inventor Johannes Gutenberg developed a method of movable type and used it to create one of the western world’s first major printed books, the “Forty–Two–Line” Bible."
---

![Encapsulation](/media/pixabay/encapsulation.jpg "Encapsulation")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/photos/tablets-drug-encapsulate-medical-4028232/)

**What is Encapsulation?**

Encapsulation is the process that binds data and functions which operates on the data under a single entity. It is one of the most important four features of Object Oriented Programming. Other features are Abstraction, Inheritance and Polymorphism. One of the greatest implementation of encapsulation is class. Because class binds the data and functions that operates on that data together in single unit.

**Real world example**

In restaurants there are many sections. Waiter section, chef section, billing section. When customer goes to the restaurant the waiter collects the order and pass the order to the chef section. The chef section starts their process when order is passed to them. When food is ready they inform and pass the food to waiter and waiter serves the food. Finally billing section bills for the food. These different section do there work independently without knowing other sections. As waiter doesn't know what are the ingredient of the food as well as the recipe. He just needs to pass the order to chef section and get food. All other things of chef section are hidden for him. That is encapsulation, the ingredient and the recipe are bind in one unit chef section. Waiter section just needs a way to pass the order and get the food when done.

**Example**

To implement the encapsulation in any language like Java, C# or C++ first create private data member and then create public methods  to set and get the data. The method to set data is called setter and the method to get data is called getter.

```csharp
class Student{
    private int serial;
    private String stuName;
    private int stuAge;

    //Getter methods
    public int getSerial(){
        return serial;
    }

    public String getStuName(){
        return stuName;
    }

    public int getStuAge(){
        return stuAge;
    }

    //Setter methods
    public void setStuAge(int newValue){
        stuAge = newValue;
    }

    public void setStuName(String newValue){
        stuName = newValue;
    }

    public void setSerial(int newValue){
        serial = newValue;
    }
}
public class Department{
    public static void main(String args[]){
         Student obj = new Student();
         obj.setStuName("Mario");
         obj.setStuAge(32);
         obj.setSerial(112233);
         System.out.println("Student Name: " + obj.getStuName());
         System.out.println("Student Serial: " + obj.getSerial());
         System.out.println("Student Age: " + obj.getStuAge());
    } 
}
```

**Advantages**

Data can be made read only or write only at any time. If no setter is given it becomes read only. Similarly if getter is not present then data becomes write only. In setter and getter methods any logic can be applied. So a validation process can be integrated before setting the data.
A class is full control of data that is stored in its fields.
Encapsulation improves readability and maintainability of the code as well as it reduces human errors.
 
Check out [Wikipedia](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming) "Encapsulation (Computer Programming)") for more. [Click here](https://www.nahidsaikat.com/tag/oop/ "Nahid Saikat") for other OOP posts.
