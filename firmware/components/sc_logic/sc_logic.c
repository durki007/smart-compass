#include <math.h>
#include <sys/cdefs.h>
#include "sc_logic.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include <freertos/task.h>
#include "compass_data.h"

// Defines
#define TAG "SC_LOGIC"
#define NODE_DETECTION_PRECISION_M 5

compass_data_t *compass_data_ptr;
display_data_t *display_data_ptr;

static float smooth_avg_buf[5];
static uint8_t smooth_avg_buf_idx = 0;

static void add_reading_to_avg_buf(float reading) {
    smooth_avg_buf[smooth_avg_buf_idx] = reading;
    smooth_avg_buf_idx = (smooth_avg_buf_idx + 1) % 5;
}

static float get_avg_reading() {
    float sum = 0;
    for (uint8_t i = 0; i < 5; i++) {
        sum += smooth_avg_buf[i];
    }
    return sum / 5;
}

static int16_t radian_to_degree(float angle) {
    float deg = (float) (angle * 180 / M_PI);
    while (deg < 0) {
        deg += 360;
    }
    while (deg > 360) {
        deg -= 360;
    }
    return (int16_t) (deg * 10);
}

static int16_t calculate_angle() {

    float curr_lon = (float) (compass_data_ptr->position.lon * M_PI / 180);
    float curr_lat = (float) (compass_data_ptr->position.lat * M_PI / 180);
    float goal_lon = (float) (compass_data_ptr->path.nodes[display_data_ptr->next_wp].lon * M_PI / 180);
    float goal_lat = (float) (compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat * M_PI / 180);

    float dLon = (goal_lon - curr_lon);

    float y = sinf(dLon) * cosf(goal_lat);
    float x = cosf(goal_lat) * sinf(goal_lat) - sinf(curr_lat)
                                                * cosf(goal_lat) * cosf(dLon);

    float angle_radians = atan2f(y, x);

    float bearing_radians = compass_data_ptr->bearing;
    add_reading_to_avg_buf(angle_radians - bearing_radians);
    return radian_to_degree(get_avg_reading());
}

static uint16_t calculate_next_wp() {
    if (display_data_ptr->distance > NODE_DETECTION_PRECISION_M) {
        return display_data_ptr->next_wp;
    }
    if (display_data_ptr->next_wp + 1 >= compass_data_ptr->path.length) {
        return display_data_ptr->next_wp;
    }
    return display_data_ptr->next_wp + 1;
}

static uint16_t calculate_distance() {
    float lon_diff = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lon - compass_data_ptr->position.lon;
    float lat_diff = compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat - compass_data_ptr->position.lat;

    float lat_km = (float) (lat_diff * 110.574);
    float lon_km = (float) (lon_diff * 111.320 *
                            cos(compass_data_ptr->path.nodes[display_data_ptr->next_wp].lat * M_PI / 180));

    return (uint32_t) (sqrtf(lat_km * lat_km + lon_km * lon_km) * 1000);
}

_Noreturn static void logic_task() {
    ESP_LOGI(TAG, "logic_task");
    compass_data_ptr = &compass_data;
    display_data_ptr = &display_data;
    while (1) {
        // Obtain semaphore 1
        if (xSemaphoreTake(compass_data_ptr->mutex, portMAX_DELAY) == pdTRUE) {
            // Obtain semaphore 2
            if (xSemaphoreTake(display_data_ptr->mutex, portMAX_DELAY) == pdTRUE) {
                // Update display data
                display_data_ptr->angle = calculate_angle();
                display_data_ptr->distance = calculate_distance();
                display_data_ptr->next_wp = calculate_next_wp();
                // Release semaphore 2
                xSemaphoreGive(display_data_ptr->mutex);
            }
            // Release semaphore 1
            xSemaphoreGive(compass_data_ptr->mutex);
        }
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

void sc_logic_init() {
    xTaskCreate(logic_task, "logic_task", 2048, NULL, 5, NULL);
}
