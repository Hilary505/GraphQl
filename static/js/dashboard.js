import { renderCharts } from './charts.js';

export const initializeDashboard = (data) => {
  // Check if data is valid
  console.log(data)
  if (!data || !data.data || !data.data.user || data.data.user.length === 0) {
    console.error("Invalid data received");
    return;
  }

  const user = data.data.user[0];
  
  // Update the HTML structure
  document.body.innerHTML = `
    <div class="flex h-screen overflow-hidden bg-gray-50">
      <!-- Expanded Blue Sidebar -->
      <div class="sidebar bg-blue-700 w-64 flex-shrink-0 shadow-lg flex flex-col">
        <div class="p-6 mb-4">
          <h1 class="text-white text-2xl font-bold flex items-center">
            <i class="fas fa-graduation-cap mr-3"></i>
            <span>LearnDash</span>
          </h1>
        </div>
        
        <!-- Sidebar navigation -->
        <nav class="flex-1 px-4 space-y-2">
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-home text-lg w-6 mr-3 text-center"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-chart-line text-lg w-6 mr-3 text-center"></i>
            <span>Statistics</span>
          </a>
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-tasks text-lg w-6 mr-3 text-center"></i>
            <span>Projects</span>
          </a>
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-book text-lg w-6 mr-3 text-center"></i>
            <span>Modules</span>
          </a>
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-users text-lg w-6 mr-3 text-center"></i>
            <span>Community</span>
          </a>
          <a href="#" class="flex items-center text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
            <i class="fas fa-cog text-lg w-6 mr-3 text-center"></i>
            <span>Settings</span>
          </a>
        </nav>
        
        <!-- User profile and logout -->
        <div class="p-4 border-t border-blue-600">
          <div class="flex items-center mb-4">
            <div class="relative mr-3">
              <img src="${user.avatar || 'https://via.placeholder.com/40'}" 
                   alt="User avatar" 
                   class="w-10 h-10 rounded-full object-cover border-2 border-blue-500">
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-700"></span>
            </div>
            <div>
              <p class="text-white font-medium">${user.name || 'User'}</p>
              <p class="text-xs text-blue-200">${user.campus || 'Unknown campus'}</p>
            </div>
          </div>
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
            <!-- Search bar -->
            <div class="flex-1 max-w-xl">
              <div class="relative">
                <input type="text" 
                       placeholder="Search courses, modules..." 
                       class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <div class="absolute left-3 top-2.5 text-gray-400">
                  <i class="fas fa-search"></i>
                </div>
              </div>
            </div>
            
            <!-- Right side icons -->
            <div class="flex items-center space-x-6">
              <button class="relative p-2 text-gray-500 hover:text-blue-600 focus:outline-none">
                <i class="far fa-bell text-xl"></i>
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button class="p-2 text-gray-500 hover:text-blue-600 focus:outline-none">
                <i class="far fa-envelope text-xl"></i>
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
                <h2 class="text-2xl font-bold mb-1">Welcome back, ${user.name || 'Student'}!</h2>
              </div>
              <button class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                View Notifications
              </button>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="stats-cards">
            <!-- Stats will be inserted here -->
          </div>

          <!-- Charts Row -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2 card-hover">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">XP Progression</h3>
                <select class="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                 <option>for the last week</option>
                  <option>for the last month</option>
                  <option>for the last 3 months</option>
                  <option>for the last 6 months</option>
                </select>
              </div>
              <div class="chart-container" style="height: 300px;">
                <canvas id="xpProgressionChart"></canvas>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 card-hover">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Skill Distribution</h3>
                <select class="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>By Level</option>
                  <option>By XP</option>
                  <option>By Projects</option>
                </select>
              </div>
              <div class="chart-container relative" style="height: 300px;">
                <canvas id="userDistributionChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Projects/Modules and Skills -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6 lg:col-span-2 card-hover">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Current Modules</h3>
                <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="text-left text-gray-500 text-sm border-b">
                      <th class="pb-3 font-medium">Module</th>
                      <th class="pb-3 font-medium">Status</th>
                      <th class="pb-3 font-medium">Grade</th>
                      <th class="pb-3 font-medium">Progress</th>
                    </tr>
                  </thead>
                  <tbody id="modules-table">
                    <!-- Modules will be inserted here -->
                  </tbody>
                </table>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 card-hover">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Top Skills</h3>
                <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
              <div class="space-y-4" id="skills-container">
                <!-- Skills will be inserted here -->
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  // Populate the dashboard with data
  populateStats(user);
  populateModules(user.modules);
  populateSkills(user.skills);
  renderCharts(user);

  // Add event listeners
  addEventListeners();
};

const populateStats = (user) => {
  const statsContainer = document.getElementById('stats-cards');
  
  const totalXp = user.totalXp?.aggregate?.sum?.amount || 0;
  const auditRatio = user.auditRatio?.ratio || 0;
  const level = Math.floor(totalXp / 1000);
  const projectsCompleted = user.projects?.length || 0;

  statsContainer.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition-all duration-300">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-gray-500 text-sm font-medium">Total XP</p>
          <h3 class="text-2xl font-bold mt-1">${totalXp.toLocaleString()}</h3>
          <p class="text-xs text-gray-400 mt-1">${(totalXp/1000).toFixed(1)}k points</p>
        </div>
        <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
          <i class="fas fa-bolt text-xl"></i>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition-all duration-300">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-gray-500 text-sm font-medium">Audit Ratio</p>
          <h3 class="text-2xl font-bold mt-1">${auditRatio.toFixed(1)}</h3>
          <p class="text-xs ${auditRatio >= 1 ? 'text-green-500' : 'text-yellow-500'} mt-1">
            ${auditRatio >= 1 ? 'Excellent' : 'Needs improvement'}
          </p>
        </div>
        <div class="p-3 bg-yellow-50 rounded-lg text-yellow-600">
          <i class="fas fa-balance-scale text-xl"></i>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition-all duration-300">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-gray-500 text-sm font-medium">Level</p>
          <h3 class="text-2xl font-bold mt-1">${level}</h3>
          <p class="text-xs text-gray-400 mt-1">${totalXp % 1000}/1000 to next</p>
        </div>
        <div class="p-3 bg-green-50 rounded-lg text-green-600">
          <i class="fas fa-level-up-alt text-xl"></i>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6 card-hover transition-all duration-300">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-gray-500 text-sm font-medium">Projects</p>
          <h3 class="text-2xl font-bold mt-1">${projectsCompleted}</h3>
          <p class="text-xs text-gray-400 mt-1">${projectsCompleted > 0 ? Math.floor(projectsCompleted/5) : 0} certifications</p>
        </div>
        <div class="p-3 bg-purple-50 rounded-lg text-purple-600">
          <i class="fas fa-project-diagram text-xl"></i>
        </div>
      </div>
    </div>
  `;
};

