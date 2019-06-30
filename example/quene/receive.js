const amq = require('amqplib/callback_api');

amq.connect('amqp://localhost', (err, connect) => {
  if (err) throw err;

  const quene = 'task_quene';
  connect.createChannel((err1, channel) => {
    if (err1) throw err1;

    channel.assertQueue(quene, {
      durable: true,
    });

    channel.consume(
      quene,
      msg => {
        const {content} = msg;
        var secs = content.toString().split('.').length - 1;

        console.log(' [x] Received %s', content.toString());
        setTimeout(function() {
          console.log(' [x] Done');
        }, secs * 1000);
      },
      {
        noAck: false,
      }
    );
  });
});
