import boto3, json, time, decimal
from traceback import format_exc
from boto3.dynamodb.conditions import Key, Attr


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)


def handle_post(table, params):
    table.put_item(
        Item={
            'channel': params['channel'],
            'timestamp': round(time.time() * 1000),
            'message': params['message'],
            'user': params['user']
        }
    )

def handle_get(table, params):
    response = table.query(
        KeyConditionExpression=Key('channel').eq(params['channel']) & Key('timestamp').gt(int(params['timestamp']))
    )
    items = response['Items']
    return items


def serialize(body):
    if body is None:
        return ''
    if isinstance(body, str):
        return body
    return json.dumps(body, cls=DecimalEncoder)

def handle_http(event):
    method = event['httpMethod']
    headers = {
        'Access-Control-Allow-Origin': 'http://piksr-chat.s3-website.eu-central-1.amazonaws.com',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    body = ''
    table = boto3.resource('dynamodb').Table('messages')
    try:
        if method == 'POST':
            body = handle_post(table, json.loads(event['body']))
        elif method == 'GET':
            body = handle_get(table, event['queryStringParameters'])
    except BaseException as e:
        code = 500
        body = {
            'exception': str(type(e)),
            'message': str(e),
            'stacktrace': format_exc()
        }
    else:
        code = 200

    return {
        'statusCode': code,
        'headers': headers,
        'isBase64Encoded': False,
        'body': serialize(body)
    }

def lambda_handler(event, context):
    #dynamodb = boto3.resource('dynamodb')
    #table = dynamodb.Table('table_1')
    
    if 'httpMethod' in event:
        return handle_http(event)
    
