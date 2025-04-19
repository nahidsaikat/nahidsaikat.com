---
title: "Understanding  Comprehensions in Python"
date: "2025-04-12T08:58:46+06:00"
tags:
  - "Python"
description: ""
---

![Understanding  Comprehensions in Python](comprehensions-in-python.jpeg "Understanding  Comprehensions in Python")
<center>
Image by <a href="https://pixabay.com/users/pierre9x6-10217214/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6891727">Pierre Blaché</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6891727">Pixabay</a>
</center>

<br>

Comprehensions are among the most powerful tools in the Python. They allow Python programmers to write clean and concise code in a Pythonic way. They improve code readability while keeping the code short and maintainable. There are different types of comprehensions in Python, in this article, we will explore all of them.

## List Comprehensions
The most common and widely used types of comprehensions are list comprehensions. List comprehensions allows us to create a new list from an existing sequence. The basic syntax of list comprehension is as follow,

```python
[expression for item in sequence]
```

Here, *sequence* can be any type of Python sequences that is iterable. *item* holds individual values of the sequence and the *expression* produces the value for the new list. Below is an example,

```python
seq = [item for item in range(10)]
print(seq)
# [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

You can also filter out the items using an optional if statement. For the above example, we can take only the even numbers while constructing the new list. In this case, the items will be evaluated against the if condition and the item for which the condition is true will survive.

```python
seq = [item for item in range(10) if item % 2 == 0]
print(seq)
# [0, 2, 4, 6, 8]
```

You can also use the else block inside the list comprehension. But you have to put that in the expression part of the comprehension. In the example below, we are marking the items as even or odd using list comprehension.

```python
seq = ["even" if item % 2 == 0 else "odd" for item in range(10)]
print(seq)
# ['even', 'odd', 'even', 'odd', 'even', 'odd', 'even', 'odd', 'even', 'odd']
```
<br>

## Set Comprehensions
Similar to the list comprehensions you can use set comprehensions to create a new set data structure from a sequence. The only difference is that you will have to use the curly braces ({}) instead of the square braces ({}). And the final created set will contains the unique elements from the sequence.

```python
seq = {item for item in range(10)}
print(seq)
# {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
```

Like the list comprehensions you can use the optional if condition in the set comprehensions as well. In the following example, you can create a set of unique even number from a list of numbers that contains duplicate elements.

```python
alist = [1, 2, 3, 4, 5, 3, 2, 5, 6, 7, 8, 9, 0]
seq = {item for item in alist if item % 2 == 0}
print(seq)
# {0, 2, 4, 6, 8}
```

The only catch is that the elements in the set are not ordered as of the original list. You can use the dictionary comprehensions that will maintain the original order.

## Dictionary Comprehensions
Dictionary comprehensions is another short and concise way to create a dictionary from a sequence. For the dictionary comprehensions you will have to use the curly braces and also define the key and value expression pair. You can also use the optional is condition in the dictionary comprehensions.

```python
{key_expression: value_expression for item in sequence if condition}
```

Here is an example,

```python
seq = {f"key-{item}": item for item in range(5)}
print(seq)
# {'key-0': 0, 'key-1': 1, 'key-2': 2, 'key-3': 3, 'key-4': 4}
```

You can also use the if condition here with dictionary comprehensions to apply filters on the data. Not only that, you can also use function/method calls in the keys and values expression.

```python
cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
seq = {index: city.upper() for index, city in enumerate(cities)}
print(seq)
# {0: 'NEW YORK', 1: 'LOS ANGELES', 2: 'CHICAGO', 3: 'HOUSTON', 4: 'PHOENIX'}
```
<br>

## Generator Comprehensions
So far we have discussed three types of comprehensions and all of them has one common character which is they all are eager loading in terms of memory usage. That means to work with those comprehensions Python loads the entire list into the memory. Which is safe for small and medium sized data. But this approach won't work when there is a need to process really big amount of data.

When the size of the list becomes problematic you can use a generator comprehension instead of list comprehension. You can pass the generator comprehension directly to the function call or use a parenthesis. 

Generator comprehensions uses lazy evaluation while process the data. It first loads a single item into the memory, process it and when finished discard the data to load next data. Because of this nature of generator comprehensions you can process very large data without creating a memory issue.

```python
data = sum(value for value in range(1_000_000_000))
print(data)
# 499999999500000000
```


## Conclusion
comprehensions is one of the most useful tools of Python. They allows to write concise code while keeping the code readable and maintainable. You can use any type of comprehensions according to your needs. If you work on a feature that is memory critical you should chose the generator comprehensions and when memory is not a problem you can use any other comprehensions.

---

##### References
1. [When to Use a List Comprehension in Python](https://realpython.com/list-comprehension-python/)
2. [List Comprehension in Python](https://www.scientecheasy.com/2023/06/list-comprehension-in-python.html/)
3. [Python Comprehensions: A Guide to Writing Clean and Efficient Code](https://python.plainenglish.io/python-comprehensions-a-guide-to-writing-clean-and-efficient-code-99f1f568abff)
4. [Python Comprehensions](https://www.pythonhello.com/fundamentals/python-comprehensions)
