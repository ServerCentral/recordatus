# recordatus

![](https://user-images.githubusercontent.com/611996/46250926-2341cf80-c40b-11e8-8320-cceb947dd3d3.png)

recordatus listens with an endpoint `/log` that ingests logs/metrics from your web app and sends to a specified logstash instance.

## Configuration

`"logstashUrl": "http://logstash:9080"`

This is your logstash instance running something like the example pipeline configuration below.

`"listenPort": 3050`

This is the port recordatus listens on.

`"index": "logstash-%Y.%m.%d"`

This is the index recordatus will write data to. strftime format is supported.

`"type": "browser"`

This is the type of elastalert document that will be created. The \_type field on your record will be this value.

`"routeName": "/log"`

If you want to change the endpoint route name, you may do so here.

## Usage

### Docker

```
docker run -v ${PWD}/config.json:/home/node/app/config.json -it -p 3050:3050 servercentral/recordatus
```

Note the port in this invocation must match the listenPort in your config.

### Manual run

```
npm install
npm run start
```

recordatus should now be listening on the specified port, ready for browsers to send it data.

## API

`PUT /log`

Send a JSON _array of objects_ to this endpoint. The objects can be in any format you choose depending on your application. It will get sent to the the logstash index and type specified in the config.

## Example logstash configuration

This configuration on a fresh logstash install will send your data to the specified elasticsearch host.

```
input {
  http {
    port => 9080
    type => "%{type}"
  }
}

output {
  stdout {
    codec => rubydebug {
      metadata => true
    }
  }
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "%{index}"
  }
}
```

If you already have a logstash instance you will have to integrate these rules into your existing config, noting the %{type} and %{index} variables. If you do not include these variables in your logstash config, and instead enter your own values, recordatus will use those values instead.
