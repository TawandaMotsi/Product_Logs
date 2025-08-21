# ---------- Build Stage ----------
FROM maven:3.9.3-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Copy everything (including pom.xml, modules, mvnw, src, etc)
COPY . .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Debug: check if MAVEN_CONFIG is set
RUN env | grep MAVEN || echo "No MAVEN env variables set"

# Unset MAVEN_CONFIG to avoid it being interpreted as a lifecycle phase
ENV MAVEN_CONFIG=""

# Download dependencies offline
RUN ./mvnw dependency:go-offline -B

# Build the entire project, skipping tests for speed
RUN ./mvnw clean package -DskipTests -B

# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar from the build stage (adjust if multiple jars/modules)
COPY --from=build /app/product/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
