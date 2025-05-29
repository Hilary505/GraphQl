import { generateXPLineGraph } from './xp.js';
import { renderSkillBars } from './skills.js';
import { createProjectCardsSummary } from './results.js';


export const initializeDashboard = (data) => {
  console.log(data)
  if (!data || !data.data || !data.data.user || data.data.user.length === 0) {
    console.error("Invalid data structure received:", data);
    document.body.innerHTML = `
      <div class="flex h-screen items-center justify-center">
        <div class="bg-white p-8 rounded-xl shadow-md">
          <h2 class="text-xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p>Could not load user data. Please try logging in again.</p>
          <button onclick="window.location.href='index.html'" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Return to Login
          </button>
        </div>
      </div>
    `;
    return;
  }
  const user = data.data.user[0];
  // Get project data from the response
  const totalXP = user.totalXP || [];
  const goProjects = data.data.goItems || [];
  const jsProjects = data.data.jsItems || [];
  const rustProjects = data.data.rustItems || [];
  
  // Get the current level from transactions
  const currentLevel = user.level && user.level[0] ? user.level[0].amount : 0;
  
  const completedProjectNames = new Set(
    totalXP.map(entry => entry.object?.name).filter(name => typeof name === 'string')
  );
  
  const countCompletedProjects = (projectList) =>
    projectList.filter(project => completedProjectNames.has(project.name)).length;
  
  const goCompleted = countCompletedProjects(goProjects);
  const jsCompleted = countCompletedProjects(jsProjects);
  const rustCompleted = countCompletedProjects(rustProjects);

  const skillTypes = user.skillTypes;
  let chart = renderSkillBars(skillTypes, true);
  const xpHistory = user.xpHistory;
  let svg = generateXPLineGraph(xpHistory);
  
  // Calculate total XP from history
const totalXPFromHistory = xpHistory.reduce((sum, entry) => sum + entry.amount, 0);
const totalXPMB = (totalXPFromHistory / 1_000_000).toFixed(2);

// Create XP History card
const xpCard = `
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-sm text-gray-500">Total XP (MB)</p>
        <p class="text-2xl font-bold">${totalXPMB}</p>
      </div>
      <div class="bg-purple-100 p-3 rounded-full">
        <i class="fas fa-chart-line text-purple-600"></i>
      </div>
    </div>
  </div>
`;

  // Create audit ratio card
  const auditRatioCard = `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Audit Ratio</p>
          <p class="text-2xl font-bold">${user.auditRatio.toFixed(1)}</p>
        </div>
        <div class="bg-blue-100 p-3 rounded-full">
          <i class="fas fa-balance-scale text-blue-600"></i>
        </div>
      </div>
    </div>
  `;
  
  // Create level card with the level from transactions
  const levelCard = `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Current Level</p>
          <p class="text-2xl font-bold">${currentLevel}</p>
        </div>
        <div class="bg-green-100 p-3 rounded-full">
          <i class="fas fa-level-up-alt text-green-600"></i>
        </div>
      </div>
    </div>
  `;
  
  document.body.innerHTML = `
    <div class="flex h-screen w-full overflow-hidden bg-gray-50">
      <!-- Expanded Blue Sidebar -->
      <div class="sidebar bg-blue-700 w-64 flex-shrink-0 shadow-lg flex flex-col">
        <div class="p-6 mb-4">
          <h1 class="text-white text-2xl font-bold flex items-center">
            <i class="fas fa-graduation-cap mr-3"></i>
            <span>LearnDash</span>
          </h1>
          <!-- User profile moved below logo -->
          <div class="flex items-center mt-6">
            <div class="relative mr-3">
              <img src="static/image/user.png" 
                   class="w-10 h-10 rounded-full object-cover border-2 border-blue-500">
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-700"></span>
            </div>
            <div>
              <p class="text-white font-medium">${user.login || 'User'}</p>
              <p class="text-xs text-blue-200">${user.campus || 'Campus'}</p>
            </div>
          </div>
        </div>
        
        <!-- Sidebar navigation -->
        <nav class="flex-1 px-4 space-y-2">
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-home text-lg w-6 mr-3 text-center"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-book text-lg w-6 mr-3 text-center"></i>
            <span>Modules</span>
          </a>
          <!-- Added Projects to sidebar navigation -->
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-project-diagram text-lg w-6 mr-3 text-center"></i>
            <span>Projects</span>
          </a>
        </nav>
        
        <!-- Logout button at bottom of sidebar -->
        <div class="p-4 border-t border-blue-600">
          <button class="logout-button w-full flex items-center justify-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-sign-out-alt mr-2"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <header class="bg-white shadow-sm sticky top-0 z-10">
          <div class="flex items-center justify-between px-8 py-4">
            <!-- Search or other left side content can go here -->
            <div></div>
            
            <!-- Right side icons - notification bell moved here -->
            <div class="flex items-center space-x-6">
              <button id="theme-toggle" class="p-2 text-gray-500 hover:text-blue-600 focus:outline-none">
                <i class="fas fa-moon text-xl"></i>
              </button>
              <button class="relative p-2 text-gray-500 hover:text-blue-600 focus:outline-none">
                <i class="far fa-bell text-xl"></i>
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button class="p-2 text-gray-500 hover:text-blue-600 focus:outline-none">
                <i class="fas fa-question-circle text-xl"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- Main content with proper spacing -->
        <main class="p-8 space-y-8 max-w-7xl mx-auto">
          <!-- Welcome banner -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-md p-6 text-white">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-2xl font-bold mb-1">Welcome back, ${user.firstName || ''} ${user.lastName || ''}!</h2>
              </div>
              <button class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                View Notifications
              </button>
            </div>
          </div>

          <!-- Piscine Cards at the top - removed hover effect -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <!-- Piscine Go -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex flex-col items-center">
                <h3 class="font-bold text-center">Piscine Go</h3>
              </div>
            </div>
            
            <!-- Module -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex flex-col items-center">
                <h3 class="font-bold text-center">Module</h3>
              </div>
            </div>

            <!-- Piscine JS -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex flex-col items-center">
                <h3 class="font-bold text-center">Piscine JS</h3>
              </div>
            </div>
            
            <!-- Piscine Rust -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex flex-col items-center">
                <h3 class="font-bold text-center">Piscine Rust</h3>
              </div>
            </div>
            
            <!-- Piscine UX -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex flex-col items-center">
                <h3 class="font-bold text-center">Piscine UX</h3>
              </div>
            </div>
          </div>

          <!-- Project Cards Section -->
          <div>
            <h2 class="text-xl font-bold mb-4">Your Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${createProjectCardsSummary(goCompleted, goProjects.length, 'Go Projects')}
              ${createProjectCardsSummary(jsCompleted, jsProjects.length, 'JavaScript Projects')}
              ${createProjectCardsSummary(rustCompleted, rustProjects.length, 'Rust Projects')}
            </div>
          </div>

          <!-- Stats Cards - removed hover effect -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="transactions-container">
            ${auditRatioCard}
            ${levelCard}
            ${xpCard}
          </div>

          <!-- Skills and XP Progression in a two-column layout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Skills card -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Skills</h3>
              </div>
              <div class="space-y-8" id="skills-container">
                ${chart}
              </div>
            </div>
            
            <!-- XP Progression -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">XP Progression</h3>
              </div>
              <div class="chart-container" style="height: 300px;">
                ${svg}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
  
  // Add event listeners
  addEventListeners();

  renderSkillBars(skillTypes);
};

const addEventListeners = () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.logout-button')) {
      e.preventDefault();
      localStorage.removeItem('jwt');
      window.location.href = 'index.html';
    }
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    
    // Update icon
    themeIcon.classList.toggle('fa-moon', !isDark);
    themeIcon.classList.toggle('fa-sun', isDark);
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
};