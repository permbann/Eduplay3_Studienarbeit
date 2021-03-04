# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Pytest cases of methods from the MathGenerator class.
"""

__authors__ = ["Luana Juhl", "Lukas Schult"]
__contact__ = "it16156@lehre.dhbw-stuttgart.de"
__credits__ = ["Luana Juhl", "Lukas Schult"]
__date__ = "2021/02/06"
__deprecated__ = False
__email__ = "it16156@lehre.dhbw-stuttgart.de"
__maintainer__ = "developer"
__status__ = "Released"
__version__ = "1.0"

from MathEngine import MathGenerator as mg
import numpy as np
import operator
import re

ops = {
    "+": operator.add,
    "-": operator.sub,
    "*": operator.mul,
    "/": operator.truediv
}


def validate_result(term):
    """
    Calculates the terms solution and compares the result with the solution in the term dictionary.
    :param term: term dictionary of the MathGenerator Methods.
    """
    operation_func = ops[list(term.keys())[0]]
    values = list(term.values())[0]
    result = values[1][0]
    for value in values[1][1:]:
        result = operation_func(result, value)
    assert result == values[0]


def validate_range(term, number_range):
    """
    Checks if the term values and solution are within the given number range.
    :param term: term dictionary of the MathGenerator Methods.
    :param number_range: boundaries for the term values.
    """
    values = list(term.values())[0]
    assert values[0] in number_range
    for value in values[1]:
        assert value in number_range


def test_generate_add_or_sub():
    """
    Executes and validates the generate_add_or_sub method 100 times.
    """
    generator = mg()
    numbers = np.arange(start=-100, stop=100, step=1)
    for _ in range(100):
        operator_symbol = np.random.choice(["+", "-"])
        number_count = np.random.choice([2, 3])
        term = generator.generate_add_or_sub(number_count, numbers, operator_symbol)
        validate_range(term, numbers)
        validate_result(term)


def test_generate_multiplication_value_pair():
    """
    Executes and validates the generate_multiplication_value_pair method 100 times.
    """
    generator = mg()
    numbers = np.arange(start=-100, stop=100, step=1)
    for _ in range(100):
        term = generator.generate_multiplication_value_pair(numbers)
        validate_range(term, numbers)
        validate_result(term)


def test_generate_division_value_pair():
    """
    Executes and validates the generate_division_value_pair method 100 times.
    """
    generator = mg()
    numbers = np.arange(start=-100, stop=100, step=1)
    for _ in range(100):
        term = generator.generate_division_value_pair(numbers)
        validate_range(term, numbers)
        validate_result(term)


def test_generate_answers():
    """
    Check if all values of the generate_answers method are within the number range and if the solution index points to
    the provided solution.
    """
    generator = mg()
    numbers = np.arange(start=-100, stop=100, step=1)
    for _ in range(100):
        solution = np.random.choice(numbers)
        answers, solution_index = generator.generate_answers(solution, numbers)
        assert solution == answers[solution_index]
        for answer in answers:
            assert answer in numbers


def test_build_term_string():
    """
    Uses a regular expression to match and validate the pattern of a term string.
    Executes all possible term types 100 times and validates their string representation.
    """
    generator = mg()
    numbers = np.arange(start=-100, stop=100, step=1)
    term_re = r'^\-?\d+ ([\+\-\*\/] \(?\-?\d+\)? )+= \?'
    # Test addition and subtraction terms
    for _ in range(100):
        operator_symbol = np.random.choice(["+", "-"])
        number_count = np.random.choice(range(2, 5))
        term = generator.generate_add_or_sub(number_count, numbers, operator_symbol)
        term_string = generator.build_term_string(term[operator_symbol][1], operator_symbol)
        assert re.match(term_re, term_string)
    # Test mixed addition and subtraction terms
    for _ in range(100):
        term = generator.generate_mixed_add_sub(generator.rng.choice([3, 4]), numbers)
        term_string = generator.build_term_string(term[1], operator_symbols=term[2])  # operator symbols list
        assert re.match(term_re, term_string)
    # Test multiplication terms
    for _ in range(100):
        operator_symbol = "*"
        term = generator.generate_multiplication_value_pair(numbers)
        term_string = generator.build_term_string(term[operator_symbol][1], operator_symbol)
        assert re.match(term_re, term_string)
    # Test division terms
    for _ in range(100):
        operator_symbol = "/"
        term = generator.generate_division_value_pair(numbers)
        term_string = generator.build_term_string(term[operator_symbol][1], operator_symbol)
        assert re.match(term_re, term_string)
