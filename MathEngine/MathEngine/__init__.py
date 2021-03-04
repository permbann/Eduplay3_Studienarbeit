# !/usr/bin/env python
# -*- coding: utf-8 -*-
"""
MathGenerator class of the MathEngine module.
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

import numpy as np
import operator
import json


class MathGenerator:
    """
    A Generator of mathematical terms and their textual representaion.
    Also provides a difficulty selection to produce various terms with a selection of answers to the term.
    """
    def __init__(self):
        self.rng = np.random.default_rng()

        self.lvl_generator_functions = {0: self.generate_add_sub_lvl,
                                        1: self.generate_add_sub_mult_lvl,
                                        2: self.generate_random_add_sub_lvl,
                                        3: self.generate_random_mult_div_lvl}
        self.range_modifiers = {0: 20,
                                1: 50,
                                2: 100}

    ops = {
        "+": operator.add,
        "-": operator.sub,
        "*": operator.mul,
        "/": operator.truediv
    }
    operations = ["+", "-", "×", "÷"]

    def get_term(self, difficulty):
        """
        Generates a term for a given difficulty level.
        :param difficulty: int Term level
        :return: serialized data of a term in a dictionary
        """
        if difficulty == 0:
            return self.generate_add_sub_lvl(possible_numbers=np.arange(start=0, stop=21, step=1), only_add=True)
        else:
            generator_selection, start, stop = self.determine_level_range(difficulty)
            if generator_selection == 1:  # add_sub_mul needs 2 ranges given in start and stop lists
                return self.lvl_generator_functions[generator_selection](
                    np.arange(start=start[0], stop=stop[0], step=1),
                    np.arange(start=start[1], stop=stop[1], step=1))
            else:
                return self.lvl_generator_functions[generator_selection](
                    np.arange(start=start[0], stop=stop[0], step=1))

    def determine_level_range(self, difficulty):
        """
        Determines which function to use to generate a term and with which number range it should be generated.
        :param difficulty: int Term level
        :return: generator_selection: level generating function, start + stop: lists for start and stop for np.arrange
        """
        modifier_selection = difficulty % 3
        generator_selection = int(difficulty / 3) % 4

        start = [0 - self.range_modifiers[modifier_selection]]
        stop = [self.range_modifiers[modifier_selection]]

        if generator_selection == 1:
            start.append(max(int(start / 5), 10) if start[0] > 0 else min(int(start[0] / 5), -10))
            stop.append(max(int(stop[0] / 5), 10) + 1)
        return generator_selection, start, stop

    def build_term_string(self, term_steps, operator_symbols):
        """
        Builds a String for a term with the given steps.
        :param term_steps: Steps to be inserted.
        :param operator_symbol: operator symbol to be inserted.
        :return: Term String.
        """
        term_string = f"{term_steps[0]}"
        for i, value in enumerate(term_steps[1:]):
            if type(operator_symbols) == list:
                operation = operator_symbols[i]
            else:
                operation = operator_symbols
            if value < 0 and operation == "-":  # auto convert  - - to +
                operation = "+"
                value = -value
            elif value < 0:  # and operation in ["+", "*", "/"]:  # use parentheses for negative values in mult and div
                value = f"({value})"
            term_string += f" {operation} {value}"
        return term_string + " = ?"

    def generate_add_sub_lvl(self, possible_numbers, only_add=False):
        """
        Generates a addition or subtraction term response.
        :param only_add: removes the random choice for the operator
        :param possible_numbers: All numbers that can occur.
        :return: dictionary of term string, answer options and solution_index
        """
        number_count = 2
        if only_add:
            operator_symbol = "+"
        else:
            operator_symbol = self.rng.choice(["+", "-"])
        term = self.generate_add_or_sub(number_count, possible_numbers, operator_symbol)
        answers, solution_index = self.generate_answers(term[operator_symbol][0], possible_numbers)
        return self.create_response_dict(self.build_term_string(term[operator_symbol][1], operator_symbol),
                                         answers,
                                         solution_index
                                         )

    def generate_add_sub_mult_lvl(self, possible_numbers_add_sub, possible_numbers_mult):
        """
            Generates a addition, subtraction or multiplication term response.
            :param possible_numbers_add_sub: All numbers that can occur for addition and subtraction terms.
            :param possible_numbers_mult: All numbers that can occur for multiplication terms.
            :return: dictionary of term string, answer options and solution_index
        """
        operator_symbol = self.rng.choice(["+", "-", "*"])
        if operator_symbol in ["+", "-"]:
            number_count = self.rng.choice([2, 3])
            term = self.generate_add_or_sub(number_count, possible_numbers_add_sub, operator_symbol)
            answers, solution_index = self.generate_answers(term[operator_symbol][0], possible_numbers_add_sub)

        else:
            term = self.generate_multiplication_value_pair(possible_numbers_mult)
            answers, solution_index = self.generate_answers(term[operator_symbol][0], possible_numbers_mult)
        return self.create_response_dict(self.build_term_string(term[operator_symbol][1], operator_symbol),
                                         answers,
                                         solution_index
                                         )

    def generate_random_add_sub_lvl(self, possible_numbers):
        """
            Generates a mixed term response (combination between addition and subtraction of up to 4 numbers)
            :param possible_numbers: All numbers that can occur.
            :return: dictionary of term string, answer options and solution_index
        """

        term = self.generate_mixed_add_sub(self.rng.choice([3, 4]), possible_numbers)
        answers, solution_index = self.generate_answers(term[0], possible_numbers)
        return self.create_response_dict(self.build_term_string(term[1], operator_symbols=term[2]),
                                         answers,
                                         solution_index
                                         )

    def generate_random_mult_div_lvl(self, possible_numbers):
        """
            Generates a multiplication or division term response.
            :param possible_numbers: All numbers that can occur.
            :return: dictionary of term string, answer options and solution_index
        """
        term_type = self.rng.choice(["*", "/"])
        if term_type == "*":
            term = self.generate_multiplication_value_pair(possible_numbers)
        else:
            term = self.generate_division_value_pair(possible_numbers)
        answers, solution_index = self.generate_answers(term[term_type][0], possible_numbers)
        return self.create_response_dict(self.build_term_string(term[term_type][1], operator_symbols=term_type),
                                         answers,
                                         solution_index
                                         )

    def create_response_dict(self, term_string, answers, solution_index):
        """
            Generates a multiplication or division term response.
            :param term_string: string version of the term (for display)
            :param answers: a json compatible list of possible answers
            :param solution_index: the list index for the correct solution
            :return: dictionary of term string, answer options and solution_index
        """
        return {
            "term": term_string,
            "answers": json.dumps(answers.tolist()),
            "solution_index": solution_index
        }

    def generate_add_or_sub(self, step_count, num_range, operator_symbol, start=0):
        """
        Generates a term for addition or subtraction with a variable number of values that lead to the result.
        :param step_count: Number of values that will lead to the term result.
        :param num_range: The number range for which the term will be generated in.
        :param operator_symbol: + or - operator symbol
        :param start: defines the first value of the term if not 0
        :return: dict with { operation_symbol: [result, array of steps]}
        """
        operation_func = self.ops[operator_symbol]
        steps = np.zeros(step_count, dtype=int)
        steps[0] = start
        while steps[0] == 0:
            choice = self.rng.choice(num_range)
            if operation_func(choice, step_count) in num_range:
                steps[0] = choice

        def get_result():
            step_sum = steps[0]
            for step in steps[1:]:
                step_sum = operation_func(step_sum, step)
            return step_sum

        for i in range(step_count - 1):
            while steps[i + 1] == 0:
                choice = self.rng.choice(num_range)
                if operation_func(operation_func(get_result(), choice), (step_count - (i + 2))) in num_range:
                    steps[i + 1] = choice

        return {operator_symbol: [get_result(), steps]}

    def is_prime(self, n):
        """
        Checks if given number is prime.
        :param n: number to check
        :return: True if prime else False
        """
        for i in range(2, n):
            if n % i == 0:
                return False
        return True

    def generate_multiplication_value_pair(self, num_range):
        """
        Generates a multiplication term with 2 values.
        :param num_range: The number range for which the term will be generated in.
        :return: dict with { operation_symbol: [result, array of steps]}
        """
        retry = True

        while retry:
            result = 0
            negative = False

            while result == 0:
                retry = False
                result = self.rng.choice(num_range)
                # check if result is prime and retry with a 90% chance

                if self.is_prime(abs(result)) and self.rng.choice([True, False], p=[0.9, 0.1]):
                    retry = True

            if result < 0:
                negative = True
                result = -result
            steps = np.zeros(2, dtype=int)

            divisors = []
            i = 1
            while i <= result:  # look for all divisors without residue
                if result % i == 0:
                    divisors.append(i)  # fill divisors list
                i += 1
            steps[0] = self.rng.choice(divisors)  # choose divisor at random for first operand
            steps[1] = result / steps[0]  # calculate the second operand
            if negative:
                negate_idx = self.rng.choice([0, 1])
                steps[negate_idx] = -steps[negate_idx]
                result = -result

            for step in steps:  # avoid terms with multiplication by 1 with 90% probability
                if step == 1 and self.rng.choice([True, False], p=[0.9, 0.1]):
                    retry = True
        return {"*": [result, steps]}

    def generate_division_value_pair(self, num_range):
        """
        Generates a division term with one numerator and one divisor.
        :param num_range: The number range for which the term will be generated in.
        :return: dict with { operation_symbol: [result, array of steps]}
        """
        numerator = 0
        divisor = 0
        while numerator == 0:  # ensures numerator will not be 0
            numerator = self.rng.choice(num_range)
            divisor = self.rng.choice(num_range)
            if divisor == 0:  # ensures not to divide by 0
                numerator = 0
            elif not (numerator / divisor).is_integer():  # only allow for integer values as result
                numerator = 0

        return {"/": [int(numerator / divisor), np.array([numerator, divisor])]}

    def generate_random_add_or_sub_pair(self, num_range):
        """
        Generates a random term with 2 steps and either + or - operation.
        :param num_range: The number range for which the term will be generated in.
        :return: dict with { operation_symbol: [result, array of steps]}
        """
        operation = self.rng.choice(["+", "-"])
        return self.generate_add_or_sub(2, num_range, operation)

    def generate_mixed_add_sub(self, step_count, num_range):
        """
        Generates a term with mixed operations. This includes at least one + and - .
        :param step_count: The number of steps for the requested term.
        :param num_range: The number range for which the term will be generated in.
        :return: Result of the term, steps of the term, operations between steps.
        """
        retry = True
        if step_count == 2:
            return self.generate_random_add_or_sub_pair(num_range)
        while retry:
            steps = np.zeros(step_count, dtype=dict)
            term = self.generate_random_add_or_sub_pair(num_range)  # generate the first term
            operations = list(term.keys())  # list to keep track of the operations between steps
            steps[0] = term[operations[0]][1][0]  # setting saving first and second step
            steps[1] = term[operations[0]][1][1]
            step = 2
            while 0 in steps:  # continues to add values from new terms to the steps
                term = self.generate_random_add_or_sub_pair(num_range)
                operations += list(term.keys())
                # checks if the first value of the term uses the last value of the steps
                if term[operations[step - 1]][1][0] == steps[step - 1]:
                    steps[step] = term[operations[step - 1]][1][1]  # adds the next value since the fist is in steps
                    step += 1
                else:
                    operations.pop()  # remove the operation from the list if the term does not fit the followup value
                if "-" in operations and "+" in operations:  # ensures that the term is mixed
                    retry = False
            result = steps[0]  # setting the initial value for the result calculation
            for i, operation in enumerate(operations, start=1):
                operation_func = self.ops[operation]
                result = operation_func(result, steps[i])  # dynamically use operations to calculate the result
            if not (result in num_range):  # ensures that the result is inside the given number range
                retry = True

        return result, steps, operations

    def generate_answers(self, solution, num_range):
        """
        Generates wrong answers for answer options.
        :param solution: the correct term result
        :param num_range: the boundaries for generated answers
        :return: tuple of answer list and correct answer index
        """
        answers = np.zeros(4)
        indexes = list(range(4))
        np.random.shuffle(indexes)
        answers[indexes[0]] = solution
        for i in [1, 2]:
            answer = solution + self.rng.choice(range(-5, 5))
            while answer == solution or answer not in num_range:
                answer = solution + self.rng.choice(range(-5, 5))
            answers[indexes[i]] = int(answer)
        answer = self.rng.choice(num_range)
        while answer == solution or answer not in num_range:
            answer = self.rng.choice(num_range)
        answers[indexes[3]] = int(answer)
        return answers, indexes[0]
