### **Explanation:**

This readme file uses mermaid to display a flow chart.   if you want to see the flow chart add a mermaid renderer to your page from your extensions store.

 **What is a Promise?**

A promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It allows you to handle asynchronous operations in a more elegant and structured way, avoiding callback hell and providing a cleaner syntax for chaining asynchronous tasks.

    Below is a Mermaid diagram that visualizes the promise processing flow:
 ```mermaid
flowchart TD
    A[Promise Initialization] --> B[Set State to PENDING]
    B --> C{Executor Execution}
    C -->|Success| D[resolve Function]
    C -->|Failure| E[reject Function]

    D --> F[Set State to FULFILLED]
    F --> G{Has then?}
    G -->|Yes| H[Call then with Result]
    G -->|No| I[Do Nothing]

    E --> J[Set State to REJECTED]
    J --> K{Has catch?}
    K -->|Yes| L[Call catch with Error]
    K -->|No| M[Do Nothing]

    N[then Method] --> O{State is FULFILLED?}
    O -->|Yes| P[Call then with Result]
    O -->|No, State is PENDING| Q[Store then Callback]

    R[catch Method] --> S{State is REJECTED?}
    S -->|Yes| T[Call catch with Error]
    S -->|No, State is PENDING| U[Store catch Callback]
```
