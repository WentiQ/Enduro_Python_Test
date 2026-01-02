// Python Test - Topics: Variables, Operators, Conditionals, Loops, Strings, Lists, Functions
// Duration: 60 minutes
// Questions: 8 (3 Easy + 3 Medium + 2 Hard)

window.defaultQuestions = [
    // ==================== EASY QUESTIONS (4-5 min each) ====================
    
    {
        id: 'q1',
        difficulty: 'easy',
        type: 'code',
        text: 'Write a function `calculate_sum` that takes two parameters (which can be strings or numbers) and returns their sum as an integer.\n\n**Type Casting Required:** Convert string numbers to integers before adding.\n\nExample:\n```python\ncalculate_sum("5", "10")  # Should return 15\ncalculate_sum(5, 10)      # Should return 15\ncalculate_sum("7", 3)     # Should return 10\n```',
        marks: 6,
        starterCode: 'def calculate_sum(a, b):\n    # Write your code here\n    pass\n\n# Test your function\nprint(calculate_sum("5", "10"))',
        testCases: [
            {
                input: 'calculate_sum("5", "10")',
                output: '15',
                hidden: false
            },
            {
                input: 'calculate_sum(5, 10)',
                output: '15',
                hidden: true
            },
            {
                input: 'calculate_sum("7", 3)',
                output: '10',
                hidden: true
            },
            {
                input: 'calculate_sum("0", "0")',
                output: '0',
                hidden: true
            }
        ],
        solution: 'def calculate_sum(a, b):\n    return int(a) + int(b)'
    },
    
    {
        id: 'q2',
        difficulty: 'easy',
        type: 'code',
        text: 'Write a function `get_data_type` that takes any value and returns its type as a string.\n\nReturn exactly: "int", "float", "str", "bool", or "other"\n\nExample:\n```python\nget_data_type(10)      # Should return "int"\nget_data_type(3.14)    # Should return "float"\nget_data_type("hello") # Should return "str"\nget_data_type(True)    # Should return "bool"\n```',
        marks: 7,
        starterCode: 'def get_data_type(value):\n    # Write your code here\n    pass\n\n# Test your function\nprint(get_data_type(10))',
        testCases: [
            {
                input: 'get_data_type(10)',
                output: 'int',
                hidden: false
            },
            {
                input: 'get_data_type(3.14)',
                output: 'float',
                hidden: true
            },
            {
                input: 'get_data_type("hello")',
                output: 'str',
                hidden: true
            },
            {
                input: 'get_data_type(True)',
                output: 'bool',
                hidden: true
            },
            {
                input: 'get_data_type([1, 2, 3])',
                output: 'other',
                hidden: true
            }
        ],
        solution: 'def get_data_type(value):\n    if type(value) == int:\n        return "int"\n    elif type(value) == float:\n        return "float"\n    elif type(value) == str:\n        return "str"\n    elif type(value) == bool:\n        return "bool"\n    else:\n        return "other"'
    },
    
    {
        id: 'q3',
        difficulty: 'easy',
        type: 'code',
        text: 'Write a function `classify_number` that takes an integer and returns a classification string based on these rules:\n- If number is 0, return "Zero"\n- If number is positive AND even, return "Positive Even"\n- If number is positive AND odd, return "Positive Odd"\n- If number is negative AND even, return "Negative Even"\n- If number is negative AND odd, return "Negative Odd"\n\n**Use nested conditionals and modulo operator**\n\nExample:\n```python\nclassify_number(10)   # Should return "Positive Even"\nclassify_number(-5)   # Should return "Negative Odd"\nclassify_number(0)    # Should return "Zero"\n```',
        marks: 7,
        starterCode: 'def classify_number(num):\n    # Write your code here\n    pass\n\n# Test your function\nprint(classify_number(10))',
        testCases: [
            {
                input: 'classify_number(10)',
                output: 'Positive Even',
                hidden: false
            },
            {
                input: 'classify_number(-5)',
                output: 'Negative Odd',
                hidden: true
            },
            {
                input: 'classify_number(0)',
                output: 'Zero',
                hidden: true
            },
            {
                input: 'classify_number(7)',
                output: 'Positive Odd',
                hidden: true
            },
            {
                input: 'classify_number(-4)',
                output: 'Negative Even',
                hidden: true
            }
        ],
        solution: 'def classify_number(num):\n    if num == 0:\n        return "Zero"\n    elif num > 0:\n        if num % 2 == 0:\n            return "Positive Even"\n        else:\n            return "Positive Odd"\n    else:\n        if num % 2 == 0:\n            return "Negative Even"\n        else:\n            return "Negative Odd"'
    },
    
    {
        id: 'q4',
        difficulty: 'easy',
        type: 'code',
        text: 'Write a function `safe_divide_with_info` that takes two numbers and returns:\n- If b is zero, return "Division by Zero Error"\n- If result is a whole number (e.g., 10/2=5), return the integer result\n- If result has decimal places (e.g., 7/2=3.5), return the float result rounded to 2 decimals\n- If a is zero, return 0\n\n**Type Casting & Multiple Conditionals Required**\n\nExample:\n```python\nsafe_divide_with_info(10, 2)   # Should return 5\nsafe_divide_with_info(7, 2)    # Should return 3.5\nsafe_divide_with_info(5, 0)    # Should return "Division by Zero Error"\n```',
        marks: 8,
        starterCode: 'def safe_divide_with_info(a, b):\n    # Write your code here\n    pass\n\n# Test your function\nprint(safe_divide_with_info(10, 2))',
        testCases: [
            {
                input: 'safe_divide_with_info(10, 2)',
                output: '5',
                hidden: false
            },
            {
                input: 'safe_divide_with_info(7, 2)',
                output: '3.5',
                hidden: true
            },
            {
                input: 'safe_divide_with_info(5, 0)',
                output: 'Division by Zero Error',
                hidden: true
            },
            {
                input: 'safe_divide_with_info(0, 5)',
                output: '0',
                hidden: true
            },
            {
                input: 'safe_divide_with_info(15, 3)',
                output: '5',
                hidden: true
            }
        ],
        solution: 'def safe_divide_with_info(a, b):\n    if b == 0:\n        return "Division by Zero Error"\n    if a == 0:\n        return 0\n    result = a / b\n    if result == int(result):\n        return int(result)\n    return round(result, 2)'
    },
    
    {
        id: 'q5',
        difficulty: 'easy',
        type: 'code',
        text: 'Write a function `arithmetic_report` that takes two integers a and b, and returns a formatted string report showing all operations.\n\nReturn format: "Sum=X, Diff=Y, Prod=Z, Quot=Q, Rem=R"\n- Sum is a+b\n- Diff is a-b (can be negative)\n- Prod is a*b\n- Quot is integer division a//b\n- Rem is remainder a%b\n\n**String formatting and all operators required**\n\nExample:\n```python\narithmetic_report(10, 3)  # Should return "Sum=13, Diff=7, Prod=30, Quot=3, Rem=1"\narithmetic_report(7, 2)   # Should return "Sum=9, Diff=5, Prod=14, Quot=3, Rem=1"\n```',
        marks: 8,
        starterCode: 'def arithmetic_report(a, b):\n    # Write your code here\n    pass\n\n# Test your function\nprint(arithmetic_report(10, 3))',
        testCases: [
            {
                input: 'arithmetic_report(10, 3)',
                output: 'Sum=13, Diff=7, Prod=30, Quot=3, Rem=1',
                hidden: false
            },
            {
                input: 'arithmetic_report(7, 2)',
                output: 'Sum=9, Diff=5, Prod=14, Quot=3, Rem=1',
                hidden: true
            },
            {
                input: 'arithmetic_report(20, 4)',
                output: 'Sum=24, Diff=16, Prod=80, Quot=5, Rem=0',
                hidden: true
            },
            {
                input: 'arithmetic_report(15, 6)',
                output: 'Sum=21, Diff=9, Prod=90, Quot=2, Rem=3',
                hidden: true
            }
        ],
        solution: 'def arithmetic_report(a, b):\n    sum_val = a + b\n    diff_val = a - b\n    prod_val = a * b\n    quot_val = a // b\n    rem_val = a % b\n    return f"Sum={sum_val}, Diff={diff_val}, Prod={prod_val}, Quot={quot_val}, Rem={rem_val}"'
    },
    
    // ==================== MEDIUM QUESTIONS (6-8 min each) ====================
    
    {
        id: 'q6',
        difficulty: 'medium',
        type: 'code',
        text: 'Write a function `smart_temperature_converter` that takes a temperature value and a unit ("C" or "F") and converts with validation.\n\n**Rules:**\n- Celsius cannot be below -273.15 (absolute zero)\n- Fahrenheit cannot be below -459.67 (absolute zero)\n- If invalid, return "Invalid Temperature"\n- If invalid unit (not C or F), return "Invalid Unit"\n- Valid conversions: round to 2 decimals\n\n**Formulas:** C to F: (C × 9/5) + 32, F to C: (F - 32) × 5/9\n\nExample:\n```python\nsmart_temperature_converter(0, "C")      # Should return 32.0\nsmart_temperature_converter(-500, "C")  # Should return "Invalid Temperature"\nsmart_temperature_converter(32, "X")    # Should return "Invalid Unit"\n```',
        marks: 12,
        starterCode: 'def smart_temperature_converter(temp, unit):\n    # Write your code here\n    pass\n\n# Test your function\nprint(smart_temperature_converter(0, "C"))',
        testCases: [
            {
                input: 'smart_temperature_converter(0, "C")',
                output: '32.0',
                hidden: false
            },
            {
                input: 'smart_temperature_converter(-500, "C")',
                output: 'Invalid Temperature',
                hidden: true
            },
            {
                input: 'smart_temperature_converter(32, "X")',
                output: 'Invalid Unit',
                hidden: true
            },
            {
                input: 'smart_temperature_converter(-459.67, "F")',
                output: '-273.15',
                hidden: true
            },
            {
                input: 'smart_temperature_converter(100, "C")',
                output: '212.0',
                hidden: true
            }
        ],
        solution: 'def smart_temperature_converter(temp, unit):\n    if unit not in ["C", "F"]:\n        return "Invalid Unit"\n    if unit == "C":\n        if temp < -273.15:\n            return "Invalid Temperature"\n        return round((temp * 9/5) + 32, 2)\n    else:\n        if temp < -459.67:\n            return "Invalid Temperature"\n        return round((temp - 32) * 5/9, 2)'
    },
    
    {
        id: 'q7',
        difficulty: 'medium',
        type: 'code',
        text: 'Write a function `smart_type_converter` that converts a string value to the most appropriate type automatically.\n\n**Conversion Priority:**\n1. If string is "true" or "false" (case-insensitive), return boolean\n2. If string can be int (no decimal), return int\n3. If string can be float, return float\n4. If string is "none" (case-insensitive), return string "None"\n5. Otherwise return original string\n\n**Must handle negative numbers**\n\nExample:\n```python\nsmart_type_converter("123")     # Should return 123\nsmart_type_converter("3.14")    # Should return 3.14\nsmart_type_converter("true")    # Should return True\nsmart_type_converter("hello")   # Should return "hello"\n```',
        marks: 14,
        starterCode: 'def smart_type_converter(value):\n    # Write your code here\n    pass\n\n# Test your function\nprint(smart_type_converter("123"))',
        testCases: [
            {
                input: 'smart_type_converter("123")',
                output: '123',
                hidden: false
            },
            {
                input: 'smart_type_converter("3.14")',
                output: '3.14',
                hidden: true
            },
            {
                input: 'smart_type_converter("true")',
                output: 'True',
                hidden: true
            },
            {
                input: 'smart_type_converter("hello")',
                output: 'hello',
                hidden: true
            },
            {
                input: 'smart_type_converter("False")',
                output: 'False',
                hidden: true
            },
            {
                input: 'smart_type_converter("-42")',
                output: '-42',
                hidden: true
            },
            {
                input: 'smart_type_converter("none")',
                output: 'None',
                hidden: true
            }
        ],
        solution: 'def smart_type_converter(value):\n    if value.lower() == "true":\n        return True\n    elif value.lower() == "false":\n        return False\n    elif value.lower() == "none":\n        return "None"\n    try:\n        if "." not in value:\n            return int(value)\n        else:\n            return float(value)\n    except:\n        return value'
    },
    
    {
        id: 'q8',
        difficulty: 'medium',
        type: 'code',
        text: 'Write a function `detailed_grade_calculator` that takes obtained marks and total marks, calculates percentage, and returns grade with status.\n\n**Return format: "Grade-Status"** (e.g., "A-Excellent")\n- If marks invalid (obtained < 0, total <= 0, obtained > total): return "Invalid"\n- Calculate percentage = (obtained/total) * 100\n- Grades: A(90-100), B(80-89), C(70-79), D(60-69), F(below 60)\n- Status: A="Excellent", B="Good", C="Average", D="Below Average", F="Fail"\n\nExample:\n```python\ndetailed_grade_calculator(95, 100)   # Should return "A-Excellent"\ndetailed_grade_calculator(40, 50)    # Should return "A-Excellent" (80%)\ndetailed_grade_calculator(50, 100)   # Should return "F-Fail"\n```',
        marks: 14,
        starterCode: 'def detailed_grade_calculator(obtained, total):\n    # Write your code here\n    pass\n\n# Test your function\nprint(detailed_grade_calculator(95, 100))',
        testCases: [
            {
                input: 'detailed_grade_calculator(95, 100)',
                output: 'A-Excellent',
                hidden: false
            },
            {
                input: 'detailed_grade_calculator(40, 50)',
                output: 'A-Excellent',
                hidden: true
            },
            {
                input: 'detailed_grade_calculator(50, 100)',
                output: 'F-Fail',
                hidden: true
            },
            {
                input: 'detailed_grade_calculator(110, 100)',
                output: 'Invalid',
                hidden: true
            },
            {
                input: 'detailed_grade_calculator(-5, 100)',
                output: 'Invalid',
                hidden: true
            },
            {
                input: 'detailed_grade_calculator(35, 50)',
                output: 'C-Average',
                hidden: true
            }
        ],
        solution: 'def detailed_grade_calculator(obtained, total):\n    if obtained < 0 or total <= 0 or obtained > total:\n        return "Invalid"\n    percentage = (obtained / total) * 100\n    if percentage >= 90:\n        return "A-Excellent"\n    elif percentage >= 80:\n        return "B-Good"\n    elif percentage >= 70:\n        return "C-Average"\n    elif percentage >= 60:\n        return "D-Below Average"\n    else:\n        return "F-Fail"'
    },
    
    {
        id: 'q9',
        difficulty: 'medium',
        type: 'code',
        text: 'Write a function `number_properties_analyzer` that takes an integer and returns a detailed analysis string.\n\n**Return format: "Property1, Property2, Property3"**\n\nAnalyze these properties in order:\n1. Sign: "Positive" or "Negative" or "Zero"\n2. Parity: "Even" or "Odd" (skip if zero)\n3. Divisibility: "Divisible by 3" and/or "Divisible by 5" (check both, skip if neither)\n4. Magnitude: "Single-digit" (0-9), "Double-digit" (10-99), "Triple-digit" (100-999), or "Large" (≥1000)\n\n**Separate properties with ", " and handle negative numbers by magnitude of absolute value**\n\nExample:\n```python\nnumber_properties_analyzer(15)   # Should return "Positive, Odd, Divisible by 3, Divisible by 5, Double-digit"\nnumber_properties_analyzer(-6)   # Should return "Negative, Even, Divisible by 3, Single-digit"\nnumber_properties_analyzer(0)    # Should return "Zero, Single-digit"\n```',
        marks: 16,
        starterCode: 'def number_properties_analyzer(num):\n    # Write your code here\n    pass\n\n# Test your function\nprint(number_properties_analyzer(15))',
        testCases: [
            {
                input: 'number_properties_analyzer(15)',
                output: 'Positive, Odd, Divisible by 3, Divisible by 5, Double-digit',
                hidden: false
            },
            {
                input: 'number_properties_analyzer(-6)',
                output: 'Negative, Even, Divisible by 3, Single-digit',
                hidden: true
            },
            {
                input: 'number_properties_analyzer(0)',
                output: 'Zero, Single-digit',
                hidden: true
            },
            {
                input: 'number_properties_analyzer(100)',
                output: 'Positive, Even, Divisible by 5, Triple-digit',
                hidden: true
            },
            {
                input: 'number_properties_analyzer(-45)',
                output: 'Negative, Odd, Divisible by 3, Divisible by 5, Double-digit',
                hidden: true
            },
            {
                input: 'number_properties_analyzer(1000)',
                output: 'Positive, Even, Divisible by 5, Large',
                hidden: true
            },
            {
                input: 'number_properties_analyzer(7)',
                output: 'Positive, Odd, Single-digit',
                hidden: true
            }
        ],
        solution: 'def number_properties_analyzer(num):\n    properties = []\n    \n    # Sign\n    if num > 0:\n        properties.append("Positive")\n    elif num < 0:\n        properties.append("Negative")\n    else:\n        properties.append("Zero")\n    \n    # Parity (skip if zero)\n    if num != 0:\n        if num % 2 == 0:\n            properties.append("Even")\n        else:\n            properties.append("Odd")\n    \n    # Divisibility\n    if num % 3 == 0 and num != 0:\n        properties.append("Divisible by 3")\n    if num % 5 == 0 and num != 0:\n        properties.append("Divisible by 5")\n    \n    # Magnitude\n    abs_num = abs(num)\n    if abs_num <= 9:\n        properties.append("Single-digit")\n    elif abs_num <= 99:\n        properties.append("Double-digit")\n    elif abs_num <= 999:\n        properties.append("Triple-digit")\n    else:\n        properties.append("Large")\n    \n    return ", ".join(properties)'
    },
    
    {
        id: 'q10',
        difficulty: 'medium',
        type: 'code',
        text: 'Write a function `advanced_string_parser` that takes a string and returns parsed value with type information.\n\n**Return format: "TYPE:VALUE"**\n- Check if binary (starts with "0b"): return "BINARY:" + decimal value\n- Check if hex (starts with "0x"): return "HEX:" + decimal value\n- Check if boolean ("true"/"false" case-insensitive): return "BOOL:True" or "BOOL:False"\n- Check if integer: return "INT:" + value\n- Check if float: return "FLOAT:" + value\n- Otherwise: return "STRING:" + value\n\nExample:\n```python\nadvanced_string_parser("42")       # Should return "INT:42"\nadvanced_string_parser("0b1010")   # Should return "BINARY:10"\nadvanced_string_parser("true")     # Should return "BOOL:True"\n```',
        marks: 16,
        starterCode: 'def advanced_string_parser(value):\n    # Write your code here\n    pass\n\n# Test your function\nprint(advanced_string_parser("42"))',
        testCases: [
            {
                input: 'advanced_string_parser("42")',
                output: 'INT:42',
                hidden: false
            },
            {
                input: 'advanced_string_parser("0b1010")',
                output: 'BINARY:10',
                hidden: true
            },
            {
                input: 'advanced_string_parser("true")',
                output: 'BOOL:True',
                hidden: true
            },
            {
                input: 'advanced_string_parser("3.14")',
                output: 'FLOAT:3.14',
                hidden: true
            },
            {
                input: 'advanced_string_parser("0xFF")',
                output: 'HEX:255',
                hidden: true
            },
            {
                input: 'advanced_string_parser("hello")',
                output: 'STRING:hello',
                hidden: true
            },
            {
                input: 'advanced_string_parser("False")',
                output: 'BOOL:False',
                hidden: true
            }
        ],
        solution: 'def advanced_string_parser(value):\n    if value.lower() == "true":\n        return "BOOL:True"\n    elif value.lower() == "false":\n        return "BOOL:False"\n    elif value.startswith("0b") or value.startswith("0B"):\n        try:\n            decimal = int(value, 2)\n            return f"BINARY:{decimal}"\n        except:\n            return f"STRING:{value}"\n    elif value.startswith("0x") or value.startswith("0X"):\n        try:\n            decimal = int(value, 16)\n            return f"HEX:{decimal}"\n        except:\n            return f"STRING:{value}"\n    try:\n        if "." not in value:\n            num = int(value)\n            return f"INT:{num}"\n        else:\n            num = float(value)\n            return f"FLOAT:{num}"\n    except:\n        return f"STRING:{value}"'
    },
    
    // ==================== HARD QUESTIONS (10-12 min each) ====================
    
    {
        id: 'q11',
        difficulty: 'hard',
        type: 'code',
        text: 'Write a function `simple_expression_calculator` that evaluates a simple expression with ONE operator.\n\n**Format: "number operator number" (e.g., "5 + 3")**\n- Supported operators: +, -, *, /, %, **\n- Numbers can be integers or floats\n- Return result as float rounded to 2 decimals\n- Return "Invalid Expression" for invalid format\n- Return "Division by Zero" for divide/mod by zero\n- Return "Invalid Operator" for unsupported operators\n\n**Parse the string manually - split by spaces**\n\nExample:\n```python\nsimple_expression_calculator("10 + 5")    # Should return 15.0\nsimple_expression_calculator("20 / 4")    # Should return 5.0\nsimple_expression_calculator("5 / 0")     # Should return "Division by Zero"\n```',
        marks: 18,
        starterCode: 'def simple_expression_calculator(expression):\n    # Write your code here\n    pass\n\n# Test your function\nprint(simple_expression_calculator("10 + 5"))',
        testCases: [
            {
                input: 'simple_expression_calculator("10 + 5")',
                output: '15.0',
                hidden: false
            },
            {
                input: 'simple_expression_calculator("20 / 4")',
                output: '5.0',
                hidden: true
            },
            {
                input: 'simple_expression_calculator("5 / 0")',
                output: 'Division by Zero',
                hidden: true
            },
            {
                input: 'simple_expression_calculator("2 ** 3")',
                output: '8.0',
                hidden: true
            },
            {
                input: 'simple_expression_calculator("10 % 3")',
                output: '1.0',
                hidden: true
            },
            {
                input: 'simple_expression_calculator("abc")',
                output: 'Invalid Expression',
                hidden: true
            },
            {
                input: 'simple_expression_calculator("5 ^ 2")',
                output: 'Invalid Operator',
                hidden: true
            }
        ],
        solution: 'def simple_expression_calculator(expression):\n    try:\n        parts = expression.split()\n        if len(parts) != 3:\n            return "Invalid Expression"\n        num1_str, operator, num2_str = parts\n        num1 = float(num1_str)\n        num2 = float(num2_str)\n        if operator == "+":\n            result = num1 + num2\n        elif operator == "-":\n            result = num1 - num2\n        elif operator == "*":\n            result = num1 * num2\n        elif operator == "/":\n            if num2 == 0:\n                return "Division by Zero"\n            result = num1 / num2\n        elif operator == "%":\n            if num2 == 0:\n                return "Division by Zero"\n            result = num1 % num2\n        elif operator == "**":\n            result = num1 ** num2\n        else:\n            return "Invalid Operator"\n        return round(result, 2)\n    except:\n        return "Invalid Expression"'
    },
    
    {
        id: 'q12',
        difficulty: 'hard',
        type: 'code',
        text: 'Write a function `advanced_calculator` that takes three string parameters: num1, operator, num2.\n\nThe function should:\n1. Convert num1 and num2 to appropriate types (int or float)\n2. Perform the operation (+, -, *, /, %, **)\n3. Return result as int if both inputs were integers and operation wasn\'t division, otherwise float\n4. Handle division by zero → return "Division Error"\n5. Handle invalid inputs → return "Invalid Input"\n\nExample:\n```python\nadvanced_calculator("10", "+", "5")      # Should return 15\nadvanced_calculator("10.5", "*", "2")    # Should return 21.0\nadvanced_calculator("10", "/", "0")      # Should return "Division Error"\nadvanced_calculator("abc", "+", "5")     # Should return "Invalid Input"\n```',
        marks: 20,
        starterCode: 'def advanced_calculator(num1, operator, num2):\n    # Write your code here\n    pass\n\n# Test your function\nprint(advanced_calculator("10", "+", "5"))',
        testCases: [
            {
                input: 'advanced_calculator("10", "+", "5")',
                output: '15',
                hidden: false
            },
            {
                input: 'advanced_calculator("10.5", "*", "2")',
                output: '21.0',
                hidden: true
            },
            {
                input: 'advanced_calculator("10", "/", "0")',
                output: 'Division Error',
                hidden: true
            },
            {
                input: 'advanced_calculator("abc", "+", "5")',
                output: 'Invalid Input',
                hidden: true
            },
            {
                input: 'advanced_calculator("8", "**", "2")',
                output: '64',
                hidden: true
            },
            {
                input: 'advanced_calculator("10", "%", "3")',
                output: '1',
                hidden: true
            }
        ],
        solution: 'def advanced_calculator(num1, operator, num2):\n    try:\n        # Try converting to int first\n        try:\n            n1 = int(num1)\n            is_int1 = True\n        except:\n            n1 = float(num1)\n            is_int1 = False\n        \n        try:\n            n2 = int(num2)\n            is_int2 = True\n        except:\n            n2 = float(num2)\n            is_int2 = False\n        \n        # Perform operation\n        if operator == "+":\n            result = n1 + n2\n        elif operator == "-":\n            result = n1 - n2\n        elif operator == "*":\n            result = n1 * n2\n        elif operator == "/":\n            if n2 == 0:\n                return "Division Error"\n            result = n1 / n2\n            return float(result)\n        elif operator == "%":\n            result = n1 % n2\n        elif operator == "**":\n            result = n1 ** n2\n        else:\n            return "Invalid Input"\n        \n        # Return int if both were integers and not division\n        if is_int1 and is_int2 and operator != "/":\n            return int(result)\n        return float(result)\n    except:\n        return "Invalid Input"'
    }
];

