---
title: "Oracle PL/SQL Case Statement"
date: "2018-02-28T22:12:03.284Z"
template: "post"
draft: false
slug: "/blog/2018/02/28/oracle-pl-sql-case-statement/"
category: "Database"
tags:
  - "PL/SQL"
  - "Oracle DB"
  - "Language"
description: "Oracle PL/SQL provides case statement control which is used in decision making. It has similarities with the IF statement control of PL/SQL. In case statement there is a selector, based on the evaluated value of the selector a block of statement will be executed. The selector will be executed only once."
---

![PL/SQL Block](/media/pixabay/pl-sql-block.png "PL/SQL Block")
[<center><span style="color:black">Image Source</span></center>](https://pixabay.com/illustrations/cubes-assorted-random-toys-677092/)

**Simple Case Statement**

Oracle PL/SQL provides case statement control which is used in decision making. It has similarities with the IF statement control of PL/SQL. In case statement there is a selector, based on the evaluated value of the selector a block of statement will be executed. The selector will be executed only once. General form of simple case statement is follow.

```ruby
CASE selector
    WHEN expression_1 THEN
        block_of_statements_1;
    WHEN expression_2 THEN
        block_of_statements_2;
    .......................................
    WHEN expression_n THEN
        block_of_statements_n;
    ELSE
        block_of_else_statement
END CASE;
```

Case statements begins with the keyword CASE followed by a selector. After that a sequence of WHEN statements. WHEN statement begins with the WHEN keyword followed by a expression which returns a value. If selector value and WHEN expression value matched then block of statements after THEN keyword will be executed. After execution of the block of statement execution control will pass to the end of the case statement. Following is an example that prints a message based on the grade of a student. Point to be noted here that the selector can contains any data types other then BLOB, BFILE and composite types.

```ruby
CASE grade
    WHEN 'A' THEN dbms_output.put_line(‘Excellent!’);
    WHEN 'B' THEN dbms_output.put_line(‘Very Good!’);
    WHEN 'C' THEN dbms_output.put_line(‘Well done!’);
    WHEN 'D' THEN dbms_output.put_line(‘You have passed!’);
    WHEN 'F' THEN dbms_output.put_line(‘You have failed!’);
    ELSE dbms_output.put_line(‘NOT a grade!’);
END CASE;
```

Like the IF statement ELSE block is optional here. When specified ELSE block will be executed if no WHEN expression matched. If not specified Oracle add following line at the end of case statement.
```ruby
ELSE RAISE CASE_NOT_FOUND;
 ```

That means there is always a ELSE block in every case statement. The exception that raised by ELSE block can be handled by normal exception handling process of Oracle PL/SQL.

**Searched Case Statement**

Searched case statement is little different from simple case statement. In searched case statement there is no selector. The statement block will be executed based on the evaluation value of WHEN clause. The result of the WHEN clause will be either true of false. If it is true, the statement block will be executed. Following is the implementation of the above example in searched case statement.

```ruby
CASE
    WHEN grade = 'A' THEN dbms_output.put_line(‘Excellent!’);
    WHEN grade = 'B' THEN dbms_output.put_line(‘Very Good!’);
    WHEN grade = 'C' THEN dbms_output.put_line('Well done!');
    WHEN grade = 'D' THEN dbms_output.put_line('You have passed!');
    WHEN grade = 'F' THEN dbms_output.put_line('You have failed!');
    ELSE dbms_output.put_line('NOT a grade!');
END CASE;
```

Like the simple case statement ELSE block is optional in searched case statement. If it is omitted then Oracle PL/SQL will add following line at the end.
```ruby
ELSE RAISE CASE_NOT_FOUND;
```

**Case Expression**

This is another types of case statement. Case expression returns a value. All WHEN expression must be associated with one statement. Case expression does not end with END CASE or semicolon. The key word END indicates the end of case expression.

```ruby
DECLARE
    bonus_amount NUMBER;
BEGIN
    bonus_amount := 30000;
    CASE
        WHEN salary >= 10000 AND salary <=20000 THEN 1500
        WHEN salary > 20000 AND salary <= 40000 THEN 1000
        WHEN salary > 40000 THEN 500
    ELSE 0 END * 10;
END;
/
```

Unlike the case statements discussed above case expression does not raise any exception if no WHEN clause matched. If no WHEN clause match the case expression returns NULL.
 
[Visit here](https://www.nahidsaikat.com/tag/oracle-db/ "Oracle DB - Nahid Saikat") for other oracle database related post.
Learn Oracle Database basics from [here](http://www.oracle.com/webfolder/technetwork/tutorials/obe/db/12c/r1/odb_quickstart/odb_quick_start.html "Oracle Database Quick Start").
