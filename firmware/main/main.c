#include "freertos/FreeRTOS.h"
#include <freertos/semphr.h>
#include "esp_log.h"
#include "nvs_flash.h"

#include "sc_ble.h"
#include "sc_display.h"
#include "compass_data.h"
#include "sc_compass.h"


compass_data_t compass_data;

void log_compass_data() {
    compass_data_t *compass_data_ptr = &compass_data;
    compass_path_t *path = &compass_data_ptr->path;
    if (xSemaphoreTake(compass_data_ptr->mutex, portMAX_DELAY) == pdTRUE) {
        ESP_LOGI("COMPASS_DATA", "Position: %f, %f", compass_data_ptr->position.lat, compass_data_ptr->position.lon);
        ESP_LOGI("COMPASS_DATA", "Path length: %lu", path->length);
        for (uint32_t i = 0; i < path->length; ++i) {
            ESP_LOGI("COMPASS_DATA", "Node %lu: %f, %f", i, path->nodes[i].lat, path->nodes[i].lon);
        }
        xSemaphoreGive(compass_data_ptr->mutex);
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
            .path = (compass_path_t) {
                    .length = 0
            }
    };
    ESP_LOGI("main", "BLE init");
    sc_ble_init();
    ESP_LOGI("main", "Display init");
    sc_display_init();
    sc_compass_init();
}
