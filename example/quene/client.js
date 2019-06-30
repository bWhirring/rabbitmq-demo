const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connect) => {
  if (err) throw err;

  const quene = 'task_quene';
  connect.createChannel((err1, channel) => {
    if (err1) throw err;

    channel.assertQueue(quene, {durable: true});

    const msg = 'hhu';
    channel.sendToQueue(quene, Buffer.from(msg));
  });
});
