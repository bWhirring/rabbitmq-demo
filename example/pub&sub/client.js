const amqp = require('amqplib/callback_api');

function bail(err, conn) {
  console.error(err);
  if (conn) conn.close(() => process.exit(1));
}

amqp.connect('amqp://localhost', (err, connect) => {
  if (err) return bail(err);

  const ex = 'logs';

  connect.createChannel((err1, channel) => {
    if (err1) return bail(err1, channel);

    channel.assertExchange(ex, 'fanout', {
      durable: false,
    });

    const msg = process.argv.slice(2).join(' ') || 'info: Hello World';

    channel.publish(ex, '', new Buffer(msg));

    console.log(`[X] Sent ${msg}`);

    channel.close(() => connect.close());
  });
});
