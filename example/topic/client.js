const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connect) => {
  connect.createChannel((err1, channel) => {
    const q = 'topic';
    const msg = 'huhu';

    channel.assertQueue(q, { durable: false }, () => {
      channel.sendToQueue(q, new Buffer(msg));

      console.log(`Sent %s`, msg);

      channel.close(() => connect.close());
    });
  });
});
