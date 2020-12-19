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
        term = self.generate_term(number_count, numbers, operator_symbol)
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

    def generate_term(self, step_count, num_range, operator_symbol, start=0):
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

        # result = steps[0]
        # for step in steps[1:]:
        #    result = operation_func(result, step)

        return get_result(), steps

    def is_prime(self, n):
        x = True
        for i in range(2, n):
            if n % i == 0:
                x = False
        return x

    def generate_multiplication_value_pair(self, num_range):
        result = 0
        negative = False
        retry = True
        while result == 0 or retry:
            retry = False
            result = np.random.choice(num_range)
            # check if result is prime and retry with a 90% chance
            if self.is_prime(abs(result)) is not False and np.random.choice([True, False], p=[0.9, 0.1]):
                retry = True

        if result < 0:
            negative = True
            result = -result
        steps = np.zeros(2)
        # get divisors
        divisors = []
        i = 1
        while i <= result:
            if result % i == 0:
                divisors.append(i)
            i += 1
        if len(divisors) > 2:
            p = [0.1]
            p += [0.9 / (len(divisors) - 2) for _ in divisors[1:len(divisors) - 2]]
            p.append(0.1)
        if len(divisors) > 1:
            p = [0.1]
            p += [0.9 / (len(divisors) - 1) for _ in divisors[1:]]
        else:
            p = [1]
        steps[0] = np.random.choice(divisors, p=p)
        steps[1] = result / steps[0]
        if negative:
            negate_idx = np.random.choice([0, 1])
            steps[negate_idx] = -steps[negate_idx]
            result = -result
        return result, steps

    def generate_mixed_add_sub(self, step_count, num_range):
        if step_count % 2 == 0:
            values = []
            for _ in range(int(step_count / 2)):
                operation = np.random.choice(["addition", "subtraction"])
                if operation == "addition":
                    values.append({operation: self.generate_addition(2, num_range)})
                elif operation == "subtraction":
                    values.append({operation: self.generate_subtraction(2, num_range)})
        print(values)


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
    # res = mg.generate_term(4, np.arange(start=-10, stop=100, step=1), "-")
    # print(res, validate(res, "-"))
    # print(mg.generate_lvl0())
    res = mg.generate_multiplication_value_pair(np.arange(start=0, stop=10, step=1))
    print(res, validate(res, "*"))