// Test metadata
window.testMetadata = {
    title: "Enduro Python Test",
    duration: 60, // minutes
    totalMarks: 146,
    topics: ["Basics", "Arithmetic Operations", "Conditional Statements", "Data Types", "Operators", "Type Casting", "Functions"],
    difficulty: {
        easy: 5,
        medium: 5,
        hard: 2
    },
    passingMarks: 73 // 50% of total marks
};

// Initialize test with questions
function initializeTestQuestions() {
    let tests = JSON.parse(localStorage.getItem('tests') || '[]');
    
    // Check if Enduro Python Test already exists
    const enduroTestExists = tests.find(t => t.title === 'Enduro Python Test');
    
    if (!enduroTestExists) {
        // Create Enduro Python Test with all questions
        const now = new Date();
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        
        const enduroTest = {
            id: 'test_enduro_' + Date.now(),
            title: 'Enduro Python Test',
            description: 'Comprehensive Python test covering variables, operators, conditionals, loops, strings, lists, and functions',
            duration: window.testMetadata.duration,
            totalMarks: window.testMetadata.totalMarks,
            questions: window.defaultQuestions,
            startDate: now.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            startDateTime: now.toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
            endDateTime: endDate.toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
            isActive: true,
            createdAt: new Date().toISOString()
        };
        tests.push(enduroTest);
        localStorage.setItem('tests', JSON.stringify(tests));
        console.log('Enduro Python Test created successfully!');
    } else {
        // Update existing test with latest questions
        const testIndex = tests.findIndex(t => t.title === 'Enduro Python Test');
        tests[testIndex].questions = window.defaultQuestions;
        tests[testIndex].totalMarks = window.testMetadata.totalMarks;
        tests[testIndex].duration = window.testMetadata.duration;
        localStorage.setItem('tests', JSON.stringify(tests));
        console.log('Enduro Python Test updated successfully!');
    }
}

