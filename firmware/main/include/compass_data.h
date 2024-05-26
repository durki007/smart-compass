
#ifndef SMART_COMPASS_COMPASS_DATA_H
#define SMART_COMPASS_COMPASS_DATA_H

#include <stdint-gcc.h>
#include <freertos/semphr.h>

#define COMPASS_PATH_MAX_LENGTH 100
#define COMPASS_PATH_SIZE sizeof (compass_path_t)

typedef struct {
    float lat;
    float lon;
} compass_path_node_t;

typedef struct {
    uint32_t length;
    compass_path_node_t nodes[COMPASS_PATH_MAX_LENGTH];
} compass_path_t;

typedef compass_path_node_t compass_position_t;
typedef uint16_t compass_bearing_t;

typedef struct {
    SemaphoreHandle_t mutex;
    compass_position_t position;
    float bearing; // in radians
    float bearing_deg; // in degrees
    compass_path_t path;
    bool position_updated;
} compass_data_t;

typedef struct {
    SemaphoreHandle_t mutex;
    // Angle in 0.1 degrees - between 0 and 3600
    int16_t angle;
    // Next waypoint id
    uint16_t next_wp;
    // Distance to next waypoint in meters
    uint32_t distance;
    bool finished;
} display_data_t;

// Global variable, initialized in main.c
extern compass_data_t compass_data;
extern display_data_t display_data;

void log_compass_data();

#endif //SMART_COMPASS_COMPASS_DATA_H
