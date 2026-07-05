import { CustomPath, Challenge } from "./types";

export const PRESET_COURSES: Record<string, CustomPath> = {
  JavaScript: {
    language: "JavaScript",
    level: "Beginner",
    summary: "Welcome to JavaScript! This interactive pathway is customized to take you from a curious student to an active developer. You will build core logic and see your changes execute instantly in real-time.",
    modules: [
      {
        id: "js-mod-1",
        title: "Variables and Data Types",
        description: "Learn how computers store and memorize values using variables, constants, and basic primitive types.",
        estimatedHours: 1,
        keyConcepts: ["Variables (let, const)", "Numbers and Strings", "Basic Console Logging"],
        lesson: {
          lessonTitle: "Your First Variables",
          content: `In programming, variables act like named storage boxes. When you write \`let name = "Sagar";\`, you're placing the text "Sagar" inside a box labeled \`name\`.

JavaScript has two main ways to create variable boxes:
1. \`let\`: For boxes whose content can change later.
2. \`const\`: For boxes whose content is locked (constant) and can never change.

Let's look at a simple example:
\`\`\`javascript
const school = "Code Academy";
let grade = 10;
// We can change grade later:
grade = 11;
\`\`\`

Let's write a simple program that handles a student's scoring tracker!`,
          codeTemplate: `// Let's create our student registry!
// 1. Create a CONST variable named 'studentName' and assign it your name.
// 2. Create a LET variable named 'score' and assign it the number 85.
// 3. Double the score variable (score = score * 2).

const studentName = "Sagar";
let score = 85;

// WRITE YOUR CODE TO DOUBLE THE SCORE BELOW THIS LINE


// Keep this line so we can print the results
console.log("Student: " + studentName + ", Final Score: " + score);`,
          challengeInstructions: "Modify the starting code template. Multiply the 'score' variable by 2 (score = score * 2) so that the printed final score outputs exactly 170.",
          solutionCriteria: "Must use mathematical operators on 'score' variable and result in score being 170.",
          sampleAnswer: `const studentName = "Sagar";
let score = 85;
score = score * 2;
console.log("Student: " + studentName + ", Final Score: " + score);`
        }
      },
      {
        id: "js-mod-2",
        title: "Decision Making with If-Else",
        description: "Teach your program how to make logical judgments based on conditional expressions and Boolean branches.",
        estimatedHours: 1.5,
        keyConcepts: ["Boolean Logic", "if, else if, else branches", "Comparison operators (>, <, ===)"],
        lesson: {
          lessonTitle: "Conditional Code Routing",
          content: `Conditional branches allow programs to make decisions, just like humans! 'If it rains, bring an umbrella. Else, wear sunglasses.'

In JavaScript, we write this using \`if\` and \`else\`:
\`\`\`javascript
let temperature = 30;
if (temperature > 25) {
  console.log("It's hot!");
} else {
  console.log("It's cool.");
}
\`\`\`

We use triple equals \`===\` to check if two things are exactly equal, and \`!==\` to check if they are not equal. Let's write code that evaluates passing or failing grades for students!`,
          codeTemplate: `// Grade Evaluator
const gradeScore = 72;
let statusMessage = "";

// 1. Write an if-else statement.
// 2. If 'gradeScore' is 60 or higher, set statusMessage to "Pass".
// 3. Otherwise (else), set statusMessage to "Fail".

// WRITE YOUR IF-ELSE STATEMENT BELOW THIS LINE


console.log("Grade: " + gradeScore + " - Status: " + statusMessage);`,
          challengeInstructions: "Check if 'gradeScore' is greater than or equal to 60. If it is, set statusMessage to 'Pass', otherwise 'Fail'. With gradeScore = 72, final print must contain 'Status: Pass'.",
          solutionCriteria: "An if/else statement checking gradeScore >= 60, resulting in statusMessage = 'Pass'.",
          sampleAnswer: `const gradeScore = 72;
let statusMessage = "";
if (gradeScore >= 60) {
  statusMessage = "Pass";
} else {
  statusMessage = "Fail";
}
console.log("Grade: " + gradeScore + " - Status: " + statusMessage);`
        }
      },
      {
        id: "js-mod-3",
        title: "Loops and Iterations",
        description: "Master the art of repetition. Solve tedious bulk actions in milliseconds using classic 'for' loops.",
        estimatedHours: 2,
        keyConcepts: ["The For Loop", "Counters", "Loop Conditions"],
        lesson: {
          lessonTitle: "Mastering the For Loop",
          content: `Loops repeat a block of code until a condition is met. The standard \`for\` loop has three parts:
- **Initialization**: Where the counter starts (e.g. \`let i = 0\`).
- **Condition**: While this is true, the loop keeps running (e.g. \`i < 5\`).
- **Increment**: How the counter changes each time (e.g. \`i++\` which adds 1).

\`\`\`javascript
for (let i = 0; i < 3; i++) {
  console.log("Repetition number " + i);
}
\`\`\`

Let's write a program that calculates the sum of all numbers from 1 to 5!`,
          codeTemplate: `// Let's sum up all positive integers from 1 up to 5!
let sum = 0;

// 1. Write a for-loop that starts a counter 'i' at 1, goes up to i <= 5, and increments 'i' by 1.
// 2. Inside the loop, add the counter value 'i' to the 'sum' variable (sum = sum + i).

// WRITE YOUR FOR LOOP BELOW THIS LINE


console.log("The total sum is: " + sum);`,
          challengeInstructions: "Create a for-loop from i = 1 to 5. Accumulate each value into the 'sum' variable. The output total sum must be exactly 15.",
          solutionCriteria: "A for loop starting at 1, ending at 5, accumulating into sum.",
          sampleAnswer: `let sum = 0;
for (let i = 1; i <= 5; i++) {
  sum += i;
}
console.log("The total sum is: " + sum);`
        }
      },
      {
        id: "js-mod-4",
        title: "Creating Reusable Functions",
        description: "Package and reuse your calculations by declaring custom functions with parameter inputs and returns.",
        estimatedHours: 2,
        keyConcepts: ["Function Declaration", "Parameters & Arguments", "Return statements"],
        lesson: {
          lessonTitle: "Declaring Custom Functions",
          content: `Functions are named blocks of reusable logic. Think of them like kitchen blenders: you feed them ingredients (parameters), they do some work, and they return a finished product (the return value).

\`\`\`javascript
function add(a, b) {
  return a + b;
}
let result = add(3, 4); // result is 7
\`\`\`

Without a \`return\` statement, functions will evaluate to \`undefined\`. Let's write a function that calculates the area of a rectangle!`,
          codeTemplate: `// Area Calculator Function
// 1. Write a function named 'calculateArea' that accepts two parameters: 'width' and 'height'.
// 2. The function should multiply width and height, and RETURN the result.

// WRITE YOUR FUNCTION BELOW


// Testing your function
const areaResult = calculateArea(10, 5);
console.log("Calculated Area: " + areaResult);`,
          challengeInstructions: "Define the calculateArea(width, height) function that returns the multiplication of both inputs. When test runs with (10, 5), output must be 50.",
          solutionCriteria: "Function named calculateArea with parameters returning width * height.",
          sampleAnswer: `function calculateArea(width, height) {
  return width * height;
}
const areaResult = calculateArea(10, 5);
console.log("Calculated Area: " + areaResult);`
        }
      }
    ]
  },
  Python: {
    language: "Python",
    level: "Beginner",
    summary: "Welcome to Python! Praised for its clean, readable English-like syntax. This course is perfect for students looking to jumpstart scripting, automation, or data analysis.",
    modules: [
      {
        id: "py-mod-1",
        title: "Python Prints and Variables",
        description: "Introduce yourself to Python's simplified syntax, basic variables, and console output.",
        estimatedHours: 1,
        keyConcepts: ["Variables and assignments", "The print() function", "Dynamic typing"],
        lesson: {
          lessonTitle: "Variables in Python",
          content: `Python is famous for not requiring extra keywords like 'let' or 'const' or semicolons. You just declare a variable and use it immediately!

\`\`\`python
name = "Sagar"
age = 18
print(name)
\`\`\`

Let's practice updating variables and printing formatted values using Python's clean structure.`,
          codeTemplate: `# Student profile in Python
# 1. Create a variable named 'student_name' and set it to "Alex".
# 2. Create an integer variable 'xp_points' and set it to 150.
# 3. Increase xp_points by 50.

student_name = "Alex"
xp_points = 150

# WRITE YOUR EXTRA CODE TO INCREASE XP HERE


print(f"Student: {student_name} has {xp_points} XP")`,
          challengeInstructions: "Add 50 to xp_points (xp_points = xp_points + 50) so that the printed output reports exactly 200 XP.",
          solutionCriteria: "Modify xp_points resulting in xp_points equaling 200.",
          sampleAnswer: `student_name = "Alex"
xp_points = 150
xp_points += 50
print(f"Student: {student_name} has {xp_points} XP")`
        }
      },
      {
        id: "py-mod-2",
        title: "Python Lists & Indexing",
        description: "Learn how to pack elements into simple sequential lists, and retrieve them via offsets.",
        estimatedHours: 1.5,
        keyConcepts: ["Lists declaration", "0-based Indexing", "Appending elements"],
        lesson: {
          lessonTitle: "Lists & Manipulations",
          content: `A list is an ordered group of items, declared using square brackets \`[]\`.
In Python, index counting starts at \`0\` for the first element, \`1\` for the second, and so on.

\`\`\`python
languages = ["Python", "JS", "C++"]
print(languages[0]) # Prints "Python"
languages.append("Go") # Adds "Go" to the end
\`\`\`

Let's modify a list and retrieve elements by indices!`,
          codeTemplate: `# Coding list manager
skills = ["HTML", "CSS"]

# 1. Append the string "Python" to the 'skills' list.
# 2. Access the first element (index 0) and assign it to a variable 'first_skill'.

# WRITE YOUR CODE BELOW THIS LINE


print(f"My skills list: {skills}")
print(f"My core skill is: {first_skill}")`,
          challengeInstructions: "Use skills.append('Python') and extract skills[0] into first_skill. Final print should contain core skill: HTML.",
          solutionCriteria: "Append 'Python' to list skills, and extract index 0 into first_skill.",
          sampleAnswer: `skills = ["HTML", "CSS"]
skills.append("Python")
first_skill = skills[0]
print(f"My skills list: {skills}")
print(f"My core skill is: {first_skill}")`
        }
      }
    ]
  },
  "HTML_CSS": {
    language: "HTML_CSS",
    level: "Beginner",
    summary: "HTML is the backbone skeleton of every website, and CSS is the paintbrush that brings it to life. This starter course will teach you standard web styling structures.",
    modules: [
      {
        id: "html-mod-1",
        title: "HTML Tags and Document Structure",
        description: "Understand nested tags, elements, headings, paragraphs, and standard skeletal layouts.",
        estimatedHours: 1,
        keyConcepts: ["Tags (<h1>, <p>, <div>)", "Attributes (class, id)", "Nesting Elements"],
        lesson: {
          lessonTitle: "HTML Essentials",
          content: `HTML (HyperText Markup Language) uses markup tags to tell browsers how to display contents. 
A tag looks like \`<tagname>content</tagname>\`.

Common tags:
- \`<h1>\` to \`<h6>\`: Headings (1 is largest, 6 is smallest).
- \`<p>\`: Standard text paragraphs.
- \`<button>\`: Clickable trigger controls.

Let's make a beautiful card markup element!`,
          codeTemplate: `<!-- Let's construct a small card markup! -->
<!-- Create a div container with class "card-wrapper" -->
<!-- Inside, place an h1 tag containing "My Project Card" and a p tag with "Learning is fun." -->

<div class="card-wrapper">
  <!-- WRITE YOUR MARKUP HERE -->
  
</div>`,
          challengeInstructions: "Inside the provided div container, add an <h1> tag with the exact text 'My Project Card' and a <p> tag with the text 'Learning is fun.'",
          solutionCriteria: "Correct nested headings and paragraphs containing the requested strings.",
          sampleAnswer: `<div class="card-wrapper">
  <h1>My Project Card</h1>
  <p>Learning is fun.</p>
</div>`
        }
      }
    ]
  },
  "Java": {
    language: "Java",
    level: "Beginner",
    summary: "Welcome to Java! This robust, object-oriented programming language runs on billions of devices. Perfect for building desktop apps, enterprise systems, and Android software.",
    modules: [
      {
        id: "java-mod-1",
        title: "Java Variables and Data Types",
        description: "Learn how to declare typed variables (int, double, String, boolean) in Java.",
        estimatedHours: 1.5,
        keyConcepts: ["Primitive Types", "Variable Declaration", "Type Safety"],
        lesson: {
          lessonTitle: "Strong Typing in Java",
          content: `In Java, every variable must have a declared data type. Java is strongly and statically typed, meaning variables are checked at compile time.
          
\`\`\`java
int score = 100;
double price = 19.99;
String studentName = "Sagar";
boolean isRegistered = true;
\`\`\``,
          codeTemplate: `// Let's create an integer tracking score!
public class Main {
    public static void main(String[] args) {
        // 1. Declare an integer variable named 'score' and assign it 150.
        // 2. Declare a String variable named 'student' and assign it "Sagar".
        
        // WRITE YOUR VARIABLES BELOW
        
        
        System.out.println(student + " has scored: " + score);
    }
}`,
          challengeInstructions: "Declare an 'int score = 150;' and a 'String student = \"Sagar\";'. Output must report exactly: 'Sagar has scored: 150'.",
          solutionCriteria: "Declare int score and String student with values 150 and Sagar.",
          sampleAnswer: `public class Main {
    public static void main(String[] args) {
        int score = 150;
        String student = "Sagar";
        System.out.println(student + " has scored: " + score);
    }
}`
        }
      }
    ]
  },
  "Cpp": {
    language: "Cpp",
    level: "Beginner",
    summary: "Welcome to C++! Renowned for high execution speeds and memory flexibility, C++ is the leading language for game engines, graphics, and operating systems.",
    modules: [
      {
        id: "cpp-mod-1",
        title: "C++ Basics and Output Streams",
        description: "Explore the structure of a C++ program and print to the console using std::cout.",
        estimatedHours: 1.5,
        keyConcepts: ["std::cout", "main function", "Output Insertion Operator <<"],
        lesson: {
          lessonTitle: "Printing to Console in C++",
          content: `C++ uses the standard library output stream \`std::cout\` and insertion operator \`<<\` to output values.

\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
\`\`\``,
          codeTemplate: `#include <iostream>

int main() {
    // 1. Print the string "Welcome to Codify" to standard output.
    // 2. Append standard end-line (std::endl) to flush the output.
    
    // WRITE YOUR PRINT STATEMENT BELOW
    
    
    return 0;
}`,
          challengeInstructions: "Add std::cout << 'Welcome to Codify' << std::endl; so the printed output is exactly 'Welcome to Codify'.",
          solutionCriteria: "Print 'Welcome to Codify' using std::cout.",
          sampleAnswer: `#include <iostream>

int main() {
    std::cout << "Welcome to Codify" << std::endl;
    return 0;
}`
        }
      }
    ]
  },
  "SQL": {
    language: "SQL",
    level: "Beginner",
    summary: "Welcome to SQL! Learn Structured Query Language (SQL) to search, filter, and modify massive relational databases efficiently.",
    modules: [
      {
        id: "sql-mod-1",
        title: "The SELECT Statement",
        description: "Retrieve specific columns and table rows from database records.",
        estimatedHours: 1,
        keyConcepts: ["SELECT column", "FROM table", "Wildcard *"],
        lesson: {
          lessonTitle: "Querying Databases",
          content: `The \`SELECT\` statement is used to fetch columns from a database table. Use \`*\` to fetch all columns.

\`\`\`sql
SELECT first_name, last_name
FROM students;
\`\`\``,
          codeTemplate: `-- Let's query our database!
-- 1. Fetch the 'name' and 'xp' columns
-- 2. Pull from the 'students' table

-- WRITE YOUR SQL QUERY BELOW`,
          challengeInstructions: "Write an SQL query to select columns 'name' and 'xp' from the 'students' table.",
          solutionCriteria: "SELECT name, xp FROM students",
          sampleAnswer: `SELECT name, xp FROM students;`
        }
      }
    ]
  }
};

