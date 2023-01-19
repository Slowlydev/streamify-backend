#!/bin/bash
# nest bootstrap script

# term environment
export TERM="xterm-color"

# set name
name=streamify

# set branch
branch="${1}"

# set app depending on branch
if [[ ${branch} == "main" ]]; then
  app=prod-nest
elif [[ ${branch} == "develop" ]]; then
  app=dev-nest
else
  echo "${blue}[${name}]${noColor} ${red}error${noColor}: invalid branch ${1}"
  exit 1
fi

# set colors
blue="$(tput setaf 4)"
cyan="$(tput setaf 6)"
green="$(tput setaf 2)"
red="$(tput setaf 1)"
noColor="$(tput sgr0)"

# exit if deployment is still running
if pidof -x "deployment.sh"; then
  echo "${blue}[${name}]${noColor} ${cyan}info${noColor}: deployment is still running"
  exit 0
fi

# quit existing screen session if there is one
if screen -list | grep -q "\.${app}"; then
  echo "${blue}[${name}]${noColor} ${cyan}info${noColor}: quitting existing screen session..."
  screen -S ${app} -X quit 1>/dev/null
fi

# start nest in screen
echo "${blue}[${name}]${noColor} ${cyan}info${noColor}: deploying ${app} app..."
screen -dmSL ${app} -Logfile "screen.log" yarn start:prod 1>/dev/null

# sleep for 2 seconds
sleep 2s

# user info
if screen -list | grep -q "\.${app}"; then
  echo "${blue}[${name}]${noColor} ${green}ok${noColor}: successfully deployed ${app} app"
  exit 0
else
  echo "${blue}[${name}]${noColor} ${red}error${noColor}: failed to deploy ${app} app"
  exit 1
fi
