const fs = require('fs');
const path = require('path');
const userFlow = require('./userFlow');

const runAllUsers = async () => {
    //Amount of users to simulate
    const userCount = 100;
    const userTests = [];

    console.log(`\n🚀 Starting UI test for ${userCount} users...\n`);

    for (let i = 0; i < userCount; i++) {
        userTests.push(userFlow(i));
    }

    const results = await Promise.all(userTests);
    const html = generateHTMLReport(results);
    const reportPath = path.join(__dirname, 'report.html');

    fs.writeFileSync(reportPath, html, 'utf-8');
    console.log(`\n📄 HTML Report saved to ${reportPath}`);
};

function generateHTMLReport(results) {
  const successCount = results.filter(r => r.status === 'success').length;
  const failCount = results.length - successCount;

  const userLabels = results.map(r => `User ${r.userId}`);
  const durationData = results.map(r => r.durationMs);
  const statusColors = results.map(r =>
    r.status === 'success' ? '#2e7d32' : '#c62828' // Dark green / Red
  );

  const rows = results.map(result => `
    <tr class="${result.status}">
      <td>${result.userId}</td>
      <td>${result.status}</td>
      <td>${result.durationMs} ms</td>
      <td>${result.url}</td>
      <td>${result.timestamp}</td>
      <td>${result.error ? escapeHTML(result.error) : '-'}</td>
      <td>${result.actions ? result.actions.join('<br>') : '-'}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>UI Load Test Report</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #111;
      --primary: #1b5e20; /* Dark green */
      --success: #43a047;
      --fail: #e53935;
      --table-head: #f4f4f4;
    }

    body {
      font-family: 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 2rem;
      max-width: 1200px;
      margin: auto;
    }

    h1 {
      color: var(--primary);
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .summary {
      margin-bottom: 2rem;
      padding: 1rem;
      border-left: 4px solid var(--primary);
      background: #fdfdfd;
    }

    .summary p {
      margin: 0.3rem 0;
      font-size: 1rem;
    }

    canvas {
      margin: 2rem 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    th {
      background: var(--table-head);
      text-align: left;
      padding: 12px;
      border-bottom: 2px solid #ccc;
    }

    td {
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: top;
    }

    tr.success {
      background-color: #e8f5e9;
    }

    tr.fail {
      background-color: #ffebee;
    }

    tr:hover {
      background-color: #f1f8e9;
    }

    .status {
      font-weight: bold;
      text-transform: uppercase;
    }

    .status.success {
      color: var(--success);
    }

    .status.fail {
      color: var(--fail);
    }
  </style>
</head>
<body>
  <h1>🧪 UI Load Test Report</h1>

  <div class="summary">
    <p><strong>Total Users:</strong> ${results.length}</p>
    <p><strong>✅ Success:</strong> ${successCount}</p>
    <p><strong>❌ Failed:</strong> ${failCount}</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
  </div>

  <canvas id="pieChart"></canvas>
  <canvas id="barChart"></canvas>

  <table>
    <thead>
      <tr>
        <th>User ID</th>
        <th>Status</th>
        <th>Duration</th>
        <th>URL</th>
        <th>Timestamp</th>
        <th>Error</th>
        <th>Action Log</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: ['Success', 'Fail'],
        datasets: [{
          data: [${successCount}, ${failCount}],
          backgroundColor: ['#2e7d32', '#c62828']
        }]
      }
    });

    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(userLabels)},
        datasets: [{
          label: 'Duration (ms)',
          data: ${JSON.stringify(durationData)},
          backgroundColor: ${JSON.stringify(statusColors)}
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { maxRotation: 90, minRotation: 45 } },
          y: { beginAtZero: true }
        }
      }
    });
  </script>
</body>
</html>
`;
}



function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

runAllUsers();
