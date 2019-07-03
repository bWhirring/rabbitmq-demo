const amqp = require('amqplib/callback_api');

const {basename} = require('path');

const severities = process.argv.slice(2);

if (severities.length < 1) {
  console.log(`Usage [info] [warning] [error]`, basename(process.argv[1]));

  process.exit(1);
}

function bail(err, conn) {
  console.error(err);
  if (conn) conn.close(() => process.exit(1));
}

function logMessage(msg) {
  console.log(`${msg.fields.routingKey}: ${msg.content.toString()}`);
}

amqp.connect('amqp://localhost', (err, connect) => {
  if (err) return bail(err);

  connect.createChannel((err1, channel) => {
    const ex = 'direct_logs';

    channel.assertExchange(ex, 'direct', {durable: false});

    channel.assertQueue('', {exclusive: true}, (err2, ok) => {
      let quene = ok.queue,
        i = 0;

      function sub(err) {
        if (err) {
          return bail(err, connect);
        } else if (i < severities.length) {
          channel.bindQueue(quene, ex, severities[i], {}, sub);
          i++;
        }
      }

      channel.consume(quene, logMessage, {noAck: true}, () => {
        console.log(`Waiting for logs`);
        sub(null);
      });
    });
  });
});
