#!/bin/bash

sudo forever start --uid "jc" --append -l /opt/forever/logtail-citt -e /opt/forever/logtail-citt.e -o /opt/forever/logtail-citt.o cittserv-api/bin/www

sleep 3

gulp browser-sync &