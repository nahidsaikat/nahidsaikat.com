---
title: "Some Cool New Features of Python 3.9"
date: "2020-10-06T00:12:03.284Z"
template: "post"
draft: false
slug: "/blog/some-cool-new-features-of-python-3.9/"
category: "Python"
tags:
  - "Python3"
  - "Language"
  - "New Features"
description: "Python 3.9 is released on 5th October, 2020 and is now available. It comes with some of the great features and lots of improvements."
---

![Some Cool New Features of Python 3.9](/media/unsplash/new-in-python39.jpg "Some Cool New Features of Python 3.9")
<center><span>Photo by <a href="https://unsplash.com/@setyaki?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Setyaki Irham</a> on <a href="https://unsplash.com/s/photos/sphere?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span></center>
<br>

Python 3.9 is released on 5th October 2020 and is now available. It comes with some of the great features and lots of improvements. In this article, we will explore some of its cool features. 

To know more about what is coming with Python 3.9 [visit this page](https://docs.python.org/release/3.9.0/whatsnew/3.9.html "New in Python 3.9"). And if you wish to see the full changelog then [go here](https://docs.python.org/release/3.9.0/whatsnew/changelog.html#changelog "Python 3.9 Changelog").

#### Dictionary Merge & Update Operators
<br>

Two new operator **Merge (|)** and **Update (|=)** are added to the built-in class `dict`. 
<br>Merge (|) creates a new dictionary with the merged keys and values. It complements `{**d1, **d2}` methods of merging two dictionaries.
```python
>>> d1 = {"a": 1}
>>> d2 = {"a": 3, "b": 2}
>>> d1 | d2
{'a': 3, 'b': 2}
```
If `d1` and `d2` shares common keys then `d2` will get preference over `d1`.

The Update (|=) operator will update `d1` in-place like the `update` method of `dict`. 
```python
>>> d1 = {"a": 1}
>>> d2 = {"a": 3, "b": 2}
>>> d1 |= d2
>>> d1
{'a': 3, 'b': 2}
```
Like the Merge (|) operator in Update (|=) operator `d2` will get preference over `d1` if they share common keys.

#### New String Methods to Remove Prefixes and Suffixes
<br>

Two new string methods **str.removeprefix(prefix)** and **str.removesuffix(suffix)** are added in Python 3.9. These two methods remove unnecessary prefix or suffix from a string.
```python
>>> "The Python 3.9".removeprefix("The ")
'Python 3.9'
>>> "Python 3.9 is released".removesuffix(" is released")
'Python 3.9'
```
If the string is not started with `prefix` or ends with `suffix` then the original string will get returned.

#### Type Hinting Generics in Standard Collections
<br>

From now on we can use built-in collection types such as `list` or `dict` as generic types in the type annotations. So we don't have to import capitalized types (`List` or `Dict`) from `typing` module.
```python
def print_messages(messages: list[str]) -> None:
    for message in messages:
        print(message)
```

<br>

#### New Library Modules

* **IANA Time Zone Database in [zoneinfo](https://docs.python.org/release/3.9.0/library/zoneinfo.html#module-zoneinfo "zoneinfo") module**
<br>

Python 3.9 comes with [zoneinfo](https://docs.python.org/release/3.9.0/library/zoneinfo.html#module-zoneinfo "zoneinfo") module that supports IANA time zone database. This module provides [zoneinfo.ZoneInfo](https://docs.python.org/release/3.9.0/library/zoneinfo.html#zoneinfo.ZoneInfo "ZoneInfo") a concrete implementation to support IANA data. zoneinfo will use the system's time zone data if available, otherwise, it will use data from first-party [tzdata](https://pypi.org/project/tzdata/ "tzdata") available on PyPI.
```python
>>> from datetime import datetime
>>> from zoneinfo import ZoneInfo
>>> dt = datetime.now()
>>> print(dt)
2020-10-06 19:28:04.854942
>>> print(dt.astimezone(ZoneInfo('Europe/London')))
2020-10-06 14:28:04.854942+01:00
```

<br>

* **An implementation of topological sort of graph in [graphlib](https://docs.python.org/release/3.9.0/library/graphlib.html#module-graphlib "graphlib") module**
<br>

[graphlib](https://docs.python.org/release/3.9.0/library/graphlib.html#module-graphlib "graphlib") is a new module that comes with Python 3.9 that contains the [graphlib.TopologicalSorter](https://docs.python.org/release/3.9.0/library/graphlib.html#graphlib.TopologicalSorter "graphlib.TopologicalSorter") class. This class has the functionality of performing the topological sort on a directed acyclic graph. `graphlib.TopologicalSorter` takes an optional parameter `graph`.
```python
>>> from graphlib import TopologicalSorter
>>> graph = {"4": {"2", "3"}, "3": {"1"}, "2": {"1"}}
>>> t_sort = TopologicalSorter(graph)
>>> list(t_sort.static_order())
['1', '2', '3', '4']
```
