#!/bin/bash

pwd
ls -la
ls -la ~/
ls -la ~/.ssh

#tar -czvf botfair.tar.gz /dist
#scp botfair.tar.gz pi@botfair.redirectme.net:/home/pi/scp
#rsync -r botfair.tar.gz pi@botfair.redirectme.net:/home/pi/rsync
#rsync -r --delete-after --quiet botfair.tar.gz pi@botfair.redirectme.net:/home/pi

chmod 600 id_rsa
mv id_rsa ~/.ssh/
ssh -o "StrictHostKeyChecking no" pi@botfair.redirectme.net /home/pi/botfair.sh
