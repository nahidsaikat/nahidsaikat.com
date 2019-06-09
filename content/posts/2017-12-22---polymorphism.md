---
title: "Polymorphism (OOP)"
date: "2017-12-22T22:12:03.284Z"
template: "post"
draft: false
slug: "/blog/2017/12/22/polymorphism/"
category: "Programming Paradism"
tags:
  - "OOP"
  - "Language"
  - "Programming Paradism"
description: "Polymorphism is one of the most important concepts of object oriented programming. It comes from two Greek words, Poly and Morph. Poly means Many and Morph means Form."
---

![Encapsulation](/media/pixabay/encapsulation.jpg "Encapsulation")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/photos/tablets-drug-encapsulate-medical-4028232/)

Polymorphism is one of the most important concepts of object oriented programming. It comes from two Greek words, Poly and Morph. Poly means Many and Morph means Form. So polymorphism is the ability of functions or objects to take multiple forms based on the data or object. Suppose we have a Shape class which has a draw method that draws something. As Shape is a generic class so it does not draw a specific thing.
 
```csharp
public class Shape
{
    public virtual void Draw()
    {
        Console.WriteLine("Performing generic drawing");
    }
}
```

Now lets say we have two more class Rectangle and Circle that inherits the Shape class.  Rectangle and Circle class will also have Draw method and will draw rectangle and circle respectively.

```csharp
class Rectangle : Shape
{
    public override void Draw()
    {
        Console.WriteLine("Drawing a rectangle");
    }
}

class Circle : Shape
{
    public override void Draw()
    {
        Console.WriteLine("Drawing a circle");
    }
}
```

Now we can use these classes in main program and call their Draw method and the specific class object will call their own version of  Draw method.

```csharp
class Program
{
    static void Main(string[] args)
    {
        var shapes = new List<Shape>
        {
            new Rectangle(),
            new Circle()
        };
        foreach (var shape in shapes)
        {
            shape.Draw();
        }
        Console.WriteLine("Press any key to exit.");
        Console.ReadKey();
    }
}
```

This is the perfect example of polymorphism. We have a common Shape class and every shape inherits it and specify their own Draw method. When we call the draw method, the specific shape will call their own version of Draw method. Thus we can say that the method is called based upon the object on which it has been called.

There are two types of polymorphism. Dynamic polymorphism and static polymorphism. The example above is an example of dynamic polymorphism. Because which Draw method will be called is decided at run time. Here we can come up with the statement that dynamic polymorphism is where method determination happens at run time. On the other hand, in static polymorphism determination of method happens at compile time. Below is an example of static polymorphism.

```csharp
class SimpleCalculator
{
    int add(int a, int b)
    {
        return a + b;
    }
    int add(int a, int b, int c)
    {
        return a + b + c;
    }
}

public class Program
{
    public static void main(String args[])
    {
        SimpleCalculator obj = new SimpleCalculator();
        System.out.println(obj.add(20, 30));
        System.out.println(obj.add(20, 30, 40));
    }
}
 ```

Check out [Wikipedia](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming) "Encapsulation (Computer Programming)") for more. [Click here](https://www.nahidsaikat.com/tag/oop/ "Nahid Saikat") for other OOP posts.
