#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;
  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    var queue = 'quene';
    var msg = 'Hello World';

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));

    console.log(`send %s`, msg);
    channel.close(() => connection.close());
  });
});
