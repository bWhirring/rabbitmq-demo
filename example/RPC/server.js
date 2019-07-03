const amqp = require('amqplib/callback_api');

function fib(n) {
  let a = 0,
    b = 1;
  for (let i = 0; i < n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return a;
}

amqp.connect('amqp://localhost', (err, connect) => {
  const quene = 'rpc_quene';

  connect.createChannel((err1, channel) => {
    channel.assertQueue(quene, { durable: false });

    channel.prefetch(1);

    function reply(msg) {
      const n = parseInt(msg.content.toString());
      console.log(`fib[%d]`, n);
      channel.sendToQueue(
        msg.properties.replyTo,
        new Buffer(fib(n).toString()),
        {
          correlationId: msg.properties.correlationId,
        }
      );
      channel.ack(msg);
    }

    channel.consume(quene, reply, { noAck: false }, () => {
      console.log(`Awaiting RPC requests`);
    });
  });
});
