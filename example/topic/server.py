import pika

connect = pika.BlockingConnection(pika.ConnectionParameters(
  host='localhost'
))

channel = connect.channel()

channel.queue_declare(queue='topic')

print('waiting for messages')

def callback(ch, method, properties, body):
  print ('Received %r' % body)

channel.basic_consume("topic", callback, consumer_tag="hello-consumer")

channel.start_consuming()

print('never print me')
