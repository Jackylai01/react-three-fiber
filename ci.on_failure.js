const { WebClient } = require('@slack/web-api');
const { exec } = require('child_process');

exec('git show -s --pretty=medium HEAD', (err, stdout) => {
  const text = 'cdic-mascot-web failed 😭\n' + stdout;
  const web = new WebClient(process.env.SLACK_TOKEN);
  web.chat
    .postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text,
    })
    .then(() => console.log('Sent message'));
});
