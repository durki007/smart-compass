#include <sys/cdefs.h>
#include "sc_logic.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include <freertos/task.h>
#include "compass_data.h"

// Defines
#define TAG "SC_LOGIC"

compass_data_t *compass_data_ptr;
display_data_t *display_data_ptr;

static int16_t calculate_angle() {
    // TODO
    return (int16_t) compass_data_ptr->bearing;
}

static uint16_t calculate_next_wp() {
    // TODO
    return 0;
}

static uint16_t calculate_distance() {
    // TODO
    return 0;
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
                display_data_ptr->next_wp = calculate_next_wp();
                display_data_ptr->distance = calculate_distance();
                // Release semaphore 2
                xSemaphoreGive(display_data_ptr->mutex);
            }
            // Release semaphore 1
            xSemaphoreGive(compass_data_ptr->mutex);
        }
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}

void sc_logic_init() {
    xTaskCreate(logic_task, "logic_task", 2048, NULL, 5, NULL);
}
