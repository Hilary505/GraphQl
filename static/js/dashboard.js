import { generateXPLineGraph } from './xp.js';
import { renderSkillBars } from './skills.js';
import { createProjectCardsSummary } from './results.js';

// Global variables to store project data
let goProjects = [];
let jsProjects = [];
let rustProjects = [];
let completedProjectNames = new Set();

export const initializeDashboard = (data) => {

  const user = data.data.user[0];
  
  // Get project data from the response
  const totalXP = user.totalXP || [];
  goProjects = data.data.goItems || [];
  jsProjects = data.data.jsItems || [];
  rustProjects = data.data.rustItems || [];
  const audits = user.audits || [];
  
  // Get the current level from transactions - using the most recent level transaction
  const currentLevel = user.level?.length > 0 
    ? user.level.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      ).amount 
    : 0;
  
  // Create a set of completed project names from transactions with type "xp"
  completedProjectNames = new Set(
    totalXP
      .filter(entry => entry.type === "xp" && entry.object?.name)
      .map(entry => entry.object.name)
  );
  
  const countCompletedProjects = (projectList) =>
    projectList.filter(project => completedProjectNames.has(project.name)).length;
  
  const go = countCompletedProjects(goProjects);
  const js = countCompletedProjects(jsProjects);
  const rust = countCompletedProjects(rustProjects);

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
         <p class="text-2xl font-bold">${(user.auditRatio ?? 0).toFixed(1)}</p>
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
      <!-- Notifications Panel (Hidden by default) -->
      <div id="notifications-panel" class="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-50">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Notifications</h2>
            <button id="close-notifications" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="space-y-4">
            ${audits.map(audit => `
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold">${audit.object?.name || 'Unknown Project'}</h3>
                    <p class="text-sm text-gray-600">Audit Points: ${audit.amount}</p>
                    <p class="text-xs text-gray-500">${new Date(audit.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Audit</span>
                </div>
              </div>
            `).join('')}
            ${audits.length === 0 ? `
              <div class="text-center text-gray-500 py-4">
                No audit notifications available
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Expanded Blue Sidebar -->
<button id="sidebarToggle" class="md:hidden p-4 text-white bg-blue-700 fixed top-0 left-0 z-50">
  <i class="fas fa-bars"></i>
</button>

<!-- Sidebar -->
<div id="sidebar" class="sidebar bg-blue-700 w-64 fixed inset-y-0 left-0 transform -translate-x-full md:translate-x-0 md:relative z-40 transition-transform duration-300 ease-in-out flex-shrink-0 shadow-lg flex flex-col">
  <div class="p-6 mb-4">
    <h1 class="text-white text-2xl font-bold flex items-center">
      <i class="fas fa-graduation-cap mr-3"></i>
      <span>LearnDash</span>
    </h1>

    <!-- User Profile -->
    <div class="flex items-center mt-6">
      <div class="relative mr-3">
        <img src="static/image/user.png" class="w-10 h-10 rounded-full object-cover border-2 border-blue-500">
        <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-700"></span>
      </div>
      <div>
        <p class="text-white font-medium">${user.login || 'User'}</p>
        <p class="text-xs text-blue-200">${user.campus || 'Campus'}</p>
      </div>
    </div>
          <details class="mt-6 text-white">
  <summary class="text-sm font-semibold mb-2 cursor-pointer select-none">
    Attributes
  </summary>
  <ul class="text-sm text-blue-100 space-y-1 mt-2">
    ${user.attrs?.id ? `<li><span class="font-medium">ID:</span> ${user.attrs.id}</li>` : ''}
    ${user.attrs?.email ? `<li><span class="font-medium">Email:</span> ${user.attrs.email}</li>` : ''}
    ${user.attrs?.country ? `<li><span class="font-medium">Country:</span> ${user.attrs.country}</li>` : ''}
    ${user.attrs?.phone ? `<li><span class="font-medium">Phone:</span> ${user.attrs.phone}</li>` : ''}
    ${user.attrs?.gender ? `<li><span class="font-medium">Gender:</span> ${user.attrs.gender}</li>` : ''}
    ${user.attrs?.environment ? `<li><span class="font-medium">Environment:</span> ${user.attrs.environment}</li>` : ''}
  </ul>
  </details>
</div>

  <!-- Navigation Links -->
  <nav class="flex-1 px-4 space-y-2">
    <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
      <i class="fas fa-home text-lg w-6 mr-3 text-center"></i>
      <span>Dashboard</span>
    </a>
    <a href="#" id="projects-link" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
      <i class="fas fa-project-diagram text-lg w-6 mr-3 text-center"></i>
      <span>Projects</span>
    </a>
  </nav>

  <!-- Logout -->
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
        <button id="view-notifications" class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          View Notifications
        </button>
      </div>
    </div>

    <!-- Piscine Cards at the top -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <!-- Piscine Go -->
      <div class="piscine-card bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" data-piscine="go">
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
      <div class="piscine-card bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" data-piscine="js">
        <div class="flex flex-col items-center">
          <h3 class="font-bold text-center">Piscine JS</h3>
        </div>
      </div>
      
      <!-- Piscine Rust -->
      <div class="piscine-card bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" data-piscine="rust">
        <div class="flex flex-col items-center">
          <h3 class="font-bold text-center">Piscine Rust</h3>
        </div>
      </div>
      
      <!-- Piscine UX -->
      <div class="piscine-card bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" data-piscine="ux">
        <div class="flex flex-col items-center">
          <h3 class="font-bold text-center">Piscine UX</h3>
        </div>
      </div>
    </div>

    <!-- Project Cards Section -->
    <div id="projects-section">
      <h2 class="text-xl font-bold mb-4">Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${createProjectCardsSummary(go, goProjects.length, 'Go')}
        ${createProjectCardsSummary(js, jsProjects.length, 'JavaScript')}
        ${createProjectCardsSummary(rust, rustProjects.length, 'Rust')}
      </div>
    </div>

    <!-- Stats Cards - removed hover effect -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="transactions-container">
      ${auditRatioCard}
      ${levelCard}
      ${xpCard}
    </div>

    <!-- Skills and XP Progression in a two-column layout -->
    <div class="grid lg:grid-cols-2 gap-6 :lg:col-span-2 ">
      <!-- Skills card -->
      <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
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

  // Notifications panel functionality
  const notificationsPanel = document.getElementById('notifications-panel');
  const viewNotificationsBtn = document.getElementById('view-notifications');
  const closeNotificationsBtn = document.getElementById('close-notifications');

  viewNotificationsBtn?.addEventListener('click', () => {
    notificationsPanel.classList.remove('translate-x-full');
  });

  closeNotificationsBtn?.addEventListener('click', () => {
    notificationsPanel.classList.add('translate-x-full');
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('i');
  
  if (themeToggle && themeIcon) {
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
  }

  // Projects link click handler
  document.getElementById('projects-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showProjectsSection();
  });

  // Add click handlers for project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const language = card.dataset.language;
      showLanguageProjects(language);
    });
  });

  // Add click handlers for piscine cards
  document.querySelectorAll('.piscine-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const piscineType = card.dataset.piscine;
      showPiscineLevels(piscineType);
    });
  });
};

const showProjectsSection = () => {
  const projectsSection = document.getElementById('projects-section');
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Highlight the projects section temporarily
    const projectsHeading = projectsSection.querySelector('h2');
    if (projectsHeading) {
      projectsHeading.classList.add('text-blue-600', 'animate-pulse');
      setTimeout(() => {
        projectsHeading.classList.remove('text-blue-600', 'animate-pulse');
      }, 2000);
    }
  }
};

window.showLanguageProjects = (language) => {
  let projects;
  let title;
  
  switch(language.toLowerCase()) {
    case 'go':
      projects = goProjects;
      title = 'Go Projects';
      break;
    case 'javascript':
      projects = jsProjects;
      title = 'JavaScript Projects';
      break;
    case 'rust':
      projects = rustProjects;
      title = 'Rust Projects';
      break;
    default:
      return;
  }
  
  const completedCount = projects.filter(p => completedProjectNames.has(p.name)).length;
  
  const modalContent = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">${title}</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-sm text-gray-600">Completed: ${completedCount} of ${projects.length}</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div class="bg-blue-600 h-2.5 rounded-full" 
                 style="width: ${(completedCount / projects.length) * 100}%"></div>
          </div>
        </div>

        <div class="space-y-3">
          ${projects.map(project => `
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <span class="font-medium">${project.name}</span>
                ${project.difficulty ? `<span class="text-xs ml-2 px-2 py-1 rounded ${getDifficultyColor(project.difficulty)}">${project.difficulty}</span>` : ''}
              </div>
              <span class="text-sm ${completedProjectNames.has(project.name) ? 'text-green-600' : 'text-gray-500'}">
                ${completedProjectNames.has(project.name) ? 'Completed' : 'Not Started'}
              </span>
            </div>
          `).join('')}
        </div>

        <div class="flex justify-end mt-4">
          <button onclick="this.closest('.fixed').remove()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalContent;
  document.body.appendChild(modalContainer.firstElementChild);
};

// const getDifficultyColor = (difficulty) => {
//   const colors = {
//     'easy': 'bg-green-100 text-green-800',
//     'medium': 'bg-yellow-100 text-yellow-800',
//     'hard': 'bg-red-100 text-red-800'
//   };
//   return colors[difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800';
// };

// Helper functions for piscine calculations
const calculatePiscineLevel = (projects, totalXP) => {
  const piscineXP = calculatePiscineXP(projects, totalXP);
  // Simple level calculation: 1 level per 1000 XP
  return Math.floor(piscineXP / 1000) || 0;
};

const calculatePiscineXP = (projects, totalXP) => {
  return totalXP
    .filter(entry => entry.type === "xp" && entry.object?.name && 
      projects.some(project => project.name === entry.object.name))
    .reduce((sum, entry) => sum + entry.amount, 0);
};

const showPiscineLevels = (piscineType) => {
  let title;
  let projects;
  let totalXP = [];
  
  switch(piscineType.toLowerCase()) {
    case 'go':
      title = 'Piscine Go';
      projects = goProjects;
      totalXP = window.user?.totalXP || [];
      break;
    case 'js':
      title = 'Piscine JavaScript';
      projects = jsProjects;
      totalXP = window.user?.totalXP || [];
      break;
    case 'rust':
      title = 'Piscine Rust';
      projects = rustProjects;
      totalXP = window.user?.totalXP || [];
      break;
    case 'ux':
      title = 'Piscine UX';
      projects = []; // Add UX projects if available
      totalXP = window.user?.totalXP || [];
      break;
    default:
      return;
  }

  const piscineXP = calculatePiscineXP(projects, totalXP);
  const level = calculatePiscineLevel(projects, totalXP);
  const completedCount = projects.filter(p => completedProjectNames.has(p.name)).length;
  const totalProjects = projects.length;

  const modalContent = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">${title}</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Current Level</p>
            <p class="text-2xl font-bold">${level}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Total XP</p>
            <p class="text-2xl font-bold">${(piscineXP / 1000).toFixed(1)}k</p>
          </div>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600">Progress: ${completedCount} of ${totalProjects} projects completed</p>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div class="bg-blue-600 h-2.5 rounded-full" 
                 style="width: ${totalProjects ? (completedCount / totalProjects) * 100 : 0}%"></div>
          </div>
        </div>

        ${projects.length > 0 ? `
          <div class="space-y-3 max-h-60 overflow-y-auto">
            ${projects.map(project => `
              <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <span class="font-medium">${project.name}</span>
                  ${project.difficulty ? `<span class="text-xs ml-2 px-2 py-1 rounded ${getDifficultyColor(project.difficulty)}">${project.difficulty}</span>` : ''}
                </div>
                <span class="text-sm ${completedProjectNames.has(project.name) ? 'text-green-600' : 'text-gray-500'}">
                  ${completedProjectNames.has(project.name) ? 'Completed' : 'Not Started'}
                </span>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="text-center text-gray-500 py-4">
            No projects available for this piscine yet
          </div>
        `}

        <div class="flex justify-end mt-4">
          <button onclick="this.closest('.fixed').remove()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalContent;
  document.body.appendChild(modalContainer.firstElementChild);
};