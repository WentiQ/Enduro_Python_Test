# Solutions for Enduro Python Test
# Topics: Basics, Arithmetic Operations, Conditional Statements, Data Types, Operators, Type Casting, Functions
# Total: 12 Questions (5 Easy + 5 Medium + 2 Hard) = 136 marks

# =============================================================================
# QUESTION 1: Calculate Sum with Type Casting (Easy - 6 marks)
# =============================================================================
def calculate_sum(a, b):
    """Convert both parameters to integers and return their sum."""
    return int(a) + int(b)

# Test cases
print("Q1: Calculate Sum")
print(calculate_sum("5", "10"))  # 15
print(calculate_sum(5, 10))      # 15
print(calculate_sum("7", 3))     # 10
print(calculate_sum("0", "0"))   # 0
print()


# =============================================================================
# QUESTION 2: Get Data Type (Easy - 7 marks)
# =============================================================================
def get_data_type(value):
    """Return the type of value as a string."""
    if type(value) == int:
        return "int"
    elif type(value) == float:
        return "float"
    elif type(value) == str:
        return "str"
    elif type(value) == bool:
        return "bool"
    else:
        return "other"

# Test cases
print("Q2: Get Data Type")
print(get_data_type(10))         # int
print(get_data_type(3.14))       # float
print(get_data_type("hello"))    # str
print(get_data_type(True))       # bool
print(get_data_type([1, 2, 3]))  # other
print()


# =============================================================================
# QUESTION 3: Classify Number (Easy - 7 marks)
# =============================================================================
def classify_number(num):
    """Classify number as positive/negative and even/odd."""
    if num == 0:
        return "Zero"
    elif num > 0:
        if num % 2 == 0:
            return "Positive Even"
        else:
            return "Positive Odd"
    else:
        if num % 2 == 0:
            return "Negative Even"
        else:
            return "Negative Odd"

# Test cases
print("Q3: Classify Number")
print(classify_number(10))   # Positive Even
print(classify_number(-5))   # Negative Odd
print(classify_number(0))    # Zero
print(classify_number(7))    # Positive Odd
print(classify_number(-4))   # Negative Even
print()


# =============================================================================
# QUESTION 4: Safe Divide with Info (Easy - 8 marks)
# =============================================================================
def safe_divide_with_info(a, b):
    """Divide with multiple validation and return appropriate type."""
    if b == 0:
        return "Division by Zero Error"
    if a == 0:
        return 0
    result = a / b
    if result == int(result):
        return int(result)
    return round(result, 2)

# Test cases
print("Q4: Safe Divide with Info")
print(safe_divide_with_info(10, 2))  # 5
print(safe_divide_with_info(7, 2))   # 3.5
print(safe_divide_with_info(5, 0))   # Division by Zero Error
print(safe_divide_with_info(0, 5))   # 0
print(safe_divide_with_info(15, 3))  # 5
print()


# =============================================================================
# QUESTION 5: Arithmetic Report (Easy - 8 marks)
# =============================================================================
def arithmetic_report(a, b):
    """Return formatted string with all arithmetic operations."""
    sum_val = a + b
    diff_val = a - b
    prod_val = a * b
    quot_val = a // b
    rem_val = a % b
    return f"Sum={sum_val}, Diff={diff_val}, Prod={prod_val}, Quot={quot_val}, Rem={rem_val}"

# Test cases
print("Q5: Arithmetic Report")
print(arithmetic_report(10, 3))  # Sum=13, Diff=7, Prod=30, Quot=3, Rem=1
print(arithmetic_report(7, 2))   # Sum=9, Diff=5, Prod=14, Quot=3, Rem=1
print(arithmetic_report(20, 4))  # Sum=24, Diff=16, Prod=80, Quot=5, Rem=0
print(arithmetic_report(15, 6))  # Sum=21, Diff=9, Prod=90, Quot=2, Rem=3
print()


# =============================================================================
# QUESTION 6: Smart Temperature Converter (Medium - 12 marks)
# =============================================================================
def smart_temperature_converter(temp, unit):
    """Convert temperature with validation for absolute zero."""
    if unit not in ["C", "F"]:
        return "Invalid Unit"
    if unit == "C":
        if temp < -273.15:
            return "Invalid Temperature"
        return round((temp * 9/5) + 32, 2)
    else:
        if temp < -459.67:
            return "Invalid Temperature"
        return round((temp - 32) * 5/9, 2)

# Test cases
print("Q6: Smart Temperature Converter")
print(smart_temperature_converter(0, "C"))      # 32.0
print(smart_temperature_converter(-500, "C"))   # Invalid Temperature
print(smart_temperature_converter(32, "X"))     # Invalid Unit
print(smart_temperature_converter(-459.67, "F")) # -273.15
print(smart_temperature_converter(100, "C"))    # 212.0
print()


