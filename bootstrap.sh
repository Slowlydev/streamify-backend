#!/bin/bash
# nest bootstrap script

export TERM="xterm-color"
name="streamify-backend"

if screen -list | grep -q "\.${app}"; then
  echo "[${name}] info: quitting existing screen session..."
  screen -S "${app}" -X quit 1>/dev/null
fi

echo "[${name}] info: deploying ${app} app..."
screen -dmSL "${app}" -Logfile "screen.log" yarn start:prod 1>/dev/null

sleep 2s

if screen -list | grep -q "\.${app}"; then
  echo "[${name}] ok: successfully deployed ${app} app"
  exit 0
else
  echo "[${name}] error: failed to deploy ${app} app"
  exit 1
fi
