"use strict";

const _ = require('lodash');
const ts = require('./lib/tinyspeck.js');
const slack = ts.instance({});

slack.on('/parrot', payload => {
  const { user_id, response_url, channel_id } = payload;
  
  const list = payload.text.split(' ')
  const pairOptions = _.chain(list).shuffle().chunk(2).value();
  
  const pairsText = _.map(pairOptions, pair => {
    return pair[1] ? `*${_.capitalize(pair[0])}* pairs with *${_.capitalize(pair[1])}*` : `*${_.capitalize(pair[0])}* is unpaired`;
  });
  
  const message = { 
    "response_type": "in_channel", 
    channel: channel_id,
    text: `Creating pairs from:\n ${payload.text}`,
    attachments: [
      { text:  pairsText.join('\n'), "mrkdwn_in": ['text'] }
    ]
  };
  
  console.log("Received 'parrot' command", payload, pairOptions, pairsText, message);
  
  slack.send(response_url, message).then(res => {
    console.log("Response sent to slash command");
  }, error => {
    console.log("An error occurred when responding to slash command: " + error);
  });
});

slack.listen('3000');