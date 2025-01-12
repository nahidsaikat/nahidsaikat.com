---
title: "Simple Techniques to Merge Dictionaries in Python"
date: "2025-01-09T12:36:15+06:00"
tags:
  - "Python"
  - "dict"
description: ""
---

![Simple Techniques to Merge Dictionaries in Python](simple-techniques-merge-python-dictionary.jpeg "Simple Techniques to Merge Dictionaries in Python")
<center>
Image by <a href="https://pixabay.com/users/archipix-36936035/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8862414">ArchiPix</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8862414">Pixabay</a>
</center>

<br>

Dictionary is a built-in data structure that stores data in key-value pairs. It not only stores data efficiently but also allows ur to access them easily when needed. In this article we will explore various ways to merge dictionaries in Python.

### Using *for* loop
The most simple and naive approach to merge dictionaries is using a for loop. We can loop over a dictionary items and add the key-value pairs to a other dictionary. In this process, the duplicate keys gets updated and the new keys will be added. 

```python
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}

for key, value in dict2.items():
    dict1[key] = value

print(dict1)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

### Using *update* method
Python's *dict* class has an *.update([other])* method that can be used to update a dictionary with the data from other dictionary. The update method takes a dictionary, an iterable or kwargs as argument. When the keys from *other* is present in the dictionary it updates the value, and when the keys from *other* is not present in the dictionary it inserts the new data into the dictionary.

```python
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}

dict1.update(dict2)
print(dict1)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

We can also pass iterable or kwargs to the dict update method. Following are the example for both of the cases.

```python
dict1 = {'a': 1, 'b': 2, 'c': 3}

dict1.update([("b", 20), ("c", 30), ("d", 4)])
print(dict1)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```
```python
dict1 = {'a': 1, 'b': 2, 'c': 3}

dict1.update(b=20, c=30, d=4)
print(dict1)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

### Using ** operator

The unpacking operator also known as double asterisk operator (**) is used to for packing and unpacking data into and from a dictionary. It is mostly used while calling a function that takes various numbers of kewords arguments. 

You can use this unpacking operator to merge two or more dictionaries. Simply unpack both the dictionaries inside a curly braces and it will create a new dictionary containing items from both of the dictionaries.

```python
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}

dict3 = {**dict1, **dict2}
print(dict3)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

You can use any number of dictionaries here to merge the data. For the duplicate keys, right most dictiionary will get the precedence. 

```python
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}
dict3 = {'c': 300, 'd': 400, 'e': 5}

dict4 = {**dict1, **dict2, **dict3}
print(dict4)
# {'a': 1, 'b': 20, 'c': 300, 'd': 400, 'e': 5}
```

In the example above, "b" takes value from **dict2** as its the right most dictionary for the key "b", "c" and "d" takes the value from the right most dictionary **dict3**, and "e" is added into the merged dictionary.

### Using | operator

Python 3.9 introduces a new operator which is called union operator ( **|** ) that merges two dictionaries into one. Using this operator you can create a new dictionary that can contain all the key-value pairs from both of the initial dictionaries. Here also, if the dictionaries share same keys the values from right most dictionary will take precedence.

```python
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}

dict3 = dict1 | dict2
print(dict3)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

Similarly, you can use the augmented union operator ( **|=** ) to merge two dictionary. If you use the augmented union operator, it will perform in-place update to the first dictionary instead of creating a new dictionary. Again for the duplicate keys, right most dictionary will take priority.

```python
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}

dict1 |= dict2
print(dict1)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

### Using *chain()* method

The **itertools** module from Python has a method *chain()* that can be used to merge two or more dictionaries. It takes multiple iterable objects, merges them and returns one iterable objects.

While merging dictionaries using *chain()* method you need to pass the key-value pair iterators using the `dict.items()` method and the chain method will then return one iterator after merging the objects. And finally you can pass that iterator object to the *dict()* constructor which will converts it into a dictionary.

```python
from itertools import chain

dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}

dict3 = dict(chain(dict1.items(), dict2.items()))
print(dict3)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

### Using *ChainMap()* method

There is another method **ChainMap()** which can used to merge dictionaries as well. It works similar to the *chain()* method, except you don't need to use the *.items()* dictionary method. You can directly pass the dictionaries to *ChainMap()* method and it will work. You need to import the *ChainMap()* method from **collections** module.

```python
from collections import ChainMap

dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'b': 20, 'c': 30, 'd': 4}

dict3 = dict(ChainMap(dict2, dict1))
print(dict3)
# {'a': 1, 'b': 20, 'c': 30, 'd': 4}
```

### Conclusion

In this article, you have learned various methods to merge Python dictionaries. You have also seen them in action in the examples. Some of the merging techniques creates new dictionary after merging, while other techniques performs in-place updates on the dictionary. You have also learned the behavior of those techniques when there are duplicate items in dictionaries.

---

##### References
1. [Dictionaries in Python](https://realpython.com/python-dicts/)
2. [Python Merge Dictionaries – Merging Two Dicts in Python](https://www.freecodecamp.org/news/python-merge-dictionaries-merging-two-dicts-in-python/)
3. [Python Merge Dictionaries – Combine Dictionaries (7 Ways)](https://datagy.io/python-merge-dictionaries/)
4. [3 Simple Ways to Merge Python Dictionaries](https://www.kdnuggets.com/3-simple-ways-to-merge-python-dictionaries)
5. [How to merge dictionaries in Python?](https://www.askpython.com/python/dictionary/merge-dictionaries)
