## Build JAR file with maven
FROM maven:3.6-openjdk-11 AS build

COPY  . /workspace/
WORKDIR /workspace/

RUN mvn clean install -DskipTests

#--------------

FROM openjdk:11-jre-slim
WORKDIR /workspace/

RUN rm -f /etc/localtime; ln -s /usr/share/zoneinfo/Asia/Jerusalem /etc/localtime

RUN echo "Asia/Jerusalem" > /etc/timezone

COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT exec java $JAVA_OPTS \
    -Djava.security.egd=file:/dev/./urandom \
    -jar /workspace/app.jar