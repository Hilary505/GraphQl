# GraphQl
* This project  uses GraphQL query  to fetch ones's own school data and display it on a UI. You will have to connect to the provided GraphQL endpoint .

## Features
* Login Page
  - Authenticate users via JWT obtained from a signin endpoint   using Basic Auth (username:password or email:password).
  - Handle invalid login attempts gracefully with error messages.
  - Support logout functionality.

* Profile Page
  - Includes a mandatory statistics section with at least two SVG-based graphs representing your achievements or journey.
    - Graph examples: XP over time, XP per project, audit ratios, pass/fail ratios on projects or Piscine exercises.

* Shows at least three selected pieces of information such as:
    - XP amount earned
    - Audit ratios
    - Basic user identification (e.g., username, email)
  
  ## Usage
  * Login using your username/email and password.
  * After successful authentication, your JWT is stored and used to fetch your data.
  * Navigate to your profile page where your school data is displayed in selected sections.
  * View the statistics section to analyze your progress through generated SVG graphs.
  * Logout when finished.

  ## Hosting
  * This projected can be accessed live on github pages where it has been hosted. 
    Acess it here: [github pages](https://hilary505.github.io/GraphQl/)
  
  ## Contributions
  * Fork the Repository
    - Click `Fork` on the GitHub to create your own copy of the project.
  * Clone and Set Up Locally
  ```bash
       $ git clone https://github.com/Hilary505/GraphQl.git
    ```
  * Work on Your Changes
    - Create a new branch for your changes:
  ```bash
       $ git checkout -b your-branch-name
    ```
  * Commit and Push
  ```bash
    $ git add .
    $ git commit -m "your message"
    $ git push origin your-branch-name
   ```
  * Open a pull Request(PR)
  - Go to your fork on GitHub
  - Click `Compare & pull request`
  - Write a clear PR description: what you changed and why.