const populateModules = (modules) => {
  const modulesTable = document.getElementById('modules-table');
  
  if (!modules || modules.length === 0) {
    modulesTable.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">No modules found</td></tr>';
    return;
  }

  modulesTable.innerHTML = modules.slice(0, 5).map(module => `
    <tr class="border-b border-gray-100 hover:bg-gray-50">
      <td class="py-4 font-medium">${module.object?.name || 'Unknown'}</td>
      <td class="py-4">
        <span class="px-3 py-1 text-xs rounded-full ${
          module.status === 'Completed' ? 'bg-green-100 text-green-800' : 
          module.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }">
          ${module.status || 'Not Started'}
        </span>
      </td>
      <td class="py-4 font-medium">${module.grade || 0}%</td>
      <td class="py-4">
        <div class="flex items-center">
          <div class="w-24 mr-2">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full ${
                module.status === 'Completed' ? 'bg-green-600' : 
                module.status === 'In Progress' ? 'bg-blue-600' : 'bg-gray-400'
              }" style="width: ${module.progress || 0}%"></div>
            </div>
          </div>
          <span class="text-sm text-gray-500">${module.progress || 0}%</span>
        </div>
      </td>
    </tr>
  `).join('');
};

const populateSkills = (skills) => {
  const skillsContainer = document.getElementById('skills-container');
  
  if (!skills || skills.length === 0) {
    skillsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No skills found</p>';
    return;
  }

  // Calculate total XP for percentage calculation
  const totalXp = skills.reduce((sum, skill) => sum + (skill.amount || 0), 0);

  skillsContainer.innerHTML = skills.slice(0, 5).map(skill => `
    <div class="skill-tag">
      <div class="flex justify-between items-center mb-2">
        <span class="font-medium">${skill.type || 'Unknown'}</span>
        <span class="text-sm text-gray-500">Level ${Math.floor((skill.amount || 0) / 1000)}</span>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>${(skill.amount || 0).toLocaleString()} XP</span>
        <span>${totalXp > 0 ? Math.round(((skill.amount || 0) / totalXp) * 100) : 0}% of total</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" 
             style="width: ${Math.min(100, Math.floor((skill.amount || 0) / 1000) * 20)}%"></div>
      </div>
    </div>
  `).join('');
};

const addEventListeners = () => {
  // Add logout button event listener
  const logoutButton = document.querySelector('.logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
};