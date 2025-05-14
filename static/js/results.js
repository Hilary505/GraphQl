export const createProjectCardsSummary = (completed, total, title) => {
    return `
      <div class="bg-white rounded-xl shadow-sm p-6 text-center">
        <h3 class="font-bold mb-2">${title}</h3>
        <p class="text-gray-700 text-sm">
          ${completed} / ${total} projects completed
        </p>
      </div>
    `;
  };
  