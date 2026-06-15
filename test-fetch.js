const https = require('https');

https.get('https://sarkariresult.com.cm/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Data length:', data.length);
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
