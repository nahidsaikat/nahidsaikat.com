---
title: "Every Methods of Python Dictionary"
date: "2024-12-27T13:27:22+06:00"
tags:
  - "Python"
  - "dict"
description: "Python dictionary is one of the most important built-in data type. It provide efficient key-value store that maps a key to a value. Keys must be unique in a dictionary where as values can be duplicated. Also keys need to be hashable to be considered as a key. Any object that is not hashable can not be used as dictionary key."
---

![Every Methods of Python Dictionary](every-dictionary-methods.jpeg "Every Methods of Python Dictionary")
<center>
Image by <a href="https://pixabay.com/users/archipix-36936035/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8612487">ArchiPix</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8612487">Pixabay</a>
</center>

<br>

Python dictionary is one of the most important built-in data type. It provide efficient key-value store that maps a key to a value. Keys must be unique in a dictionary where as values can be duplicated. Also keys need to be hashable to be considered as a key. Any object that is not hashable can not be used as dictionary key.

Dictionaries has some core characteristics, they are mutable which means values can be updated in place, they are dynamic which means dictionaries can grow or shrink as needed and they are efficient thus key lookup is very fast. From Python 3.7, dictionaries are ordered by default, that means it maintains the order when they were created.

Internally dictionaries are heavily used by Python as well. The concept of scopes and namespaces are dependent on dictionary. Not only that, Python objets have special attribute `__dict__` that maps attributes to it's value of an object. As a fundamental part of Python, learning dictionaries is essential for developers. In this article, we will explore all the methods that *dict* class provides us.


### .get(key, default=None)
The `.get(key)` method returns the associated value to the key from the dictionary. If the *key* is not present in the dictionary it returns the default value if specified. When the default value is not present it returns *None* instead of raising a **KeyError**.

```python
a_dict = {"a": 1, "b": 2}

print(a_dict.get("a"))
print(a_dict.get("c", 3))
print(a_dict.get("d"))
# 1
# 3
# None
```
In the example above, we first tried to get the value for key `a`. As the key is present in the dictionary we get the value back. Then we tried to get the value for a key `c` which is not present in the dictionary, but as we specified the defaults value we get that default value back. And lastly we again tried to get value for a key `d` which is also not present in the dictionary. This time as we didn't specify the default value thus we got `None`.

We can also get the values from dictionary using square brackets (*a_dict[key]*). The difference is that, it will raise a *KeyError* when the key is not present in the dictionary.

```python
a_dict = {"a": 1, "b": 2}

print(a_dict["a"])
print(a_dict["c"])
# 1
# Traceback (most recent call last):
#   File "/Users/admin/Documents/exercise.py", line 4, in <module>
#     print(a_dict["c"])
#           ~~~~~~^^^^^
# KeyError: 'c'
```

### .keys()
The `.keys()` method returns a *dict_keys* object which is a dictionary view object. The nature of this view object is that it reflects the changes to the original dictionary. As the keys are unique and hashable, the *dict_keys* views are set-like. The set-like views implements all the abstruct methods of `collections.abc.Set`. Thus we can perform some set operation on them.

```python
a_dict = {"a": 1, "b": 2}

print(a_dict.keys())
# dict_keys(['a', 'b'])
```
The view object returned by the *.keys()* method is also iterable and we can also easily convert the view into a list of key.

```python
a_dict = {"a": 1, "b": 2}

for key in a_dict.keys():
    print(key)

a_dict["c"] = 3
print(list(a_dict.keys()))

# a
# b
# ['a', 'b', 'c']
```

### .values()
The `.values()` is a method of Python dictionary which also returns a view object. When we change the dictionary it reflects in the data returned from *values()* method. As dictionaries can have duplicate values, the *values()* method also returns duplicate data if present in the dictionary. Thus *dict_values* view is not set-like object.

```python
a_dict = {"a": 1, "b": 2}
print(a_dict.values())
# dict_values([1, 2])

a_dict["c"] = 3
print(list(a_dict.values()))
# [1, 2, 3]
```

### .items()
`.items()` method of dictionary also returns a view object *dict_items* which is an iterable. The dict_items contains list of tuple of the key-value pairs. The first element of each tuple is the dictionary key and the second element is the dictionary value. As the tuple is immutable and the keys are hashable the *dict_items* view is also set-like objects. Also any change to the dictionary will reflect on the *dict_items* view as well.

```python
a_dict = {"a": 1, "b": 2}
print(a_dict.items())
# dict_items([('a', 1), ('b', 2)])

a_dict["c"] = 3
print(a_dict.items())
# dict_items([('a', 1), ('b', 2), ('c', 3)])

for key, value in a_dict.items():
    print(key, value)
# a 1
# b 2
# c 3
```

### .update([other])
The `.update()` method of Python dictionary is used to update a dictionary by another dictionary or an iterable of key-value pairs. If we pass an iterable to the update method it must have the key-value pair of length two. The result of *update* operation can have two kind of effects,

* when *other* has the same keys, it updates the dictionary in place,
* when *other* has new keys, it inserts that keys in the dictionary.

