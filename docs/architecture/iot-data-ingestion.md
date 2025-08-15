# IoT Data Ingestion Backend

## 1. Overview

The IoT Data Ingestion service is a critical component of the CoreChain Climate Network. It is responsible for receiving, validating, processing, and storing data from thousands of IoT devices in real-time. The service must be highly scalable, fault-tolerant, and secure to ensure data integrity.

## 2. Data Flow Architecture

```
                               +-------------------------+
                               |      AI Fraud           |
                               |      Detection          |
                               +-----------+-------------+
                                           ^
                                           |
+-----------+      +-------------+      +--+--------------+      +-----------------+      +-----------------+
| IoT       |----->| MQTT Broker |----->| Data Validation +----->| Data Processing |----->| Blockchain      |
| Devices   |      | (EMQX)      |      | & Enrichment    |      | Pipeline (Kafka)|      | Oracle          |
+-----------+      +-------------+      +-----------------+      +-----------------+      +-------+---------+
                                           |
                                           v
                               +-----------+-------------+
                               |      Data Storage       |
                               | (InfluxDB, PostgreSQL)  |
                               +-------------------------+
```

### Data Flow Steps:

1.  **Device Connection**: IoT devices establish a secure MQTT connection to the EMQX broker.
2.  **Data Ingestion**: Devices publish sensor data (e.g., CO2 levels, temperature) to specific MQTT topics.
3.  **Validation & Enrichment**: A microservice consumes the data, validates its integrity (signatures, checksums), and enriches it with metadata (e.g., device location, timestamp).
4.  **Fraud Detection**: The enriched data is sent to the AI Fraud Detection module for real-time analysis.
5.  **Processing Pipeline**: Validated data is published to a Kafka topic for asynchronous processing.
6.  **Data Storage**: Consumer services store the data in the appropriate database (InfluxDB for time-series, PostgreSQL for metadata).
7.  **Blockchain Oracle**: A dedicated service aggregates the data and submits it to the blockchain oracle for use in smart contracts.

## 3. Key Features

-   **High Throughput**: Designed to handle over 1 million messages per minute.
-   **Low Latency**: Sub-100ms processing time from ingestion to storage.
-   **Real-time Validation**: On-the-fly data integrity and signature checks.
-   **Scalability**: Horizontally scalable microservices using Kubernetes.
-   **Fault Tolerance**: Use of message queues (Kafka) and dead-letter queues to prevent data loss.
-   **Security**: End-to-end encryption with TLS and device-level authentication.

## 4. Technology Stack

-   **Message Broker**: EMQX (for MQTT)
-   **Processing Pipeline**: Apache Kafka
-   **Backend Language**: Go / Node.js (for high-concurrency microservices)
-   **Databases**:
    -   InfluxDB (Time-series data)
    -   PostgreSQL (Device metadata, user data)
    -   Redis (Caching, session management)
-   **Containerization**: Docker
-   **Orchestration**: Kubernetes

## 5. API Design

-   **Internal Communication**: gRPC for high-performance communication between microservices.
-   **External (Device-facing)**: MQTT protocol over a secure TCP connection.
