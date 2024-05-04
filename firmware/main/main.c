#include "freertos/FreeRTOS.h"
#include <freertos/semphr.h>
#include "esp_log.h"

#include "sc_ble.h"
#include "sc_display.h"
#include "compass_data.h"

compass_data_t compass_data;

void
app_main(void)
{
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
}