export const CODING_CHALLENGES: Challenge[] = [
  {
    id: "ch-1",
    title: "Celsius to Fahrenheit Converter",
    language: "JavaScript",
    difficulty: "Easy",
    description: "Write a function 'convertToFahrenheit' that accepts a temperature in Celsius and returns its equivalent in Fahrenheit. The formula is: F = (C * 9/5) + 32.",
    starterCode: `function convertToFahrenheit(celsius) {
  // 1. Calculate the Fahrenheit equivalent
  // 2. Return the calculated value
  let fahrenheit;
  
  // WRITE YOUR FORMULA LOGIC HERE
  
  return fahrenheit;
}

// Example test case: convertToFahrenheit(30) should return 86
console.log(convertToFahrenheit(30));`,
    instructions: "Fill in the calculation formula. Multiply the celsius value by 9/5 and add 32. Assign this to 'fahrenheit' and return it.",
    solutionCriteria: "Function must correctly convert 30 to 86 and 0 to 32 using the standard formula.",
    xpReward: 25,
    sampleSolution: `function convertToFahrenheit(celsius) {
  let fahrenheit = (celsius * 9/5) + 32;
  return fahrenheit;
}
console.log(convertToFahrenheit(30));`
  },
  {
    id: "ch-2",
    title: "FizzBuzz Lite",
    language: "JavaScript",
    difficulty: "Medium",
    description: "Write a function 'fizzBuzz' that accepts a number. If the number is divisible by 3, return 'Fizz'. If it is divisible by 5, return 'Buzz'. If it is divisible by BOTH 3 and 5, return 'FizzBuzz'. Otherwise, return the number itself.",
    starterCode: `function fizzBuzz(num) {
  // Write conditional logic to test divisibility.
  // Tip: Use the modulo operator '%' to check if remainder is 0 (num % 3 === 0).
  
  // WRITE YOUR CODE HERE
  
}

console.log("test-15:", fizzBuzz(15));
console.log("test-9:", fizzBuzz(9));
console.log("test-10:", fizzBuzz(10));
console.log("test-7:", fizzBuzz(7));`,
    instructions: "Write the nested conditionals checking divisibility by 15 (or both 3 and 5), then 3, then 5. Ensure you return the exact string results ('FizzBuzz', 'Fizz', 'Buzz') or the number.",
    solutionCriteria: "fizzBuzz(15) -> 'FizzBuzz', fizzBuzz(9) -> 'Fizz', fizzBuzz(10) -> 'Buzz', fizzBuzz(7) -> 7.",
    xpReward: 40,
    sampleSolution: `function fizzBuzz(num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return "FizzBuzz";
  } else if (num % 3 === 0) {
    return "Fizz";
  } else if (num % 5 === 0) {
    return "Buzz";
  } else {
    return num;
  }
}
console.log("test-15:", fizzBuzz(15));`
  },
  {
    id: "ch-3",
    title: "Python List Positive Filter",
    language: "Python",
    difficulty: "Easy",
    description: "Write a Python function 'filter_positives(numbers)' that takes a list of numbers as input and returns a new list containing only positive numbers (numbers > 0).",
    starterCode: `def filter_positives(numbers):
    # 1. Initialize an empty list
    # 2. Iterate over 'numbers' using a loop
    # 3. If the number is positive (> 0), append it to your list
    # 4. Return the list
    positives = []
    
    # WRITE YOUR LOOP HERE
    
    return positives

print(filter_positives([-5, 3, 0, 12, -1]))`,
    instructions: "Write a 'for num in numbers:' loop, inspect if 'num > 0', and call 'positives.append(num)'. Ensure the list returned contains [3, 12] for the test case.",
    solutionCriteria: "Correct Python indentation, a working loop filtering out values <= 0, and returns only positive integers.",
    xpReward: 30,
    sampleSolution: `def filter_positives(numbers):
    positives = []
    for num in numbers:
        if num > 0:
            positives.append(num)
    return positives
print(filter_positives([-5, 3, 0, 12, -1]))`
  },
  {
    id: "ch-4",
    title: "String Reverser",
    language: "JavaScript",
    difficulty: "Easy",
    description: "Write a function 'reverseString' that accepts a string input and returns the string in reverse order (e.g. 'hello' becomes 'olleh').",
    starterCode: `function reverseString(str) {
  // Tip: You can split a string into an array, reverse the array, and join it back.
  // Or write a simple reverse for-loop.
  
  // WRITE YOUR REVERSED LOGIC HERE
  
}

console.log(reverseString("CodePathways"));`,
    instructions: "Convert the input string to reverse text. You can use JS split(''), reverse(), and join('') or a custom loop. 'CodePathways' should become 'syawhtaPedoC'.",
    solutionCriteria: "Returns reverse value of the string.",
    xpReward: 20,
    sampleSolution: `function reverseString(str) {
  return str.split('').reverse().join('');
}
console.log(reverseString("CodePathways"));`
  },
  {
    id: "ch-5",
    title: "Java Even or Odd Checker",
    language: "Java",
    difficulty: "Easy",
    description: "Implement a method 'checkEvenOdd' that takes an integer and returns 'Even' or 'Odd' depending on its value.",
    starterCode: `public class Main {
    public static String checkEvenOdd(int num) {
        // Write conditional statement using % 2 operator
        // RETURN "Even" or "Odd"
        
        // WRITE YOUR CODE HERE
        
    }
    
    public static void main(String[] args) {
        System.out.println(checkEvenOdd(4));
    }
}`,
    instructions: "Use standard 'if (num % 2 == 0) return \"Even\"; else return \"Odd\";' syntax inside the method.",
    solutionCriteria: "Returns 'Even' for 4 and 'Odd' for 3.",
    xpReward: 20,
    sampleSolution: `public class Main {
    public static String checkEvenOdd(int num) {
        if (num % 2 == 0) {
            return "Even";
        } else {
            return "Odd";
        }
    }
    public static void main(String[] args) {
        System.out.println(checkEvenOdd(4));
    }
}`
  },
  {
    id: "ch-6",
    title: "C++ Largest Number",
    language: "Cpp",
    difficulty: "Easy",
    description: "Write a function 'findMax(int a, int b)' that returns the larger of two integer values.",
    starterCode: `#include <iostream>

int findMax(int a, int b) {
    // 1. Compare a and b
    // 2. Return the larger one
    
    // WRITE YOUR LOGIC HERE
    
}

int main() {
    std::cout << findMax(15, 30) << std::endl;
    return 0;
}`,
    instructions: "Return 'a' if 'a > b', else return 'b'. Your program should print 30 for findMax(15, 30).",
    solutionCriteria: "Correctly identifies and returns the maximum integer.",
    xpReward: 25,
    sampleSolution: `#include <iostream>

int findMax(int a, int b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

int main() {
    std::cout << findMax(15, 30) << std::endl;
    return 0;
}`
  },
  {
    id: "ch-7",
    title: "SQL Count High Scorers",
    language: "SQL",
    difficulty: "Medium",
    description: "Write an SQL query to find how many students have more than 100 XP.",
    starterCode: `-- Count students with more than 100 XP
-- Tip: Use the COUNT(*) function and a WHERE clause

-- WRITE YOUR SQL CODE HERE`,
    instructions: "Write 'SELECT COUNT(*) FROM students WHERE xp > 100;'",
    solutionCriteria: "SELECT COUNT(*) FROM students WHERE xp > 100",
    xpReward: 35,
    sampleSolution: `SELECT COUNT(*) FROM students WHERE xp > 100;`
  }
];
