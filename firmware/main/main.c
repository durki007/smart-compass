#include "freertos/FreeRTOS.h"
#include <freertos/semphr.h>
#include "esp_log.h"

#include "compass_data.h"
#include "sc_ble.h"
#include "sc_display.h"
#include "sc_gps.h"
#include "sc_compass.h"
#include "sc_logic.h"

compass_data_t compass_data;
display_data_t display_data;

void log_compass_data() {
    if(xSemaphoreTake(compass_data.mutex, portMAX_DELAY) == pdTRUE) {
        ESP_LOGI("compass_data", "Position: %f, %f", compass_data.position.lat, compass_data.position.lon);
        ESP_LOGI("compass_data", "Bearing: %u", compass_data.bearing);
        ESP_LOGI("compass_data", "Path length: %lu", compass_data.path.length);
        xSemaphoreGive(compass_data.mutex);
        return;
    }
}

void log_display_data() {
    if(xSemaphoreTake(display_data.mutex, portMAX_DELAY) == pdTRUE) {
        ESP_LOGI("display_data", "Angle: %d", display_data.angle);
        ESP_LOGI("display_data", "Next WP: %u", display_data.next_wp);
        ESP_LOGI("display_data", "Distance: %u", display_data.distance);
        xSemaphoreGive(display_data.mutex);
        return;
    }
}

void
app_main(void) {
    compass_data = (compass_data_t) {
            .mutex = (SemaphoreHandle_t) xSemaphoreCreateMutex(),
            .position = (compass_position_t) {
                    .lat = 0.0,
                    .lon = 0.0
            },
            .bearing = 0,
            .path = (compass_path_t) {
                    .length = 0
            },
            .position_updated = false
    };
    display_data = (display_data_t) {
            .mutex = (SemaphoreHandle_t) xSemaphoreCreateMutex(),
            .angle = 0,
            .next_wp = 0,
            .distance = 0
    };
    ESP_LOGI("main", "BLE init");
    sc_ble_init();
    ESP_LOGI("main", "Display init");
    sc_display_init();
    ESP_LOGI("main", "GPS init");
    sc_gps_init();
    ESP_LOGI("main", "Compass init");
    sc_compass_init();
    ESP_LOGI("main", "Logic init");
    sc_logic_init();
    while (1) {
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        log_compass_data();
        log_display_data();
    }
}
