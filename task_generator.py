# difficulty levels:
# Classes: 1, 2, 3, 4
# Numbers: 0-20, 0-100, 0-1000, 0-1000000
# Operations: Comparison, Order, Addition, Subtraction, Multiplication, Division
# Materials: Money, Countable Objects, cm, m, Time, Geometry, g, kg, ml, l
# lvl2 words: Summ, diff, prod, quotient
# lvl3 rulez: kommutativ, assoziativ
# lvl3 words: area
# lvl4 stuff: zerlegen (pictures / symbols), right angles
import numpy as np
import operator


class MathGenerator:
    ops = {
        "+": operator.add,
        "-": operator.sub,
        "*": operator.mul,
        "/": operator.truediv
    }
    operations = ["+", "-", "×", "÷"]

    def get_term(self, difficulty):
        if difficulty == 0:
            return self.generate_lvl0()
        if difficulty == 1:
            return self.generate_lvl1()
        if difficulty == 2:
            return self.generate_lvl2()
        if difficulty == 3:
            return self.generate_lvl3()
        if difficulty == 4:
            return self.generate_lvl4()

    def build_term_string(self, term_steps, operator_symbol):
        term_string = f"{term_steps[0]}"
        for value in term_steps[1:]:
            term_string += f" {operator_symbol} {value}"
        return term_string + " = ?"

    def generate_lvl0(self):
        numbers = np.arange(start=1, stop=20, step=1)
        number_count = np.random.choice([2, 3])
        operator_symbol = "+"
        term = self.generate_add_or_sub(number_count, numbers, operator_symbol)
        return self.build_term_string(term[1], operator_symbol), term[0]

    def generate_lvl1(self):
        numbers = np.arange(start=0, stop=100, step=1)

        pass

    def generate_lvl2(self):
        numbers = np.arange(start=0, stop=100, step=1)
        pass

    def generate_lvl3(self):
        pass

    def generate_lvl4(self):
        pass

    def generate_add_or_sub(self, step_count, num_range, operator_symbol, start=0):
        operation_func = self.ops[operator_symbol]
        steps = np.zeros(step_count, dtype=int)
        steps[0] = start
        while steps[0] == 0:
            choice = np.random.choice(num_range)
            if operation_func(choice, step_count) in num_range:
                steps[0] = choice

        def get_result():
            step_sum = steps[0]
            for step in steps[1:]:
                step_sum = operation_func(step_sum, step)
            return step_sum

        for i in range(step_count - 1):
            while steps[i + 1] == 0:
                choice = np.random.choice(num_range)
                if operation_func(operation_func(get_result(), choice), (step_count - (i + 2))) in num_range:
                    steps[i + 1] = choice

        return {operator_symbol: [get_result(), steps]}

    def is_prime(self, n):
        x = True
        for i in range(2, n):
            if n % i == 0:
                x = False
        return x

    def generate_multiplication_value_pair(self, num_range):
        retry = True
        while retry:
            result = 0
            negative = False

            while result == 0:
                retry = False
                result = np.random.choice(num_range)
                # check if result is prime and retry with a 90% chance
                if self.is_prime(abs(result)) and np.random.choice([True, False], p=[0.9, 0.1]):
                    retry = True

            if result < 0:
                negative = True
                result = -result
            steps = np.zeros(2, dtype=int)
            # get divisors
            divisors = []
            i = 1
            while i <= result:  # look for all divisors without residue
                if result % i == 0:
                    divisors.append(i)
                i += 1
            steps[0] = np.random.choice(divisors)
            steps[1] = result / steps[0]
            if negative:
                negate_idx = np.random.choice([0, 1])
                steps[negate_idx] = -steps[negate_idx]
                result = -result

            for step in steps:  # avoid terms with multiplication by 1 with 90% probability
                if step == 1 and np.random.choice([True, False], p=[0.9, 0.1]):
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
            numerator = np.random.choice(num_range)
            divisor = np.random.choice(num_range)
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
        operation = np.random.choice(["+", "-"])
        return self.generate_add_or_sub(2, num_range, operation)

    def generate_mixed_add_sub(self, step_count, num_range):
        """
        Generates a term with mixed operations. This includes at least one + and - .
        :param step_count: The number of steps for the requested term.
        :param num_range: The number range for which the term will be generated in.
        :return: Result of the term, steps of the term, operations between steps.
        """
        retry = True
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


ops = {
    "+": operator.add,
    "-": operator.sub,
    "*": operator.mul,
    "/": operator.truediv
}


def validate(tup, operator_symbol):
    operation_func = ops[operator_symbol]
    result = tup[1][0]
    for value in tup[1][1:]:
        result = operation_func(result, value)
    return result == tup[0]


mg = MathGenerator()
for i in range(1, 1001):
    #    print(mg.get_task(0))
    # print(mg.generate_addition(2,range(-3,4)))
    # print(mg.generate_subtraction(3, np.arange(start=-10, stop=100, step=1)))
    # mg.generate_mixed_add_sub(4, np.arange(start=-10, stop=100, step=1))
    #res = mg.generate_add_or_sub(2, np.arange(start=-10, stop=100, step=1), "-")
    res = mg.generate_division_value_pair(np.arange(start=0, stop=10, step=1))
    #res = mg.generate_multiplication_value_pair(np.arange(start=-10, stop=100, step=1))
    #res = mg.generate_mixed_add_sub(3, np.arange(start=-10, stop=10, step=1))
    print(res)
    # print(mg.generate_lvl0())
    #

    # print(res)#, validate(res, "/"))
