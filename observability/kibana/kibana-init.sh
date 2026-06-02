#!/bin/sh
set -eu

until curl -fsS http://kibana:5601/api/status >/dev/null; do
  sleep 2
done

if ! curl -fsS http://kibana:5601/api/data_views | grep -Fq "docker-logs-*"; then
  curl -fsS -X POST http://kibana:5601/api/data_views/data_view \
    -H "kbn-xsrf: true" \
    -H "Content-Type: application/json" \
    -d '{"data_view":{"title":"docker-logs-*","name":"Docker Logs","timeFieldName":"@timestamp"}}'
fi
