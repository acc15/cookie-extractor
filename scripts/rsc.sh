#!/bin/sh
URL="ws://localhost:8080/rsocket"
DATA='[{"domain":"domain","name":"name","path":"path","value":"value","hostOnly":true,"httpOnly":true,"secure":true,"session":true,"storeId":"storeId","sameSite":"unspecified"}]'

rsc -w -r="cookie" --dmt='application/json' -d="${DATA}" "${URL}" 
