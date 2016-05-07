FROM node:latest

MAINTAINER whereuat.ninja: info@whereuat.ninja

#custom init.d to start up services
RUN mkdir -p /etc/my_init.d
ADD docker/node_scripts/my_init /sbin/my_init
RUN chmod +x /sbin/my_init

# Logs to sumologic
ADD https://collectors.sumologic.com/rest/download/deb/64 /tmp/collector.deb
#ADD sumo.conf /etc/sumo.conf # <-- done at runtime
ADD docker/config/node.sumologic.sources.json /etc/sources.json

# ensure that the collector gets started when you launch
ADD docker/node_scripts/start_sumo /etc/my_init.d/start_sumo
RUN chmod 755 /etc/my_init.d/start_sumo

RUN dpkg -i /tmp/collector.deb

COPY . /var/www
WORKDIR /var/www

RUN apt-get update

RUN npm install -g pm2@latest

RUN mkdir -p /var/log/pm2

EXPOSE 3000

# ensure that mongodb gets started when you launch
ADD docker/node_scripts/start_node /etc/my_init.d/start_node
RUN chmod 755 /etc/my_init.d/start_node

#ENTRYPOINT ["pm2", "start", "server.js", "--name", "whereuat-api", "--log", "/var/log/pm2/pm2.log", "--watch", "--no-daemon"]
CMD /sbin/my_init

# To Build:
# docker build -f .\docker\node.dockerfile -t whereuatninja/node-api .

# To Run:
# docker run -d -p 3000:3000 -e "WHEREUAT_API_APP_ENV=development" --name node-api whereuatninja/node-api