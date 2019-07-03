const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

const severity = args.length > 0 ? args[0] : 'info';

const message = args.slice(1).join(' ') || 'Hello World';

function bail(err, conn) {
  console.error(err);
  if (conn) conn.close(() => process.exit(1));
}

amqp.connect('amqp://localhost', (err, connect) => {
  if (err) return bail(err);

  const ex = 'direct_logs';

  connect.createChannel((err1, channel) => {
    if (err1) return bail(err1, connect);

    channel.assertExchange(
      ex,
      'direct',
      {
        durable: false,
      },
      () => {
        channel.publish(ex, severity, new Buffer(message));
        channel.close(() => connect.close());
      }
    );
  });
});
