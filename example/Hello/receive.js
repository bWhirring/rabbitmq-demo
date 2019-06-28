#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;
  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    var queue = 'quene';
    channel.assertQueue(queue, {
      durable: false
    });

    console.log(`waiting`, queue);

    channel.consume(
      queue,
      msg => {
        const { content } = msg;
        console.log(`receive msg ${content}`);
      },
      {
        noAck: true
      }
    );
  });
});