# =============================================================================
# QUESTION 7: Smart Type Converter (Medium - 14 marks)
# =============================================================================
def smart_type_converter(value):
    """Automatically detect and convert to appropriate type."""
    if value.lower() == "true":
        return True
    elif value.lower() == "false":
        return False
    elif value.lower() == "none":
        return "None"
    try:
        if "." not in value:
            return int(value)
        else:
            return float(value)
    except:
        return value

# Test cases
print("Q7: Smart Type Converter")
print(smart_type_converter("123"))     # 123
print(smart_type_converter("3.14"))    # 3.14
print(smart_type_converter("true"))    # True
print(smart_type_converter("hello"))   # hello
print(smart_type_converter("False"))   # False
print(smart_type_converter("-42"))     # -42
print(smart_type_converter("none"))    # None
print()


# =============================================================================
# QUESTION 8: Detailed Grade Calculator (Medium - 14 marks)
# =============================================================================
def detailed_grade_calculator(obtained, total):
    """Calculate grade with status from obtained and total marks."""
    if obtained < 0 or total <= 0 or obtained > total:
        return "Invalid"
    percentage = (obtained / total) * 100
    if percentage >= 90:
        return "A-Excellent"
    elif percentage >= 80:
        return "B-Good"
    elif percentage >= 70:
        return "C-Average"
    elif percentage >= 60:
        return "D-Below Average"
    else:
        return "F-Fail"

# Test cases
print("Q8: Detailed Grade Calculator")
print(detailed_grade_calculator(95, 100))   # A-Excellent
print(detailed_grade_calculator(40, 50))    # A-Excellent (80%)
print(detailed_grade_calculator(50, 100))   # F-Fail
print(detailed_grade_calculator(110, 100))  # Invalid
print(detailed_grade_calculator(-5, 100))   # Invalid
print(detailed_grade_calculator(35, 50))    # C-Average (70%)
print()


# =============================================================================
# QUESTION 9: Number Properties Analyzer (Medium - 16 marks)
# =============================================================================
def number_properties_analyzer(num):
    """Analyze multiple properties of a number and return formatted report."""
    properties = []
    
    # Sign
    if num > 0:
        properties.append("Positive")
    elif num < 0:
        properties.append("Negative")
    else:
        properties.append("Zero")
    
    # Parity (skip if zero)
    if num != 0:
        if num % 2 == 0:
            properties.append("Even")
        else:
            properties.append("Odd")
    
    # Divisibility
    if num % 3 == 0 and num != 0:
        properties.append("Divisible by 3")
    if num % 5 == 0 and num != 0:
        properties.append("Divisible by 5")
    
    # Magnitude
    abs_num = abs(num)
    if abs_num <= 9:
        properties.append("Single-digit")
    elif abs_num <= 99:
        properties.append("Double-digit")
    elif abs_num <= 999:
        properties.append("Triple-digit")
    else:
        properties.append("Large")
    
    return ", ".join(properties)

# Test cases
print("Q9: Number Properties Analyzer")
print(number_properties_analyzer(15))    # Positive, Odd, Divisible by 3, Divisible by 5, Double-digit
print(number_properties_analyzer(-6))    # Negative, Even, Divisible by 3, Single-digit
print(number_properties_analyzer(0))     # Zero, Single-digit
print(number_properties_analyzer(100))   # Positive, Even, Divisible by 5, Triple-digit
print(number_properties_analyzer(-45))   # Negative, Odd, Divisible by 3, Divisible by 5, Double-digit
print(number_properties_analyzer(1000))  # Positive, Even, Divisible by 5, Large
print(number_properties_analyzer(7))     # Positive, Odd, Single-digit
print()


# =============================================================================
# QUESTION 10: Advanced String Parser (Medium - 16 marks)
# =============================================================================
def advanced_string_parser(value):
    """Parse string and return type with value in format TYPE:VALUE."""
    if value.lower() == "true":
        return "BOOL:True"
    elif value.lower() == "false":
        return "BOOL:False"
    elif value.startswith("0b") or value.startswith("0B"):
        try:
            decimal = int(value, 2)
            return f"BINARY:{decimal}"
        except:
            return f"STRING:{value}"
    elif value.startswith("0x") or value.startswith("0X"):
        try:
            decimal = int(value, 16)
            return f"HEX:{decimal}"
        except:
            return f"STRING:{value}"
    try:
        if "." not in value:
            num = int(value)
            return f"INT:{num}"
        else:
            num = float(value)
            return f"FLOAT:{num}"
    except:
        return f"STRING:{value}"

