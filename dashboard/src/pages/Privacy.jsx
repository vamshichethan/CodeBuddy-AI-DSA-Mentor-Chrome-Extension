const sections = [
  {
    title: 'What CodeBuddy Collects',
    body: [
      'When you use the Chrome extension on a LeetCode problem page, CodeBuddy may read the problem title, description, difficulty, selected programming language, current editor code, page URL, and timestamps needed to provide hints, debugging, pattern detection, dry runs, complexity analysis, notes, roadmap recommendations, and progress tracking.',
      'The extension also stores local preferences such as the backend API URL, dashboard URL, and hint progress for the current problem.'
    ]
  },
  {
    title: 'How Data Is Used',
    body: [
      'Problem context and code are sent to the CodeBuddy backend API only when you request an AI feature such as a hint, debug report, edge cases, complexity analysis, interview response, note, or code review.',
      'The backend uses Google Gemini to generate mentor-style responses. Progress data may be stored in MongoDB or a local fallback store to power the analytics dashboard and personalized roadmap.'
    ]
  },
  {
    title: 'What CodeBuddy Does Not Do',
    body: [
      'CodeBuddy does not sell personal data.',
      'CodeBuddy does not collect passwords, payment information, browsing history outside supported LeetCode problem pages, or unrelated website content.',
      'CodeBuddy does not automatically submit, modify, or execute your LeetCode solutions.'
    ]
  },
  {
    title: 'Third-Party Services',
    body: [
      'CodeBuddy uses Vercel for hosting, MongoDB for optional progress storage, and Google Gemini for AI responses. These services process request data only as needed to provide the product features.'
    ]
  },
  {
    title: 'Data Control',
    body: [
      'You can disable or remove the extension at any time from chrome://extensions.',
      'You can switch the extension to a local backend from the popup settings if you do not want to use the deployed API.',
      'For deletion requests or privacy questions, contact the project owner through the GitHub repository.'
    ]
  }
];

export default function Privacy() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="glass rounded-2xl p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-primary mb-3">Last updated: May 22, 2026</p>
        <h1 className="text-3xl font-bold text-white mb-4">CodeBuddy AI Privacy Policy</h1>
        <p className="text-gray-300 leading-7">
          CodeBuddy AI is a DSA mentor Chrome extension and dashboard. This policy explains what data is handled when
          you use the extension, backend API, and dashboard.
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.title} className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
          <div className="space-y-3">
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-gray-300 leading-7">{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
        <p className="text-gray-300 leading-7">
          GitHub: <a className="text-primary hover:underline" href="https://github.com/vamshichethan/CodeBuddy-AI-DSA-Mentor-Chrome-Extension" target="_blank" rel="noreferrer">vamshichethan/CodeBuddy-AI-DSA-Mentor-Chrome-Extension</a>
        </p>
      </section>
    </div>
  );
}
