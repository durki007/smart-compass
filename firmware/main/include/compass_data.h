
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

typedef struct {
    SemaphoreHandle_t mutex;
    compass_position_t position;
    compass_path_t path;
} compass_data_t;

// Global variable, defined in main.c
extern compass_data_t compass_data;

#endif //SMART_COMPASS_COMPASS_DATA_H