# Test cases
print("Q10: Advanced String Parser")
print(advanced_string_parser("42"))       # INT:42
print(advanced_string_parser("0b1010"))   # BINARY:10
print(advanced_string_parser("true"))     # BOOL:True
print(advanced_string_parser("3.14"))     # FLOAT:3.14
print(advanced_string_parser("0xFF"))     # HEX:255
print(advanced_string_parser("hello"))    # STRING:hello
print(advanced_string_parser("False"))    # BOOL:False
print()


# =============================================================================
# QUESTION 11: Simple Expression Calculator (Hard - 18 marks)
# =============================================================================
def simple_expression_calculator(expression):
    """Evaluate simple expression manually without eval()."""
    try:
        parts = expression.split()
        if len(parts) != 3:
            return "Invalid Expression"
        
        num1_str, operator, num2_str = parts
        num1 = float(num1_str)
        num2 = float(num2_str)
        
        if operator == "+":
            result = num1 + num2
        elif operator == "-":
            result = num1 - num2
        elif operator == "*":
            result = num1 * num2
        elif operator == "/":
            if num2 == 0:
                return "Division by Zero"
            result = num1 / num2
        elif operator == "%":
            if num2 == 0:
                return "Division by Zero"
            result = num1 % num2
        elif operator == "**":
            result = num1 ** num2
        else:
            return "Invalid Operator"
        
        return round(result, 2)
    except:
        return "Invalid Expression"

# Test cases
print("Q11: Simple Expression Calculator")
print(simple_expression_calculator("10 + 5"))    # 15.0
print(simple_expression_calculator("20 / 4"))    # 5.0
print(simple_expression_calculator("5 / 0"))     # Division by Zero
print(simple_expression_calculator("2 ** 3"))    # 8.0
print(simple_expression_calculator("10 % 3"))    # 1.0
print(simple_expression_calculator("abc"))       # Invalid Expression
print(simple_expression_calculator("5 ^ 2"))     # Invalid Operator
print()


# =============================================================================
# QUESTION 12: Advanced Calculator (Hard - 20 marks)
# =============================================================================
def advanced_calculator(num1, operator, num2):
    """
    Advanced calculator with type conversion and error handling.
    - Converts strings to int or float
    - Performs arithmetic operations
    - Returns int if both inputs were integers (except division)
    - Handles errors appropriately
    """
    try:
        # Try converting to int first
        try:
            n1 = int(num1)
            is_int1 = True
        except:
            n1 = float(num1)
            is_int1 = False
        
        try:
            n2 = int(num2)
            is_int2 = True
        except:
            n2 = float(num2)
            is_int2 = False
        
        # Perform operation
        if operator == "+":
            result = n1 + n2
        elif operator == "-":
            result = n1 - n2
        elif operator == "*":
            result = n1 * n2
        elif operator == "/":
            if n2 == 0:
                return "Division Error"
            result = n1 / n2
            return float(result)
        elif operator == "%":
            result = n1 % n2
        elif operator == "**":
            result = n1 ** n2
        else:
            return "Invalid Input"
        
        # Return int if both were integers and not division
        if is_int1 and is_int2 and operator != "/":
            return int(result)
        return float(result)
    except:
        return "Invalid Input"

# Test cases
print("Q12: Advanced Calculator")
print(advanced_calculator("10", "+", "5"))      # 15
print(advanced_calculator("10.5", "*", "2"))    # 21.0
print(advanced_calculator("10", "/", "0"))      # Division Error
print(advanced_calculator("abc", "+", "5"))     # Invalid Input
print(advanced_calculator("8", "**", "2"))      # 64
print(advanced_calculator("10", "%", "3"))      # 1
print()


# =============================================================================
# SUMMARY
# =============================================================================
print("=" * 70)
print("ALL SOLUTIONS COMPLETED")
print("=" * 70)
print("Total Questions: 12")
print("Easy: 5 questions (36 marks)")
print("Medium: 5 questions (72 marks)")
print("Hard: 2 questions (38 marks)")
print("Total Marks: 146")
print("Passing Marks: 73 (50%)")
print("=" * 70)
print("\nTopics Covered:")
print("✓ Basics")
print("✓ Arithmetic Operations (+, -, *, /, %, **)")
print("✓ Conditional Statements (if/elif/else, nested)")
print("✓ Data Types (int, float, str, bool)")
print("✓ Operators (comparison, logical, arithmetic)")
print("✓ Type Casting (int(), float(), str(), bool())")
print("✓ Functions (def, parameters, return)")
print("✓ String manipulation and formatting")
print("✓ Binary and Hexadecimal conversion")
print("=" * 70)
