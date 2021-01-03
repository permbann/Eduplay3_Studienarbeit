from MathEngine import MathGenerator as mg
import numpy as np
import operator

ops = {
    "+": operator.add,
    "-": operator.sub,
    "*": operator.mul,
    "/": operator.truediv
}


def validate_result(term):
    operation_func = ops[list(term.keys())[0]]
    values = list(term.values())[0]
    print(values)
    result = values[1][0]
    for value in values[1][1:]:
        result = operation_func(result, value)
    assert result == values[0]


def validate_range(term, number_range):
    values = list(term.values())[0]
    assert values[0] in number_range
    for value in values[1]:
        assert value in number_range


def test_generate_add_or_sub():
    generator = mg()
    numbers = np.arange(start=0, stop=100, step=1)
    for _ in range(100):
        operator_symbol = np.random.choice(["+", "-"])
        number_count = np.random.choice([2, 3])
        term = generator.generate_add_or_sub(number_count, numbers, operator_symbol)
        validate_range(term, numbers)
        validate_result(term)