Here is an example for both of the cases,
```python
a_dict = {"a": 1, "b": 2}

a_dict.update({"c": 3, "d": 4})
print(a_dict)
# {'a': 1, 'b': 2, 'c': 3, 'd': 4}

a_dict.update({"d": 40, "e": 5})
print(a_dict)
# {'a': 1, 'b': 2, 'c': 3, 'd': 40, 'e': 5}
```

### .setdefault(key, default=None)
The `.setdefault(key, default)` method takes a key and a default value. This method is used to both get the value and set a new key-value pair. When the key is present in the dictionary it returns its associated value, but when the key is not present in the dictionary it inserts the key with the default value passed and returns the default value. The default value of *default* is None.

```python
a_dict = {"a": 1, "b": 2}

print(a_dict.setdefault("a", 3))
print(a_dict.setdefault("c", 3))
print(a_dict)
# 1
# 3
# {'a': 1, 'b': 2, 'c': 3}
```

### .pop(key[, default])
The `.pop(key)` method removes a key-value pair from the dictionary using a key and returns its value. Optionally we can pass a default value, if the key is not present in the dictionary the default value gets returned. When the key is not present and the default value also not passed, it raises a **KeyError**.

```python
a_dict = {"a": 1, "b": 2}

value = a_dict.pop("a")
print(value)
print(a_dict)
# 1
# {'b': 2}

value = a_dict.pop("c", 3)
print(value)
print(a_dict)
# 3
# {'b': 2}

value = a_dict.pop("d")
# Traceback (most recent call last):
#   File "/Users/admin/Documents/exercise.py", line 11, in <module>
#     value = a_dict.pop("d")
#             ^^^^^^^^^^^^^^^
# KeyError: 'd'
```
To get the value after removing the key-value pair we use the pop method. If we just want to remove the key-value pair we can use the `del` statement.
```python
a_dict = {"a": 1, "b": 2}

del a_dict["a"]
print(a_dict)
# {'b': 2}
```

### .popitem()
The `.popitem()` method removes and returns a key-value pair. While removing items it maintains LIFO(last in, first out) order. Thus it removes the dictionary items from right to left. The returned data has the form of (key, value), which is a two value tuple where first item is the dictionary key and the second item is dictionary value. If we call the *.popitem()* method on an empty dictionary it will raise a **KeyError**.

```python
a_dict = {"a": 1, "b": 2}

print(a_dict.popitem())
# ('b', 2)
print(a_dict)
# {'a': 1}
print(a_dict.popitem())
# ('a', 1)
print(a_dict)
# {}
a_dict.popitem()
# Traceback (most recent call last):
#   File "/Users/admin/Documents/exercise.py", line 7, in <module>
#     a_dict.popitem()
# KeyError: 'popitem(): dictionary is empty'
```
Before Python 3.6, dictionaries does not follow any orders, thus would return arbitrary items upon calling popitem() method.

### .copy()
The `.copy()` dictionary method is used to copy a dictionary. It returns a new dictionary with the same key-value pairs from the original dictionary. Any change to the original dictionary doesn't reflects on the copied dictionary. But if the original dictionary contains a mutable objects then its reference is copied over. Thus changing that mutable object in original dictionary will have reflect on the copied dictionary.

```python
a_dict = {"a": 1, "b": 2}
b_dict = a_dict.copy()
print(a_dict)
print(b_dict)
# {'a': 1, 'b': 2}
# {'a': 1, 'b': 2}

a_dict = {"a": 1, "b": 2, "list": [1, 2, 3]}
b_dict = a_dict.copy()
a_dict["list"].append(4)
print(a_dict)
print(b_dict)
# {'a': 1, 'b': 2, 'list': [1, 2, 3, 4]}
# {'a': 1, 'b': 2, 'list': [1, 2, 3, 4]}
```

### .fromkeys(iterable, value=None, /)
The `.fromkeys(iterable)` is a classmethod of *dict* data type. It creates a new dictionary by taking the keys from the *iterable* and sets the same *value* argument which is defaults to *None*. As the same *value* argument is set to all the keys, its not good practice to use a mutable data type as *value*. The iterable can have duplicate values but the keys of the new dictionary will be unique.

```python
a_dict = dict.fromkeys(['a', 'b', 'c'], 0)
print(a_dict)
# {'a': 0, 'b': 0, 'c': 0}
```

### .clear()
The `.clear()` method removes all the key-value pairs from the dictionary. It remomves the items in place and makes the dictionary an empty dictionary. It doesn't take any parameter and returns *None*.

```python
a_dict = {"a": 1, "b": 2}
print(a_dict)
# {'a': 1, 'b': 2}

a_dict.clear()
print(a_dict)
# {}
```

### Conclusion
Dictionary is one of the core built-in data types in Python. Knowing dictionary is very crucial skill for any Python developer. In this article we tried to explain different methods that *dict* data type provides to retrieving, updating and removing data from the dictionary. We have also see them in action using various examples.


---

##### References
1. [Dictionaries in Python](https://realpython.com/python-dicts/)
2. [Python Dictionary Methods](https://pythonexamples.org/python-dictionary-methods/)
3. [Dictionary Methods](https://diveintopython.org/functions/dictionary-methods)
4. [Built-in Types](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)
