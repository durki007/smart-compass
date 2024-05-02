#include "esp_log.h"
#include "nvs_flash.h"

#include "sc_ble.h"
#include "sc_display.h"


void
app_main(void)
{
//    ESP_LOGI("main", "BLE init");
//    sc_ble_init();
    ESP_LOGI("main", "Display init");
    sc_display_init();
}
