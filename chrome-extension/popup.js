document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('exportBtn').addEventListener('click', () => {
    chrome.cookies.getAll({
      url: 'https://weread.qq.com',
      name: 'wr_*'
    }, (cookies) => {
      const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const resultDiv = document.getElementById('result');
      resultDiv.textContent = cookieStr;
      
      // Copy to clipboard
      navigator.clipboard.writeText(cookieStr)
        .then(() => {
          const btn = document.getElementById('exportBtn');
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = 'Export Cookies';
          }, 2000);
        })
        .catch(err => {
          resultDiv.textContent = `Error: ${err.message}`;
        });
    });
  });

  document.getElementById('apiBtn').addEventListener('click', () => {
    chrome.cookies.getAll({
      url: 'https://weread.qq.com',
      name: 'wr_*'
    }, async (cookies) => {
      const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const apiResultDiv = document.getElementById('apiResult');
      
      try {
        apiResultDiv.textContent = 'Calling API...';
        const response = await fetch('https://weread.qq.com/api/user/notebook', {
          headers: {
            'Cookie': cookieStr,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        
        const data = await response.json();
        apiResultDiv.textContent = `API Response: ${JSON.stringify(data, null, 2)}`;
      } catch (err) {
        apiResultDiv.textContent = `API Error: ${err.message}`;
      }
    });
  });
});
