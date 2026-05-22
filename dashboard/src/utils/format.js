// Format AI text responses into readable HTML
export function formatResponse(text) {
  return escapeHtml(String(text || ''))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-dark-700 text-primary px-1 rounded text-sm">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-300"><strong>$1.</strong> $2</li>')
    .replace(/❌/g, '<span class="text-red-400">❌</span>')
    .replace(/✅/g, '<span class="text-green-400">✅</span>')
    .replace(/⚠️/g, '<span class="text-yellow-400">⚠️</span>')
    .replace(/💡/g, '<span class="text-yellow-300">💡</span>')
    .replace(/🎯/g, '<span>🎯</span>')
    .replace(/📚/g, '<span>📚</span>')
    .replace(/\n\n/g, '</p><p class="mt-4">')
    .replace(/\n/g, '<br/>');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
