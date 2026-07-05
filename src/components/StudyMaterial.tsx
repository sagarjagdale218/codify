import React, { useState } from "react";
import { 
  BookOpen, ChevronRight, Code, Copy, Check, Sparkles, 
  HelpCircle, Lightbulb, ExternalLink, GraduationCap, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudyMaterialProps {
  language: string;
}

interface Article {
  title: string;
  summary: string;
  content: string;
  codeSnippet?: string;
  proTip: string;
}

interface InterviewQ {
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const STUDY_DATA: Record<string, {
  cheatSheet: { category: string; syntax: string; desc: string }[];
  articles: Article[];
  interviewQuestions: InterviewQ[];
  gfgLink: string;
}> = {
  JavaScript: {
    gfgLink: "https://www.geeksforgeeks.org/javascript/",
    cheatSheet: [
      { category: "Variable Declarations", syntax: "const name = 'Sagar';\nlet age = 22;", desc: "const is block-scoped & read-only. let is block-scoped & re-assignable." },
      { category: "Arrow Function", syntax: "const greet = (name) => `Hello, ${name}`;", desc: "Shorthand function syntax with lexical 'this' binding." },
      { category: "Array Transformation", syntax: "const doubled = [1, 2, 3].map(x => x * 2);", desc: "Creates a new array by calling a function on every element." },
      { category: "Nullish Coalescing", syntax: "const score = scoreInput ?? 0;", desc: "Returns right-hand value if left-hand value is null or undefined." }
    ],
    articles: [
      {
        title: "Understanding Block Scope & Closures",
        summary: "Learn how JavaScript scopes variables using blocks and preserves surrounding state using Closures.",
        content: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned.",
        codeSnippet: `function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log('Outer Variable: ' + outerVariable);
    console.log('Inner Variable: ' + innerVariable);
  }
}
const newFunction = outerFunction('outside');
newFunction('inside'); // Still remembers 'outside'!`,
        proTip: "Use Closures to create private variables and emulate object-oriented data encapsulation in functional JavaScript."
      },
      {
        title: "Asynchronous JS: Promises & Async/Await",
        summary: "Master non-blocking concurrent operations with clean, modern synchronous-style syntax.",
        content: "JavaScript is single-threaded. Async operations are handed to the browser APIs. To resolve async operations, we use Promises. 'async/await' is syntactic sugar built on top of Promises to make async code look and behave like synchronous code.",
        codeSnippet: `async function fetchStudentProfile() {
  try {
    const response = await fetch('/api/profile');
    const data = await response.json();
    console.log("Success: ", data);
  } catch (error) {
    console.error("Failed to load: ", error);
  }
}`,
        proTip: "Always wrap async/await functions in try-catch blocks to prevent unhandled promise rejections that crash code."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between '==' and '==='?",
        answer: "'==' (loose equality) compares values after performing type coercion, which can lead to unexpected conversions. '===' (strict equality) compares both value and type without coercion.",
        difficulty: "Easy"
      },
      {
        question: "Explain hoisting in JavaScript.",
        answer: "Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their containing scope during compile-phase. Only declarations are hoisted, not assignments. 'let' and 'const' variables are hoisted but enter a 'Temporal Dead Zone' until initialized.",
        difficulty: "Medium"
      },
      {
        question: "What are Event Loops in JavaScript?",
        answer: "The Event Loop is a mechanisms that allows single-threaded JavaScript to perform non-blocking I/O operations. It continuously monitors the Call Stack and the Callback/Microtask Queues. When the stack is empty, it pushes the first task from the queue to the stack for execution.",
        difficulty: "Hard"
      }
    ]
  },
  Python: {
    gfgLink: "https://www.geeksforgeeks.org/python-programming-language/",
    cheatSheet: [
      { category: "List Comprehension", syntax: "squares = [x**2 for x in range(1, 6)]", desc: "Generates lists using compact single-line loop expressions." },
      { category: "Dictionary Access", syntax: "scores.get('Sagar', 0)", desc: "Safely reads dictionary keys without throwing KeyErrors if missing." },
      { category: "Unpacking Operators", syntax: "a, b = [10, 20]\nargs = [1, 2]\nadd(*args)", desc: "Assigns multiple variables at once or unpacks elements into parameters." },
      { category: "Lambda Functions", syntax: "multiply = lambda x, y: x * y", desc: "Declares compact, anonymous functions in a single expression line." }
    ],
    articles: [
      {
        title: "Pythonic List Comprehensions & Generator Expressions",
        summary: "Learn to write clean, memory-efficient iterations with compact pythonic syntaxes.",
        content: "List comprehensions offer a shorter syntax when you want to create a new list based on the values of an existing list. Generators are similar but use parentheses () instead of brackets [], calculating elements lazily on-the-fly to save massive system memory.",
        codeSnippet: `# Standard List Comprehension
names = ["sagar", "alex", "julianne"]
capitalized = [name.capitalize() for name in names if name.startswith("s")]
print(capitalized) # ['Sagar']

# Lazy Generator Expression
number_gen = (x * 2 for x in range(1000000))
print(next(number_gen)) # 0 (only calculates when requested)`,
        proTip: "Use list comprehensions for small lists where code readability is improved. For extremely large sets, prefer Generator expressions to keep RAM utilization near zero."
      },
      {
        title: "Object Oriented Programming in Python",
        summary: "Master Python classes, constructor variables, inheritance chains, and dunder methods.",
        content: "Python supports fully functional Object Oriented Programming. Every method inside a class must receive 'self' as its first parameter to refer to the current instance. Special dunder (double underscore) methods like __init__, __str__ handle object instantiation and string representations.",
        codeSnippet: `class Student:
    def __init__(self, name, xp):
        self.name = name
        self.xp = xp
        
    def __str__(self):
        return f"{self.name} (Level {self.xp // 100 + 1})"
        
sagar = Student("Sagar", 240)
print(sagar) # Prints: Sagar (Level 3)`,
        proTip: "Always invoke super().__init__() in a child class's constructor to initialize inherited base-class attributes correctly."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between list and tuple?",
        answer: "Lists are mutable (their values, size, and items can be modified in-place using append, pop, etc.). Tuples are immutable (once created, their contents cannot change). Tuples are also faster and more memory-efficient.",
        difficulty: "Easy"
      },
      {
        question: "Explain the purpose of '*args' and '**kwargs'.",
        answer: "'*args' allows a function to accept any number of positional arguments as a tuple. '**kwargs' allows the function to accept any number of keyword (named) arguments as a dictionary.",
        difficulty: "Medium"
      },
      {
        question: "How does Python handle memory management?",
        answer: "Python uses a private heap to manage memory. It utilizes reference counting (freeing memory immediately when references to an object drop to zero) backed by a cyclic Garbage Collector that detects and disposes of circular reference groups.",
        difficulty: "Hard"
      }
    ]
  },
  HTML_CSS: {
    gfgLink: "https://www.geeksforgeeks.org/html-tutorials/ and https://www.geeksforgeeks.org/css-tutorials/",
    cheatSheet: [
      { category: "Flexbox Container", syntax: "display: flex;\njustify-content: space-between;\nalign-items: center;", desc: "Positions elements in fluid rows or columns with proportional scaling rules." },
      { category: "CSS Grid Definition", syntax: "display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 16px;", desc: "Constructs rigid multi-dimensional layouts with specific responsive spans." },
      { category: "Mobile Media Queries", syntax: "@media (max-width: 768px) {\n  .sidebar { display: none; }\n}", desc: "Changes stylesheets based on viewport dimensions to ensure usability." },
      { category: "HTML Image tags", syntax: "<img src='url' alt='desc' referrerPolicy='no-referrer' />", desc: "Displays graphics with safe referrer parameter rules." }
    ],
    articles: [
      {
        title: "Mastering CSS Flexbox Alignments",
        summary: "Understand the differences between Main Axis and Cross Axis layouts for visual alignment.",
        content: "Flexbox aligns child elements along a single dimensional flow. The axis depends on 'flex-direction' (defaults to row). 'justify-content' aligns children along the main axis, while 'align-items' handles distribution along the perpendicular cross axis.",
        codeSnippet: `/* Fluid center alignment wrapper */
.flex-container {
  display: flex;
  flex-direction: row;       /* Main axis is horizontal */
  justify-content: center;   /* Centers children horizontally */
  align-items: center;       /* Centers children vertically */
  flex-wrap: wrap;           /* Allows wrapping on mobile viewports */
}`,
        proTip: "Use margin-left: auto on a single flex item to push it all the way to the far-right edge of its container, very handy for navigation headers!"
      },
      {
        title: "Understanding the CSS Box Model",
        summary: "Examine how Margin, Border, Padding, and Content interact to determine layout dimensions.",
        content: "Every visual element in HTML is represented as a rectangular box. By default (content-box), setting width refers only to the inner content. Padding and border expand the actual rendered width. Using box-sizing: border-box resolves this, forcing dimensions to contain padding and borders.",
        codeSnippet: `/* Best practice reset for all elements */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}`,
        proTip: "Always declare box-sizing: border-box in your global styles to avoid broken layouts and responsive calculation overflows!"
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between 'block', 'inline', and 'inline-block' display values?",
        answer: "'block' elements start on a new line and stretch to full container width (e.g. div, h1). 'inline' elements only occupy their exact content size and do not support height/width parameters (e.g. span, a). 'inline-block' remains in-line but fully respects width, height, and margins.",
        difficulty: "Easy"
      },
      {
        question: "Explain the CSS specificity hierarchy.",
        answer: "Specificity determines which CSS rules apply. Inline styles have the highest weight (1000), followed by ID selectors (100), Class/attribute selectors (10), and Element tags (1). The '!important' flag overrides all specificity, but should be used sparingly.",
        difficulty: "Medium"
      },
      {
        question: "Explain CSS BFC (Block Formatting Context).",
        answer: "A BFC is an independent layout region of a web page. Inside it, block boxes are laid out vertically. It prevents margins from collapsing across parent/child structures and prevents text from wrapping around adjacent floating elements. Created by setting overflow: hidden, display: flow-root, or flex/grid parameters.",
        difficulty: "Hard"
      }
    ]
  },
  Java: {
    gfgLink: "https://www.geeksforgeeks.org/java/",
    cheatSheet: [
      { category: "Main Class Boilerplate", syntax: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello\");\n  }\n}", desc: "The standard entry point where all Java applications start execution." },
      { category: "Array Declaration", syntax: "int[] scores = new int[5];\nArrayList<String> list = new ArrayList<>();", desc: "Static array declarations require fixed size. ArrayList represents dynamic size." },
      { category: "Getter and Setter", syntax: "public String getName() { return name; }\npublic void setName(String n) { this.name = n; }", desc: "Standard patterns for accessing and writing private class parameters safely." },
      { category: "Checked Exceptions", syntax: "try {\n  File f = new File(\"f.txt\");\n} catch (IOException e) {\n  System.err.println(e);\n}", desc: "Enforces robust compile-time exception catching for operations prone to failures." }
    ],
    articles: [
      {
        title: "The Four Pillars of Java OOP",
        summary: "Understand Abstraction, Encapsulation, Inheritance, and Polymorphism in Java.",
        content: "Java is fundamentally object-oriented. 1) Encapsulation: Hiding fields with private variables and public getters. 2) Inheritance: Sub-classing classes using 'extends'. 3) Polymorphism: Overloading/Overriding methods. 4) Abstraction: Creating general abstract models using 'interface' or 'abstract' keywords.",
        codeSnippet: `// Polymorphism and Inheritance Example
abstract class CodeLanguage {
    abstract void compile();
}

class JavaCompiler extends CodeLanguage {
    @Override
    void compile() {
        System.out.println("Java compiles to bytecode (.class)");
    }
}`,
        proTip: "Use interfaces instead of abstract classes when modeling pure behavioral signatures, as Java classes can implement multiple interfaces but only extend a single parent class."
      },
      {
        title: "Java Collections Framework Explained",
        summary: "Determine when to use Lists, Sets, or Maps to structure dynamic application state.",
        content: "Java offers a robust set of interfaces for collections. ArrayList handles ordered arrays with fast index access. HashSet structures unique unordered collections, filtering duplicate inputs instantly. HashMap maps unique keys to values for O(1) query performance.",
        codeSnippet: `import java.util.*;

HashMap<String, Integer> xpMap = new HashMap<>();
xpMap.put("Sagar", 450);
xpMap.put("Alex", 300);

if (xpMap.containsKey("Sagar")) {
    int points = xpMap.get("Sagar"); // Fast constant-time lookup
    System.out.println("Sagar has: " + points + " XP");
}`,
        proTip: "Always use key types that implement hashCode() and equals() properly (like String or Integer) when configuring Map keys."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between JDK, JRE, and JVM?",
        answer: "JVM (Java Virtual Machine) is the abstract machine that executes compiled bytecode. JRE (Java Runtime Environment) bundles JVM with standard libraries to RUN Java apps. JDK (Java Development Kit) includes JRE plus tools like javac (the compiler) to DEVELOP Java apps.",
        difficulty: "Easy"
      },
      {
        question: "What is the difference between equals() and '==' in Java?",
        answer: "'==' compares memory reference locations (addresses) in heap. 'equals()' is a method that evaluates whether the logical contents of two object values are identical (e.g. comparing String strings).",
        difficulty: "Medium"
      },
      {
        question: "Why is String immutable in Java?",
        answer: "Strings are immutable for security (parameters, paths, DB connections are often strings), thread-safety (multiple threads can read safely), and cache sharing (Java maintains a 'String Constant Pool' in memory, saving duplicate allocations).",
        difficulty: "Hard"
      }
    ]
  },
  Cpp: {
    gfgLink: "https://www.geeksforgeeks.org/cpp-programming-language/",
    cheatSheet: [
      { category: "Pointers and References", syntax: "int value = 42;\nint* ptr = &value;\nint& ref = value;", desc: "ptr holds the memory address of value. ref acts as a direct alias to the memory address." },
      { category: "STL Vector (Dynamic)", syntax: "#include <vector>\nstd::vector<int> numbers;\nnumbers.push_back(10);", desc: "Dynamic array from the Standard Template Library, handles automatic resizing." },
      { category: "Input and Output", syntax: "#include <iostream>\nstd::cout << \"Hello Codify\" << std::endl;\nstd::cin >> userValue;", desc: "Streams to print to standard output (stdout) or read inputs (stdin)." },
      { category: "Manual Constructor/Destructor", syntax: "class Node {\n  int* data;\n  Node() { data = new int[5]; }\n  ~Node() { delete[] data; }\n};", desc: "Constructors reserve dynamic heap allocations. Destructors must free them to prevent leaks." }
    ],
    articles: [
      {
        title: "Pointers, Memory Allocations & Deallocations",
        summary: "Understand standard memory structures (Stack vs Heap) and manual pointer management in C++.",
        content: "In C++, primitive parameters are stored on the Stack. Dynamic structures (created via the 'new' keyword) live in the Heap, which has no automatic garbage collection. Pointers represent variables storing raw hex coordinates of other variables. If not cleaned up manually using the 'delete' keyword, memory leaks result.",
        codeSnippet: `#include <iostream>

void demonstrateMemory() {
    int stackVar = 100; // Auto-managed memory
    int* heapVar = new int(200); // Dynamic heap allocation
    
    std::cout << "Stack value: " << stackVar << std::endl;
    std::cout << "Heap pointer address: " << heapVar << std::endl;
    std::cout << "Heap dereferenced value: " << *heapVar << std::endl;
    
    delete heapVar; // CRITICAL: Free dynamic heap allocation
    heapVar = nullptr; // Clear pointer address
}`,
        proTip: "Use Smart Pointers (std::unique_ptr, std::shared_ptr) from the memory header to automatically free heap resources when variable reference blocks go out of scope, bypassing manual deletes entirely!"
      },
      {
        title: "Mastering the Standard Template Library (STL)",
        summary: "Examine high-performance standard data engines (Vectors, Maps, and Pairs) built-in with C++.",
        content: "STL provides templated classes for algorithms, containers, and iterators. std::vector handles dynamic sizing; std::unordered_map maps keys using hash lists for swift lookups; std::set stores unique items and sorts them automatically using self-balancing binary search trees.",
        codeSnippet: `#include <iostream>
#include <vector>
#include <unordered_map>

int main() {
    // Unordered Hash Map
    std::unordered_map<std::string, int> xp_tracker;
    xp_tracker["Sagar"] = 550;
    
    std::cout << "Sagar's XP score: " << xp_tracker["Sagar"] << std::endl;
    return 0;
}`,
        proTip: "Avoid calling vector insertions (insert) in loops as they force expensive element shifting. Instead, prefer push_back() or emplace_back() for constant-time back-end Appends."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between C and C++?",
        answer: "C is a procedural programming language and does not natively support Object Oriented concepts. C++ is an extension of C that fully supports OOP (Classes, objects, inheritance, polymorphism, templates, standard exception handling) alongside procedural logic.",
        difficulty: "Easy"
      },
      {
        question: "Explain the difference between 'delete' and 'delete[]'.",
        answer: "'delete' is used to deallocate a single object initialized dynamically using 'new'. 'delete[]' is mandatory to deallocate arrays of objects initialized dynamically using 'new[]'.",
        difficulty: "Medium"
      },
      {
        question: "What are virtual functions and why are they used?",
        answer: "A virtual function is a member function declared in a base class that is redefined (overridden) in a derived class. They are used to enable Run-Time (Dynamic) Polymorphism, ensuring that the correct overridden function is invoked when referenced through base-class pointers.",
        difficulty: "Hard"
      }
    ]
  },
  SQL: {
    gfgLink: "https://www.geeksforgeeks.org/sql-tutorial/",
    cheatSheet: [
      { category: "SELECT with filter", syntax: "SELECT name, score\nFROM students\nWHERE score > 80\nORDER BY score DESC;", desc: "Retrieves specific columns, filters rows based on thresholds, and sorts results." },
      { category: "INNER JOIN Query", syntax: "SELECT s.name, p.roadmap_title\nFROM students s\nINNER JOIN paths p ON s.path_id = p.id;", desc: "Matches records from multiple tables by sharing foreign keys." },
      { category: "GROUP BY Aggregates", syntax: "SELECT country, COUNT(*), AVG(gpa)\nFROM applicants\nGROUP BY country\nHAVING COUNT(*) > 5;", desc: "Groups matching records to execute mathematical functions on groups." },
      { category: "INSERT Statement", syntax: "INSERT INTO classroom (name, xp)\nVALUES ('Sagar', 210);", desc: "Adds a new data record row containing specific column values inside a table." }
    ],
    articles: [
      {
        title: "Mastering Database Joins (Inner, Left, Right, Full)",
        summary: "Learn to query data across multiple relational table architectures utilizing specific joins.",
        content: "Relational databases avoid redundancy by storing distinct datasets across separate tables linked by keys. JOINs merge columns from these tables based on matching parameters: INNER JOIN (only matching keys in both), LEFT JOIN (all left rows, plus matching right), RIGHT JOIN (all right rows), and FULL JOIN (all rows from both).",
        codeSnippet: `-- Schema: students(id, name, path_id) | paths(id, track_name)
SELECT s.name AS student_name, p.track_name
FROM students s
LEFT JOIN paths p 
ON s.path_id = p.id; -- Ensures students are printed even if they haven't chosen a path yet`,
        proTip: "Specify short table aliases (e.g. 's' for 'students') in JOIN queries to increase query readability and prevent column-name ambiguities."
      },
      {
        title: "Relational Keys & Referential Integrity",
        summary: "Analyze the structures of Primary Keys, Foreign Keys, and Unique Constraint parameters.",
        content: "A Primary Key is a unique column (or set of columns) that uniquely identifies a row in a table. It cannot contain nulls. A Foreign Key is a column that references a Primary Key in another table, creating an inheritance reference chain. Referential integrity ensures that these references always point to valid data, preventing orphaned child rows.",
        codeSnippet: `CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);

CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY,
    student_name VARCHAR(100),
    course_id INT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);`,
        proTip: "Set up 'ON DELETE CASCADE' on foreign keys so that deleting a course automatically removes all its child enrollment records, preventing dead invalid references."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between WHERE and HAVING?",
        answer: "'WHERE' is used to filter individual table record rows before any aggregate groupings are performed. 'HAVING' is used to filter aggregated group results produced by GROUP BY statements.",
        difficulty: "Easy"
      },
      {
        question: "What are database Indexes and how do they work?",
        answer: "An Index is a performance-tuning data structure (often a B-Tree) created over database columns. It acts as a quick-lookup map, avoiding expensive full table scans and boosting search queries to O(log N) speeds, at the cost of slight write delays.",
        difficulty: "Medium"
      },
      {
        question: "Explain the Four ACID Properties in relational databases.",
        answer: "ACID properties guarantee safe transactions: 1) Atomicity: Complete success or complete rollback (All-or-Nothing). 2) Consistency: Data transitions strictly respect schema constraints. 3) Isolation: Concurrently executing transactions do not interfere with each other. 4) Durability: Completed writes survive server crashes.",
        difficulty: "Hard"
      }
    ]
  }
};

export default function StudyMaterial({ language }: StudyMaterialProps) {
  const [activeTab, setActiveTab] = useState<"cheatsheet" | "articles" | "interview" | "gfg">("cheatsheet");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedInterviewQ, setExpandedInterviewQ] = useState<number | null>(null);

  const langKey = STUDY_DATA[language] ? language : "JavaScript";
  const data = STUDY_DATA[langKey];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              GeeksforGeeks Study Corner
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-lg font-bold font-mono">
                {language === "HTML_CSS" ? "HTML & CSS" : language === "Cpp" ? "C++" : language} Reference
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Premium topic guides, fast-reference cheat sheets, and class interview preparation materials.
            </p>
          </div>
        </div>

        <a 
          href={data.gfgLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition shrink-0 cursor-pointer w-fit self-start sm:self-center"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Visit GeeksforGeeks Portal
        </a>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 border-b border-slate-100">
        {[
          { id: "cheatsheet", label: "Interactive Cheat Sheet", icon: Code },
          { id: "articles", label: "Core Concepts Articles", icon: BookOpen },
          { id: "interview", label: "GFG Interview Q&A Prep", icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/15" 
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {activeTab === "cheatsheet" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {data.cheatSheet.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="p-4 border-b border-slate-200/60 bg-white flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 font-sans flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleCopyCode(item.syntax, idx)}
                      className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition"
                      title="Copy code snippet"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <pre className="font-mono text-[11px] text-slate-800 bg-slate-900 text-white p-3.5 rounded-xl overflow-x-auto leading-normal whitespace-pre">
                      {item.syntax}
                    </pre>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans pl-1.5 border-l-2 border-emerald-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "articles" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="space-y-6"
            >
              {data.articles.map((art, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium font-sans">
                      {art.summary}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    {art.content}
                  </div>

                  {art.codeSnippet && (
                    <div className="relative group">
                      <pre className="font-mono text-[11px] text-slate-100 bg-slate-900 p-4 rounded-2xl overflow-x-auto leading-normal">
                        {art.codeSnippet}
                      </pre>
                      <button
                        onClick={() => handleCopyCode(art.codeSnippet!, idx + 100)}
                        className="absolute top-3.5 right-3.5 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition opacity-100 md:opacity-0 group-hover:opacity-100"
                        title="Copy code block"
                      >
                        {copiedIndex === idx + 100 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  <div className="bg-emerald-50/70 border border-emerald-100/80 rounded-2xl p-4 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-emerald-600 fill-emerald-500/10 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 font-sans leading-relaxed">
                      <span className="font-extrabold text-emerald-800 uppercase tracking-wider text-[10px] block mb-0.5">GeeksforGeeks Pro Tip</span>
                      {art.proTip}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "interview" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="space-y-3"
            >
              {data.interviewQuestions.map((q, idx) => {
                const isExpanded = expandedInterviewQ === idx;
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedInterviewQ(isExpanded ? null : idx)}
                      className="w-full p-4 text-left font-sans flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : q.difficulty === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Q{idx + 1} Interview Practice</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight leading-snug">
                          {q.question}
                        </h4>
                      </div>
                      <span className="text-slate-400 font-mono text-xs font-bold">
                        {isExpanded ? "Collapse ▲" : "Reveal Answer ▼"}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-600 leading-relaxed font-sans"
                        >
                          <div className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            Model Answer Explanation
                          </div>
                          {q.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
