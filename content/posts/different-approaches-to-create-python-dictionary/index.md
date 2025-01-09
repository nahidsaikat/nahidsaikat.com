---
title: "Different Approaches to Create Python Dictionary"
date: "2025-01-04T10:35:46+06:00"
tags:
  - "Python"
  - "dict"
description: "Dictionary is one of the most important built-in data type in Python. It provides a robust key-value data store that maps a key to a value. It allows us to access values through key lookup and also we can modify dictionary in many ways."
---

![Different Approaches to Create Python Dictionary](create-python-dictionary.jpeg "Different Approaches to Create Python Dictionary")
<center>
Image by <a href="https://pixabay.com/users/archipix-36936035/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8901608">ArchiPix</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8901608">Pixabay</a>
</center>

<br>

Dictionary is one of the most important built-in data types in Python. It provides a robust key-value data storage that maps a key to a value. It allows us to access values through key lookup and also we can modify dictionary in many ways.

The nature of dictionary keys is that they are unique and hashable. Only the immutable data types can be used as dictionary keys. We can use anything as dictionary values and they can also have duplicate data.

There are many ways to create a dictionary. We can use curly braces, *dict()* constructor, dictionary comprehensions or use *.fromkeys()* class method to create a dictionary. In this artile we will explore those and other methods to create a dictionary.

### Using Curly Braces
The most easy way to create a dictionary is using the dictionary literals. Just define the key-value pairs separated by commas (,) inside a curly braces ({}). To separate the keys from the values use a colons(:). Setting the key-value pair is optional, if you don't set them you will get an empty dictionary. 

``` python
{
    key_1: <value_1>, key_2: <value_2>, ..., key_N: <value_N>,
}
```
Dictionary ignores spaces and line breaks inside them. Thus we can define each key-value pair in separate line making it more readable.

```python
{
    "Name": "Mahmud",
    "Age": 25,
    "Country": "Bangladesh",
    "City": "Dhaka",
    "Skills": ["Python", "Java", "C++"],
}
```

### dict() Constructor
The `dict()` constructor can also be used to create a dictionary. *dict()* is a built-in function that takes keywords arguments or an iterable to construct a dictionary. When we call dict() function without any argument it creates an empty dictionary.

While using keywords arguments to create the dictionary we need to make sure that the keys are valid Python identifier and it can be converted to string. Here is an example,
```python
dict(
    Name="Mahmud",
    Age=25,
    Country="Bangladesh",
    City="Dhaka",
    Skills=["Python", "Java", "C++"],
)
```

We can also create a dictionary by passing an iterable of key-value pairs to the *dict()* function. In the example below, we have used a list containing two elements tuple. The first element of tuple is the key and the second element is value.
```python
dict([
    ("Name", "Mahmud"),
    ("Age", 25),
    ("Country", "Bangladesh"),
    ("City", "Dhaka"),
    ("Skills", ["Python", "Java", "C++"]),
])
```

The built-in **zip()** function can also be used to create a dictionary. The zip function takes one or more iterable as arguments and yields tuple combining elements from each iterable. Thus we can combine *dict()* with *zip()* function call to create a dictionary.

```python
keys = ["Name", "Age", "Country", "City", "Skills"]
values = ["Mahmud", 25, "Bangladesh", "Dhaka", ["Python", "Java", "C++"]]
dictionary = dict(zip(keys, values))
print(dictionary)
# {'Name': 'Mahmud', 'Age': 25, 'Country': 'Bangladesh', 'City': 'Dhaka', 'Skills': ['Python', 'Java', 'C++']}
```

### .fromkeys() Classmethod
Python *dict* data type has a default class method `.fromkeys()` that allows us to create a new dictionary. It takes an iterable of keys and a default value for all the keys. The iterable can contain duplicate items but the dictionary keys will be unique.

While using *.fromkeys()* class method to create the dictionary, it will assign the same value to each key. In case there is no value passed it defaults to *None*. 

```python
data = dict.fromkeys(["x", "y", "z"], 0)
print(data)
# {'x': 0, 'y': 0, 'z': 0}
```
In the above example we passed a iterable containing *x, y, z* and a default value *0*, and it returned a new dictionary with the keys and the values are 0.

### Dictionary Comprehensions
Dictionary comprehensions is another great tool to create and manipulate Python dictionary. It has similar systax to list comprehensions, but it uses curly braces ({}) instead of square braces ([]). Here is the basic systax of dictionary comprehension.
```python
{key: value for key in iterable}
```

Following is an example of creating a dictionary using the numbers from 1 to 10 with their squared values as dictionary value.
```python
data = {num: num**2 for num in range(1, 11)}
print(data)
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25, 6: 36, 7: 49, 8: 64, 9: 81, 10: 100}
```

We can also apply filter on dictionary comprehensions. Here is an example that filters out the odd number while creating the dictionary.
```python
data = {num: num**2 for num in range(1, 11) if num % 2 == 0}
print(data)
# {2: 4, 4: 16, 6: 36, 8: 64, 10: 100}
```

### Union Operator
We can create a new dictionary by merging two or more dictionary into one using the dictionary union operator ( **|** ). The dictionary union operator is introduced in Python 3.9 allowing us to merge different dictionaries

```python
dict_1 = { 'a': 1, 'b': 2, 'c': 3 }
dict_2 = { 'd': 4, 'e': 5, 'f': 6 }
new_dict = dict_1 | dict_2
print(new_dict)
# {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6}
```

When the merging dictionaries contains duplicate value, the resulting dictionary will get the value from the right most source dictionary ensuring the uniqueness of the dictionary keys.

```python
dict_1 = { 'a': 1, 'b': 2, 'c': 3 }
dict_2 = { 'c': 400, 'e': 5, 'f': 6 }
new_dict = dict_1 | dict_2
print(new_dict)
# {'a': 1, 'b': 2, 'c': 400, 'e': 5, 'f': 6}
```

### Conclusion
We already know that dictionary is one of the core fundamental data types in Python. There is no alternate to learning it to be a great Python developer. In this article we have shown 5 different ways to create and manipulate dictionary. By learning them you can strengthen your knowledge on dictionary.

---

##### References
1. [Dictionaries in Python](https://realpython.com/python-dicts/)
2. [5 Ways to Create a Dictionary in Python](https://learnpython.com/blog/create-dictionary-in-python/)
2. [Python Dictionary – How to Create a Dict in Python (Hashmap)](https://www.freecodecamp.org/news/python-dictionary-how-to-create-a-dict-in-python/)
