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
  // Get project data from the responseconst totalXP = user.totalXP || [];
  const goProjects = data.data.goItems || [];
  const jsProjects = data.data.jsItems || [];
  const rustProjects = data.data.rustItems || [];
  
  
  const totalXP = user.totalXP || [];
  
  
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
  
  // Calculate XP in KB (assuming xp is in bytes)
  const xpKB = user.xp ? (user.xp / 1024).toFixed(2) : 0;
  
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
  
  // Create level card
  const levelCard = `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">Level</p>
          <p class="text-2xl font-bold">${user.level}</p>
        </div>
        <div class="bg-green-100 p-3 rounded-full">
          <i class="fas fa-level-up-alt text-green-600"></i>
        </div>
      </div>
    </div>
  `;
  
  // Create XP card (in KB)
  const xpCard = `
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500">XP (KB)</p>
          <p class="text-2xl font-bold">${xpKB}</p>
        </div>
        <div class="bg-purple-100 p-3 rounded-full">
          <i class="fas fa-star text-purple-600"></i>
        </div>
      </div>
    </div>
  `;
  
  document.body.innerHTML = `
    <div class="flex h-screen overflow-hidden bg-gray-50">
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
              <img src="${user.avatarUrl}" 
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
        <main class="p-8 space-y-8">
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
            
            <!-- Piscine UI -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex flex-col items-center">
                <h3 class="font-bold text-center">Piscine UI</h3>
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="transactions-container">
            ${auditRatioCard}
            ${levelCard}
            ${xpCard}
          </div>

          <!-- Skills card -->
          <div class="grid grid-cols-1 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex justify-between items-center mb-4">
                <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                 <h3 class="text-lg font-semibold">Skills</h3>
                </button>
              </div>
              <div class="space-y-8" id="skills-container">
                ${chart}
              </div>
            </div>
          </div>
          
          <!-- XP Progression at the end - removed hover effect -->
          <div class="grid grid-cols-1 gap-6">
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
};