// Call initialization when script loads
if (typeof window !== 'undefined') {
    // Wait a bit for other scripts to load
    setTimeout(initializeTestQuestions, 100);
}

// Additional helper functions for question management

// Add question to test
function addQuestionToTest(testId, question) {
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const test = tests.find(t => t.id === testId);
    
    if (test) {
        if (!test.questions) {
            test.questions = [];
        }
        test.questions.push(question);
        // Update total marks
        test.totalMarks = test.questions.reduce((sum, q) => sum + q.marks, 0);
        localStorage.setItem('tests', JSON.stringify(tests));
        return true;
    }
    return false;
}

// Remove question from test
function removeQuestionFromTest(testId, questionId) {
    const tests = JSON.parse(localStorage.getItem('tests') || '[]');
    const test = tests.find(t => t.id === testId);
    
    if (test && test.questions) {
        test.questions = test.questions.filter(q => q.id !== questionId);
        // Update total marks
        test.totalMarks = test.questions.reduce((sum, q) => sum + q.marks, 0);
        localStorage.setItem('tests', JSON.stringify(tests));
        return true;
    }
    return false;
}

// Get all available question templates
function getQuestionTemplates() {
    return window.defaultQuestions;
}

// Create custom question
function createCustomQuestion(type, text, marks, difficulty, starterCode, testCases) {
    return {
        id: 'q_custom_' + Date.now(),
        difficulty: difficulty || 'medium',
        type: type,
        text: text,
        marks: marks,
        starterCode: starterCode || '',
        testCases: testCases || [],
        solution: ''
    };
}

// Get questions by difficulty
function getQuestionsByDifficulty(difficulty) {
    return window.defaultQuestions.filter(q => q.difficulty === difficulty);
}
