# ---------- Build Stage ----------
# Just acts as a placeholder to copy the locally built JAR
FROM eclipse-temurin:17-jre-jammy AS build

WORKDIR /app

# Copy the locally built JAR from the product module
COPY product/target/*.jar app.jar

# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
