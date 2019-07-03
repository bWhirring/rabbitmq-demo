const amqp = require('amqplib/callback_api');

function bail(err, conn) {
  console.error(err);
  if (conn) conn.close(() => process.exit(1));
}

amqp.connect('amqp://localhost', (err, connect) => {
  if (err) return bail(err);
  process.once('SIGINT', () => connect.close());

  const ex = 'logs';

  connect.createChannel((err1, channel) => {
    if (err1) return bail(err1, channel);

    channel.assertExchange(
      ex,
      'fanout',
      {
        durable: false,
      },
      err2 => {
        if (err2) return bail(err2, connect);

        channel.assertQueue('', {exclusive: true}, (err3, ok) => {
          if (err3) return bail(err3, connect);

          const quene = ok.queue;
          channel.bindQueue(quene, ex, '');
          channel.consume(
            quene,
            msg => {
              console.log(`[X] receive ${msg.content.toString()}`);
            },
            {noAck: true},
            err4 => {
              if (err4) return bail(err4, connect);
              console.log(`Waiting for logs`);
            }
          );
        });
      }
    );
  });
});
