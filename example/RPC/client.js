const amqp = require('amqplib/callback_api');
const uuid = require('node-uuid');

let n;
try {
  if (process.argv.length < 3) throw new Error('Error');
  n = parseInt(process.argv[2]);
} catch (e) {
  console.error(e);
}

amqp.connect('amqp://localhost', (err, connect) => {
  connect.createChannel((err1, channel) => {
    var correlationId = uuid();

    channel.assertQueue('', { exclusive: true }, (err2, ok) => {
      const quene = ok.queue;
      channel.consume(
        quene,
        msg => {
          if (msg.properties.correlationId === correlationId) {
            console.log(`Got %d`, msg.content.toString());
          } else {
            console.log(`error`);
            channel.close(() => connect.close());
          }
        },
        { noAck: true }
      );
      console.log(`Requesting fib(%d)`, n);
      channel.sendToQueue('rpc_quene', new Buffer(n.toString()), {
        replyTo: quene,
        correlationId,
      });
      channel.close(() => connect.close());
    });
  });
});
